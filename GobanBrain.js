// GOPARTY
var GoParty = $.inherit({

	/***
	   CONSTRUCTOR
        ***/
	__constructor: function( size, stones ) {
		this.initial_goban = new Goban( size, stones );
		this.size = size;
		this.error = false;
		this.stones = stones;
		this.turns = [];
	},


	/***
	   PUBLIC METHODS
        ***/
	play: function( coord ) {
		var goban = new Goban( this.size, this.stones );
		goban.turn( coord );
		this.error = goban.error;
		if ( this.error == false ) {
			this.stones = goban.stones;
			this.turns[this.turns.length] = goban;
			return true;
		} 
		return false;
	};


        /***
           PRIVATE METHODS
        ***/
});


// GOBAN
var Goban = $.inherit({

        /***
           CONSTRUCTOR
        ***/
        __constructor: function( size, stones ) {
                this.stones = stones;
         	this.turn;
		this.size = size;
		this.error = false;
        },


        /***
           PUBLIC METHODS
        ***/
	turn: function( turn ) {
		this.turn = turn;
		this.add_stone( turn );
                if ( this.error !== false ) {
                        return false;
                }
                var coord_around = this.coord_around( turn );
                for ( var i in coord_around ) {
                        if ( this.get_stone( coord_around[ i ] ) == ( turn.color + 1 ) % 2 ) {
                                this.check_group( coord_around[ i ] );
                        }
                }
                this.check_group( turn );
                if ( this.get_stone( turn ) == -1 ) {
			this.error = "Suicide";
                        return false;
                }
		return true;
	},


        /***
           PRIVATE METHODS
        ***/
	add_stone: function( turn ) {
		if ( ! this.is_coord_on_goban( turn ) ) {
			this.error = "Outside goban";
			return false;
		}
		if ( typeof this.stones[ turn.x ] == "undefined" ) {	
			this.stones[ turn.x ] = [];
		} 
		if ( typeof this.stones[ turn.x ][ turn.y ] != "undefined" ) {
			this.error = "Already a stone";
			return false;
		}
		this.stones[ turn.x ][ turn.y ] = turn.color;
		return true;
	},
	remove_stone: function( coord ) {
		if ( 	this.is_coord_on_goban( coord ) &&
                        typeof this.stones[ coord.x ] != "undefined" &&
			typeof this.stones[ coord.x ][ coord.y ] != "undefined"
		) {
			delete this.stones[ coord.x ][ coord.y ];
                }
	},
	stone: function( coord ) {
		if ( typeof this.stones[ coord.x ] == "undefined" ||	
			typeof this.stones[ coord.x ][ coord.y ] == "undefined"
		) {
			return -1;
                }
		return this.stones[ coord.x ][ coord.y ];
	},
	check_group: function( coord ) {
		var group = this.group( coord );	
	        var liberties = this.group_liberties( group );	
		if ( liberties.length == 0 ) {
			this.stones = this.remove_group(  group );
		}
	},
	group_liberties: function( group ) {
		var liberties = [];
		for ( var j in group ) {
			var coord_around = this.coord_around( group[ j ] );
			for ( var i in coord_around ) {
	                        if ( this.get_stone( coord_around[ i ] ) == -1 ) {
	                                var found = false;
					for ( var k in liberties ) {
						if ( 	liberties[ k ].x == coord_around[ i ].x && 
							liberties[ k ].y == coord_around[ i ].y
						) {
							found = true;
							break;
						}
					}
					if ( found == false ) {
						liberties[ liberties.length ] = coord_around[ i ];
					}
	                        }
        	        }
			
		}
		return liberties;
	},
	remove_group: function( group ) {
		for ( var j in group ) {
			this.remove_stone( group[ j ] );
		}
        },
	group: function( coord, coord_from, group ) {
		return this.group_recursive( coord, { x: -2, y: -2 }, [] );
        },
	group_recursive: function( coord, coord_from, group ) {
		var found = false;
		for ( var i in group ) {
			if ( group[ i ].x == coord.x && group[ i ].y == coord.y ) {
				found = true;
				break;
			}
		}
		if ( found == false ) {
			group[ group.length ] = coord;
			var coord_around = this.coord_around( coord );
			for ( var i in coord_around ) {
	                        if (    ! ( coord_around[ i ].x == coord_from.x && coord_around[ i ].y == coord_from.y ) && 
					this.get_stone( coord_around[ i ] ) == this.get_stone( coord ) 
	                        ) {
	                                group = this.group_recursive( coord_around[ i ], coord, group );
	                        }
        	        }
		}
		return group; 
	},
	coord_around: function( coord ) {
		var coords = [
			{ x: coord.x - 1, y: coord.y },
			{ x: coord.x, y: coord.y - 1 },
			{ x: coord.x + 1, y: coord.y },
			{ x: coord.x, y: coord.y + 1 }
		];
		var coord_around = [];
		for ( var i in coords ) {
			if ( this.is_coord_on_goban( coords[ i ] ) ) {
				coord_around[ coord_around.length ] = coords[ i ]
			}
		}
		return coord_around;
	},
	is_coord_on_goban: function( coord ) {
		return ( coord.x > 0 &&
                	coord.y > 0 &&
                	coord.x <= this.size &&
                	coord.y <= this.size
                );
	},
});
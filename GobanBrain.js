// GOPARTY
var GoParty = $.inherit({

	/***
	   CONSTRUCTOR
        ***/
	__constructor: function( size, stones ) {
		this.size = size;
		this.error = false;
		this.stones = stones;
		this.gobans = [ new Goban( size, stones ) ];
		this.turn_index = 0;
	},


	/***
	   PUBLIC METHODS
        ***/
	play: function( coord ) {
		// Clone of stones array
		var goban = new Goban( this.size, $.extend( true, [], this.stones ) );
		var turn = coord;
		turn.color = this.current_color();
		goban.play( turn );
		this.error = goban.error;
		if ( this.error == false ) {
			this.stones = goban.stones;
			this.turn_index++;
			this.gobans = this.gobans.slice( 0, this.turn_index );
			this.gobans[ this.turn_index ] = goban;
			return true;
		} 
		return false;
	},
	previous: function( ) {
		if ( this.turn_index <= 0 ) {
			return false;
		}
		this.update_turn_index( this.turn_index - 1 );
		return true;
	},
	next: function( ) {
		if ( this.turn_index >= this.gobans.length - 1 ) {
                        return false;
                }
		this.update_turn_index( this.turn_index + 1 );
                return true;
	},
	begin: function( ) {
		this.update_turn_index( 0 );
	},
	end: function( ) {
		this.update_turn_index( this.gobans.length - 1 );
	},


        /***
           PRIVATE METHODS
        ***/
	current_color: function( ) {
		if ( this.gobans.length == 0 ) {
			return 0;
		}
		return ( this.gobans[ this.turn_index ].turn.color + 1 ) % 2;
	},
	update_turn_index: function( turn_index ) {
		this.turn_index = turn_index;
		this.stones = this.gobans[ this.turn_index ].stones;
	},
});


// GOBAN
var Goban = $.inherit({

        /***
           CONSTRUCTOR
        ***/
        __constructor: function( size, stones ) {
                this.stones = stones;
         	this.turn = { color: 1 };
		this.size = size;
		this.error = false;
        },


        /***
           PUBLIC METHODS
        ***/
	play: function( turn ) {
		this.turn = turn;
		this.add_stone( turn );
                if ( this.error !== false ) {
                        return false;
                }
                var coord_around = this.coord_around( turn );
                for ( var i in coord_around ) {
                        if ( this.stone( coord_around[ i ] ) == ( turn.color + 1 ) % 2 ) {
                                this.check_group( coord_around[ i ] );
                        }
                }
                this.check_group( turn );
                if ( this.stone( turn ) == -1 ) {
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
			this.remove_group(  group );
		}
	},
	group_liberties: function( group ) {
		var liberties = [];
		for ( var j in group ) {
			var coord_around = this.coord_around( group[ j ] );
			for ( var i in coord_around ) {
	                        if ( this.stone( coord_around[ i ] ) == -1 ) {
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
					this.stone( coord_around[ i ] ) == this.stone( coord ) 
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

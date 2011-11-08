// GOBAN
var Goban = $.inherit( Canvas, {

	/***
	   CONSTRUCTOR
        ***/
	__constructor: function( element ) {
		this.colors = [ 'black', 'white' ];
		this.__base( element, 480, 480 );
		this.attributes = {
			goban_size: 19,
			stones: [],
			initial_stones: [ [], [] ],
			initial_color: 0,
			turns: [],
			cell_size: 24
		}
		this.dependencies = [ 'goban_size', 'initial_stones' ];
		var layer = this.add_layer( 'bg', new Goban_Background( this ) );
			    this.add_layer( 'grid', new Goban_Grid( this ) );
		            this.add_layer( 'stones', new Goban_Stones( this ) );
		layer.update();
	},


	/***
	   PUBLIC METHODS
        ***/
	play: function ( x, y ) {
		var turn = { x:x, y:y }
                var turns = this.get( 'turns' );
		var stones = this.get( 'stones' );
		if ( typeof turns[ turns.length - 1 ] == "undefined") {
			turn.color = this.get('initial_color');
		} else { 
			turn.color = ( turns[ turns.length - 1 ].color + 1 ) % 2;
		}
		stones = this.play_stone( stones, turn );
		if ( stones != false ) {
			turns[ turns.length ] = turn;
			this.set({
				turns: turns,
				stones: stones,
			});	
		}
	},


        /***
           PRIVATE METHODS
        ***/
	add_stone: function( stones, turn ) {
		if ( ! this.is_coord_on_goban( turn ) ) {
			return false;
		}
		if ( typeof stones[ turn.x ] == "undefined" ) {	
			stones[ turn.x ] = [];
		} 
		if ( typeof stones[ turn.x ][ turn.y ] != "undefined" ) {
			return false;
		}
		stones[ turn.x ][ turn.y ] = turn.color;
		return stones;
	},
	remove_stone: function( stones, coord ) {
		if ( 	this.is_coord_on_goban( coord ) &&
                        typeof stones[ coord.x ] != "undefined" &&
			typeof stones[ coord.x ][ coord.y ] != "undefined"
		) {
			delete stones[ coord.x ][ coord.y ];
                }
                return stones;
	},
	get_stone: function( stones, coord ) {
		if ( typeof stones[ coord.x ] == "undefined" ||	
			typeof stones[ coord.x ][ coord.y ] == "undefined"
		) {
			return -1;
                }
		return stones[ coord.x ][ coord.y ];
	},
	play_stone: function( stones, turn ) {
		stones = this.add_stone( stones, turn );
		if ( stones == false ) {
			return false;
		}
		var coord_around = this.coord_around( turn );
		for ( var i in coord_around ) {
			if ( this.get_stone( stones, coord_around[ i ] ) == ( turn.color + 1 ) % 2 ) {
				stones = this.check_group( stones, coord_around[ i ] );
			}
                }
		stones = this.check_group( stones, turn );
                if ( this.get_stone( stones, turn ) == -1 ) {
                       	return false; 
                }
		return stones;
	},
	check_group: function( stones, coord ) {
		var group = this.group( stones, coord );	
	        var liberties = this.group_liberties( stones, group );	
		if ( liberties.length == 0 ) {
			stones = this.remove_group( stones, group );
		}
		return stones;
	},
	group_liberties: function( stones, group ) {
		var liberties = [];
		for ( var j in group ) {
			var coord_around = this.coord_around( group[ j ] );
			for ( var i in coord_around ) {
	                        if ( this.get_stone( stones, coord_around[ i ] ) == -1 ) {
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
	remove_group: function( stones, group ) {
		for ( var j in group ) {
			stones = this.remove_stone( stones, group[ j ] );
		}
		return stones;
        },
	group: function( stones, coord, coord_from, group ) {
		return this.group_recursive( stones, coord, { x: -2, y: -2 }, [] );
        },
	group_recursive: function( stones, coord, coord_from, group ) {
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
					this.get_stone( stones, coord_around[ i ] ) == this.get_stone( stones, coord ) 
	                        ) {
	                                group = this.group_recursive( stones, coord_around[ i ], coord, group );
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
                	coord.x <= this.get( 'goban_size' ) &&
                	coord.y <= this.get( 'goban_size' )
                );
	},
    

	/***
           OVERRITE METHODS
        ***/
        update: function( attribute ) {
		if ( attribute == 'goban_size' ) {
			var goban_size = this.get('goban_size');
	                this.scale( 20 / (goban_size + 1) );
		} else if ( attribute == 'initial_stones' ) {
			var initial_stones = this.get( 'initial_stones' );
			var stones = [];
			for ( var i in this.colors ) {
				for ( var stone in initial_stones[ i ] ) {
					stones = this.add_stone( stones, stone.x, stone.y, i );
				}
			}
			this.set({
				stones: stones,
			});
		}
	},

	onclick: function( x, y ) {
                // STONE COORDS
                var cell_size  = this.get('cell_size');
                x = Math.round( x / cell_size );
                y = Math.round( y / cell_size );
		this.play( x, y );
	},
});


// GOBAN BACKGROUND
var Goban_Background = $.inherit( Layer, {

	/***
	   OVERRITE METHODS
        ***/
	draw: function( ctx ) {
		ctx.fillStyle    = 'rgb( 219, 145, 46)';
		ctx.fillRect(0, 0, this.x_max(), this.y_max());
		ctx.strokeStyle  = 'rgb( 226, 169, 91)';
		ctx.lineWidth    = 5;
		ctx.beginPath();
		ctx.moveTo( this.x_max(),            0 );
		ctx.lineTo(            0,            0 );
		ctx.lineTo(            0, this.y_max() );
		ctx.stroke();
		ctx.strokeStyle  = 'rgb( 165, 109, 34)';
		ctx.beginPath();
		ctx.moveTo( this.x_max(),            2 );
		ctx.lineTo( this.x_max(), this.y_max() );
		ctx.lineTo(            2, this.y_max() );
		ctx.stroke();
	},
});


// GOBAN GRID
var Goban_Grid = $.inherit( Layer, {

	/***
	   OVERRITE METHODS
        ***/
	draw: function( ctx ) {
		var goban_size = this.get('goban_size');
		var cell_size = this.get('cell_size');
		ctx.strokeStyle      = 'black';
		ctx.lineCap          = 'butt';
		ctx.lineWidth        = 1;
		var canvas_coord_min = cell_size;
		var canvas_coord_max = goban_size * cell_size;
		var canvas_coord     = 0;
		for ( var i = 0; i < goban_size; i++ ) {
			canvas_coord = i * cell_size + canvas_coord_min;
			ctx.beginPath();
			ctx.moveTo( canvas_coord_min, canvas_coord );
			ctx.lineTo( canvas_coord_max, canvas_coord );
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo( canvas_coord, canvas_coord_min );
			ctx.lineTo( canvas_coord, canvas_coord_max );
			ctx.stroke();
		}
	}
});


// GOBAN STONES
var Goban_Stones = $.inherit( Layer, {

	/***
	   CONSTRUCTOR
        ***/
        __constructor: function( canvas ) {
		this.__base( canvas );
		this.dependencies = [ 'stones' ];
	},


	/***
	   OVERRITE METHODS
        ***/
	draw: function( ctx ) {
		var goban_size = this.get('goban_size');
		var stones     = this.get('stones');
		var cell_size  = this.get('cell_size');
		for ( var x in stones ) {
			for ( var y in stones[ x ] ) {
				ctx.fillStyle = this.canvas.colors[ stones[ x ][ y ] ];
				ctx.beginPath();
				ctx.arc( 
					x * cell_size, 
					y * cell_size, 
					10, 
					0, 
					Math.PI*2, 
					true
				);
				ctx.closePath();
				ctx.fill();
			}
		}
	},

});

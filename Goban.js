// GOBAN
var Goban = $.inherit( Canvas, {

	/***
	   CONSTRUCTOR
        ***/
	__constructor: function( element ) {
		this.__base( element, 480, 480 );
		this.attributes = {
			goban_size: 19,
			stones: { white: [], black: [] },
			cell_size: 24
		}
		this.dependencies = [ 'goban_size' ];
		var layer = this.add_layer( 'bg', new Goban_Background( this ) );
			    this.add_layer( 'grid', new Goban_Grid( this ) );
		            this.add_layer( 'stones', new Goban_Stones( this ) );
		layer.update();
	},


	/***
	   PUBLIC METHODS
        ***/
	add_stone: function( color, x, y ) {
		var stones = this.get('stones');
		stones[color][ stones[color].length ] = {x:x,y:y};
		this.set( {stones: stones} );
	},
    

	/***
           OVERRITE METHODS
        ***/
        update: function( ) {
		var goban_size = this.get('goban_size');
                this.scale( 20 / (goban_size + 1) );
	}
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
		for ( color in stones ) {
			ctx.fillStyle = color;
			for ( i in stones[color] ) {
				ctx.beginPath();
				ctx.arc( 
					stones[color][i].x * cell_size, 
					stones[color][i].y * cell_size, 
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

	onclick: function( x, y ) {
		// STONE COORDS
		var cell_size  = this.canvas.cell_size;
		x = Math.round( x / cell_size );
		y = Math.round( y / cell_size );
		var coords = {x:x,y:y};

		// CHANGE STONES
		var stones = this.get('stones');
		var is_black = false;
		for ( var i in stones.black ) {
			if ( stones.black[ i ].x == x && stones.black[ i ].y == y ) {
				is_black = true;
				delete stones.black[ i ];
				stones.white[ stones.white.length ] = coords;
				this.set( {stones: stones} );
				break;
			}
		}
		if ( ! is_black ) {			
			var is_white = false;
			for ( var i in stones.white ) {
				if ( stones.white[ i ].x == x && stones.white[ i ].y == y ) {
					is_white = true;
					delete stones.white[ i ];
					this.set( {stones: stones} );
					break;
				}
			}
			if ( ! is_white ) {
				this.canvas.add_stone( 'black', x, y );
			}
		}
	},
});

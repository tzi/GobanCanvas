// GOBAN
var GobanCanvas = $.inherit( Canvas, {

	/***
	   CONSTRUCTOR
        ***/
	__constructor: function( element ) {
		this.colors = [ 'black', 'white' ];
		this.__base( element, 480, 480 );
		this.party = new GoParty();
		this.attributes = {
			goban_size: 19,
			stones: [],
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
		this.party.play( turn );
		if ( this.party.error == false ) {
			this.set({
				stones: this.party.stones,
			});	
		} else {
			alert( this.party.error );
		}
	},
        begin: function( ) {
		this.party.begin( );
                this.set( { stones: this.party.stones } );
        },
        previous: function( ) {
		this.party.previous( );
                this.set( { stones: this.party.stones } );
        },
        next: function( ) {
                this.party.next( );
                this.set( { stones: this.party.stones } );
        },
        end: function( ) {
		this.party.end( );
		this.set( { stones: this.party.stones } );
        },


	/***
           OVERRITE METHODS
        ***/
        update: function( attribute ) {
		if ( attribute == 'goban_size' ) {
			var goban_size = this.get('goban_size');
			this.party = new GoParty( goban_size, this.get( 'stones' ) );
	                this.scale( 20 / (goban_size + 1) );
		} else if ( attribute == 'initial_stones' ) {
			var initial_stones = this.get( 'initial_stones' );
			new GoParty( this.get('goban_size'), this.get( 'initial_stones' ) );
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

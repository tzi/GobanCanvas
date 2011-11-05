// GOBAN
var Goban = $.inherit( Canvas, {

	/***
	   CONSTRUCTOR
        ***/
	__constructor: function( element ) {
		this.__base( element, 480, 480 );
		this.attributes = {
			goban_size: 19,
			stones: {}
		}
		this.cell_size = 24;
	

		// GOBAN BACKGROUND
		var layer = this.add_layer( 'bg' );
		layer.draw = function( ctx ) {
			ctx.fillStyle    = 'rgb( 219, 145, 46)';
			ctx.fillRect(0, 0, 480, 480);
			ctx.strokeStyle  = 'rgb( 226, 169, 91)';
			ctx.lineWidth    = 5;
			ctx.beginPath();
			ctx.moveTo( 480,   0 );
			ctx.lineTo(   0,   0 );
			ctx.lineTo(   0, 480 );
			ctx.stroke();
			ctx.strokeStyle  = 'rgb( 165, 109, 34)';
			ctx.beginPath();
			ctx.moveTo( 480,   2 );
			ctx.lineTo( 480, 480 );
			ctx.lineTo(   2, 480 );
			ctx.stroke();
		};
		layer.update();


		// GOBAN CELL
		var layer = this.add_layer( 'grid'  );
		layer.dependencies = [ 'goban_size' ];
		layer.draw = function( ctx ) {
			var goban_size = this.canvas.get('goban_size');
			var cell_size = this.canvas.cell_size;
			this.scale( 20 / (goban_size + 1) );
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
		};


		// GOBAN STONES
		var layer = this.add_layer( 'stones' );
		layer.dependencies = [ 'goban_size', 'stones' ];
		layer.draw = function( ctx ) {
			var goban_size = this.canvas.get('goban_size');
			var stones     = this.canvas.get('stones');
			var cell_size  = this.canvas.cell_size;
			this.scale( 20 / (goban_size + 1) );
			for ( color in stones ) {
				ctx.fillStyle = color;
				for ( var i = 0; i < stones[color].length; i++ ) {
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
		};

	
		// EVENT
		$( element ).click(function(event){
			console.dir(event);
		});
	},
});

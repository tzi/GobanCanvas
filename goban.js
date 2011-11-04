// GOBAN
var Goban = $.inherit(
	Canvas,
	{
		__constructor: function( element ) {
			this.__base( element, 480, 480 );
			this.add_layer( 'bg'    );
			this.add_layer( 'grid'  );
			this.add_layer( 'stone' );
		
			// GOBAN BACKGROUND
			var layer = this.layer( 'bg' );
			var ctx = layer.get_context();
			ctx.fillStyle    = 'rgb( 219, 145, 46)';
			ctx.fillRect(0, 0, 480, 480);
			ctx.strokeStyle  = 'rgb( 226, 169, 91)';
			ctx.lineWidth    = 4;
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
		
			// EVENT
			$( element ).click(function(event){
				console.dir(event);
			});
		},

		draw_grid: function( goban_size ) {
			this.goban_size = goban_size;
			var layer = this.layer( 'grid' );
			layer.clean( );
			layer.scale( 20 / (goban_size + 1) );
			var ctx = layer.get_context( );


			// GOBAN CELL
			ctx.strokeStyle      = 'black';
			ctx.lineCap          = 'butt';
			ctx.lineWidth        = 1;
			var cell_size        = 24;
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
		},
	}
);

goban_draw_stones = function( goban, goban_size, stones ) {
	var canvas = $( '.goban_stones', goban )[0];
	if ( canvas.getContext ) {
		var ctx = canvas.getContext('2d');
		var cell_size        = 24;
		
		// STONES
		for ( color in stones ) {
			ctx.fillStyle = color;
			for ( var i=0; i<stones[color].length; i++ ) {
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
	}
};

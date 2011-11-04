// CANVAS
var Canvas = $.inherit(
    {
        __constructor: function( element, width, height, count_layer ) {
                this.element     = element;
                this.scale_ratio = 1;
                size_ratio       = height / width;
		this.layers      = [];
		for ( var i=0; i<count_layer; i++ ) {
			this.layers[i] = new Layer( this, width, height );
		}
		element.css({width: '100%'})
			.css({height: $( element ).width() * size_ratio});
		$(window).resize(function(){
			$( element ).css({height: $( element ).width() * size_ratio});
		});
        },

        scale : function( ratio ) {
		var scale_ratio = ratio / this.scale_ratio;
		$( 'canvas', this.element ).each(function(){
			var ctx = this.getContext('2d');
			ctx.scale( scale_ratio, scale_ratio );
		});
		this.scale_ratio = ratio;
        },

        layer : function( layer ) {
		return this.layers[layer];
        },
    }
);


// LAYER
var Layer = $.inherit(
    {
        __constructor: function( canvas, width, height ) {
		this.canvas  = canvas
                this.width   = width;
                this.height  = height;
                this.element = $('<canvas>Your browser does not support the canvas element.</canvas>')
			.appendTo( canvas.element )
			.attr( 'width',  width )
			.attr( 'height', height )
			.get(0);
        },

        get_context: function() {
		var ctx;
		if ( this.element.getContext ) {
			var ctx = this.element.getContext( '2d' );
		}
		return ctx;
        },

        clean : function( layer ) {
		var ctx = this.get_context();
		ctx.clearRect( 0, 0, this.width/this.canvas.scale_ratio, this.height/this.canvas.scale_ratio );

        },
    }
);

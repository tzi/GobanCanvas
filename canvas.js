// CANVAS
var Canvas = $.inherit(
    {
        __constructor: function( element, width, height ) {
                this.element     = element;
		this.layers      = [];
                this.width       = width;
                this.height      = height;
                size_ratio       = height / width;
		element.css({width: '100%'})
			.css({height: $( element ).width() * size_ratio});
		$(window).resize(function(){
			$( element ).css({height: $( element ).width() * size_ratio});
		});
        },

	add_layer: function( layer_name ) {
		this.layers[ layer_name ] = new Layer( this );
	},

        scale: function( ratio ) {
		for ( layer_name in this.layers ) {
			this.layers[ layer_name ].scale( ratio );
		};
        },

        layer: function( layer_name ) {
		return this.layers[ layer_name ];
        },
    }
);


// LAYER
var Layer = $.inherit(
    {

	/***
	   CONSTRUCTOR
        ***/
        __constructor: function( canvas ) {
		this.canvas  = canvas;
                this.scale_ratio = 1;
                this.element = $('<canvas>Your browser does not support the canvas element.</canvas>')
			.appendTo( canvas.element )
			.attr( 'width',  canvas.width  )
			.attr( 'height', canvas.height )
			.get(0);
        },


	/***
	   PUBLIC METHODS
        ***/
        get_context: function() {
		var ctx;
		if ( this.element.getContext ) {
			var ctx = this.element.getContext( '2d' );
		}
		return ctx;
        },

        clean: function( ) {
		var ctx = this.get_context();
		ctx.clearRect( 0, 0, this.x_max(), this.y_max() );
        },

        scale : function( ratio ) {
		var scale_ratio = ratio / this.scale_ratio;
		var ctx = this.get_context();
		ctx.scale( scale_ratio, scale_ratio );
		this.scale_ratio = ratio;
        },


	/***
	   PRIVATE METHODS
        ***/
	x_max: function( ) {
		return this.canvas.width / this.scale_ratio;
	},
	y_max: function( ) {
		return this.canvas.height / this.scale_ratio;
	},


	/***
	   METHODS TO OVERRIDE
        ***/
	draw: function( ) {
	}
    }
);

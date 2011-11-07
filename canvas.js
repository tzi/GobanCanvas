// CANVAS
var Canvas = $.inherit({

	/***
	   CONSTRUCTOR
        ***/
        __constructor: function( element, width, height ) {
                this.element     = element;
		this.layers      = [];
		this.attributes  = {};
                this.width       = width;
                this.height      = height;
                size_ratio       = height / width;
		element.css({width: '100%'})
			.css({height: $( element ).width() * size_ratio});
		
		// EVENT
		$(window).resize(function(){
			$( element ).css({height: $( element ).width() * size_ratio});
		});
		canvas = this;
		$( element ).click( function(event){
			canvas.click_handler(event);
		});
        },


	/***
	   PUBLIC METHODS
        ***/
	add_layer: function( layer_name, layer) {
		if ( typeof layer == "undefined") layer = new Layer( this );
		this.layers[ layer_name ] = layer;
		return layer;
	},

        scale: function( ratio ) {
		for ( layer_name in this.layers ) {
			this.layers[ layer_name ].scale( ratio );
		};
        },

        layer: function( layer_name ) {
		return this.layers[ layer_name ];
        },

	set: function( attributes ) {
		for ( attribute_name in attributes ) {
			if ( typeof this.attributes[ attribute_name ] == "undefined" ) {
				delete attributes[ attribute_name ];
			} else {
				this.attributes[ attribute_name ] = attributes[ attribute_name ];
			}
		}
		for ( layer_name in this.layers ) {
			var layer = this.layers[ layer_name ];
			for ( attribute_name in layer.dependencies ) {
				var dependency = layer.dependencies[ attribute_name ];
				if ( typeof attributes[ dependency ] != "undefined" ) {
					layer.update();
					break;
				}
			}
		}
	},

	get: function( attribute_name ) {
		return this.attributes[ attribute_name ];
	},


	/***
	   PRIVATE METHODS
        ***/
	click_handler: function( event ) {
		for ( layer_name in this.layers ) {
			var layer = this.layers[ layer_name ];
			layer.onclick( 
				event.layerX * this.width  / $(this.element).width() / layer.scale_ratio,
				event.layerY * this.height / $(this.element).height() / layer.scale_ratio
			);
		}
	},
});


// LAYER
var Layer = $.inherit({

	/***
	   CONSTRUCTOR
        ***/
        __constructor: function( canvas ) {
		this.dependencies = [];
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

	update: function() {
		this.clean( );
		var ctx = this.get_context();
		this.draw( ctx );
	},

	set: function( attributes ) {
		this.canvas.set( attributes );
	},

	get: function( attribute_name ) {
		return this.canvas.get( attribute_name );
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
	draw: function( ctx ) {
	},
	onclick: function( x, y ) {
	}
});

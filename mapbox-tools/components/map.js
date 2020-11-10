import Core from '../../basic-tools/tools/core.js'
import Evented from '../../basic-tools/components/evented.js'
import Util from '../../basic-tools/tools/util.js'

export default class Map extends Evented {
				
	static set Token(value) { mapboxgl.accessToken = value; }
	
	static get Token() { return mapboxgl.accessToken; }
	
	get Container() {
		return this.map._container;
	}
	
	get Center() {
		return this.map.getCenter();
	}
	
	set Center(value) {
		this.map.setCenter(value)
	}
	
	get Zoom() {
		return this.map.getZoom();
	}
	
	set Zoom(value) {
		this.map.setZoom(value)
	}
	
	get Style() {
		return this.style;
	}
	
	constructor(options) {
		super();
		
		this.layers = [];
		this.original = {};
		this.style = options.style;
		
		this.click = this.OnLayerClick_Handler.bind(this);
		
		this.map = new mapboxgl.Map(options); 
		
		this.map.once('styledata', this.OnceStyleData_Handler.bind(this));
		
		// this.map.on('click', this.click);
		
		this.WrapEvent('moveend', 'MoveEnd');
		this.WrapEvent('zoomend', 'ZoomEnd');
		this.WrapEvent('load', 'Load');
		
		this.map.once('load', ev => {
			// Fix for improve this map in french
			this.map.getContainer().querySelector('.mapbox-improve-map').innerHTML = Core.Nls("Mapbox_Improve");
		})
	}
	
	/**
	 * Add a data source to the map
	 * @param {string} name - name of a data source
	 * @param {object} data - object containing the details of the data source
	 * - Data Source Example:
	 * 	{
	 * 		type: "geojson",
	 * 		data: "https://example.org/mydata.json",
	 * 		cluster: true,
	 * 		clusterMaxZoom: 14,
	 * 		clusterRadius: 50
	 * 	}
	 */
	AddSource(name, data) {
		this.map.addSource(name, data);
	}

	/**
	 * Add layer to the map
	 * @param {object} layer - object containing the details of the layer
	 * - Layer Example:
	 * 	{
	 * 		id: 'mylayer',
	 * 		source: 'mydatasource',
	 *		type: 'circle',
	 *		paint: {
	 *			circle-color: "#000000",
	 *			circle-radius: 8
	 *		}
	 * 	}
	 */
	AddLayer(layer) {
		if (layer.id && layer.type) {
			this.map.addLayer(layer);
		}
	}
	
	/**
	 * Add layers for clustering the data.
	 * @param {object} definedOpts - an object containing all of the cluster options
	 * {
	 * 		source: data-source-id, 
	 * 		id: cluster-layer-id,
	 * 		filter: mapbox-expression,
	 * 		circle_paint: object containing the paint properties for the cluster circle,
	 * 		circle_layout: object containing the layout properties for the cluster circle,
	 * 		label_paint: object containing the paint properties for the cluster label,
	 * 		label_layout: object containing the layout properties for the cluster label
	 * }
	 */
	AddClusters(definedOpts) {
		let defaultOpts = {
			filter: ['has', 'point_count'],
			circle_paint: {
				'circle-color': ['step', ['get', 'point_count'], '#c1cede', 50, '#c1cede', 500, '#c1cede'],
				'circle-radius': ['step', ['get', 'point_count'], 15, 50, 25, 500, 35 ],
				'circle-stroke-width': 0.5,
				'circle-stroke-color': '#000000'
			},
			label_paint: {
				'text-color': '#000000'
			},
			label_layout: {
				'text-allow-overlap': true,
				'text-field': '{point_count_abbreviated}',
				'text-font': ['Open Sans Regular'],
				'text-size': 12
			}
		};
		
		let options = Util.Mixin(defaultOpts, definedOpts);

		// Add clusters layer for source
		this.map.addLayer({
			id: (options.id || options.source) + '_clusters',
			type: 'circle',
			source: options.source,
			filter: options.filter, 
			paint: options.circle_paint
		});
		 
		// Add cluster count labels layer
		this.map.addLayer({
			id: (options.id || options.source) + '_cluster-count',
			type: 'symbol',
			source: options.source,
			filter: options.filter,
			layout: options.label_layout,
			paint: options.label_paint 
		});
	}
	
	AddControl(control, location) {
		this.map.addControl(control, location);
	}
	
	InfoPopup(lngLat, html) {	
		var popup = new mapboxgl.Popup({ closeOnClick: true })
								.setLngLat(lngLat)
								.setHTML(html)
								.addTo(this.map);
					
		popup._closeButton.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>';
		popup._closeButton.setAttribute('aria-label', Core.Nls('Mapbox_Close_Popup'));
		popup._closeButton.title = Core.Nls('Mapbox_Close_Popup');
	}
	
	Reset(layers) {
		layers.forEach(l => {
			this.map.setPaintProperty(l, 'fill-color', this.original[l])
		});
		
		this.original = {};
	}
	
	/**
	 * Retrieves the layer type 
	 * @param {string} layerId - id of the map layer
	 */
	GetLayerType(layerId) {
		const layer = this.map.getLayer(layerId);
		let layerType;

		if (layer.type) {
			layerType = layer.type;
		}

		return layerType;
	}

	/**
	 * Get the layer color paint property name based on layer type
	 * @param {string} layerType - The layer type 
	 */
	GetLayerColorPropertyByType(layerType) {
		let layerPaintProperty;

		switch (layerType) {
			case 'circle':
				layerPaintProperty = 'circle-color';
				break;
			case 'line':
				layerPaintProperty = 'line-color';
				break;
			case 'fill':
				layerPaintProperty = 'fill-color';
				break;
			case 'symbol':
				layerPaintProperty = 'icon-color';
				break;
			case 'background':
				layerPaintProperty = 'background-color';
				break;
			case 'heatmap':
				layerPaintProperty = 'heatmap-color';
				break;
			case 'fill-extrusion':
				layerPaintProperty = 'fill-extrusion-color';
				break;
			default:
				layerPaintProperty = 'circle-color';
		}		

		return layerPaintProperty;
	}

	/*This is used with an array of colors and (single opacity or array of opacity values)*/
	Choropleth(layers, property, legend, opacity) {
		var classes = ['case'];

		if(Array.isArray(opacity) && Array.isArray(legend) && legend.length > 1){
			legend.forEach(function(l, index) {			
			var color = l.color.length == 3 ? `rgba(${l.color.join(',')},${opacity[index]})` : `rgba(${l.color.join(',')})`;
			
			if (l.value) classes.push(l.value);
			
			classes.push(color);
		});
		}
		else if(!Array.isArray(opacity) &&  Array.isArray(legend) && legend.length > 1) {
			legend.forEach(function(l) {			
			var color = l.color.length == 3 ? `rgba(${l.color.join(',')},${opacity})` : `rgba(${l.color.join(',')})`;
			
			if (l.value) classes.push(l.value);
			
			classes.push(color);
		});
		}

		layers.forEach(l => {
			if (property && this.map.getPaintProperty(l, property)) {
				this.original[l] = this.map.getPaintProperty(l, property);
			
				this.map.setPaintProperty(l, property, classes)
			}
		});
	}

	/*This is used with a single color value and an array of opacity values)*/
	ChoroplethVarOpac(layers, property, legend, opacity) {
		var classes = ['case'];

		var col = [0,0,0];

		if(Array.isArray(opacity) && Array.isArray(legend) && legend.length > 1){
			legend.forEach(function(l, index) {			
			
			var color = `rgba(${col.join(',')},${opacity[index]})`;
			
			if (l.value) classes.push(l.value);
			
			classes.push(color);
		});
		}

		layers.forEach(l => {
			if (property && this.map.getPaintProperty(l, property)) {
				this.original[l] = this.map.getPaintProperty(l, property);
			
				this.map.setPaintProperty(l, property, classes)
			}
		});
	}

	ReorderLayers(layers) {
		layers.forEach(l => this.map.moveLayer(l));
	}
	
	GetLayer(layer) {
		return this.map.getLayer(layer) || null;
	}
	
	ShowLayer(layer) {
		this.map.setLayoutProperty(layer, 'visibility', 'visible');
	}
	
	HideLayer(layer) {
		this.map.setLayoutProperty(layer, 'visibility', 'none');
	}
	
	HideLayers(layers) {
		layers.forEach(l => this.HideLayer(l));
	}
	
	ShowLayers(layers) {
		layers.forEach(l => this.ShowLayer(l));
	}
	
	FitBounds(bounds, options) {		
		this.map.fitBounds(bounds, options);
	}

	SetMaxBounds(bounds) {
		this.map.setMaxBounds(bounds);
	}

	SetStyle(style) {
		this.style = style;
		
		this.map.once('styledata', this.OnceStyleData_Handler.bind(this))
		
		this.map.setStyle(style);
	}
	
	SetClickableMap(layers) {				
		this.map.on('click', this.click);
	}
	
	SetClickableLayers(layers) {
		layers.forEach(l => this.map.off('click', l, this.click)); 
		
		this.layers = layers;
		
		this.layers.forEach(l => this.map.on('click', l, this.click));
	}
	
	QueryRenderedFeatures(point, layers) {
		return this.map.queryRenderedFeatures(point, { layers: layers });
	}
	
	OnceStyleData_Handler(ev) {
		this.Emit('StyleChanged', ev);
	}
	
	OnLayerClick_Handler(ev) {
		this.Emit('Click', ev);
	}
	
	WrapEvent(oEv, nEv) {
		var f = (ev) => this.Emit(nEv, ev);
		
		this.map.on(oEv, f);
	}
}

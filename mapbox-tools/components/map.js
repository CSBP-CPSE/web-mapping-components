import Core from '../../basic-tools/tools/core.js'
import Evented from '../../basic-tools/components/evented.js'

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
	 * @param {string} sourceName - string of the id for a data source added
	 * with the AddSource method.
	 */
	AddClusters(sourceName) {
		// Add clusters layer for source
		this.map.addLayer({
			id: sourceName + '_clusters',
			type: 'circle',
			source: sourceName,
			filter: ['has', 'point_count'],
			paint: {
				'circle-color': ['step', ['get', 'point_count'], '#66c2a5', 50, '#fc8d62', 500, '#8da0cb'],
				'circle-radius': ['step', ['get', 'point_count'], 15, 50, 25, 500, 35 ],
				'circle-stroke-width': 0.5,
				'circle-stroke-color': '#000000'
			}
		});
		 
		// Add cluster count labels layer
		this.map.addLayer({
			id: sourceName + '_cluster-count',
			type: 'symbol',
			source: sourceName,
			filter: ['has', 'point_count'],
			layout: {
				'text-allow-overlap': true,
				'text-field': '{point_count_abbreviated}',
				'text-font': ['Open Sans Regular'],
				'text-size': 12
			},
			print: {
				'text-color': '#000000'
			}
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
			this.original[l] = this.map.getPaintProperty(l, property);
			
			this.map.setPaintProperty(l, property, classes)
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
			this.original[l] = this.map.getPaintProperty(l, property);
			this.map.setPaintProperty(l, property, classes)			
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

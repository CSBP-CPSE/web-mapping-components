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
		
		this.click = this.OnLayerClick_Handler.bind(this);;
		
		this.map = new mapboxgl.Map(options); 
		
		this.map.once('styledata', this.OnceStyleData_Handler.bind(this));
		
		this.WrapEvent('moveend', 'MoveEnd');
		this.WrapEvent('zoomend', 'ZoomEnd');
		this.WrapEvent('load', 'Load');
	}
	
	AddSource(name, data) {
		this.map.addSource('odhf', data);
	}
	
	AddControl(control, location) {
		this.map.addControl(control, location);
	}
	
	InfoPopup(lngLat, html) {	
		var popup = new mapboxgl.Popup({ closeOnClick: true })
								.setLngLat(lngLat)
								.setHTML(html)
								.addTo(this.map);
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
	
	SetStyle(style) {
		this.style = style;
		
		this.map.once('styledata', this.OnceStyleData_Handler.bind(this))
		
		this.map.setStyle(style);
	}
	
	SetClickableLayers(layers) {
		this.layers.forEach(l => this.map.off('click', l, this.click)); 
		
		this.layers = layers;
		
		this.layers.forEach(l => this.map.on('click', l, this.click));
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
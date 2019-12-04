import Other from './other.js';	// TODO : yiich that name sucks

export default class Map {

	static set Token(value) { mapboxgl.accessToken = value; }
	
	static get Token() { return mapboxgl.accessToken; }
	
	static InfoPopup(map, lngLat, html) {	
		var popup = new mapboxgl.Popup({ closeOnClick: true })
								.setLngLat(lngLat)
								.setHTML(html)
								.addTo(map);
	}
	
	static Choropleth(map, layers, classes) {
		layers.forEach(function(l) {
			map.setPaintProperty(l, 'fill-color', classes);
		});
	}
	
	static ReorderLayers(map, layers) {
		layers.forEach(function(l) { map.moveLayer(l); });
	}
	
	static Destroy(map, config, hClick) {
		config.layers.forEach(function(l) { 
			map.off('click', l, hClick); 
		});
	}
	
	static Reload(map, config) {
		map.setStyle(config.style);
	}
	
	static Redraw(map, config, opacity, hClick) {
		if (config.selected) map.setLayoutProperty(config.selected, 'visibility', 'visible');
		
		// Maybe make a classification function in MBT.Map
		var classes = Other.Classes(config.classes, config.legend, opacity);
		
		Map.Choropleth(map, config.layers, classes);
		
		config.layers.forEach(function(l) {
			map.on('click', l, hClick);
		});
	}
}
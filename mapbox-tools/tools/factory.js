import Legend from '../controls/legend.js';
import MapsList from '../controls/mapsList.js';
import Menu from '../controls/menu.js';

export default class Factory {

	static Map(container, style, center, zoom) {
		return new mapboxgl.Map({ container: container, style: style, center: center, zoom: zoom });
	}
	
	static NavigationControl() {
		return new mapboxgl.NavigationControl();
	}
	
	static GeolocateControl() {
		return new mapboxgl.GeolocateControl({
			positionOptions: { enableHighAccuracy: true },
			trackUserLocation: true
		});
	} 
	
	static ScaleControl(units) {
		return new mapboxgl.ScaleControl({
			maxWidth: 80,
			unit: units
		});
	}
	
	static AttributionControl() {
		return new mapboxgl.AttributionControl({ compact: true });
	}
	
	static LegendControl(toc, selected, legend, title, subtitle) {
		return new Legend({ toc:toc, selected:selected, legend:legend, title:title, subtitle:subtitle });
	}
	
	static MapsListControl(maps, selected) {
		return new MapsList({ maps:maps, selected:selected });
	}
	
	static MenuControl() {
		return new Menu();
	}
}
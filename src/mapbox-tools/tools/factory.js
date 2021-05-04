import Legend from '../controls/legend.js';
import Toc from '../controls/toc.js';
import Opacity from '../controls/opacity.js';
import Download from '../controls/download.js';
import MapsList from '../controls/mapsList.js';
import Bookmarks from '../controls/bookmarks.js';
import Search from '../controls/search.js';
import Fullscreen from '../controls/fullscreen.js';
import Navigation from '../controls/navigation.js';
import Menu from '../controls/menu.js';
import Group from '../controls/group.js';
import Map from '../components/map.js';

/**
 * Factory class
 * @class
 */
export default class Factory {

	/**
	 * A factory method used to create new Map components
	 * @param {object} container DOM reference to the HTML containing the map
	 * @param {string} token mapbox access token (provided by Mapbox)
	 * @param {string} style url to the mapbox map style document
	 * @param {object} center object containing the lat/long coordinates for the center of the map.
	 * @param {number} zoom the map zoom level (between 0-22).
	 * @returns {object} A Map object
	 */
	static Map(container, token, style, center, zoom) {
		Map.Token = token;
		
		return new Map({ container: container, style: style, center: center, zoom: zoom });
	}

	/*
	static NavigationControl(showCompass, showZoom) {
		return new maplibregl.NavigationControl({ showCompass:showCompass, showZoom:showZoom });
	}
	*/
	static NavigationControl(showCompass, showZoom, titleIn, titleOut) {
		return new Navigation({ showCompass:showCompass, showZoom:showZoom, titleIn:titleIn, titleOut:titleOut });
	}
	
	/**
	 * Add a full screen control button which makes the map take up the full screen resolution
	 * @param {string} title tooltip text which appears when hovering over the button
	 * @returns {object} maplibre fullscreencontrol object
	 */
	static FullscreenControl(title) {
		return new Fullscreen({ title:title });
	}
	
	static GeolocateControl() {
		return new maplibregl.GeolocateControl({
			positionOptions: { enableHighAccuracy: true },
			trackUserLocation: true
		});
	} 
	
	/**
	 * Create a new scale control that's added to the map component
	 * @param {string} units the unit of measurement used by the scale bar; 'imperial', 'metric', or 'nautical'.
	 * @returns {object} mablibre scalecontrol object
	 */
	static ScaleControl(units) {
		return new maplibregl.ScaleControl({
			maxWidth: 80,
			unit: units
		});
	}
	
	static AttributionControl() {
		return new maplibregl.AttributionControl({ compact: true });
	}
	
	// TODO : LegendControl requires too many parameters
	static LegendControl(legend, title, banner, subtitle, hasCheckbox) {
		return new Legend({ legend:legend, title:title, banner:banner, subtitle:subtitle, hasCheckbox:hasCheckbox});
	}	
	
	static TocControl(toc) {
		return new Toc({ toc:toc });
	}
	
	static OpacityControl(opacity) {
		return new Opacity({ opacity:opacity });
	}
	
	static DownloadControl(link) {
		return new Download({ link:link });
	}
	
	static MapsListControl(maps) {
		return new MapsList({ maps:maps });
	}
	
	static BookmarksControl(items) {
		return new Bookmarks({ items:items });
	}
	
	static MenuControl(items) {
		return new Menu({ items:items });
	}
	
	static SearchControl(items, placeholder, title) {
		return new Search({ items:items, placeholder:placeholder, title:title });
	}
	
	static Group(controls) {
		return new Group({ controls:controls });
	}
}
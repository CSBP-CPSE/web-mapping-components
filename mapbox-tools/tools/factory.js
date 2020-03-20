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

export default class Factory {

	static Map(container, token, style, center, zoom) {
		Map.Token = token;
		
		return new Map({ container: container, style: style, center: center, zoom: zoom });
	}
	/*
	static NavigationControl(showCompass, showZoom) {
		return new mapboxgl.NavigationControl({ showCompass:showCompass, showZoom:showZoom });
	}
	*/
	static NavigationControl(showCompass, showZoom, titleIn, titleOut) {
		return new Navigation({ showCompass:showCompass, showZoom:showZoom, titleIn:titleIn, titleOut:titleOut });
	}
	
	static FullscreenControl(title) {
		return new Fullscreen({ title:title });
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
	
	// TODO : LegendControl requires too many parameters
	static LegendControl(legend, title, banner, subtitle) {
		return new Legend({ legend:legend, title:title, banner:banner, subtitle:subtitle });
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
import Theme from '../controls/theme.js';
import ThemeDatalist from '../controls/themeDatalist.js';
import Legend from '../controls/legend.js';
import Toc from '../controls/toc.js';
import LabelsToggle from '../controls/labelsToggle.js';
import Opacity from '../controls/opacity.js';
import Download from '../controls/download.js';
import MapsList from '../controls/mapsList.js';
import MapsMenu from '../controls/mapsMenu.js';
import Bookmarks from '../controls/bookmarks.js';
import Search from '../controls/search.js';
import Fullscreen from '../controls/fullscreen.js';
import Navigation from '../controls/navigation.js';
import Menu from '../controls/menu.js';
import Group from '../controls/group.js';
import CollapsableGroup from '../controls/collapsableGroup.js';
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

	/**
	 * Create map navigation control buttons for zooming in and out of the map, and for
	 * resetting the bearing North
	 * @param {boolean} showCompass indicate if the compass button should be shown (true) or not (false)
	 * @param {boolean} showZoom indicate if zoom buttons should be shown (true) or not (false)
	 * @param {string} titleIn tooltip text that appears when hovering over the zoom in button
	 * @param {string} titleOut tooltip text that appears when hovering over the zoom out button
	 * @returns {object} Navigation control object
	 */
	static NavigationControl(showCompass, showZoom, titleIn, titleOut) {
		return new Navigation({ showCompass:showCompass, showZoom:showZoom, titleIn:titleIn, titleOut:titleOut });
	}
	
	/**
	 * Create a full screen control button that makes the map take up the full screen resolution
	 * @param {string} title tooltip text that appears when hovering over the button
	 * @returns {object} Fullscreen control object
	 */
	static FullscreenControl(title) {
		return new Fullscreen({ title:title });
	}
	
	/**
	 * Creates a geolocate control that when clicked attempts to geo-locate your real world position
	 * and update the map extent to your current location.
	 * @returns {object} a maplibre GeolocateControl object
	 */
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
			maxWidth: 100,
			unit: units
		});
	}
	
	static AttributionControl() {
		return new maplibregl.AttributionControl({ compact: true });
	}
	
	/**
	 * Creates a new Legend control that is added to the map component
	 * @param {object} config Legend configuration
	 * Example:
	 * [
	 * 		{
	 * 			color: [255,0,0],
	 * 			label: "Legend Item A",
	 * 			title: "Toggle Legend Item Visibility",
	 * 			opacity: 1,
	 * 			value: ["==", ["get", "type"], "A"] <- Mapbox expression
	 * 		},
	 * 		...
	 * 		{
	 * 			color: [150,150,150],
	 * 			label: "Other",
	 * 			title: "Toggle Legend Item Visibility"
	 * 		}
	 * ]
	 * @param {string} title Legend title text
	 * @param {string} banner Legend banner text, placed above the legend's title and subtitle.
	 * @param {string} subtitle Legend subtitle text
	 * @returns {object} Legend control object
	 */
	static LegendControl(config, title, banner, subtitle) {
		return new Legend({ config:config, title:title, banner:banner, subtitle:subtitle});
	}

	/**
	 * Builds a Table of Contents Control
	 * @param {object} toc A collection of TOC items
	 * @param {string} label The label to be shown above the TOC options
	 * @returns TOC object
	 */
	static TocControl(toc, label) {
		return new Toc({ toc:toc, label:label });
	}

	/**
	 * Theme map control 
	 * @param {array} themes a list of themes
	 * @param {string} groups_label the groups label
	 * @param {string} themes_label the themes label
	 * @returns an instantiated Theme control object
	 */
	static ThemeControl(themes, groups_label, themes_label) {
		return new Theme(
			{ 
				themes:themes,
				groups_label:groups_label, 
				themes_label:themes_label
			}
		);
	}
	
	/**
	 * Theme Datalist map control 
	 * @param {array} themes a list of themes
	 * @param {string} groups_label the groups label
	 * @param {string} themes_label the themes label
	 * @returns an instantiated Theme control object
	 */
	 static ThemeDatalistControl(themes, groups_label, themes_label) {
		return new ThemeDatalist(
			{ 
				themes:themes,
				groups_label:groups_label,
				themes_label:themes_label
			}
		);
	}
	
	/**
	 * Creates a new Opacity slider control that can be added to the map
	 * @param {number} opacity Number representing the initial opacity value between 0-1.
	 * @returns {object} Opacity control object
	 */
	static OpacityControl(opacity) {
		return new Opacity({ opacity:opacity });
	}
	
	/**
	 * Builds a Download Control
	 * @param {string} link The link URL
	 * @param {string} label The link label text
	 * @returns Download Control object
	 */
	static DownloadControl(link, label) {
		return new Download({ link:link, label:label });
	}
	
	/**
	 * Creates a new MapsList control that can be added to the map, which
	 * provides a utility to switch between map styles.
	 * @param {object} maps Dictionary containing a collection of maps
	 * Example:
	 * {
	 * 		mapa: {
	 * 			id: "mapa",
	 * 			style: "map style url",
	 * 			title: "Map A"
	 * 		},
	 * 		...
	 * }
	 * @param {string} label The label text to be shown as the header of the maps list control
	 * @returns {object} MapsList control object
	 */
	static MapsListControl(maps, label) {
		return new MapsList({ maps:maps, label:label });
	}
	
	/**
	 * Builds a Maps Menu Control
	 * @param {object} maps A collection of keys containing the details on each map 
	 * @param {string} label The label to be shown next to the maps select menu
	 * @returns MapsMenu object
	 */
	static MapsMenuControl(maps, label) {
		return new MapsMenu({ maps:maps, label:label });
	}
	
	/**
	 * Creates a new Bookmarks control that can be added to a map.
	 * The control provides an easy way to navigate the map to predefined
	 * locations.
	 * @param {array} items List of bookmarked location, which includes the
	 * bookmarked location's extent and a label.
	 * Example: 
	 * [
	 * 		{
	 * 			extent: [[-75, 50],[-74, 52]],
	 * 			label: "Location 1"
	 * 		},
	 * 		...,
	 * 		{
	 * 			extent: [[20, 35],[22,36]],
	 * 			label: "Location N"
	 * 		}
	 * ] 
	 * @param {string} label The label text to be shown as the header of the bookmarks control
	 * @param {string} description The description text to be shown at the bottom of the bookmarks control
	 * @returns {object} Bookmarks control object
	 */
	static BookmarksControl(items, label, description) {
		return new Bookmarks({ items:items, label:label, description:description });
	}
	
	static MenuControl(items) {
		return new Menu({ items:items });
	}
	
	/**
	 * Creates a new Search control to add to the application. When a user
	 * selects a search item, the map zooms to that defined location.
	 * @param {array} items A list of search items that can be selected.
	 * Example:
	 * [
	 * 		{
	 * 			extent: [[33,63],[40,65]],
	 * 			id: "12345",
	 * 			label: "Foo Bar (12345)",
	 * 			name: "Foo Bar"
	 * 		},
	 * 		...
	 * ]
	 * @param {string} placeholder The placeholder text shown in the search
	 * input field. 
	 * @param {string} title The title text that's shown when hovering over 
	 * the control.
	 * @returns {object} Search control object
	 */
	static SearchControl(items, placeholder, title) {
		return new Search({ items:items, placeholder:placeholder, title:title });
	}

	/**
	 * Creates a container, which contains a collection of map controls.
	 * @param {object} controls A collection of map controls
	 * Example: 
	 * {
	 * 		opacity: Factory.OpacityControl(1),
	 * 		...
	 * }
	 * @returns {object} Group control object
	 */
	static Group(controls) {
		return new Group({ controls:controls });
	}
	
	/**
	 * Creates a collapsable group container that contains a collection of controls.
	 * @param {object} controls A collection of map controls
	 * Example: 
	 * {
	 * 		opacity: Factory.OpacityControl(1),
	 * 		...
	 * }
	 * @param {string} summaryLabel Text label for collapsable group
	 * @returns {object} Collapsable group control object
	 */
	 static CollapsableGroup(controls, summaryLabel) {
		return new CollapsableGroup(
			{
				controls: controls, 
				summary: summaryLabel
			}
		);
	}
	
	/**
	 * Create a Labels Toggle Control
	 * @param {object} map Web-Mapping-Components Map Object
	 * @param {string} label Control label
	 * @returns A new Labels Toggle control
	 */
	static LabelsToggleControl(map, label) {
		return new LabelsToggle({ map: map, label : label });
	}
}
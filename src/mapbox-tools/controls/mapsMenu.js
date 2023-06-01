import Control from '../components/control.js';
import Dom from '../../basic-tools/tools/dom.js';

/**
 * MapsMenu Control class
 * @class
 */
export default class MapsMenu extends Control { 
		
	constructor(options) {	
		super(options);
		
		this._container = this.Node('root');
		this.maps = options.maps;

		// If a custom label is provided, update menu label
		if (options.label && typeof(options.label) === 'string') {
			this.Node('maps-menu-label').innerHTML = options.label;
			Dom.SetAttribute(this.Node('maps-menu'), 'aria-label', options.label);
		}

		// Update the Maps Select Menu
		this.updateMapsMenu(this.maps);

		// Add event listeners for change events on maps menu
		this.Node('maps-menu').addEventListener('change', this.onMapsMenuSelectorChange_Handler.bind(this));
	}

	/**
	 * Select maps menu value getter
	 * @returns {string} The value of the maps-menu select element
	 */
	get value() {
		return this.Node('maps-menu').value;
	}

	/**
	 * Select maps menu value setter
	 * @param {string} val The value the maps-menu select element should be set to
	 */
	set value(val) {
		let menu = this.Node('maps-menu');
		menu.value = val;
	}

	/**
	 * Set maps menu map options
	 * @param {object} val The collection of map configurations used to generate menu options
	 */
	set mapoptions(val) {
		if (typeof val === 'object' && val != null && Object.keys(val).length) {
			this.maps = val;
			this.options.maps = val;

			Dom.Empty(this.Node('maps-menu'));
			this.updateMapsMenu(val);
		}
   }

	/**
	 * Update the maps menu with a collection of maps as select menu options.
	 * @param {object} maps a collection of maps
	 * Example of basic maps object structure:
	 * {
	 * 		"mapa": {
	 * 			id: "mapa",
	 * 			title: "Map A",
	 * 			style: "mapbox://styles/<user-name>/<map-style-id>",
	 * 			...	
	 * 		},
	 * 		"mapb": {
	 * 			id: "mapb",
	 * 			title: "Map B",
	 * 			style: "mapbox://styles/<user-name>/<map-style-id>",
	 * 			...
	 * 		},
	 * 		"mapc": {
	 * 			id: "mapc",
	 * 			title: "Map C",
	 * 			style: "mapbox://styles/<user-name>/<map-style-id>",
	 * 			...
	 * 		}
	 * }
	 */
	updateMapsMenu(maps) {
		let mapKeys = Object.keys(maps);

		for (let i = 0; i < mapKeys.length; i += 1) {
			let mapKey = mapKeys[i];
			let map = maps[mapKey];

			let opt = Dom.Create('option', {
				value: String(map.id),
				innerHTML: String(map.title)
			}, this.Node('maps-menu'));
			opt.setAttribute('handle', 'maps-menu-option');
		}
	}

	/**
	 * Handle maps menu selection changes and emit required map selection details 
	 * @param {Event} ev
	 */
	onMapsMenuSelectorChange_Handler(ev) {
		let mapsMenuSelection = this.Node('maps-menu').value;

		// Emit change event for maps menu
		this.Emit('MapsMenuControlChanged', {
			id: mapsMenuSelection, 
			map: this.maps[mapsMenuSelection]
		});
	}

	/**
	 * HTML Template for Maps Menu Control
	 * @returns {string} Template representing a maps menu control
	 */
	Template() {
		return "<div handle='root' class='maps-menu mapboxgl-ctrl'>" + 
					"<div class='maps-menu-container'>" + 
						"<label handle='maps-menu-label' class='maps-menu-label'>Maps</label>" +
						"<select aria-label='Maps' handle='maps-menu' name='maps-menu' class='maps-menu'></select>" +
					"</div>" +
				"</div>"
	}
}
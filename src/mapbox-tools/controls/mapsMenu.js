import Control from '../components/control.js';
import Core from '../../basic-tools/tools/core.js';
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
	 * Update the maps menu with a collection of maps as select menu options.
	 * @param {object} maps a collection of maps
	 * Example of basic maps object structure:
	 * {
	 * 		"mapa": {
	 * 			id: "mapa",
	 * 			title: "Map A",
	 * 			...	
	 * 		},
	 * 		"mapb": {
	 * 			id: "mapb",
	 * 			title: "Map B",
	 * 			...
	 * 		},
	 * 		"mapc": {
	 * 			id: "mapc",
	 * 			title: "Map C",
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
				value: map.id,
				innerHTML: map.title
			}, this.Node('maps-menu'));
			opt.setAttribute('handle', 'maps-menu-option');
		}
	}

	/**
	 * Handle maps menu selection changes and emit required map selection details 
	 * @param {object} ev Change event
	 */
	onMapsMenuSelectorChange_Handler(ev) {
		let mapsMenuSelection = this.Node('maps-menu').value;

		// Emit change event for maps menu
		this.Emit('MapsMenuSelectorChange', {
			id: mapsMenuSelection, 
			map: this.maps[mapsMenuSelection]
		});
	}

	/**
	 * HTML Template for Maps Menu Control
	 * @returns {string} Template representing a maps menu control
	 */
	Template() {
		return "<div handle='root' class='maps-menu-selector'>" + 
					"<div class='maps-menu-container'>" + 
						"<label class='control-label'>Maps</label>" +
						"<select aria-label='Maps' handle='maps-menu' name='maps-menu' class='maps-menu'></select>" +
					"</div>" +
			   "</div>"
	}
}
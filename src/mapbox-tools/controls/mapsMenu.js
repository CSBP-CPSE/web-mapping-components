import Control from '../components/control.js';
import Core from '../../basic-tools/tools/core.js';
import Dom from '../../basic-tools/tools/dom.js';

/**
 * MapsMenu class
 * @class
 */
export default class MapsMenu extends Control { 
		
	constructor(options) {	
		super(options);
		
		this._container = this.Node('root');
		this.maps = options.maps;
		
		this.updateMapsMenu(this.maps);

		// Add event listeners for change events on maps menu
		this.Node('maps-menu').addEventListener('change', this.onMapsMenuSelectorChange_Handler.bind(this));
	}

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

	onMapsMenuSelectorChange_Handler(ev) {
		let mapsMenuSelection = this.Node('maps-menu').value;

		this.Emit('MapsMenuSelectorChange', {id: mapsMenuSelection, map: this.maps[mapsMenuSelection]});
	}
	
	Template() {
		return "<div handle='root' class='maps-menu-selector'>" + 
					"<div class='maps-menu-container'>" + 
						"<label class='control-label'>Maps</label>" +
						"<select aria-label='Maps' handle='maps-menu' name='maps-menu' class='maps-menu'></select>" +
					"</div>" +
			   "</div>"
	}
}
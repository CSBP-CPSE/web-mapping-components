import Control from '../components/control.js';
import Core from '../../basic-tools/tools/core.js';
import Dom from '../../basic-tools/tools/dom.js';
import Tooltip from '../../basic-tools/components/tooltip.js';

/**
 * Mapslist class
 * @class
 */
export default class MapsList extends Control {

	constructor(options) {
		super(options);
		
		this._container = this.Node('root');
		
		// If a custom label is provided, update menu label
		if (options.label && typeof(options.label) === 'string') {
			this.Node('maps-header').innerHTML = options.label;
		}

		//this.tooltip = new Tooltip();
		
		// Update the Maps List
		this.updateMapsList(options.maps);
	}

	/**
	 * Set the list of map options
	 * @param {object} val The collection of map configurations used to generate menu list items
	 */
	set mapoptions(val) {
		if (typeof val === 'object' && val != null && Object.keys(val).length) {
			this.options.maps = val;

			Dom.Empty(this.Node('maps-ul'));
			this.updateMapsList(val);
		}
   }

	/**
	 * Update the list of maps in the control
	 * @param maps a list of map configurations
	 */
	updateMapsList(maps) {
		for (var id in maps) {
			this.AddMapItem(String(id), maps[id]);
		}
	}

	AddMapItem(id, map) {
		var li = Dom.Create('li', {
			className:"maps-list-item",
			innerHTML:String(map.title),
			tabIndex:0 }, this.Node("maps-ul"));
		
		//li.addEventListener("mousemove", this.OnLiMouseMove_Handler.bind(this, id, map));
		//li.addEventListener("mouseleave", this.OnLiMouseLeave_Handler.bind(this, id, map));
		li.addEventListener("click", this.OnLiClick_Handler.bind(this, id, map));
		li.addEventListener("keydown", this.OnLiKeydown_Handler.bind(this, id, map));
	}

	/*
	OnLiMouseMove_Handler(id, map, ev) {
		this.tooltip.Node("content").innerHTML = map.description;
		this.tooltip.Show(ev.pageX - window.scrollX + 20, ev.pageY - window.scrollY);
	}
	
	OnLiMouseLeave_Handler(id, map, ev) {
		this.tooltip.Hide();
	}
	*/

	OnLiKeydown_Handler(id, map, ev) {
		// prevent default event on specifically handled keys
		if (ev.keyCode != 13) return;
		
		ev.preventDefault();
		
		this.Emit("MapSelected", { id:id, map:map });
	}
	
	OnLiClick_Handler(id, map, ev) {
		this.Emit("MapSelected", { id:id, map:map });
	}
	
	Template() {
		return "<div handle='root' class='maps'>" +
					"<div class='maps-header-container'>" +
						`<img class='maps-header-icon' src='${Core.root}assets/layers.png'></img>` +
						"<h2 handle='maps-header' class='maps-header'>Maps</h2>" +
					"</div>" +
					"<ul handle='maps-ul' class='maps-list'></ul>" +
					// "<div handle='description' class='maps-description'></div>" +
				"</div>"
	}
}
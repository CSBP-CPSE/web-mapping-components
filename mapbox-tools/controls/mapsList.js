import Control from '../components/control.js';
import Core from '../../basic-tools/tools/core.js';
import Dom from '../../basic-tools/tools/dom.js';
import Tooltip from '../../basic-tools/components/tooltip.js';

export default class MapsList extends Control { 
		
	constructor(options) {	
		super(options);
		
		this._container = this.Node('root');
		
		this.tooltip = new Tooltip();
		
		for (var id in options.maps) this.AddMapItem(id, options.maps[id]);
	}

	AddMapItem(id, map) {
		var li = Dom.Create('li', { className:"maps-list-item", innerHTML:map.title }, this.Node("ul"));
		
		li.addEventListener("mousemove", this.OnLiMouseMove_Handler.bind(this, id, map));
		li.addEventListener("mouseleave", this.OnLiMouseLeave_Handler.bind(this, id, map));
		li.addEventListener("click", this.OnLiClick_Handler.bind(this, id, map));
	}
	
	OnLiMouseMove_Handler(id, map, ev) {	
		this.tooltip.Node("content").innerHTML = map.description;
		this.tooltip.Show(ev.x + 20, ev.y);
	}
	
	OnLiMouseLeave_Handler(id, map, ev) {	
		this.tooltip.Hide();
	}
	
	OnLiClick_Handler(id, map, ev) {		
		this.Emit("MapSelected", { id:id, map:map });
	}
	
	Template() {
		return "<div handle='root' class='maps'>" + 
				  "<div class='maps-header-container'>" + 
					 "<img class='maps-header-icon' src='assets/layers.png'></img>" +
					 "<h2 class='maps-header'>nls(Maps_Header)</h2>" +
				  "</div>" +
				  "<ul handle='ul' class='maps-list'></ul>" + 
				  "<div handle='description' class='maps-description'>nls(Maps_Description)</div>" +
			   "</div>"
	}
}
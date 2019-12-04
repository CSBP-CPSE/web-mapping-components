import Control from '../components/control.js';
import Core from '../../basic-tools/tools/core.js';
import Dom from '../../basic-tools/tools/dom.js';

export default class MapsList extends Control { 
		
	constructor(options) {	
		super(options);
		
		this._container = this.Node('root');
		
		for (var id in options.maps) this.AddMapItem(options.maps[id]);
	}

	AddMapItem(map) {
		var li = Dom.Create('li', { className:"maps-list-item", innerHTML:map.title[Core.locale] }, this.Node("ul"));
		
		li.addEventListener("click", this.OnLiClick_Handler.bind(this, map));
	}
	
	OnLiClick_Handler(map, ev) {		
		this.Emit("MapSelected", { map:map });
	}
	
	Template() {
		return "<div handle='root' class='maps'>" + 
				"<div class='maps-header-container'>" + 
					"<img class='maps-header-icon' src='assets/layers.png'></img>" +
					"<h2 class='maps-header'>nls(Maps_Header)</h2>" +
				"</div>" +
				"<ul handle='ul' class='maps-list'></ul>" + 
			   "</div>"
	}
}
import Control from '../components/control.js';
import Dom from '../../basic-tools/tools/dom.js';

export default class Menu extends Control { 
		
	constructor(options) {	
		super(options);
		
		this._container = this.Node('root');
	}
	
	AddButton(icon, title, hClick) {
		var root = this.Node("root");
		var btn = Dom.Create("button", { "title":title, "aria-label":title, "type":"button" }, root);
		var img = Dom.Create("img", { "className":"mapboxgl-ctrl-icon", "src":icon }, btn);
		
		btn.addEventListener("click", hClick);
		
		return btn;
	}
	
	Template() {
		return "<div handle='root' class='maps-control mapboxgl-ctrl mapboxgl-ctrl-group'></div>";
	}
}
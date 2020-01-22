import Control from '../components/control.js';
import Dom from '../../basic-tools/tools/dom.js';
import Popup from '../../basic-tools/components/popup.js';

export default class Menu extends Control { 
		
	constructor(options) {	
		super(options);
		
		this._container = this.Node('root');
		
		this.buttons = {};
	}
	
	AddButton(id, icon, title, hClick) {
		if (this.buttons[id]) throw new Error("Button already exists in menu.");
		
		var root = this.Node("root");
		var btn = Dom.Create("button", { "title":title, "aria-label":title, "type":"button" }, root);
		var img = Dom.Create("img", { "className":"mapboxgl-ctrl-icon", "src":icon }, btn);
		
		btn.addEventListener("click", hClick);
		
		this.buttons[id] = { node:btn };
		
		return btn;
	}
	
	AddPopupButton(id, icon, title, widget) {
		var popup = new Popup("modal");
		
		popup.Content = widget.Node("root");
		
		this.AddButton(id, icon, title, (ev) => { popup.Show(); });
		
		this.buttons[id].popup = popup;
		
		return popup;
	}
	
	Button(id) {
		return this.buttons[id] || null;
	}
	
	Template() {
		return "<div handle='root' class='maps-control mapboxgl-ctrl mapboxgl-ctrl-group'></div>";
	}
}
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
		var btn = Dom.Create("button", { "title":title, "aria-label":title, "type":"button", "className":"mapboxgl-ctrl-icon" }, root);
		var img = Dom.Create("img", { "alt":title, "src":icon }, btn);
		
		btn.addEventListener("click", hClick);
		
		this.buttons[id] = { node:btn };
		
		return btn;
	}
	
	AddPopupButton(id, icon, title, widget, container) {
		var popup = new Popup("modal absolute popup-" + id, container);
		
		popup.Content = widget.Node("root");
		
		var button = this.AddButton(id, icon, title, (ev) => { popup.Show(); });
		
		popup.On("Hide", this.OnPopupHide_Handler.bind(this, button));
		
		this.buttons[id].popup = popup;
		
		return popup;
	}
	
	Button(id) {
		return this.buttons[id] || null;
	}
	
	OnPopupHide_Handler(button, ev) {
		button.focus();
	}
	
	Template() {
		return "<div handle='root' class='maps-control mapboxgl-ctrl mapboxgl-ctrl-group'></div>";
	}
}
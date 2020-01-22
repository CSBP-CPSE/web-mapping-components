import Control from '../components/control.js';
import Dom from '../../basic-tools/tools/dom.js';

export default class Menu extends Control { 
		
	constructor(options) {	
		super(options);
		
		this.controls = {}
		
		for (var id in options.controls) {
			this.AddControl(id, options.controls[id]);
		}
		
		this._container = this.Node('root');
	}
	
	AddControl(id, control) {
		if (this.controls.hasOwnProperty(id)) throw new Error("Control already exists in the group");
		
		this.controls[id] = control;
		
		Dom.Place(control._container, this.Node("root"));
	}
	
	Template() {
		return "<div handle='root' class='mapboxgl-ctrl mapboxgl-ctrl-group'></div>";
	}
}
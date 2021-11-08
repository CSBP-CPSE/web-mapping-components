import Control from '../components/control.js';
import Dom from '../../basic-tools/tools/dom.js';

/**
 * Group class
 * @class
 */
export default class Group extends Control { 
		
	constructor(options) {	
		super(options);

		this._container = this.Node('root');
		
		this.controls = {}
		
		// Add controls to the group
		for (var id in options.controls) {
			this.AddControl(id, options.controls[id]);
		}
	}
	
	/**
	 * Add a control to the group
	 * @param {string} id The control id being added
	 * @param {object} control The control for 
	 */
	AddControl(id, control) {
		if (this.controls.hasOwnProperty(id)) throw new Error("Control already exists in the group");
		
		this.controls[id] = control;
		
		Dom.Place(control._container, this.Node("root"));
	}
	
	// HTML template for a group control
	Template() {
		return "<div handle='root' class='mapboxgl-ctrl mapboxgl-ctrl-group'></div>";
	}
}
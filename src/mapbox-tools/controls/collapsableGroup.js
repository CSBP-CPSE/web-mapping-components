import Control from '../components/control.js';
import Dom from '../../basic-tools/tools/dom.js';

/**
 * Collapsable Group class
 * @class
 */
export default class CollapsableGroup extends Control { 
		
	constructor(options) {	
		super(options);
		
		this.controls = {}

		this._container = this.Node('root');

		// Add summary label to the control
		if (options.summary && typeof(options.summary) === 'string') {
			this.Node('collapsable-group-summary').innerHTML = options.summary;
		}
		
		// Add controls to collapsable group
		for (var id in options.controls) {
			this.AddControl(id, options.controls[id]);
		}	
	}

	/**
	 * Add a control to the collapsable group
	 * @param {string} id The control id being added
	 * @param {object} control The control for 
	 */
	AddControl(id, control) {
		if (this.controls.hasOwnProperty(id)) throw new Error("Control already exists in the collapsable group");
		
		this.controls[id] = control;
		
		Dom.Place(control._container, this.Node("root"));
	}

	// HTML template for a collapsable group control
	Template() {
		return "<details open handle='root' class='mapboxgl-ctrl mapboxgl-ctrl-collapsable-group'>" +
		"<summary handle='collapsable-group-summary'></summary>" +
		"</details>";
	}
}
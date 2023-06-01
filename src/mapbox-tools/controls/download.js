import Control from '../components/control.js';

/**
 * Download class
 * @class
 */
export default class Download extends Control {
		
	constructor(options) {
		super(options);

		// If a custom label is provided, update menu label
		if (options.label && typeof(options.label) === 'string') {
			this.Node('link').innerHTML = options.label;
		}
		
		this._container = this.Node('root');

		if (options.link) this.Node('link').setAttribute('href', options.link);
	}
	
	Template() {
		return "<div handle='root' class='download mapboxgl-ctrl'>" +
					"<div class='control-label'>" +
						"<a handle='link' target='_blank' class='link'>Download data</a>" +
					"</div>" +
				"</div>";
	}
}
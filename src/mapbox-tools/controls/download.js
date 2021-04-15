import Control from '../components/control.js';

/**
 * Download class
 * @class
 */
export default class Download extends Control { 
		
	constructor(options) {	
		super(options);
		
		this._container = this.Node('root');

		if (options.link) this.Node('link').setAttribute('href', options.link); 
	}
	
	Template() {        
		return "<div handle='root' class='download mapboxgl-ctrl'>" +
					"<div class='control-label'>" + 
						"<a handle='link' target='_blank' class='link'>nls(Download_Title)</a>" + 
					"</div>" +
				"</div>";
	}
}
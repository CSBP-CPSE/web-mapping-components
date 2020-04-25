import Control from '../components/control.js';
import Core from '../../basic-tools/tools/core.js';
import Dom from '../../basic-tools/tools/dom.js';

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
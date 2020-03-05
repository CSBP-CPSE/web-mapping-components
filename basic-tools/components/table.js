import Templated from './templated.js';
import Core from '../tools/core.js';
import Dom from '../tools/dom.js';

export default Core.Templatable("Basic.Components.Table", class Table extends Templated {
	
    set caption(value) { this.Node('caption').innerHMTL = value; }

	constructor(container, options) {	
		super(container, options);
	}
	
	Template() {        
		return "<table handle='root' class='table'>" +
			   "</table>";
	}
})
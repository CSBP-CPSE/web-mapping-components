import Control from '../components/control.js';
import Core from '../../basic-tools/tools/core.js';
import Dom from '../../basic-tools/tools/dom.js';

export default class Search extends Control { 
		
	constructor(options) {	
		super(options);
		
		this._container = this.Node('root');
		
		this.Node("input").setAttribute("placeholder", options.placeholder || "");
		
		this.Node("input").addEventListener("change", this.OnInputChange_Handler.bind(this));
	}
	
	OnInputChange_Handler(ev) {
		var value = this.Node("input").value;
		
		if (value.length == 0) return;
		
		this.Emit("Change", { value:value });
	}
	
	Template() {        
		return "<div handle='root' class='search mapboxgl-ctrl'>" +
				  "<input handle='input' type='text' class='search-input'>" + 
			   "</div>";
	}
}
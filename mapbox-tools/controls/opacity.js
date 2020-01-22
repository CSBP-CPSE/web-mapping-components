import Control from '../components/control.js';
import Core from '../../basic-tools/tools/core.js';
import Dom from '../../basic-tools/tools/dom.js';

export default class Legend extends Control { 
		
	constructor(options) {	
		super(options);
		
		this._container = this.Node('root');
        
		this.opacity = (this.options.opacity == undefined) ? 0.75 : this.options.opacity;
		
		this.Node("slider").value = this.opacity * 100;		
		this.Node('slider').addEventListener("change", this.onSliderChange_Handler.bind(this));
	}
	
	onSliderChange_Handler(ev) {
		this.opacity = this.Node("slider").value / 100;
		
		this.Emit("OpacityChanged", { opacity:this.opacity });
	}
	
	Template() {        
		return "<div handle='root' class='opacity mapboxgl-ctrl'>" +
				  "<div class='control-label'>nls(Toc_Opacity)</div>" +
				  "<div class='opacity-slider'>" +
					"<input handle='slider' type='range' min='0' max='100' value='75' class='slider'>" +
				  "</div>" +
			   "</div>";
	}
}
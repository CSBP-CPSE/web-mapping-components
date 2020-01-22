import Control from '../components/control.js';
import Core from '../../basic-tools/tools/core.js';
import Dom from '../../basic-tools/tools/dom.js';

export default class Legend extends Control { 
		
	constructor(options) {	
		super(options);
		
		this._container = this.Node('root');
        
		this.Reload(options.legend, options.title, options.subtitle);
	}
	
	Reload(legend, title, subtitle) {		
		this.LoadLegend(legend);
						
		if (title) this.Node('title').innerHTML = title;
		
		if (subtitle) this.Node('subtitle').innerHTML = subtitle;
	}
	
	LoadLegend(config) {
		Dom.Empty(this.Node("legend"));
		
		if (!config) return;
		
		config.forEach(i => this.AddLegendItem(i));
	}
	
	AddLegendItem(item) {
		if (!item.label) return;
		
		var div = Dom.Create("div", { className:"legend-item legend-item-1" }, this.Node("legend"));
		var icn = Dom.Create("div", { className:"legend-icon" }, div);
		var lbl = Dom.Create("div", { innerHTML:item.label }, div);
		
		icn.style.backgroundColor = `rgb(${item.color.join(",")})`;
		icn.style.border = "solid thin silver";
		
		return div;
	}
	
	Template() {        
		return "<div handle='root' class='legend mapboxgl-ctrl'>" +
				  "<div handle='title' class='control-label'>nls(Toc_Legend)</div>" +
				  "<div handle='subtitle' class='control-label'></div>" +
				  "<div handle='legend' class='legend-container'></div>" +
			   "</div>";
	}
}
import Control from '../components/control.js';
import Core from '../../basic-tools/tools/core.js';
import Dom from '../../basic-tools/tools/dom.js';

export default class Legend extends Control { 
		
	constructor(options) {	
		super(options);
		
		this._container = this.Node('root');
        debugger;
		this.chkBoxes = null;
		this.chkBoxesState = null;
		var hasCheckbox = (options.hasCheckbox.toLowerCase());

		this.Reload(options.legend, options.title, options.banner, options.subtitle, hasCheckbox);
	}
	
	Reload(legend, title, banner, subtitle, hasCheckbox) {		
		this.LoadLegend(legend, hasCheckbox);
						
		if (banner) this.Node('banner').innerHTML = banner;
		if (title) this.Node('title').innerHTML = title;
		if (subtitle) this.Node('subtitle').innerHTML = subtitle;
		
		debugger;
		Dom.ToggleCss(this.Node("banner"), "hidden", !banner);
		Dom.ToggleCss(this.Node("title"), "hidden", !title);
		Dom.ToggleCss(this.Node("subtitle"), "hidden", !subtitle);
	}
	
	LoadLegend(config, hasCheckbox) {
		this.chkBoxes = []
		this.chkBoxesState = [];

		Dom.Empty(this.Node("legend"));
		
		if (!config) return;

		if(hasCheckbox == 'true'){
			config.forEach(i => this.AddLegendItemWiCheck(i));
		}
		else{
			config.forEach(i => this.AddLegendItem(i));			
		}
		
	}

	AddLegendItem(item) {
		if (!item.label) return;
		
		var div = Dom.Create("div", { className:"legend-item legend-item-1" }, this.Node("legend"));
		var icn = Dom.Create("div", { className:"legend-icon" }, div);
		var lbl = Dom.Create("div", { innerHTML:item.label.en }, div);
		
		icn.style.backgroundColor = `rgb(${item.color.join(",")})`;
		icn.style.border = "solid thin silver";

		return div;
	}

	AddLegendItemWiCheck(item) {
		if (!item.label) return;
		
		var div = Dom.Create("div", { className:"legend-item legend-item-1" }, this.Node("legend"));
 
		var chkBox = Dom.Create("input", {handle: "checkBox", className: "legend-tickbox" , type: "checkbox"}, div);

		chkBox.addEventListener("change", this.OnCheckbox_Checked.bind(this));
		chkBox.checked = true;

		this.chkBoxes.push(chkBox)

 		var icn = Dom.Create("div", { className:"legend-icon" }, div);
		var lbl = Dom.Create("div", { innerHTML:item.label }, div);

		icn.style.backgroundColor = `rgb(${item.color.join(",")})`;
		icn.style.border = "solid thin silver";
		
		this.chkBoxesState.push({ item:item, checkbox:chkBox });

		return div;
	}

	OnCheckbox_Checked(ev) {
		this.Emit("LegendChange", { state:this.chkBoxesState });
	}

	Template() {        
		return "<div handle='root' class='legend mapboxgl-ctrl'>" +
				  "<div handle='banner' class='control-label legend-banner'></div>" +
				  "<div>" +
					  "<div handle='title' class='control-label'></div>" +
					  "<div handle='subtitle' class='control-label legend-subtitle'></div>" +
				  "</div>" +
				  "<div handle='legend' class='legend-container'></div>" +
			   "</div>";
	}
}
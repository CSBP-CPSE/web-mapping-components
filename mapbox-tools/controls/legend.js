import Control from '../components/control.js';
import Core from '../../basic-tools/tools/core.js';
import Dom from '../../basic-tools/tools/dom.js';

let n = 0;

export default class Legend extends Control { 
		
	constructor(options) {	
		super(options);
		
		this._container = this.Node('root');

		this.chkBoxes = null;
		this.chkBoxesState = null;
		
		this.Reload(options.legend, options.title, options.banner, options.subtitle);
	}
	
	Reload(legend, title, banner, subtitle) {		
		this.LoadLegend(legend);
						
		if (banner) this.Node('banner').innerHTML = banner;
		if (title) this.Node('title').innerHTML = title;
		if (subtitle) this.Node('subtitle').innerHTML = subtitle;
		
		Dom.ToggleCss(this.Node("banner"), "hidden", !banner);
		Dom.ToggleCss(this.Node("title"), "hidden", !title);
		Dom.ToggleCss(this.Node("subtitle"), "hidden", !subtitle);
	}
	
	LoadLegend(config) {
		this.chkBoxes = []
		this.chkBoxesState = [];

		Dom.Empty(this.Node("legend"));
		
		if (!config) return;

		config.forEach(i => this.AddLegendItem(i));
	}

	AddLegendItem(item) {
		if (!item.label) return;
		
		var id = "legend-check-" + ++n;
		var div = Dom.Create("div", { className:"legend-item legend-item-1" }, this.Node("legend"));
		var chkBox = Dom.Create("input", { id:id, title: item.title, className: "legend-tickbox", type:"checkbox", checked:true }, div);
 		var icn = Dom.Create("div", { className:"legend-icon" }, div);
		var lbl = Dom.Create("label", { innerHTML:item.label }, div);

		lbl.setAttribute("for", id);

		this.chkBoxes.push(chkBox)
		
		chkBox.addEventListener("change", this.OnCheckbox_Checked.bind(this));
		
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
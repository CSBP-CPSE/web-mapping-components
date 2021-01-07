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
		let i, legendItem;
		this.chkBoxes = [];
		this.chkBoxesState = [];

		Dom.Empty(this.Node("legend"));
		
		if (Array.isArray(config)) {
			for (i = 0; i < config.length; i += 1) {
				legendItem = config[i];
				this.AddLegendItem(legendItem);
			}
		}
	}

	AddLegendItem(item) {
		var chkBox, svg, icn, lbl, i, id, div;
		if (!item.label && !item.group) return;
		
		id = "legend-check-" + ++n;
		div = Dom.Create("div", { className:"legend-item legend-item-1" }, this.Node("legend"));

		// Add groups of items if them exist in legend
		if (item.group && item.group.heading) {
			Dom.Create('div', {className: "legend-heading", innerHTML: item.group.heading}, div);
			if (item.group.items) {
				for (i = 0; i < item.group.items.length; i += 1) {
					// Copy item title to group item
					if (!item.group.items[i].title) {
						item.group.items[i].title = item.title;
					}

					// Add group item to legend
					this.AddLegendItem(item.group.items[i]);
				}
			}

		} else {
			chkBox = Dom.Create("input", { id:id, title: item.title, className: "legend-tickbox", type:"checkbox", checked:true }, div);
			svg = Dom.CreateSVG("svg", { width:15, height:15 }, div);
			icn = Dom.CreateSVG("rect", { width:15, height:15 }, svg);
			lbl = Dom.Create("label", { innerHTML:item.label }, div);

			lbl.setAttribute("for", id);
   
			this.chkBoxes.push(chkBox)
		   
			chkBox.addEventListener("change", this.OnCheckbox_Checked.bind(this));
		   
			icn.setAttribute('fill', `rgb(${item.color.join(",")})`);
				   
			this.chkBoxesState.push({ item:item, checkbox:chkBox });
   
			return div;
		}
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
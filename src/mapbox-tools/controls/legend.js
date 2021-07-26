import Control from '../components/control.js';
import Dom from '../../basic-tools/tools/dom.js';

let n = 0;

/**
 * Legend class
 * @class
 */
export default class Legend extends Control { 
		
	constructor(options) {
		super(options);
		
		this._container = this.Node('root');

		this.config = options.config;
		this.title = options.title;
		this.subtitle = options.subtitle;
		this.banner = options.banner;
		this.chkBoxes = null;
		this.chkBoxesState = null;
		
		this.Reload(options.config, options.title, options.banner, options.subtitle);
	}
	
	Reload(config, title, banner, subtitle) {
		
		// Update legend properties
		this.config = config;
		this.banner = banner || null;
		this.title = title || null;
		this.subtitle = subtitle || null;

		/// Load legend items into legend
		this.LoadLegend(config);
						
		// Update legend labels with the current legend properties
		if (this.banner) this.Node('banner').innerHTML = this.banner;
		if (this.title) this.Node('title').innerHTML = this.title;
		if (this.subtitle) this.Node('subtitle').innerHTML = this.subtitle;
		
		// Hide portions on legend which aren't defined.
		Dom.ToggleClass(this.Node("banner"), "hidden", !this.banner);
		Dom.ToggleClass(this.Node("title"), "hidden", !this.title);
		Dom.ToggleClass(this.Node("subtitle"), "hidden", !this.subtitle);
	}
	
	/**
	 * Load legend as defined in map config file
	 * @param {object} config - legend object in map config file
	 */
	LoadLegend(config) {
		let i, legendItem;
		this.chkBoxes = [];
		this.chkBoxesState = [];

		Dom.Empty(this.Node("legend"));
		
		// Add each legend item
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

	/**
	 * Gets the style data from provided legend item
	 * @param {object} legendItem - Object containing the style information 
	 * @retruns - An object containing the legendItem color and value if available
	 */
	static GetStylingFromLegendItem(legendItem) {
		let style = {};

		if (legendItem.color) {
			style.color = legendItem.color;

			if (legendItem.value) {
				style.value = legendItem.value;
			}
		}

		return style;
	}

	/**
	 * Get list of legend style rules (colours and expression values) defined
	 * in the legend config.
	 * @param {array} legendConfig A list of config items defining the legend
	 * @returns A list of style objects containing colours and conditions
	 * needed to paint layers with that colour.
	 */
	static GetListOfStyles(legendConfig) {
		let i, j, legendItem, groupItems;
		let styleCollection = [];

		// Iterate through legendConfig and get styling from each
		if (Array.isArray(legendConfig)) {
			for (i = 0; i < legendConfig.length; i += 1) {
				legendItem = legendConfig[i];
				if (legendItem.group && legendItem.group.items) {
					// If item is a group of items, get styling from all items in group
					groupItems = legendItem.group.items;
					for (j = 0; j < groupItems.length; j += 1) {
						styleCollection.push(this.GetStylingFromLegendItem(groupItems[j]));
					}
				} else {
					styleCollection.push(this.GetStylingFromLegendItem(legendItem));
				}
			}
		}

		return styleCollection;
	}	

	OnCheckbox_Checked(ev) {
		this.Emit("LegendChange", { state:this.chkBoxesState });
	}

	// Template for legend widget
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
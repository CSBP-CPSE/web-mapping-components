import Control from '../components/control.js';
import Dom from '../../basic-tools/tools/dom.js';

/**
 * Table of Contents (TOC) class
 * @class
 */
export default class Toc extends Control { 
		
	constructor(options) {	
		super(options);
		
		this._container = this.Node('root');

		this.Reload(options.toc);
	}

	/**
	 * Get the list of TOC items
	 * @returns {array} list of TOC items used for radio button options
	 */
	get items() {
		return this.options.toc;
	}

	/**
	 * Set the list of TOC items
	 * @param {array} tocItems list of TOC items used for radio button options
	 */
	set items(tocItems) {
		this.options.toc = tocItems;
		this.Reload(this.options.toc);
	}

	/**
	 * Checks if the provided layered ID is a TOC radio button items 
	 * @param {string} layerId id of the TOC item
	 * @returns {boolean}
	 */
	HasLayer(layerId) {
		return this.radios.hasOwnProperty(layerId);
	}

	/**
	 * Generate the radio button options for the TOC Control
	 * @param {array} toc list of toc items 
	 */
	Reload(toc) {
		Dom.Empty(this.Node("toc"));
		
        this.radios = {};
		
		if (toc) toc.forEach(i => this.radios[i.id] = this.AddTocItem(i));
	}

	/**
	 * Selects a TOC item
	 * @param {string} layerId id of TOC item
	 */
	SelectItem(layerId) {
		// Uncheck previous TOC Item
		if (this.current && this.HasLayer(this.current)) {
			this.radios[this.current].checked = false;
		}
		
		if (!this.HasLayer(layerId)) return;
		
		this.current = layerId;
		
		this.radios[layerId].checked = true;
	}
	
	/**
	 * Event handler for change events in TOC control
	 * @param {object} item toc item details
	 * Example: 
	 * {
	 * 		id: 1,
	 * 		label: "Item Label",
	 * 		selected: true,
	 *      ...
	 * }
	 * @param {object} ev event object
	 */
	onChange_Handler(item, ev) {
		if (this.current) this.radios[this.current].checked = false;
		
		this.current = item.id;
		
		this.Emit('LayerVisibility', { layer:this.current });
	}

	/**
	 * Add a radio button for TOC control item to the TOC control.
	 * @param {object} item toc item details
	 * Example: 
	 * {
	 * 		id: 1,
	 * 		label: "Item Label",
	 * 		selected: true,
	 *      ...
	 * }
	 * @returns DOM radio button input
	 */
	AddTocItem(item) {
		var i = this.Node("toc").children.length + 1;
		var div = Dom.Create("div", { className:"toc-item" }, this.Node("toc"));
		var ipt = Dom.Create("input", { type:"radio", name:"toc", id:`rd-${i}` }, div);
		var lbl = Dom.Create("label", { innerHTML:item.label }, div);
		
		lbl.setAttribute("for", `rd-${i}`);
		
		ipt.addEventListener('change', this.onChange_Handler.bind(this, item))
		
		return ipt;
	}
	
	// Create a HTML template for the TOC control
	Template() {        
		return "<div handle='root' class='toc mapboxgl-ctrl'>" +
					"<div class='control-label'>nls(Toc_Instruction)</div>" +
					"<div handle='toc' class='legend-container toc-container'></div>" +
				"</div>";
	}
}
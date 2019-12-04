import Control from '../components/control.js';
import Core from '../../basic-tools/tools/core.js';

export default class Legend extends Control { 
	
    get opacity() { return this.Node('slider').value / 100; }
	
	constructor(options) {	
		super(options);
		
		this._container = this.Node('root');
		
        this.radios = {};
        
		if (this.options.toc) {
			this.AssignRadioButtons(this.options.toc);
		
			if (this.options.selected) {
				this.current = this.options.selected;
				this.radios[this.options.selected].checked = true;
			}
		}
		
		if (this.options.title && this.Node('title')) {
			this.Node('title').innerHTML = this.options.title[Core.locale];
		}
		
		if (this.options.subtitle && this.Node('subtitle')) {
			this.Node('subtitle').innerHTML = this.options.subtitle[Core.locale];
		}
		
		this.Node('slider').addEventListener("change", this.onSliderChange_Handler.bind(this));
	}
	
	AssignRadioButtons(toc) {
		toc.forEach(function(l) {
			this.radios[l.id] = this.Node('rd_' + l.id);
			
			this.radios[l.id].addEventListener('change', this.onChange_Handler.bind(this, l.id))
		}.bind(this));
	}
	
	Select(layer) {
		if (this.current) {
			this.radios[this.current].checked = false;
			this._map.setLayoutProperty(this.current, 'visibility', 'none');
		}
		
		this.current = layer;		
		this._map.setLayoutProperty(this.current, 'visibility', 'visible');
	}
	
	onChange_Handler(layer, ev) {
		this.Select(layer);
	}
	
	onSliderChange_Handler(ev) {
		this.Emit("OpacityChanged", { opacity:this.opacity });
	}
	
	Template() {
		var tocHTML = this.options.toc ? this.TocTemplate(this.options.toc) : "";
		var legHTML = this.options.legend ? this.LegendTemplate(this.options.legend) : "";
        
		return "<div handle='root' class='legend mapboxgl-ctrl mapboxgl-ctrl-group'>" +
				  legHTML +
				  tocHTML + 
				  "<div class='legend-label'>nls(Toc_Opacity)</div>" +
				  "<div class='opacity-slider'>" +
					"<input handle='slider' type='range' min='0' max='100' value='75' class='slider'>" +
				  "</div>" +
			  "</div>";
	}
	
	LegendTemplate(legend) {	
		var html = "";
		
		this.options.legend.forEach(function(l) {
			var s = `background-color:rgb(${l.color.join(",")});border:solid thin silver;`;
			var l = l.label[Core.locale];
			
			html += `<div class='legend-item legend-item-1'><div class='legend-icon' style='${s}'></div><div>${l}</div></div>`;
		});
		
		return "<div handle='title' class='legend-label'>nls(Toc_Legend)</div>" +
			   "<div handle='subtitle' class='legend-label'></div>" +
			   "<div class='legend-container'>" + html + "</div>";
	}
	
	TocTemplate(toc) {	
		var html = "";
	
		toc.forEach(function(l) {
			html += "<label>" + 
						"<input handle='rd_" + l.id + "' type='radio' name='boundary'>"  +
						l.label[Core.locale] + 
					"</label>";
		});
		
		return "<div class='legend-label'>nls(Toc_Instruction)</div>" +
			   "<div class='legend-container toc-container'>" + html + "</div>";
	}
}
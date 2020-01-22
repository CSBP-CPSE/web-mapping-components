import Control from '../components/control.js';
import Core from '../../basic-tools/tools/core.js';
import Dom from '../../basic-tools/tools/dom.js';

export default class Toc extends Control { 
		
	constructor(options) {	
		super(options);
		
		this._container = this.Node('root');
        		
		this.Reload(options.toc);
	}
	
	HasLayer(layerId) {
		return this.radios.hasOwnProperty(layerId);
	}
	
	Reload(toc) {
		Dom.Empty(this.Node("toc"));
		
        this.radios = {};
		
		if (toc) toc.forEach(i => this.radios[i.id] = this.AddTocItem(i));
	}
	
	SelectItem(selected) {
		if (this.current) this.radios[this.current].checked = false;
		
		if (!this.HasLayer(selected)) return;
		
		this.current = selected;
		
		this.radios[selected].checked = true;
	}
	
	onChange_Handler(item, ev) {
		if (this.current) this.radios[this.current].checked = false;
		
		this.current = item.id;
		
		this.Emit('LayerVisibility', { layer:this.current });
	}
	
	AddTocItem(item) {
		var i = this.Node("toc").children.length + 1;
		var div = Dom.Create("div", { className:"toc-item" }, this.Node("toc"));
		var ipt = Dom.Create("input", { type:"radio", name:"toc", id:`rd-${i}` }, div);
		var lbl = Dom.Create("label", { innerHTML:item.label }, div);
		
		lbl.setAttribute("for", `rd-${i}`);
		
		ipt.addEventListener('change', this.onChange_Handler.bind(this, item))
		
		return ipt;
	}
	
	Template() {        
		return "<div handle='root' class='toc mapboxgl-ctrl'>" +
				  "<div class='control-label'>nls(Toc_Instruction)</div>" +
				  "<div handle='toc' class='legend-container toc-container'></div>" +
			   "</div>";
	}
}
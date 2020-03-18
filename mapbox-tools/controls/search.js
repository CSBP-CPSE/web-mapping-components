import Typeahead from '../../basic-tools/components/typeahead.js';
import Control from '../components/control.js';
import Core from '../../basic-tools/tools/core.js';
import Dom from '../../basic-tools/tools/dom.js';

export default class Search extends Control { 
		
	constructor(options) {	
		super(options);
		
		this._container = this.Node('root');
		
		this.layer = options.layer;
		this.field = options.field;
		this.color = options.color;
		
		// TODO : This should probably happen outside of the widget.
		this.Node('typeahead').items = this.Itemize(options.items);
		this.Node('typeahead').placeholder = options.placeholder;
		this.Node('typeahead').title = options.title;
	
		this.Node('typeahead').On('Change', this.onTypeaheadChange_Handler.bind(this));
	}
	
	Itemize(data) {		
		var items = data.map(i => {
			return { 
				id : i[0], 
				label : `(${i[0]}) ${i[1]}`, 
				extent : [[i[2], i[3]], [i[4], i[5]]] 
			}
		});
		
		return items.sort((a, b) => { return a.label > b.label ? 1 : -1 });
	}
	
	onTypeaheadChange_Handler(ev) {
		var data = {
			layer : this.layer,
			field : this.field,
			color : this.color,
			item : ev.item
		}
		
		this.Emit('Change', data);
	}
	
	Template() {        
		return "<div handle='root' class='search-control mapboxgl-ctrl'>" +
				  "<div handle='typeahead' widget='Basic.Components.Typeahead'></div>" +
			   "</div>";
	}
}
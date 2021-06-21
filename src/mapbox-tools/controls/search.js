import Control from '../components/control.js';

/**
 * Search class
 * @class
 */
export default class Search extends Control { 
		
	constructor(options) {	
		super(options);
		
		this._container = this.Node('root');
		
		this.layer = options.layer;
		this.field = options.field;
		this.color = options.color;
		this.items = options.items;
		
		// TODO : This should probably happen outside of the widget.
		this.Node('typeahead').items = this.Itemize(options.items);
		this.Node('typeahead').placeholder = options.placeholder;
		this.Node('typeahead').title = options.title;
	
		this.Node('typeahead').On('Change', this.onTypeaheadChange_Handler.bind(this));
	}

	/**
	 * Set the search layer for the search control
	 * @param {string} layer Id of the search layer
	 */
	set searchLayer(layer) {
		this.layer = layer
	}

	/**
	 * Get the search layer used by the search control
	 * @returns {string} Id of the current search layer
	 */
	get searchLayer() {
		return this.layer;
	}

	/**
	 * Set the search items associated with the current search control
	 * @param {array} items List of search items
	 * Example of required format for search items:
	 * [
	 * 		{
	 * 			'id':'1001'
	 * 			'name':'Foo Bar'
	 * 			'label':'Foo Bar (1001)'
	 * 			'extent':[[54, 45], [55, 46]]
	 * 		},
	 * 		...
	 * ]
	 */
	set searchItems(items) {
		this.items = items;
	}

	/**
	 * Get search items associated with the current search control
	 * @returns {array} List of search items
	 */
	get searchItems() {
		return this.items;
	}
	
	/**
	 * Update the available items for the typeahead element
	 */
	UpdateSearchItems() {
		this.Node('typeahead').items = this.Itemize(this.items);
	}

	/**
	 * Itemize the search items for the search control
	 * @param {array} items 
	 * @returns {array} list of sorted items
	 */
	Itemize(items) {		
		return items.sort((a, b) => { return a.label > b.label ? 1 : -1 });
	}
	
	/**
	 * Event handler for typeahead changes
	 * @param {object} ev typeahead change event
	 */
	onTypeaheadChange_Handler(ev) {
		var data = {
			layer : this.layer,
			field : this.field,
			color : this.color,
			item : ev.item
		}
		
		this.Emit('Change', data);
	}
	
	/**
	 * Create a template for the search control
	 * @returns {string} html template for search control
	 */
	Template() {        
		return "<div handle='root' class='search-control mapboxgl-ctrl'>" +
				  "<div handle='typeahead' widget='Basic.Components.Typeahead'></div>" +
			   "</div>";
	}
}
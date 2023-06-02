import Templated from './templated.js';
import Core from '../tools/core.js';
import Dom from '../tools/dom.js';

/**
 * Typeahead class
 * @class
 */
export default Core.Templatable("Basic.Components.Typeahead", class Typeahead extends Templated {
	
	/**
	 * Set the placeholder text for the search input
	 * @param {string} value Placeholder text
	 */
    set placeholder(value) {
		this.Node('input').setAttribute('placeholder', value);
	}
	
	/**
	 * Set title for the search
	 * @param {string} value title property for the search input
	 */
	set title(value) {
		this.Node('input').setAttribute('title', value);
	}
	
	/**
	 * Set the typeahead items
	 * @param {array} value list of typeahead items
	 */
	set items(value) {
		this._items = value.map(i => {
			var li = Dom.Create("li", { innerHTML : i.label, tabIndex : -1 });
			var item = { data : i, node : li };
			
			li.addEventListener("mousedown", this.onLiClick_Handler.bind(this, item));
			
			return item;
		});
	}
	
	/**
	 * Set the current typeahead item
	 * @param {object} value typeahead item
	 */
	set current(value) {
		this._curr = value;
	}
	
	/**
	 * Get the current typeahead item
	 * @returns {object} the currently selected typeahead item
	 */
	get current() {
		return this._curr;
	}
	
	constructor(container, options) {
		super(container, options);
		
		this._items = null;
		this._filt = null;
		this._curr = null;
		this._temp = null;
		
		this.Node("input").addEventListener("input", function(ev) { this.OnInputInput_Handler(ev); }.bind(this));

		// this.Node("input").addEventListener("click", this.OnInputClick_Handler.bind(this));
		this.Node("input").addEventListener("keydown", function(ev) { this.OnInputKeyDown_Handler(ev); }.bind(this));
		this.Node("input").addEventListener("blur", function(ev) { this.OnInputBlur_Handler(ev); }.bind(this));
		this.Node("input").addEventListener("focusin", function(ev) { this.OnInputClick_Handler(ev); }.bind(this));
		// this.Node("input").addEventListener("focusout", this.OnInputBlur_Handler.bind(this));
		
		if (!options) return;
		
		this.items = options.items;
	}
	
	// Empty the list of typeahead suggestions
	Empty() {
		Dom.Empty(this.Node("list"));
		
		this._filt = [];
	}
	
	/**
	 * Create a filtered list of typeahead search results and add them to the list
	 * @param {string} mask search input box text
	 */
	Fill(mask) {
		this._filt = this._items.filter(i => compare(i.data.label, mask));
		
		var frag = document.createDocumentFragment();
		
		for (var i = 0; i < this._filt.length; i++) {
			var curr = this._filt[i];
			
			// Maybe insert <b> at right index instead, faster?
			curr.node.innerHTML = curr.data.label.replace(mask, `<b>${mask}</b>`);
			curr.next = this._filt[(i + 1) % this._filt.length];
			curr.next.prev = curr;
		
			Dom.Place(curr.node, frag);
		}
				
		Dom.Place(frag, this.Node("list"));
		
		function compare(label, mask) {
			return label.toLowerCase().indexOf(mask.toLowerCase()) !== -1
		}
	}
	
	// Toggle collapsed class on typeahead DOM element
	UpdateClass() {
		Dom.ToggleClass(this.Node("root"), "collapsed", this._filt.length === 0);
	}
	
	// Reset the typeahead component
	Reset() {
		if (this._temp) Dom.SetClass(this._temp.node, "");
			
		this._temp = null;
		
		this.Empty();
		
		var value = this.current ? this.current.data.label : "";
		
		this.Node("input").value = value;
	}
	
	/**
	 * Handle input events on search input
	 * @param {InputEvent} ev
	 */
	OnInputInput_Handler(ev) {
		// If input is less than 3 character in length, do nothing
		if (ev.target.value.length < 3) return;
		
		this.Empty();
		
		// Fill in typeahead suggestions
		this.Fill(ev.target.value);
		
		this.UpdateClass();
	}
	
	/**
	 * Handle click events on search input
	 * @param {FocusEvent} ev
	 */
	OnInputClick_Handler(ev) {
		// If input is less than 3 character in length, do nothing
		if (ev.target.value.length < 3) return;
		
		// Fill in typeahead suggestions
		this.Fill(ev.target.value);
		
		this.UpdateClass();
		
		this.Emit("Focusin", {});
	}
	
	/**
	 * Handle specific key input events; including up, down, shift+up, enter and esc inputs
	 * @param {KeyboardEvent} ev
	 */
	OnInputKeyDown_Handler(ev) {
		// prevent default event on specifically handled keys
		if (ev.keyCode == 40 || ev.keyCode == 38 || ev.keyCode == 13 || ev.keyCode == 27) ev.preventDefault();

		// shift + up : select text
		if (ev.shiftKey == true &&  ev.keyCode == 38)  this.nodes.Input.select();
		
		// up or down key : cycle through dropdown
		else if (ev.keyCode == 40 || ev.keyCode == 38 ) {
			this._temp = this._temp || this._filt[this._filt.length - 1];
			
			Dom.SetClass(this._temp.node, "");
			
			this._temp = (ev.keyCode == 40) ? this._temp.next : this._temp.prev;
			
			this.Node("input").value = this._temp.data.label;
			
			this.ScrollTo(this._temp);
			
			Dom.SetClass(this._temp.node, "active");
		}

		// enter : select currently focused
		else if (ev.keyCode == 13) {
			// if an item is currently selected through arrows, select that one
			if (this._temp) this.onLiClick_Handler(this._temp);
			
			// if a filtered list is being shown, select the first item
			else if (this._filt.length > 0) this.onLiClick_Handler(this._filt[0]);

			// nothing is selected (don't think this can happen
			else {
				this.OnInputClick_Handler({ target:this.Node("input") });
			}
		}

		// if escape key
		else if (ev.keyCode == 27) this.OnInputBlur_Handler();
	}
	
	/**
	 * Handle blur events
	 * @param {FocusEvent} ev
	 */
	OnInputBlur_Handler(ev) {
		this.Reset();
		
		this.UpdateClass();
	}
	
	/**
	 * Handle click events on typeahead list item
	 * @param {object} item list item content
	 * @param {MouseEvent} ev
	 */
	onLiClick_Handler(item, ev) {
		this.current = item;
				
		this.Reset();
		
		this.UpdateClass();
		
		this.Emit("Change", { item:item.data });
	}
	
	ScrollTo(item) {
		// create rectangules to know the position of the elements
		var ul = this.Node("list");
		var liBx = item.node.getBoundingClientRect();
		var ulBx = ul.getBoundingClientRect();
		
		//if the element is in this range then it is inside the main container, don't scroll
		if (liBx.bottom > ulBx.bottom) ul.scrollTop = ul.scrollTop + liBx.bottom - ulBx.top - ulBx.height;
		
		else if (liBx.top < ulBx.top) ul.scrollTop = ul.scrollTop + liBx.top - ulBx.top;
	}

	// Create a html template for the typeahead component
	Template() {
		return "<div handle='root' class='typeahead collapsed'>" +
					"<input handle='input' type='text' class='input'>" +
					"<ul handle='list' class='list'></ul>" +
				"</div>";
	}
})

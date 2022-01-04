import Control from '../components/control.js';
import Core from '../../basic-tools/tools/core.js';
import Dom from '../../basic-tools/tools/dom.js';

/**
 * Bookmarks class
 * @class
 */
export default class Bookmarks extends Control { 
		
	constructor(options) {	
		super(options);
		
		this._container = this.Node('root');
		
		if (!options.items) return;
		
		options.items = options.items.sort((a,b) => {
			if (a.label < b.label) return -1;
			
			if (a.label > b.label) return 1;

			return 0;
		});
		
		options.items.forEach((i) => { this.AddBookmark(i); });

		// If a custom label is provided, update control label
		if (options.label && typeof(options.label) === 'string') {
			this.Node('bookmarks-header').innerHTML = options.label;
		}

		// If a custom description is provided, update control description
		if (options.description && typeof(options.description) === 'string') {
			this.Node('description').innerHTML = options.description;
		}
	}
	
	AddBookmark(item) {
		var li = Dom.Create('li', { className:"bookmarks-list-item", innerHTML:item.label, tabIndex:0 }, this.Node("ul"));
		
		li.addEventListener("keydown", this.OnLiKeydown_Handler.bind(this, item));
		li.addEventListener("click", this.OnLiClick_Handler.bind(this, item));
	}
	
	OnLiKeydown_Handler(item, ev) {		
		if (ev.keyCode != 13) return;
		
		ev.preventDefault();
		
		this.Emit("BookmarkSelected", { item:item });
	}
	
	OnLiClick_Handler(item, ev) {		
		this.Emit("BookmarkSelected", { item:item });
	}
	
	Template() {
		return "<div handle='root' class='bookmarks'>" + 
				  "<div class='bookmarks-header-container'>" + 
					 `<img class='bookmarks-header-icon' src='${Core.root}assets/bookmarks.png'></img>` +
					 "<h2 handler='bookmarks-header' class='bookmarks-header'>Bookmarks</h2>" +
				  "</div>" +
				  "<ul handle='ul' class='bookmarks-list'></ul>" + 
				  "<div handle='description' class='bookmarks-description'></div>" +
			   "</div>"
	}
}
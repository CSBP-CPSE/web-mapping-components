import Control from '../components/control.js';
import Core from '../../basic-tools/tools/core.js';
import Dom from '../../basic-tools/tools/dom.js';

export default class Bookmarks extends Control { 
		
	constructor(options) {	
		super(options);
		
		this._container = this.Node('root');
		
		if (!options.items) return;
		
		options.items.forEach((i) => { this.AddBookmark(i); });
	}
	
	AddBookmark(item) {
		var li = Dom.Create('li', { className:"bookmarks-list-item", innerHTML:item.label[Core.locale] }, this.Node("ul"));
		
		li.addEventListener("click", this.OnLiClick_Handler.bind(this, item));
	}
	
	OnLiClick_Handler(item, ev) {		
		this.Emit("BookmarkSelected", { item:item });
	}
	
	Template() {
		return "<div handle='root' class='bookmarks'>" + 
				  "<div class='bookmarks-header-container'>" + 
					 "<img class='bookmarks-header-icon' src='assets/bookmarks.png'></img>" +
					 "<h2 class='bookmarks-header'>nls(Bookmarks_Header)</h2>" +
				  "</div>" +
				  "<ul handle='ul' class='bookmarks-list'></ul>" + 
				  "<div handle='description' class='bookmarks-description'>nls(Bookmarks_Description)</div>" +
			   "</div>"
	}
}
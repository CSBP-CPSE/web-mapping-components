import Control from '../components/control.js';
import Core from '../../basic-tools/tools/core.js';
import Dom from '../../basic-tools/tools/dom.js';

export default class Bookmarks extends Control { 
		
	constructor(options) {	
		super(options);
		
		this._container = this.Node('root');
		
		if (!options.items) return;
		
		options.items = options.items.sort((a,b) => {
			if (a.label < b.label) return -1;
			
			if (a.label > b.label) return 1;

			return 0;
		});
		
		options.items.forEach((i) => { this.AddBookmark(i); });
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
					 "<h2 class='bookmarks-header'>nls(Bookmarks_Header)</h2>" +
				  "</div>" +
				  "<ul handle='ul' class='bookmarks-list'></ul>" + 
				  "<div handle='description' class='bookmarks-description'>nls(Bookmarks_Description)</div>" +
			   "</div>"
	}
}
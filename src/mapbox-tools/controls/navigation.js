import Templated from '../../basic-tools/components/templated.js';
import Evented from '../../basic-tools/components/evented.js';

export default class Navigation extends Evented { 
	
	set titleIn(value) { this._n._zoomInButton.title = value; }
	
	set titleOut(value) { this._n._zoomOutButton.title = value; }
		
	constructor(options) {	
		super();
		
		this._n = new mapboxgl.NavigationControl({ showCompass:options.showCompass, showZoom:options.showZoom });
		
		this.options = options;
	}
			
	onFullscreenClick_Handler(ev) {		
		if (!this.fullscreen) this.Emit("enterFullscreen", {});
		
		else this.Emit("exitFullscreen", {});
	}
	
	onAdd(map) {		
		this._container = this._n.onAdd(map);
		
		this._n._zoomInButton.removeAttribute("aria-label");
		this._n._zoomOutButton.removeAttribute("aria-label");
		
		this.titleIn = this.options.titleIn; 
		this.titleOut = this.options.titleOut; 
		
        this._map = map;
		
        return this._container;
    }

    onRemove() {
		this._n.onRemove();
		
        this._n._container.parentNode.removeChild(this._n._container);
		
		this._map = undefined;
    }
}
import Templated from '../../basic-tools/components/templated.js';
import Evented from '../../basic-tools/components/evented.js';

export default class Fullscreen extends Evented { 
	
	set title(value) { this._fs._controlContainer.firstChild.title = value; }
	
	get fullscreen() { return this._fs._fullscreen; }
	
	constructor(options) {	
		super();
		
		this._fs = new mapboxgl.FullscreenControl();
		
		this.options = options;
	}
			
	onFullscreenClick_Handler(ev) {		
		if (!this.fullscreen) this.Emit("enterFullscreen", {});
		
		else this.Emit("exitFullscreen", {});
	}
	
	onAdd(map) {		
		this._container = this._fs.onAdd(map);
		
		this._fs._controlContainer.firstChild.addEventListener("click", this.onFullscreenClick_Handler.bind(this));
		this._fs._controlContainer.firstChild.removeAttribute("aria-label");
		
		this.title = this.options.title;
		
        this._map = map;
		
        return this._container;
    }

    onRemove() {
		this._fs.onRemove();
		
        this._fs._container.parentNode.removeChild(this._fs._container);
		
		this._map = undefined;
    }
}
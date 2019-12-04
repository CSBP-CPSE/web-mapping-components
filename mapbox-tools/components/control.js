import Templated from '../../basic-tools/components/templated.js';

export default class Control extends Templated { 
	
	constructor(options) {	
		super(null, options);
		
		if (!this.template) throw new Error("MapBox controls cannot be empty");
		
		if (this.template.children.length > 1) throw new Error("MapBox controls should have one root node");
		
		this._container = this.template.children[0];
	}
	
	onAdd(map) {
        this._map = map;
		
        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        
		this._map = undefined;
    }
}
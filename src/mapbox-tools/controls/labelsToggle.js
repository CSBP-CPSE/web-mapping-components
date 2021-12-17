import Control from '../components/control.js';

/**
 * LabelsToggle class
 * @class
 */
export default class LabelsToggle extends Control { 
		
	constructor(options) {	
		super(options);
		
		this.map = options.map;

		this._container = this.Node('root');

		// If a custom label is provided, update menu label
		if (options.label && typeof(options.label) === 'string') {
			this.Node('labels-toggle-label').innerHTML = options.label;
			Dom.SetAttribute(this.Node('labels-toggle-checkbox'), 'aria-label', options.label);
		}

		// Add event listeners for change events on maps menu
		this.Node('labels-toggle-checkbox').addEventListener('change', this.onLabelsToggleCheckboxChange_Handler.bind(this));
	}

	/**
	 * Retrieve a list of layers used by the map
	 * @returns {array} List containing all layers in the map's style specification
	 */
	getMapStyleLayers() {
		let mapStyle = this.map.GetStyle();
			
		if (mapStyle && mapStyle.layers) {
			return mapStyle.layers;
		}
	}

	/**
	 * Get a list of label layers.
	 * 
	 * Note: Label layers in Mapbox use the layer type 'symbol', and have the 
	 * property 'text-field' defined. 
	 * @returns {array} List of layer ids for label layers
	 */
	getLabelLayers() {
		let layerIds = [];
		let styleLayers = this.getMapStyleLayers();

		for (let i = 0; i < styleLayers.length; i += 1) {
			let layer = styleLayers[i];
			if (layer.type && layer.type === 'symbol') {
				let layerId = layer.id;

				if (this.map.GetLayoutProperty(layerId, 'text-field')) {
					layerIds.push(layer.id);
				}
			}
		}

		return layerIds;
	}

	/**
	 * Handle labels toggle checkbox changes
	 * @param {object} ev Change event
	 */
	onLabelsToggleCheckboxChange_Handler(ev) {
		let layerIds = this.getLabelLayers();

		if (ev && ev.currentTarget && ev.currentTarget.checked) {
			for (let i = 0; i < layerIds.length; i += 1) {
				let layerId = layerIds[i];
				this.map.ShowLayer(layerId);
			}
		} else {
			for (let i = 0; i < layerIds.length; i += 1) {
				let layerId = layerIds[i];
				this.map.HideLayer(layerId);
			}
		}
	}

	/**
	 * HTML Template for Labels Toggle Control
	 * @returns {string} Template representing a labels toggle control
	 */
	 Template() {
		return "<div handle='root' class='labels-toggle mapboxgl-ctrl'>" + 
					"<div class='labels-toggle-container'>" + 
						"<label handle='labels-toggle-label' class='labels-toggle-label'>Labels</label>" +
						"<input type='checkbox' checked aria-label='Labels' handle='labels-toggle-checkbox' name='labels-toggle-checkbox' class='labels-toggle-checkbox'></input>" +
					"</div>" +
			   "</div>"
	}
}
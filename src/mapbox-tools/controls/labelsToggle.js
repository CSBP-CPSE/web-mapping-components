import Control from '../components/control.js';
import Core from '../../basic-tools/tools/core.js';
import Dom from '../../basic-tools/tools/dom.js';

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
		}

		// Add event listeners for change events on maps menu
		this.Node('labels-toggle-checkbox').addEventListener('change', this.onLabelsToggleCheckboxChange_Handler.bind(this));
	}

	getMapStyleLayers() {
		if (this.map && this.map.map && this.map.map.style && this.map.map.style.styleSheet) {
			return this.map.map.style.styleSheet;
		}
	}

	getLabelLayers() {
		let layerIds = [];

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
						"<input type='checkbox' checked aria-label='Labels' handle='labels-toggle-checkbox' name='labels-toggle-checkbox' class='labels-toggle-checkbox'></input>" +
						"<label handle='labels-toggle-label' class='labels-toggle-label'>Labels</label>" +
					"</div>" +
			   "</div>"
	}
}
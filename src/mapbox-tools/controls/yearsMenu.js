import Control from '../components/control.js';
import Dom from '../../basic-tools/tools/dom.js';

/**
 * YearsMenu Control class
 * @class
 */
export default class YearsMenu extends Control { 
		
	constructor(options) {	
		super(options);
		
		this._container = this.Node('root');
		this.years = options.years;

		// If a custom label is provided, update menu label
		if (options.label && typeof(options.label) === 'string') {
			this.Node('years-menu-label').innerHTML = options.label;
			Dom.SetAttribute(this.Node('years-menu'), 'aria-label', options.label);
		}

		// Update the Years Select Menu
		this.updateYearsMenu(this.years);

		// Add event listeners for change events on years menu
		this.Node('years-menu').addEventListener('change', this.onYearsMenuSelectorChange_Handler.bind(this));
	}

	/**
	 * Select years menu value getter
	 * @returns {string} The value of the years-menu select element
	 */
	get value() {
		return this.Node('years-menu').value;
	}

	/**
	 * Select years menu value setter
	 * @param {string} val The value the years-menu select element should be set to
	 */
	set value(val) {
		let menu = this.Node('years-menu');
		menu.value = val;
	}

	/**
	 * Update the years menu with a collection of years as select menu options.
	 * @param {array} years a collection of years. e.g [2016, 2021]
	 */
	updateYearsMenu(years) {
		for (let i = 0; i < years.length; i += 1) {
			let year = String(years[i]);

			let opt = Dom.Create('option', {
				value: year,
				innerHTML: year
			}, this.Node('years-menu'));
			opt.setAttribute('handle', 'years-menu-option');
		}
	}

	/**
	 * Handle years menu selection changes and emit required year selection details 
	 * @param {Event} ev
	 */
	onYearsMenuSelectorChange_Handler(ev) {
		let yearsMenuSelection = this.Node('years-menu').value;

		// Emit change event for years menu
		this.Emit('YearsMenuControlChanged', {
			id: yearsMenuSelection
		});
	}

	/**
	 * HTML Template for Years Menu Control
	 * @returns {string} Template representing a years menu control
	 */
	Template() {
		return "<div handle='root' class='years-menu mapboxgl-ctrl'>" + 
					"<div class='years-menu-container'>" + 
						"<label handle='years-menu-label' class='years-menu-label'>Year</label> " +
						"<select aria-label='Years' handle='years-menu' name='years-menu' class='years-menu'></select>" +
					"</div>" +
				"</div>"
	}
}
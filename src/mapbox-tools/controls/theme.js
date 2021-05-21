import Control from '../components/control.js';
import Core from '../../basic-tools/tools/core.js';
import Dom from '../../basic-tools/tools/dom.js';

/**
 * Theme control class
 * @class
 * 
 */
export default class Theme extends Control { 

	constructor(options) {	
		super(options);
		
		this._container = this.Node('root');
		this.themes = options.themes;

		this.UpdateSelectionMenu(this.themes);

		this.Node('themes').addEventListener("change", this.onThemeSelectorChange_Handler.bind(this));
	}
	
	/**
	 * Update theme selection menu
	 * @param {object} themes 
	 */
	UpdateSelectionMenu(themes) {
		let i, theme;

		// Update themes
		this.themes = themes; 

		// Empty theme selection menu before adding items
		Dom.Empty(this.Node("themes"));

		// Add updated themes to selection menu
		if (Array.isArray(themes)) {
			for (i = 0; i < themes.length; i += 1) {
				theme = themes[i];
				if (theme && theme.group) {
					this.AddMenuGroup(theme);
				} else {
					this.AddMenuItem(theme);
				}
			}

			// Dispatch a change event to trigger a theme selection change
			this.Node('themes').dispatchEvent(new Event('change', { 'bubbles': true }));
		}

		// Hide select menu if no options exists
		Dom.ToggleClass(this.Node("themes"), "hidden", !this.themes);
	}

	/**
	 * Add menu group to theme select menu
	 * @param {object} item 
	 */
	AddMenuGroup(item) {
		if (item) {
			if (item.group) {
				Dom.Create("optgroup", {label: item.group[Core.locale]}, this.Node("themes"));
			}

			if (item.items && Array.isArray(item.items)) {
				for (var i = 0; i < item.items.length; i += 1) {
					this.AddMenuItem(item.items[i]);
				}
			}
		}
	}

	/**
	 * Add a menu item to select menu
	 * @param {object} item 
	 * @returns Dom element representing select menu option.
	 */
	AddMenuItem(item) {
		if (item && item.id && item.label) {
			let opt = Dom.Create("option", {value: item.id, innerHTML: item.label[Core.locale]}, this.Node("themes"));
			opt.setAttribute('handle', 'theme-option');
		}
	}

	/**
	 * Get the theme object from a colleciton of themes based on theme id
	 * @param {array} themes list of defined themes
	 * @param {string} themeId id of the theme
	 * @returns {object} the selected theme
	 */
	getThemeById(themes, themeId) {
		let selectedTheme;

		for (var i = 0; i < themes.length; i += 1) {
			let theme = themes[i];
			if (theme) {
				if (theme.id && theme.id === themeId) {
					selectedTheme = theme;
					break;
				} else if (theme.group && theme.items && Array.isArray(theme.items)) {
					selectedTheme = this.getThemeById(theme.items, themeId);
					if (selectedTheme) {
						break;
					}
				}
			}
		}
		return selectedTheme;
	}

	/**
	 * Handler for theme selector change event
	 * @param {object} ev menu selection change event
	 */
	onThemeSelectorChange_Handler(ev) {
		let selection;
		let selectionId = this.Node("themes").value;

		// Get theme by the selection Id
		selection = this.getThemeById(this.themes, selectionId);

		this.Emit("ThemeSelectorChange", { theme: selection });
	}
	
	/**
	 * Provides the HTML template for a theme selector control
	 * @returns {string} controller template
	 */
	Template() {        
		return "<div handle='root' class='theme-selector mapboxgl-ctrl'>" +
				  "<label class='control-label'>Map Theme</label>" +
				  "<select handle='themes' name='themes' class='themes'>" +
				  "</select>" +
			   "</div>";
	}
}
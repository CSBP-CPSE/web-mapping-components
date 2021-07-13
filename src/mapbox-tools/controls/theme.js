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
		
		if (options.type && options.type === 'datalist') {
			this.type = options.type;
		} else {
			this.type = 'select';
		}
		
		this._container = this.Node('root');
		this.themes = options.themes;

		this.updateThemeControl(this.themes);

		// Add event listeners for change events on both select menus
		this.Node('theme-groups').addEventListener("change", this.onThemeGroupsSelectorChange_Handler.bind(this));
		this.Node('themes').addEventListener("change", this.onThemeSelectorChange_Handler.bind(this));
	}
	
	/**
	 * Update theme selection menu
	 * @param {object} themes 
	 */
	updateThemeControl(themes) {
		let themeGroups;

		// Update themes
		this.themes = themes; 

		// Get theme groups defined in config
		themeGroups = this.GetThemeGroups(this.themes);

		if (themeGroups.length) {
			// Add group items if they're defined
			this.updateGroupsMenu(themeGroups);

		} else {
			// If no groups are provided, update themes menu
			this.updateThemesMenu(this.themes);
		}

		// Hide select menu if no options exists
		Dom.ToggleClass(this.Node("groups-menu-container"), "hidden", !themeGroups.length);
		Dom.ToggleClass(this.Node("themes-menu-container"), "hidden", !this.themes);
	}

	/**
	 * Update the group menu options
	 * @param {array} groups list of defined theme groups
	 */
	updateGroupsMenu(groups) {
		let i, group;
		let group_menu_node = 'theme-groups';

		if (this.type === 'datalist'){
			group_menu_node = "theme-groups-list"
		}

		// Empty theme groups selection menu before adding items
		Dom.Empty(this.Node(group_menu_node));

		// Add group items if they're defined
		if (Array.isArray(groups) && groups.length) {
			for (i = 0; i < groups.length; i += 1) {
				group = groups[i];	
				this.addGroupItem(group, group_menu_node)
			}

			// Dispatch a change event to trigger a group selection change
			this.Node("theme-groups").dispatchEvent(new Event('change', { 'bubbles': true }));
		}
	}

	/**
	 * Update the theme menu options
	 * @param {array} themes list of defined themes
	 */
	updateThemesMenu(themes) {
		let i, theme;
		let themes_menu_node = 'themes';

		if (this.type === 'datalist'){
			themes_menu_node = "themes-list"
		}

		// Empty theme selection menu before adding items
		Dom.Empty(this.Node(themes_menu_node));

		// Add updated themes to selection menu
		if (Array.isArray(themes) && themes.length) {
			for (i = 0; i < themes.length; i += 1) {
				theme = themes[i];
				this.addThemeItem(theme, themes_menu_node);
			}

			// Dispatch a change event to trigger a theme selection change
			this.Node('themes').dispatchEvent(new Event('change', { 'bubbles': true }));
		}
	}

	/**
	 * Gets a list of theme groups defined in the theme config object
	 * @param {object} themesConfig copy of the theme object
	 */
	GetThemeGroups(themesConfig) {
		let groups = [];

		if (Array.isArray(themesConfig) && themesConfig.length) {
			for (let i = 0; i < themesConfig.length; i += 1) {
				let configItem = themesConfig[i];

				if (configItem.group) {
					groups.push(String(configItem.group[Core.locale]));		
				}
			}
		}

		return groups;
	}

	/**
	 * Add a menu theme group item to select menu
	 * @param {object} item Details on the option item
	 * @param {string} node Name of the node to add the option to.
	 * @returns Dom element representing select menu option.
	 */
	addGroupItem(item, node) {
		let opt = Dom.Create("option", {value: item, innerHTML: item}, this.Node(node));
		opt.setAttribute('handle', 'theme-option');
	}

	/**
	 * Add a menu item to select menu
	 * @param {object} item Details on the item being added as an option
	 * @param {string} node A string representing the node which will have the option added to.
	 * @returns Dom element representing select menu option.
	 */
	addThemeItem(item, node) {
		if (item && item.id && item.label) {
			let opt;

			if (this.type === 'datalist') {
				opt = Dom.Create("option", {value: item.label[Core.locale], innerHTML: item.label[Core.locale]}, this.Node(node));
				opt.dataset.themeid = item.id;
			} else {
				opt = Dom.Create("option", {value: item.id, innerHTML: item.label[Core.locale]}, this.Node(node));
			}

			opt.setAttribute('handle', 'theme-option');
		}
	}

	/**
	 * Get the theme object from a colleciton of themes based on theme id
	 * @param {array} themes list of defined themes
	 * @param {string} groupId id of the group
	 * @returns {object} the selected theme
	 */
	getThemesByGroup(themes, groupId) {
		let groupThemes;

		for (var i = 0; i < themes.length; i += 1) {
			let theme = themes[i];
			if (theme) {
				if (theme.group && theme.items && Array.isArray(theme.items)) {
					if (theme.group[Core.locale] === groupId){ 
						groupThemes = theme.items;
						break;
					}
				}
			}
		}
		return groupThemes;
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
	 * Handler for theme-groups selector change event
	 * @param {object} ev menu selection change event
	 */
	onThemeGroupsSelectorChange_Handler(ev) {
		let themes;
		let selectionId = this.Node("theme-groups").value;

		// Get theme by the selection Id
		themes = this.getThemesByGroup(this.themes, selectionId);

		this.updateThemesMenu(themes);

		// Clear previous themes value when switching theme group
		if (this.type === 'datalist') {
			this.Node("themes").value = "";			
		}
	}

	/**
	 * Handler for theme selector change event
	 * @param {object} ev menu selection change event
	 */
	onThemeSelectorChange_Handler(ev) {
		let datalist, selection, selectionId, inputValue;

		if (this.type === 'datalist') {
			// Get Datalist Input value
			inputValue = this.Node('themes').value;
			// Get DataList Node
			datalist = this.Node('themes-list');

			for (let i = 0; i < datalist.options.length; i += 1) {
				let dataListItem = datalist.options[i];
				// Check if datalist item value matches input value
				if (dataListItem.value === inputValue) {
					// Get themeid from list item dataset
					if (dataListItem.dataset && dataListItem.dataset.themeid) {
						selectionId = dataListItem.dataset.themeid;
						break;
					}
				}
			}
		} else {
			selectionId = this.Node("themes").value;
		}

		// Get theme by the selection Id
		selection = this.getThemeById(this.themes, selectionId);

		this.Emit("ThemeSelectorChange", { theme: selection });
	}
	
	/**
	 * Provides the HTML template for a theme selector control
	 * @returns {string} controller template
	 */
	Template() {        
		let template;

		if (this.type = 'datalist') {
			template = "<div handle='root' class='theme-selector mapboxgl-ctrl'>" +
					"<div class='groups-menu-container' handle='groups-menu-container'>" +
						"<label class='control-label' for='groups'>Theme Groups</label>" +
						"<input aria-label='Theme groups' handle='theme-groups' list='groups-list' name='groups'>" +
						"<datalist handle='theme-groups-list' id='groups-list' class='theme-groups'></datalist>" +
					"</div>"+
					"<div class='themes-menu-container' handle='themes-menu-container'>" +
						"<label class='control-label' for='themes'>Map Theme</label>" +
						"<input aria-label='Themes' handle='themes' list='themes-list' name='themes'>" +
						"<datalist handle='themes-list' id='themes-list' class='themes'></datalist>" +
					"</div>"+
			   "</div>";
		} else {
			template = "<div handle='root' class='theme-selector mapboxgl-ctrl'>" +
					"<div class='groups-menu-container' handle='groups-menu-container'>" +
						"<label class='control-label'>Theme Groups</label>" +
						"<select aria-label='Theme groups' handle='theme-groups' name='theme-groups' class='theme-groups'></select>" +
					"</div>"+
					"<div class='themes-menu-container' handle='themes-menu-container'>"+
						"<label class='control-label'>Map Theme</label>" +
						"<select aria-label='Themes' handle='themes' name='themes' class='themes'></select>" +
					"</div>"+
			   "</div>";
	}

		return template;
	}
}
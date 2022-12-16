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

		// If a custom label is provided, update groups label
		if (options.groups_label && typeof(options.groups_label) === 'string') {
			this.Node('theme-groups-label').innerHTML = options.groups_label;
			Dom.SetAttribute(this.Node('theme-groups'), 'aria-label', options.groups_label);
		}

		// If a custom label is provided, update themes label
		if (options.themes_label && typeof(options.themes_label) === 'string') {
			this.Node('themes-label').innerHTML = options.themes_label;
			Dom.SetAttribute(this.Node('themes'), 'aria-label', options.themes_label);
		}

		this.themes = options.themes;
		
		this.currentTheme = "";
		this.currentThemeGroup = "";

		this.updateThemeControl(this.themes);

		// Add event listeners for change events on both select menus
		this.Node('theme-groups').addEventListener("change", this.onThemeGroupSelectorChange_Handler.bind(this));
		this.Node('themes').addEventListener("change", this.onThemeSelectorChange_Handler.bind(this));
	}

	/**
	 * Update theme selection menu
	 * @param {object} themes 
	 */
	updateThemeControl(themes) {
		let themeGroups;

		// Set theme control input values before updating
		this.Node('theme-groups').value = this.currentThemeGroup;
		this.Node('themes').value = this.currentTheme;

		// Update themes
		this.themes = themes; 

		// Get theme groups defined in config
		themeGroups = this.getThemeGroups(this.themes);

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

		// Empty theme groups selection menu before adding items
		Dom.Empty(this.Node(group_menu_node));

		// Add group items if they're defined
		if (Array.isArray(groups) && groups.length) {
			// Add items to group menu
			for (i = 0; i < groups.length; i += 1) {
				group = groups[i];
				this.addGroupItem(group, group_menu_node);
			}
		}

		// Re-set current theme group selection to previous selection if
		// current selection after group menu options is updated
		if (this.currentThemeGroup && this.Node('theme-groups').value != this.currentThemeGroup) {
			this.Node('theme-groups').value = this.currentThemeGroup;
		}

		// Update group selection to first item if current theme selection
		// is not in group.
		if (!this.isValidGroup(groups, this.currentThemeGroup)) {
			// Set initial value to first group datalist option
			let firstGroupItem = groups[0];
			this.Node('theme-groups').value = firstGroupItem[Core.locale];

			// Updated current theme group selection
			this.currentThemeGroup = this.Node('theme-groups').value;
		}

		// Dispatch a change event to trigger a group selection change
		this.Node("theme-groups").dispatchEvent(new Event('change', { 'bubbles': true }));
	}

	/**
	 * Update the theme menu options
	 * @param {array} themes list of defined themes
	 */
	updateThemesMenu(themes) {
		let i, theme;
		let themes_menu_node = 'themes';

		if (!this.isValidTheme(themes, this.currentTheme)) {
			// Empty theme selection menu before adding items
			Dom.Empty(this.Node(themes_menu_node));

			// Add updated themes to selection menu
			if (Array.isArray(themes) && themes.length) {
				for (i = 0; i < themes.length; i += 1) {
					theme = themes[i];
					this.addThemeItem(theme, themes_menu_node);
				}

				// Initial selection of first available theme
				this.Node('themes').value = themes[0].id;

				// Update current theme selection
				this.currentTheme = this.Node('themes').value;
			}
		}
		// Dispatch a change event to trigger a theme selection change
		this.Node('themes').dispatchEvent(new Event('change', { 'bubbles': true }));
	}

	/**
	 * Gets a list of theme groups defined in the theme config object
	 * @param {object} themesConfig copy of the theme object
	 */
	getThemeGroups(themesConfig) {
		let groups = [];

		if (Array.isArray(themesConfig) && themesConfig.length) {
			for (let i = 0; i < themesConfig.length; i += 1) {
				let configItem = themesConfig[i];

				if (configItem.group) {
					groups.push(configItem.group);
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
		if (item) {
			let opt = Dom.Create("option", {
				value: item[Core.locale], 
				innerHTML: item[Core.locale]
			}, this.Node(node));
			opt.setAttribute('handle', 'theme-option');
		}
	}

	/**
	 * Add a menu item to select menu
	 * @param {object} item Details on the item being added as an option
	 * @param {string} node A string representing the node which will have the option added to.
	 * @returns Dom element representing select menu option.
	 */
	addThemeItem(item, node) {
		if (item && item.id && item.label) {
			let opt = Dom.Create("option", {
				value: item.id,
				innerHTML: item.label[Core.locale]
			}, this.Node(node));

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
	 * Checks if the currently selected theme is within the list of theme items
	 * @param {array} themes list of themes
	 * @param {string} currentTheme the name of the currently selected theme
	 * @returns {boolean} 
	 */
	isValidTheme(themes, currentTheme) {
		let theme, i;
		let validTheme = false;

		if (themes && Array.isArray(themes)) {
			for (i = 0; i < themes.length; i += 1) {
				theme = themes[i];
				if (theme && theme.label 
					&& (theme.label[Core.locale] === currentTheme
					|| theme.id === currentTheme)) {
					validTheme = true;
					break;
				}
			}
		}

		return validTheme;
	}

	/**
	 * Checks if the currently selected theme group is within the list of group items
	 * @param {array} groups list of groups of themes
	 * @param {string} currentThemeGroup the name of the currently selected group
	 * @returns {boolean} 
	 */
	isValidGroup(groups, currentThemeGroup) {
		let group, i;
		let validThemeGroup = false;

		if (groups && Array.isArray(groups)) {
			for (i = 0; i < groups.length; i += 1) {
				group = groups[i];
				if (group && group[Core.locale] === currentThemeGroup) {
					validThemeGroup = true;
					break;
				}
			}
		}

		return validThemeGroup;
	}

	/**
	 * Handler for theme-groups selector change event
	 * @param {Event} ev
	 */
	onThemeGroupSelectorChange_Handler(ev) {
		this.currentThemeGroup = this.Node('theme-groups').value;

		// Get theme by the selection Id
		let themes = this.getThemesByGroup(this.themes, this.currentThemeGroup);

		this.updateThemesMenu(themes);
	}

	/**
	 * Handler for theme selector change event
	 * @param {Event} ev
	 */
	onThemeSelectorChange_Handler(ev) {
		this.currentTheme = this.Node('themes').value;

		// Get theme by the selection Id
		let selection = this.getThemeById(this.themes, this.currentTheme);

		this.Emit("ThemeSelectorChange", { theme: selection });
	}
	
	/**
	 * Provides the HTML template for a theme selector control
	 * @returns {string} controller template
	 */
	Template() {
		let template = "<div handle='root' class='theme-selector mapboxgl-ctrl'>" +
				"<div class='groups-menu-container' handle='groups-menu-container'>" +
					"<label handle='theme-groups-label' class='control-label'>Theme Groups</label>" +
					"<select aria-label='Theme groups' handle='theme-groups' name='theme-groups' class='theme-groups'></select>" +
				"</div>"+
				"<div class='themes-menu-container' handle='themes-menu-container'>"+
					"<label handle='themes-label' class='control-label'>Themes</label>" +
					"<select aria-label='Themes' handle='themes' name='themes' class='themes'></select>" +
				"</div>"+
			"</div>";

		return template;
	}
}

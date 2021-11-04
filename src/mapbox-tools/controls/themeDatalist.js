import Theme from '../../mapbox-tools/controls/theme.js';
import Core from '../../basic-tools/tools/core.js';
import Dom from '../../basic-tools/tools/dom.js';

/**
 * Theme Datalist control class
 * @class
 * 
 */
export default class ThemeDatalist extends Theme { 

	constructor(options) {	
		super(options);
		
		this.themes = options.themes;

		this.currentTheme = "";
		this.currentThemeGroup = "";

		this.updateThemeControl(this.themes);

		// Add event listeners for change events on both select menus
		this.Node('theme-groups').addEventListener("change", this.onThemeGroupSelectorChange_Handler.bind(this));
		this.Node('theme-groups').addEventListener("focus", this.onThemeGroupSelectorFocused_Handler.bind(this));
		this.Node('theme-groups').addEventListener("blur", this.onThemeGroupSelectorBlured_Handler.bind(this));
		this.Node('themes').addEventListener("change", this.onThemeSelectorChange_Handler.bind(this));
		this.Node('themes').addEventListener("focus", this.onThemeSelectorFocused_Handler.bind(this));
		this.Node('themes').addEventListener("blur", this.onThemeSelectorBlured_Handler.bind(this));
	}

	/**
	 * Update the group menu options
	 * @param {array} groups list of defined theme groups
	 */
	updateGroupsMenu(groups) {
		let i, group;
		let group_menu_node = 'theme-groups-list';

		// Empty theme groups selection menu before adding items
		Dom.Empty(this.Node(group_menu_node));

		// Add group items if they're defined
		if (Array.isArray(groups) && groups.length) {
			for (i = 0; i < groups.length; i += 1) {
				group = groups[i];	
				this.addGroupItem(group, group_menu_node)
			}

			// Set initial value to first group datalist option
			let firstGroupItem = groups[0];
			this.Node('theme-groups').value = firstGroupItem[Core.locale];

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
		let themes_menu_node = 'themes-list';

		// Empty theme selection menu before adding items
		Dom.Empty(this.Node(themes_menu_node));

		// Add updated themes to selection menu
		if (Array.isArray(themes) && themes.length) {
			for (i = 0; i < themes.length; i += 1) {
				theme = themes[i];
				this.addThemeItem(theme, themes_menu_node);
			}

			// Initial selection of first available theme 
			this.Node('themes').value = themes[0].label[Core.locale];

			// Dispatch a change event to trigger a theme selection change
			this.Node('themes').dispatchEvent(new Event('change', { 'bubbles': true }));
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
				value: item.label[Core.locale], 
				innerHTML: item.label[Core.locale]
			}, this.Node(node));
			opt.dataset.themeid = item.id;

			opt.setAttribute('handle', 'theme-option');
		}
	}

	/**
	 * Handler for theme-groups selector change event
	 * @param {object} ev menu selection change event
	 */
	onThemeGroupSelectorChange_Handler(ev) {
		let themes;
		this.currentThemeGroup = this.Node('theme-groups').value;

		// Blur theme group input if input string matches one of the dataset options
		let themeGroupList = this.Node('theme-groups-list').options;
		for (let i = 0; i < themeGroupList.length; i += 1) {
			if (themeGroupList[i].value === this.currentThemeGroup) {
				this.Node('theme-groups').blur();
			}
		};

		// Get themes by the theme group selection Id
		themes = this.getThemesByGroup(this.themes, this.currentThemeGroup);

		// Update Themes selector
		this.updateThemesMenu(themes);
	}
	
	/**
	 * Handler for theme group selector select event when type is datalist
	 * @param {object} ev menu selection change event
	 */
	onThemeGroupSelectorFocused_Handler(ev) {
		this.currentThemeGroup = this.Node('theme-groups').value;
		this.Node('theme-groups').value = "";
	}
	
	/**
	 * Handler for theme group selector blur event when type is datalist
	 * @param {object} ev menu selection change event
	 */
	onThemeGroupSelectorBlured_Handler(ev) {
		this.Node('theme-groups').value = this.currentThemeGroup;
	}

	/**
	 * Handler for theme selector change event
	 * @param {object} ev menu selection change event
	 */
	onThemeSelectorChange_Handler(ev) {
		let datalist, selectionId;
		this.currentTheme = this.Node('themes').value;

		// Get DataList Node
		datalist = this.Node('themes-list');

		for (let i = 0; i < datalist.options.length; i += 1) {
			let dataListItem = datalist.options[i];
			// Check if datalist item value matches input value
			if (dataListItem.value === this.currentTheme) {
				// Get themeid from list item dataset
				if (dataListItem.dataset && dataListItem.dataset.themeid) {
					selectionId = dataListItem.dataset.themeid;
					break;
				}
			}
		}

		// Blur theme input if input string matches one of the dataset options
		let themeList = this.Node('themes-list').options;
		for (let i = 0; i < themeList.length; i += 1) {
			if (themeList[i].value === this.currentTheme) {
				this.Node('themes').blur();
			}
		};

		// Get theme by the selection Id
		let selection = this.getThemeById(this.themes, selectionId);

		this.Emit("ThemeSelectorChange", { theme: selection });
	}
	
	/**
	 * Handler for theme selector select event when type is datalist
	 * @param {object} ev menu selection change event
	 */
	onThemeSelectorFocused_Handler(ev) {
		this.currentTheme = this.Node('themes').value;
		this.Node('themes').value = "";
	}
	
	/**
	 * Handler for theme selector blur event when type is datalist
	 * @param {object} ev menu selection change event
	 */
	onThemeSelectorBlured_Handler(ev) {
		this.Node('themes').value = this.currentTheme;
	}

	/**
	 * Provides the HTML template for a theme selector control
	 * @returns {string} controller template
	 */
	Template() {
		let template = "<div handle='root' class='theme-selector mapboxgl-ctrl'>" +
				"<div class='groups-menu-container' handle='groups-menu-container'>" +
					"<label handle='theme-groups-label' class='control-label' for='groups'>Theme Groups</label>" +
					"<input aria-label='Theme groups' handle='theme-groups' list='groups-list' name='groups'>" +
					"<datalist handle='theme-groups-list' id='groups-list' class='theme-groups'></datalist>" +
				"</div>"+
				"<div class='themes-menu-container' handle='themes-menu-container'>" +
					"<label handle='themes-label' class='control-label' for='themes'>Themes</label>" +
					"<input aria-label='Themes' handle='themes' list='themes-list' name='themes'>" +
					"<datalist handle='themes-list' id='themes-list' class='themes'></datalist>" +
				"</div>"+
		   "</div>";
	
		return template;
	}
}
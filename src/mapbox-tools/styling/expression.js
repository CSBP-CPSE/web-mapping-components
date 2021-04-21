/**
 * expression.js
 * 
 * A collection of functions for generating mapbox expressions used for styling.
 */


/**
 * Generate mapbox expression for fill colours defined in the map config file.
 * @param {object} legend - object containing the legend details stored in
 * the map config file.
 * @retruns A style expression using legend style data.
 * 
 * Example: 
 * ["case", 
 * ["==", ["get","type"],"Hospital"], 
 * "rgba(255,25,167,1)", 
 * ["==", ["get","type"],"School"], 
 * "rgba(50,128,229,1)",
 * "rgba(255,214,10,1)"] 
 */
export function generateColourExpression(legend) {
	var styleColor, i, styleItem, defaultColour, legendStyles;
	var expression = ['case'];

	// Get styling from legend config
	if (legend && legend.config) {
		legendStyles = legend.GetListOfStyles(legend.config);
	}
	
	// Check that legend items length equals opacity length
	if (Array.isArray(legendStyles) && legendStyles.length > 0) {
		for (i = 0; i < legendStyles.length; i += 1) {
			styleItem = legendStyles[i];

			// Define style color
			if (styleItem && styleItem.color) {
				if (styleItem.color.length === 3) {
					styleColor = 'rgb(' + styleItem.color.join(',') + ')';

				} else if (styleItem.color.length === 4) {
					styleColor = 'rgba(' + styleItem.color.join(',') + ')';
				}
			}

			// Add style case and color
			if (styleItem.value && styleColor) {
				// Add mapbox expression value is defined, add it to cases list
				expression.push(styleItem.value);						

				// Add colour to cases list
				expression.push(styleColor);
			} else {
				defaultColour = styleColor;
			}
		}

		// Add default colour as last item in colour cases
		// This is required by mapbox to in sure errors 
		// don't occur when the last item in the legend config
		// is not the default colour (i.e. the one without a 
		// a defined mapbox expression value)
		expression.push(defaultColour);
	}

	return expression;
}

/**
 * Generate style expression for opacity based on legend status
 * @param {object} legend object containing the legend details stored in
 * the map config file.
 * @param {number} opacity an opacity value between 0 and 1
 * @retruns An style expression using opacity values.
 * 
 * Example: 
 * ["case", 
 * ["==", ["get","type"],"Hospital"], 
 * 0, 
 * ["==", ["get","type"],"School"], 
 * 1,
 * 1] 
 */
export function generateOpacityExpression(legend, opacity) {
	var styleOpacity, i, styleItem, defaultOpacity, legendStyles, chkBox;
	var legendOpacities = [];
	var expression = ['case'];

	// Get styling from legend config
	if (legend && legend.config) {
		legendStyles = legend.GetListOfStyles(legend.config);
	}

	// Generate a list of opacity values for each legend item based on;
	// the checkbox state, and if the legend item has the property binary_opacity
	// set in the map config file.
	if (legend && legend.chkBoxesState) {
		for (i = 0; i < legend.chkBoxesState.length; i += 1) {
			chkBox = legend.chkBoxesState[i];

			if (chkBox && chkBox.checkbox && !chkBox.checkbox.checked) {
				legendOpacities.push(0);
			} else if (chkBox && chkBox.item && chkBox.item.binary_opacity) {
				legendOpacities.push(1);
			} else {
				legendOpacities.push(opacity);
			}
		}
	}
	
	if (Array.isArray(legendStyles) && legendStyles.length > 0 && legendStyles.length === legendOpacities.length) {
		for (i = 0; i < legendStyles.length; i += 1) {
			styleItem = legendStyles[i];
			styleOpacity = legendOpacities[i];

			// Add style case and color
			if (styleItem.value && styleOpacity >= 0 && styleOpacity <= 1) {
				// Add mapbox expression value is defined, add it to cases list
				expression.push(styleItem.value);						

				// Add opacity to cases list
				expression.push(styleOpacity);
			} else {
				defaultOpacity = styleOpacity;
			}
		}

		// Add default colour as last item in expression 
		// This is required by mapbox to in sure errors 
		// don't occur when the last item in the legend config
		// is not the default colour (i.e. the one without a 
		// a defined mapbox expression value)
		expression.push(defaultOpacity);
	}
	return expression;
}

/**
 * Convert opacity expression into an expression for symbol opacities
 * @param {array} opacityExpression expression containing cases for styling opacities.
 */
export function generateSymbolOpacityExpression(opacityExpression) {
	let expression = [];

	for (var i = 0; i < opacityExpression.length; i += 1) {
		if (typeof opacityExpression[i] === 'number') {
			if (opacityExpression[i] > 0) {
				expression.push(1);
			} else {
				expression.push(0);
			}
		} else {
			expression.push(opacityExpression[i]);
		}
	}

	return expression;
}
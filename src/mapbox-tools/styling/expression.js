/**
 * expression.js
 *
 * A collection of functions for generating mapbox expressions used for styling.
 * For additional information on mapbox expressions, see the mapbox documentation
 * at, https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/
 */
import Legend from '../controls/legend.js';

/**
 * Converts a list of rgb numbers into an rgb or rgba string
 * @param {array} colourList
 * @returns {string} rgb or rgba string
 * Examples:
 *   [50,150,250] -> "rgb(50,150,250)"
 *   [50,150,250,0.5] -> "rgba(50,150,250,0.5)"
 */
function colourListToRGBString(colourList) {
	let rgbString;

	if (Array.isArray(colourList) && colourList.length >= 3) {
		if (colourList.length === 3) {
			rgbString = 'rgb(' + colourList.join(',') + ')';

		} else if (colourList.length === 4) {
			rgbString = 'rgba(' + colourList.join(',') + ')';
		}
	}

	return rgbString;
}

/**
 *
 * Generate a list of opacity values for each legend item based on;
 * the checkbox state, and if the legend item has the property opacity
 * set to a predefined opacity value in the map config file.
 * @param {object} legend current legend object
 * @param {number} storedOpacity the stored opacity value
 */
function generateLegendOpacityValues(legend, storedOpacity) {
	let legendOpacities = [];
	let i, chkBox;

	if (legend && legend.chkBoxesState) {
		for (i = 0; i < legend.chkBoxesState.length; i += 1) {
			chkBox = legend.chkBoxesState[i];

			if (chkBox && chkBox.checkbox && !chkBox.checkbox.checked) {
				legendOpacities.push(0);
			} else if (chkBox && chkBox.item && chkBox.item.opacity && typeof(chkBox.item.opacity) === 'number') {
				// Ensure that opacity value is between 1 and 0.
				if (chkBox.item.opacity > 1) {
					chkBox.item.opacity = 1;
				} else if (chkBox.item.opacity < 0) {
					chkBox.item.opacity = 0;
				}

				legendOpacities.push(chkBox.item.opacity);
			} else {
				legendOpacities.push(storedOpacity);
			}
		}
	}

	return legendOpacities;
}

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
	var styleColor, i, styleItem, defaultColour, legendStyles, expression;

	// Get styling from legend config
	if (legend && legend.config) {
		legendStyles = Legend.GetListOfStyles(legend.config);
	}
	
	// Check that legend items length equals opacity length
	if (Array.isArray(legendStyles) && legendStyles.length > 1) {
		expression = ['case'];
		for (i = 0; i < legendStyles.length; i += 1) {
			styleItem = legendStyles[i];

			if (styleItem) {
				// Define style color
				if (styleItem.color) {
					styleColor = colourListToRGBString(styleItem.color);
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
		}

		// Add default colour as last item in colour cases
		// This is required by mapbox to in sure errors
		// don't occur when the last item in the legend config
		// is not the default colour (i.e. the one without a
		// a defined mapbox expression value)
		expression.push(defaultColour);

	} else if (Array.isArray(legendStyles) && legendStyles.length == 1) {
		// If legend only includes 1 item, set style expression to the value of
		// a rgb/rgba color string
		if (legendStyles[0].color) {
			expression = colourListToRGBString(legendStyles[0].color);
		}
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
	var styleOpacity, i, styleItem, defaultOpacity, legendStyles, expression, legendOpacities ;

	// Get styling from legend config
	if (legend && legend.config) {
		legendStyles = Legend.GetListOfStyles(legend.config);
	}

	// Generate legend opacity values based on legend checkbox state
	legendOpacities = generateLegendOpacityValues(legend, opacity);
	
	// Create style expression for opacity values
	if (Array.isArray(legendStyles) && legendStyles.length > 1 && legendOpacities.length > 1) {
		expression = ['case'];
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
				if (styleOpacity >= 0 && styleOpacity <= 1) {
					defaultOpacity = styleOpacity;
				} else {
					defaultOpacity = opacity;
				}
			}
		}

		// Add default colour as last item in expression
		// This is required by mapbox to in sure errors
		// don't occur when the last item in the legend config
		// is not the default colour (i.e. the one without a
		// a defined mapbox expression value)
		expression.push(defaultOpacity);

	} else if (Array.isArray(legendStyles) && legendStyles.length == 1 && legendOpacities.length == 1) {
		// If legend only includes 1 item, set style expression to the only legend opacity value
		expression = legendOpacities[0];
	}
	
	return expression;
}

/**
 * Convert opacity expression into an expression for symbol opacities
 * @param {array} opacityExpression expression containing cases for styling opacities.
 */
export function generateSymbolOpacityExpression(opacityExpression) {
	let expression;

	if (opacityExpression && opacityExpression.length > 1) {
		expression = [];
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

	} else if (typeof opacityExpression === 'number') {

		// When a single opacity value represents the expression, the symbol opacity
		// can either be 0 or 1
		if (opacityExpression > 0) {
			expression = 1;
		} else {
			expression = 0;
		}
	}

	return expression;
}

/**
 * Layer class - Defines logic for interacting with map layers
 * @class
 */
export default class Layer {
	/**
	 * Retrieves the layer type 
	 * @param {object} map - reference to map 
	 * @param {string} layerId - id of the map layer
	 */
	static GetLayerType(map, layerId) {
		const layer = map.getLayer(layerId);
		let layerType;

		if (layer && layer.type) {
			layerType = layer.type;
		}

		return layerType;
	}

	/**
	 * Method to update a paint property for a layer
	 * @param {object} map - Reference to map
	 * @param {string} layerId - Name of the map layer
	 * @param {string} paintProperty - Paint Property of the map layer
	 * @param {array || string} styleRules - Mapbox expression of style rules or a rgba string value.
	 */
	static SetPaintProperty(map, layerId, paintProperty, styleRules) {
		// Check that layer exists in map
		if (map.getLayer(layerId)) {
			map.setPaintProperty(layerId, paintProperty, styleRules);
		}
	}

	/**
	 * Method to update a layout property for a layer
	 * @param {object} map - Reference to map
	 * @param {string} layerId - Name of the map layer
	 * @param {string} layoutProperty - Layout Property of the map layer
	 * @param {array || string} styleRules - Mapbox expression of layout rules and values.
	 */
	static SetLayoutProperty(map, layerId, layoutProperty, styleRules) {
		// Check that layer exists in map and update it
		if (map.getLayer(layerId)) {
			map.setLayoutProperty(layerId, layoutProperty, styleRules);
		}
	}

	/**
	 * Set the filter on a map layer
	 * @param {object} map 
	 * @param {string} layerId 
	 * @param {array || string} expression - Mapbox expression o
	 */
	static SetFilter(map, layerId, expression) {
		map.setFilter(layerId, expression);
	}

	ReorderLayers(map, layers) {
		layers.forEach(l => map.moveLayer(l));
	}
	
	static GetLayer(map, layer) {
		return map.getLayer(layer) || null;
	}
	
	static ShowLayer(map, layer) {
		map.setLayoutProperty(layer, 'visibility', 'visible');
	}
	
	static HideLayer(map, layer) {
		map.setLayoutProperty(layer, 'visibility', 'none');
	}
}
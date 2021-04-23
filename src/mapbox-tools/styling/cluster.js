/**
 * Generate a list of validated clustered layers currently used on the map
 * @param {object} map Reference to a mapbox object
 */
export function getClusterLayers(map) {
	let mapStyle, mapLayers;
	let clusterLayers = [];

	if (map) {
		// get map style configuration
		mapStyle = map.getStyle();
		if (mapStyle.layers) {
			// get layers from map style
			mapLayers = mapStyle.layers;

			// iterate through map layers to confirm if layer ids are cluster ids
			// Note: cluster ids are those ending in '-cluster' or '-cluster-count'
			mapLayers.forEach(layer => {
				if (layer && layer.id) {
					let layerID = layer.id;

					if (isClusterLayer(layerID)) {
						clusterLayers.push(layerID);
					}
				}
			})
		}
	}

	return clusterLayers;
}

/**
 * Generate a list of sources used for clustering on the map
 * @param {object} map Reference to a mapbox object
 */
export function getClusterSources(map) {
	let mapStyle, mapSource, mapSources, mapSourceKeys;
	let clusterSources = [];

	if (map) {
		// get map style configuration
		mapStyle = map.getStyle();
		if (mapStyle.sources) {
			mapSources = mapStyle.sources;
			// get source keys
			mapSourceKeys = Object.keys(mapSources);

			// iterate through map sources to confirm if they're clustered 
			mapSourceKeys.forEach(key => {
				if (Object.hasOwnProperty.call(mapSources, key)) {
					mapSource = mapSources[key];

					if (mapSource.cluster) {
						clusterSources.push(key);
					}
				}
			})
		}
	}
	return clusterSources;
}


/**
 * Checks if the layer is in fact a cluster layer or not, based on its id.
 * @param {string} layerID id of the layer
 * @returns 
 */
function isClusterLayer(layerID) {
	let clusterRegex = new RegExp('.*(-cluster|-cluster-count)$', 'gm');
	let match = layerID.match(clusterRegex);

	return match;
}
import Core from '../../basic-tools/tools/core.js'
import Evented from '../../basic-tools/components/evented.js'
import Util from '../../basic-tools/tools/util.js'
import { OSM } from '../styling/osm.js'
import {generateColourExpression, generateOpacityExpression, generateSymbolOpacityExpression} from '../styling/expression.js'

/**
 * Map class
 * @class
 */
export default class Map extends Evented {
				
	/**
	 * Set the mapbox access token
	 * @param {string} value map box access token
	 */
	static set Token(value) { 
		maplibregl.accessToken = value; 
	}
	
	/**
	 * Get the access token
	 * @returns {string} mapbox access token
	 */
	static get Token() { 
		return maplibregl.accessToken; 
	}
	
	/**
	 * Get the Dom element that is the map container
	 * @return {object} the html element used to contain the map
	 */
	get Container() {
		return this.map._container;
	}
	
	/**
	 * Get the center of the map
	 * @returns {object} the center coordinates of the map
	 * e.g. {lat: 50, lng: -100}
	 */
	get Center() {
		return this.map.getCenter();
	}
	
	/**
	 * Set the center of the map
	 * @param {object} coords The coordinates for the center of the map
	 * E.g. {lat: 50, lng: -100}
	 */
	set Center(coords) {
		this.map.setCenter(coords)
	}
	
	/**
	 * Get the current map zoom level
	 * @returns {number} map zoom level (between 0-22)
	 */ 
	get Zoom() {
		return this.map.getZoom();
	}
	
	/**
	 * Set the map zoom level
	 * @param {number} value map zoom value
	 */
	set Zoom(value) {
		this.map.setZoom(value)
	}
	
	/**
	 * Get the current map style URL
	 * @returns {string} URL to the map style document
	 */
	get Style() {
		return this.style;
	}
	
	constructor(options) {
		super();
		
		this.layers = [];
		
		if (options.style === "osm") {
			options.style = OSM;
		}

		this.style = options.style

		this.click = this.OnLayerClick_Handler.bind(this);
		
		this.map = new maplibregl.Map(options); 
		
		this.map.once('styledata', this.OnceStyleData_Handler.bind(this));
		
		// this.map.on('click', this.click);
		
		this.WrapEvent('moveend', 'MoveEnd');
		this.WrapEvent('zoomend', 'ZoomEnd');
		this.WrapEvent('load', 'Load');
		this.WrapEvent('sourcedata', 'SourceData');
		
		this.map.once('load', ev => {
			let mapContainer = this.map.getContainer();
			// Fix for improve this map in french
			if (mapContainer && mapContainer.querySelector('.mapbox-improve-map')) {
				mapContainer.querySelector('.mapbox-improve-map').innerHTML = Core.Nls("Mapbox_Improve");
			}
		});
	}
	
	// ------------------------------------------------------------------------
	// Map Properties Methods
	// ------------------------------------------------------------------------
	/**
	 * Set the map bounds for the map.
	 * @param {array} bounds - An array containing coordinate pairs for the map bounds.
	 * @param {object} options - object containing options when fitting the map bounds 
	 */
	FitBounds(bounds, options) {		
		this.map.fitBounds(bounds, options);
	}

	/**
	 * Set the maximum bounds of the map
	 * @param {array} bounds - An array containing coordinate pairs for the map bounds.
	 * e.g. [[x1, y1], [x2, y2]]
	 */
	SetMaxBounds(bounds) {
		this.map.setMaxBounds(bounds);
	}

	/**
	 * Set the maximum zoom level for the map. If the value is null/undefined,
	 * the max zoom level is reset to 22. 
	 * @param {number} zoomLevel A numeric value between 0 and 22. 
	 */
	SetMaxZoom(zoomLevel) {
		this.map.setMaxZoom(zoomLevel);
	}

	/**
	 * Get the map style specification
	 * @returns {object} Style JSON representing the map's style specification
	 */
	GetStyle() {
		return this.map.getStyle();
	}

	/**
	 * Set the map style of the map.
	 * @param {string} style URL of the mapbox map style document
	 */
	SetStyle(style) {
		if (style === "osm") {
			this.style = OSM;
		} else {
			this.style = style;
		}
		
		this.map.once('styledata', this.OnceStyleData_Handler.bind(this))
		
		this.map.setStyle(style);
	}
	
	SetClickableMap(layers) {				
		this.map.on('click', this.click);
	}

	// ------------------------------------------------------------------------
	// Map Control & UI Methods
	// ------------------------------------------------------------------------
	/**
	 * Add a specified map control to the map.
	 * @param {object} control - map control object
	 * @param {string} location - location of the object. e.g. 'top-left'
	 */
	AddControl(control, location) {
		this.map.addControl(control, location);
	}
	
	InfoPopup(lngLat, html) {	
		var popup = new maplibregl.Popup({ closeOnClick: true })
			.setLngLat(lngLat)
			.setHTML(html)
			.addTo(this.map);
					
		popup._closeButton.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>';
		popup._closeButton.setAttribute('aria-label', Core.Nls('Mapbox_Close_Popup'));
		popup._closeButton.title = Core.Nls('Mapbox_Close_Popup');
	}
	
	SetClickableLayers(layers) {
		layers.forEach(l => this.map.off('click', l, this.click)); 
		
		this.layers = layers;
		
		this.layers.forEach(l => this.map.on('click', l, this.click));
	}
	
	QueryRenderedFeatures(point, layers) {
		return this.map.queryRenderedFeatures(point, { layers: layers });
	}
	
	// ------------------------------------------------------------------------
	// Map Data Source Methods
	// ------------------------------------------------------------------------
	/**
	 * Add a data source to the map
	 * @param {string} name - name of a data source
	 * @param {object} data - object containing the details of the data source
	 * - Data Source Example:
	 * 	{
	 * 		type: "geojson",
	 * 		data: "https://example.org/mydata.json",
	 * 		cluster: true,
	 * 		clusterMaxZoom: 14,
	 * 		clusterRadius: 50
	 * 	}
	 */
	AddSource(name, data) {
		this.map.addSource(name, data);
	}

	// ------------------------------------------------------------------------
	// Map Layer Methods - Collection of methods for working with map layers
	// ------------------------------------------------------------------------
	/**
	 * Add layer to the map
	 * @param {object} layer - object containing the details of the layer
	 *  Layer Example:
	 * 	{
	 * 		id: 'mylayer',
	 * 		source: 'mydatasource',
	 *		type: 'circle',
	 *		paint: {
	 *			circle-color: "#000000",
	 *			circle-radius: 8
	 *		}
	 * 	}
	 */
	AddLayer(layer) {
		if (layer.id && layer.type && !this.GetLayer(layer.id)) {
			this.map.addLayer(layer);
		}
	}
	
	/**
	 * Get a specified layer
	 * @param {string} layerId map layer id. 
	 */
	GetLayer(layerId) {
		return this.map.getLayer(layerId) || null;
	}

	/**
	 * Retrieves the layer type 
	 * @param {string} layerId - id of the map layer
	 */
	GetLayerType(layerId) {
		const layer = this.GetLayer(layerId);
		let layerType;

		if (layer && layer.type) {
			layerType = layer.type;
		}

		return layerType;
	}

	/**
	 * Filter layer content by filter expression
	 * @param {string} layerId - Name of the map layer
	 * @param {array | null | undefined} filter - Expression containing rules to
	 * include/exclude filter. If null/undefined, existing filters is removed.
	 * @param {object} options - Object containing filter options
	 */
	SetFilter(layerId, filter, options) {
		if (!options) {
			options = {};
		}

		if (this.GetLayer(layerId)) {
			this.map.setFilter(layerId, filter, options);
		}
	}

	/**
	 * Method to update a paint property for a layer
	 * @param {string} layerId - Name of the map layer
	 * @param {string} paintProperty - Paint Property of the map layer
	 * @param {array || string} styleRules - Mapbox expression of style rules or a rgba string value.
	 */
	SetPaintProperty(layerId, paintProperty, styleRules) {
		// Check that layer exists in map
		if (this.GetLayer(layerId)) {
			this.map.setPaintProperty(layerId, paintProperty, styleRules);
		}
	}

	/**
	 * Get layout property for a layer
	 * @param {string} layerId - Name of the map layer
	 * @param {string} layoutProperty - Layout property name
	 * @returns The layout property value
	 */
	GetLayoutProperty(layerId, layoutProperty) {
		// Check that layer exists in map and update it
		if (this.GetLayer(layerId)) {
			return this.map.getLayoutProperty(layerId, layoutProperty);
		}
	}

	/**
	 * Set a layout property for a layer
	 * @param {string} layerId - Name of the map layer
	 * @param {string} layoutProperty - Layout property name
	 * @param {array || string} styleRules - Mapbox expression of style rules or a rgba string value.
	 */
	SetLayoutProperty(layerId, layoutProperty, styleRules) {
		// Check that layer exists in map and update it
		if (this.GetLayer(layerId)) {
			this.map.setLayoutProperty(layerId, layoutProperty, styleRules);
		}
	}

	ReorderLayers(layers) {
		layers.forEach(l => this.map.moveLayer(l));
	}
	
	/**
	 * Show a specified layer
	 * @param {string} layerId map layer id. 
	 */
	ShowLayer(layerId) {
		this.SetLayoutProperty(layerId, 'visibility', 'visible');
	}
	
	/**
	 * Hides a specified layer
	 * @param {string} layerId map layer id. 
	 */
	HideLayer(layerId) {
		this.SetLayoutProperty(layerId, 'visibility', 'none');
	}

	/**
	 * Toggle the visibility of a map layer
	 * @param {string} layerID map layer to be hidden/shown
	 */
	ToggleMapLayerVisibility(layerID) {
		if (this.map.getLayoutProperty(layerID, 'visibility') === 'visible'){
			this.HideLayer(layerID);
		} else {
			this.ShowLayer(layerID);
		}
	}

	/**
	 * Update Map Layers based on current legend state. Layer styling is
	 * updated by the current state of the legend which updates layer
	 * paint properties for colour and opacity.
	 * @param {array} layerIDs - a list of layer id
	 * @param {object} legend - reference to the current legend object
	 * @param {number} storedOpacity - Locally stored opacity value between 0 - 1.
	 */
	UpdateMapLayersWithLegendState(layerIDs, legend, storedOpacity) {
		let opacity;

		// Define opacity based on provided storedOpacity value; 
		if (storedOpacity >= 0 && storedOpacity <= 1) {
			opacity = storedOpacity;
		} else {
			opacity = 1;
		}

		// Generate colour mapbox expression
		let colourExpression = generateColourExpression(legend);

		// Loop through layers and update colour classes
		if (colourExpression) {
			for (let i = 0; i < layerIDs.length; i += 1) {
				// Get Layer Colour Property
				let currentLayerID = layerIDs[i];
				let layerType = this.GetLayerType(currentLayerID);
				if (layerType && layerType !== 'symbol') {
					let layerProperty = layerType + '-color';

					// Update layer colour properties
					if (layerProperty) {
						this.SetPaintProperty(currentLayerID, layerProperty, colourExpression);
					}
				}
			}
		}

		// Generate opacity expressions
		// All legend layers are based on the legend input checkbox state. If the
		// item has a pre-defined opacity value defined with the opacity property,
		// the opacity is set to that value. Otherwise the opacity is based on the
		// locally stored opacity value. When the legend item is unchecked it's 0,
		var opacityExpression = generateOpacityExpression(legend, opacity);
		var symbolOpacityExpression = generateSymbolOpacityExpression(opacityExpression);

		if ((opacityExpression || opacityExpression === 0) && (symbolOpacityExpression || symbolOpacityExpression === 0)) {
			for (var i = 0; i < layerIDs.length; i += 1) {
				// Get Layer Colour Property
				let currentLayerID = layerIDs[i];
				let layerType = this.GetLayerType(currentLayerID);
				let layerFillProperty = layerType + '-opacity';

				if (layerType) {
					if (layerType !== 'symbol') {
						// Update layer opacity properties
						if (layerFillProperty) {
							this.SetPaintProperty(currentLayerID, layerFillProperty, opacityExpression);

							// If layer type is a circle, update circle stroke opacity to match circle-opacity
							if (layerType === 'circle') {
								this.SetPaintProperty(currentLayerID, 'circle-stroke-opacity', opacityExpression);
							}
						}

					} else {
						// Set opacity of feature labels based on opacity values. 
						// if opacity = 0 for a layer, then the labels are also set to 0.
						this.SetPaintProperty(currentLayerID, 'text-opacity', symbolOpacityExpression);
					}
				}
			}
		}
	}

	// ------------------------------------------------------------------------
	// Map Cluster Methods
	// ------------------------------------------------------------------------
	/**
	 * Add layers for clustering the data.
	 * @param {object} definedOpts - an object containing all of the cluster options
	 * {
	 * 		source: data-source-id, 
	 * 		id: cluster-layer-id,
	 * 		filter: mapbox-expression,
	 * 		circle_paint: object containing the paint properties for the cluster circle,
	 * 		circle_layout: object containing the layout properties for the cluster circle,
	 * 		label_paint: object containing the paint properties for the cluster label,
	 * 		label_layout: object containing the layout properties for the cluster label
	 * }
	 */
	AddClusters(definedOpts) {
		let defaultOpts = {
			filter: ['has', 'point_count'],
			circle_paint: {
				'circle-color': '#728399',
				'circle-radius': ['interpolate', ['exponential', 1], ['get', 'point_count'],1, 12, 1000, 32],
				'circle-stroke-width': 3,
				'circle-stroke-color': 'rgba(114,131,153,0.5)'
			},
			label_paint: {
				'text-color': '#fff',
				'text-halo-color': '#fff',
				'text-halo-width': 0.4
			},
			label_layout: {
				'text-allow-overlap': true,
				'text-field': '{point_count_abbreviated}',
				'text-font': ['Open Sans Regular'],
				'text-size': 12
			}
		};
		
		let options = Util.Mixin(defaultOpts, definedOpts);
		let clusterLayerId = (options.id || options.source) + '_clusters';
		let clusterCountLayerId = (options.id || options.source) + '_clusters-count';

		// Add clusters layer for source
		this.AddLayer({
			id: clusterLayerId,
			type: 'circle',
			source: options.source,
			filter: options.filter, 
			paint: options.circle_paint
		});

		// Add cluster count labels layer
		this.AddLayer({
			id: clusterCountLayerId,
			type: 'symbol',
			source: options.source,
			filter: options.filter,
			layout: options.label_layout,
			paint: options.label_paint 
		});
	}

	// ------------------------------------------------------------------------
	// Map Event Methods
	// ------------------------------------------------------------------------
	OnceStyleData_Handler(ev) {
		this.Emit('StyleChanged', ev);
	}
	
	/**
	 * Event handler for clicking on the map, and emits a 'Click' event.
	 * @param {object} ev - click event object
	 */
	OnLayerClick_Handler(ev) {
		this.Emit('Click', ev);
	}
	/**
	 * Wraps original mapbox event with a new event
	 * @param {string} oEv original mapbox event
	 * @param {string} nEv new event
	 */
	WrapEvent(oEv, nEv) {
		var f = (ev) => this.Emit(nEv, ev);
		
		this.map.on(oEv, f);
	}
}

# Web-Mapping-Components Quick Start Guide:
## Goal:
The goal of this guide is to provide those new to the library a quick guide to develop their own mapping application.

## Background:
The web-mapping-components library was originally part of the [web-mapping-dev](https://github.com/CSBP-CPSE/web-mapping-dev) repository, which included both the core web mapping logic and various map viewer applications. In an effort to make this code more managable, the web-mapping-dev repository was separated between core functionality and the web mapping viewer applications which use it (e.g. [lode-viewer](https://github.com/CSBP-CPSE/lode-viewer)).

The web-mapping-components library is built on maplibre-gl technology (a fork of the mapbox-gl library) and includes the core logic needed to add a dynamic web map to a webpage, and related controls/components to enhance the map's functionality (e.g. a map legend).

The web-mapping-components library consists of a number of modules which is split between two categories 1) basic-tools and 2) mapbox-tools. The mapbox-tools portion of the library handles logic directly related to using the maplibre-gl web-mapping library, while the basic-tools portion of the library contains all non-maplibre functionality.

## How to use the library in your project:
The web-mapping-components library as mentioned above is modular in design (ECMAScript (ES) modules), and the project uses rollup to bundle these modules into a single web-mapping-components.js library. Note: running the command `npm run build` will generate a new web-mapping-components.js library which will be found in the `/dist` directory.

To include this library into your project, simply copy the built web-mapping-components.js to your project, and reference the module(s) you're interested in using in your code. 

For example if you wanted to use the Factory module to create a Map from the web-mapping-components library in your own JavaScript library, you would import that module in the following way;

```javascript
import { Factory } from './<library-location>/web-mapping-components.js';

let myMap = Factory.Map(<passed-arguments>);
```

## Library Assets:
Various controls in the Web-Mapping-Components library were built with images (e.g. a `globe.png` image for the home button). Although developers aren't limited to using these image files, the original assets can be found in the [/assets](https://github.com/CSBP-CPSE/web-mapping-components/tree/master/assets) directory.

## External Dependencies:
The web-mapping-components library currently has two dependencies which are **not** currently bundled with the library, and will need to be included with your project in some manner.

* [maplibre-gl](https://www.npmjs.com/package/maplibre-gl)
* [promise-polyfill](https://www.npmjs.com/package/promise-polyfill))

## Map Component:
### How To Add A Map:
The heart of the web-mapping-components library is the map being created using the maplibre-gl library. A new map can be created using the Factory class Map method. 

**Factory.Map Parameters**:
* container: DOM reference to the HTML containing the map
* token: mapbox access token (provided by Mapbox)
* style: url to the mapbox map style document
* center: object containing the lat/long coordinates for the center of the map.
* zoom: the map zoom level (between 0-22).

**Example**:
```javascript
import { Factory } from './web-mapping-components.js';

let options = {
	container: document.getElementById('my-map-container-id'),
	accessToken: '<your-mapbox-access-token>',
	mapStyle: 'mapbox://styles/<your-user-name>/<your-map-style-id>',
	mapCenter: {lng: -75, lat: 46},
	mapZoom: 12
};

let myMap = Factory.Map(options.container, options.accessToken, options.mapStyle, options.mapCenter, options.mapZoom);
```

#### Add a Map with OSM Background:
To use OpenStreetMap as the background, set the map style as `osm`. Note: Since OpenStreetMap is being used as the map style document, a Mapbox access token is not required.

**Example**:
```javascript
import { Factory } from './web-mapping-components.js';

let options = {
	container: document.getElementById('my-map-container-id'),
	accessToken: '',
	mapStyle: 'osm',
	mapCenter: {lng: -75, lat: 46},
	mapZoom: 12
};

let myMap = Factory.Map(options.container, options.accessToken, options.mapStyle, options.mapCenter, options.mapZoom);
```

#### Set Max Bounds of Map:
The maximum extent for a map can be set on a map object using the `SetMaxBounds([[x1,y1],[x2,y2]])` method. Note: x1 and y1 represents the lower left bounds, and x2 and y2 represents the upper right bounds.

**Example**:
```javascript
let myMap = Factory.Map(options.container, options.accessToken, options.mapStyle, options.mapCenter, options.mapZoom);
myMap.SetMaxBounds([[-50, -50], [10, 10]]);
```

#### Set Max Zoom of Map:
The default map zoom range for a map is between 0 and 22. To set a maximum zoom level can be done with the `SetMaxZoom(max-zoom-level)` method.

**Example**:
```javascript
let myMap = Factory.Map(options.container, options.accessToken, options.mapStyle, options.mapCenter, options.mapZoom);
myMap.SetMaxZoom(12);
```

## Map Controls:
Built into the web-mapping-components library are numerous map controls, which can be added to enhance the functionality of the Map Component.

### How To Add Controls To A Map:
To add a map control, first create the control object, and then add it with the map object's AddControl method.

**Map.AddControl Parameters**:
* control: The control object you want added to the map.
* location: the control's location on the map. e.g. 'top-left', 'top-right', 'bottom-left', and 'bottom-right'.

**Example**:
```javascript
...
let myMap = Factory.Map(options.container, options.accessToken, options.mapStyle, options.mapCenter, options.mapZoom);
let scaleBar = Factory.ScaleControl('metric');
myMap.AddControl(scaleBar, 'top-left');
```

### Map Navigation Control:
Map Navigation Buttons to zoom in and out of the map and reset bearing to North, can be added using the Factory.NavigationControl method.

**Factory.NavigationControl Parameters**:
* showCompass: Indicate (true or false) if the compass button should be shown, which
allows user to reset the map bearing to North).
* showZoom: Indicate (true or false) if the map zoom in/out buttons should be shown.
* titleIn: The title text (i.e. the tooltip text that appears when hovering the
cursor over it) for the map zoom-in button.
* titleOut: The title text (i.e. the tooltip text that appears when hovering the
cursor over it) for the map zoom-out button.

**Example**: 
```javascript
import { Factory } from './web-mapping-components.js';

let mapNavBtns = Factory.NavigationControl(true, true, 'Click to zoom-in', 'Click to zoom-out');
<map-object>.AddControl(mapNavBtns, 'top-left');
```

### Scale Bar Control:
A scale bar can be added using the Factory.ScaleControl method.

**Factory.ScaleControl Parameter**:
* units: The name of the unit of measurement used by the scale bar, which can be; 'imperial', 'metric', or 'nautical'.

**Example**: 
```javascript
import { Factory } from './web-mapping-components.js';

let scaleBar = Factory.ScaleControl('metric');
<map-object>.AddControl(scaleBar, 'bottom-left');
```

### Full-Screen Control:
A button to make the map full screen, can be added using the Factory.FullscreenControl method.

**Factory.FullscreenControl Parameter**:
* title: The title text (i.e. the tooltip text that appears when hovering the cursor over it) for the button.

**Example**:
```javascript
import { Factory } from './web-mapping-components.js';

let fullScreenBtn = Factory.FullscreenControl('Click to make the map full screen');
<map-object>.AddControl(fullScreenBtn, 'top-left');
```

### Geo-Locate Control:
A button which will geo-locate your position when clicked. This control can be added using the Factory.GeolocateControl method.

**Example**:
```javascript
import { Factory } from './web-mapping-components.js';

let geolocate = Factory.GeolocateControl();
<map-object>.AddControl(geolocate, 'top-left');
```

### Opacity Control:
The opacity control provides a slider that generates an opacity value (between 0 and 1), which can be used to adjust opacity for a selected layer.

#### Create and Add an Opacity Control:
```javascript
let initialOpacity = 1;
let opacityControl = Factory.OpacityControl(initialOpacity);

<map-opacity>.AddControl(opacityControl);
```

#### Set the Opacity Control Label:
```javascript
<opacity-control-object>.label = "Opacity Control Label";
```

#### Set the Opacity Control Title:
```javascript
<opacity-control-object>.title = "Opacity Control Title";
```

#### Bind Opacity Control Change Events to a Function:
```javascript
<opacity-control-object>.On("OpacitySliderChanged", this.OnOpacitySlider_Changed.bind(this));

OnOpacitySlider_Changed(ev) {
	// Custom logic for handling changes to opacity
	console.log("Current Opacity Value: " + ev.opacity);	
};
```

### Group Control:
The group control provides a structure to house a list of controls that can be added to an application.

**Syntax**:
```javascript
// Define structure of group with an example of a control within the group
let group = {
	<control-name-1>: Factory.<control-1>,
	<control-name-2>: Factory.<control-2>,
	...,
	<control-name-n>: Factory.<control-n>,

};

// Create a Group control object and add it to the map object.
<map-object>.AddControl(Factory.Group({group}));
```

**Example**:
```javascript
// Define group structure with opacity control
let group = {
	opacity: Factory.OpacityControl(1);
};

myMap.AddControl(Factory.Group(group));

// Update opacity control that's inside the group
group.opacity.label = "Opacity Slider";
```

### Legend
The legend is arguably the most useful control provided by the Web-Mapping-Components Library, but requires multiple steps to be properly configured, including;

1. Defining the legend items
2. Creating a legend control object
3. Adding the control object to the map
4. Handle changes when the legend's state updates

#### Defining the Legend Items:
The legend items are represented by a list of objects which contain various properties about each legend item, including; the item `label`, item `color`, item `opacity`, and a `value` often represented by a [Mapbox expression](https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/), which defines the conditions representing the legend item. 

**Legend Item Properties**:
* label: A string representing the label of the item.
* color: An array containing either the RGB or RGBA color value of the item.
* opacity: A number representing the default opacity value, ranging between 0 and 1.
* value: A Mapbox expression representing the legend item.

Example: 
```javascript
let legendItems = [
	{
		"color": [255,25,167],
		"label": "Legend Item 1",
		"value": [<mapbox expression>]
	},
	{
		"color": [150,150,150],
		"opacity": 0.8,
		"label": "Other"
	}
];
```

Note: When creating a list of multiple legend items, make sure to include a default/catch-all item (see example above with the "Other" legend item). This will insure that cases not defined by the above legend items are handled by the map. 

#### Creating A Legend Control Object:
A new legend control object can be instantiated using the `Factory.LegendControl` method, which has four parameters including; `legend`, `title`, `banner`, and `subtitle`.

**LegendControl Parameters**:
* config: An array of legend items defining the legend's configurations (see example above). 
* title: A string representing the legend's title.
* banner: A string representing the banner text for the legend (placed at the top of legend).
* subtitle: A string representing the legend's sub-title (placed below the title text).

Syntax:
```javascript
let YourLegendControl = Factory.LegendControl(LegendItemsArray, "Legend Title", "Legend Banner", "Legend Sub-Title");
```

#### Adding Legend Control To The Map:
Once the legend control object is created, it can then be added to the map application using the map `AddControl` method.

Syntax:
```javascript
YourMap.AddControl(YourLegendControl);
```

#### Handling Legend State Changes:
The final step is to handle `LegendChange` events and in the context of the legend, update the map layers with the updated legend state. 

To make updating map layers based on changes to a legend's state, a function was added to the Map object which handles updating a provided list of map layer ids based on the current legend's state called `UpdateMapLayersWithLegendState`. This methods requires only three values passed to it to update the map layers; 1) a list of the layers you want updated, 2) the current legend's state, and 3) an opacity value for the legend items. 

Syntax:
```javascript
YourLegendControl.On("LegendChange", this.OnLegend_Changed.bind(this));

OnLegend_Changed(ev) {
	YourMap.UpdateMapLayersWithLegendState(LayerIdsList, YourLegendControl, OpacityValue);
}
```

#### Example:
```javascript
import { Factory } from './web-mapping-components.js';

let options = {
	container: document.getElementById('my-map-container-id'),
	accessToken: '',
	mapStyle: 'osm',
	mapCenter: {lng: -75, lat: 46},
	mapZoom: 12
};

// Create Map
let myMap = Factory.Map(options.container, options.accessToken, options.mapStyle, options.mapCenter, options.mapZoom);

let legendItems = [
	{
		"color": [255,25,167],
		"label": "Ottawa, ON",
		"value": ["==",["get","city_name"],"Ottawa"]
	},
	{
		"color": [150,150,150],
		"opacity": 0.8,
		"label": "Other"
	}
];

// Create Legend Control
let legendControl = Factory.LegendControl(legendItems, "Legend Title", null, "Legend Sub-Title");

// Add Legend Control To Map
myMap.AddControl(legendControl);

// Handle changes to legend state
legendControl.On("LegendChange", this.OnLegend_Changed.bind(this));

OnLegend_Changed(ev) {
	myMap.UpdateMapLayersWithLegendState(['layer1','layer2','layer3'], legendControl, 1);
}
```

### Labels Toggle Control:
The labels toggle control provides a simple interface control for toggling on/off all map layers which show labels. 

#### Creating And Adding A Labels Toggle Control:
A new Labels Toggle control object can be created using the `Factory.LabelsToggleControl` method, which has two parameters; `map`, and `label`.

**Labels Toggle Control Parameters**:
* map: A Web-Mapping-Component Map object. 
* label: A string representing the label for the Labels Toggle control. Default value is 'Labels' if no string is provided.

Syntax:
```javascript
let MyLabelsToggleControl = Factory.LabelsToggleControl(<map-object>, <label-string>);
<map-object>.AddControl(MyLabelsToggleControl);
```

#### Example:
```javascript
let MyLabelsToggleControl = Factory.LabelsToggleControl(MyMap, "Labels");
MyMap.AddControl(MyLabelsToggleControl);
```

## Map Data:
Mapbox provides various types of layers which can be added to your map, including; background, fill, line, symbol, raster, circle, fill-extrusion, heatmap, hillshade, and sky.

For further information, please consult the [mapbox-gl documentation](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/).

In general there are two main ways add data to a map; 
1. The easiest is to add it directly as a layer to your map style document via mapbox studio, which will be automatically loaded when you load the map style document.
2. Alternatively if your data is available as an external source, you can also reference that data, and then add it directlt to the map.

Note: When adding data sources and layers to mapbox map, it's important to know that in some cases you may need to listen to events, to ensure that the map is ready to have a data source added or a layer added.

### Adding A Data Source:
An external geojson data source can be added using the Map.AddSource method. Note: Mapbox supports multiple data source types; tile sets, vector, raster, raster-dem, geojson, images and video. See [mapbox-gl documentation](https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/) for further details.

**Map.AddSource Parameters**:
name: The name of the data source, which will be referenced by any layers.
data: The object defining the data.

**Raster Tileset Example**:
```javascript
let osmSource = {
	type: 'raster',
	tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
	tileSize: 256,
	attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};

<map-object>.AddSource('osm', osmSource);
```

**GeoJSON Example 1**:
```javascript
...
let geojsonSource = {
	type: "geojson",
	data: "https://example.org/mydata.json"
};

<map-object>.AddSource('mydata', geojsonSource);
```

**GeoJSON Example 2**:
```javascript
...
let citiesSource = {
	type: "geojson",
	data: {
		"type": "FeatureCollection",
		"name": "cities",
		"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
		"features": [
			{ "type": "Feature", "properties": { "name": "New York" }, "geometry": { "type": "Point", "coordinates": [ -74.0061, 40.7171 ] } },
			{ "type": "Feature", "properties": { "name": "Toronto" }, "geometry": { "type": "Point", "coordinates": [ -79.39, 43.6601 ] } },
			{ "type": "Feature", "properties": { "name": "Vancouver" }, "geometry": { "type": "Point", "coordinates": [ -123.1103, 49.2697 ] } },
			{ "type": "Feature", "properties": { "name": "Tokyo" }, "geometry": { "type": "Point", "coordinates": [ 139.7781, 35.7061 ] } },
			{ "type": "Feature", "properties": { "name": "London" }, "geometry": { "type": "Point", "coordinates": [ -0.145, 51.5374 ] } }
		]
	}
};

<map-object>.AddSource('cities', citiesSource);
```

### Add a Map Layer:
After adding a new data source, the data can be added to a map as a layer. This can be performed using the Map.AddLayer method. Note: Mapbox provides a variety of layer types, which can be added, including; background, fill, line, symbol, raster, circle, fill-extrusion, heatmap, hillshade, and sky. See [mapbox-gl documentation](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/) for further details.

**Map.AddLayer Parameter**:
layer: The object containing the details about the layer.

**Example**:
```javascript
	let citiesLayer = {
		id: 'worldcities',
		source: 'cities',
		type: 'circle',
		paint: {
			'circle-color': "#000000",
			'circle-radius': 8
		}
	};

	this.map.AddLayer(citiesLayer);
```

## Events:
The Web-Mapping-Components library has a selection of custom events, which are listed below; 

* **LegendChange** - When the Legend Control's state has changed (e.g. a legend item's checkbox is changed), it emits a "LegendChange" event.
* **OpacitySliderChanged** - When the Opacity Control is updated (e.g. the slider bar is adjusted), it emits a "OpacitySliderChanged" event.
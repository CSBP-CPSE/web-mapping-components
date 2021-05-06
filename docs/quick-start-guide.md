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

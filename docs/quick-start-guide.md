# Web-Mapping-Components Quick Start Guide:
## Background:
The web-mapping-components library was originally part of the [web-mapping-dev](https://github.com/CSBP-CPSE/web-mapping-dev) repository, which included both core web mapping logic and various map viewer applications. In an effort to make this code more managable, the web-mapping-dev repository was separated between core functionality and the web mapping viewer applications which use it (e.g. [lode-viewer](https://github.com/CSBP-CPSE/lode-viewer)).

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

Example:
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

### Map Controls:
Built into the web-mapping-components library are numerous map controls, which can be added to enhance the functionality of the Map Component.

To add a map control, simple create it, and then add it with the <map-object>.AddControl method.

Example:
```javascript
...
let myMap = Factory.Map(options.container, options.accessToken, options.mapStyle, options.mapCenter, options.mapZoom);
myMap.AddControl(<control-object>);
```

#### Map Navigation Buttons:
Map Navigation Buttons to zoom in and out of the map and reset bearing to North, can be added using the Factory.NavigationControl method.

**Factory.NavigationControl Parameters**:
* showCompass: Indicate (true or false) if the compass button should be shown, which
allows user to reset the map bearing to North).
* showZoom: Indicate (true or false) if the map zoom in/out buttons should be shown.
* titleIn: The title text (i.e. the tooltip text that appears when hovering the
cursor over it) for the map zoom-in button.
* titleOut: The title text (i.e. the tooltip text that appears when hovering the
cursor over it) for the map zoom-out button.

Example: 
```javascript
import { Factory } from './web-mapping-components.js';

let myMapNavBtns = Factory.NavigationControl(true, true, 'Click to zoom-in', 'Click to zoom-out');
<map-object>.AddControl(myMapNavBtns);
```

#### Scale Bar:
A scale bar can be added using the Factory.ScaleControl method.

**Factory.ScaleControl Parameter**:
* units: The name of the unit of measurement used by the scale bar, which can be; 'imperial', 'metric', or 'nautical'.

Example: 
```javascript
import { Factory } from './web-mapping-components.js';

let myScale = Factory.ScaleControl('metric');
<map-object>.AddControl(myScale);
```

#### Full Screen Button:
A button to make the map full screen, can be added using the Factory.FullscreenControl method.

**Factory.FullscreenControl Parameter**:
* title: The title text (i.e. the tooltip text that appears when hovering the cursor over it) for the button.

Example:
```javascript
import { Factory } from './web-mapping-components.js';

let myFullScreenBtn = Factory.FullscreenControl('Click to make the map full screen');
<map-object>.AddControl(myFullScreenBtn);
```

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

let myMap = new Factory.Map(<passed-arguments>);
```

## External Dependencies:
The web-mapping-components library currently has two dependencies which are **not** currently bundled with the library, and will need to be included with your project in some manner.

* [maplibre-gl](https://www.npmjs.com/package/maplibre-gl)
* [promise-polyfill](https://www.npmjs.com/package/promise-polyfill))

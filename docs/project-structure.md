# Web-Mapping-Components Structure Notes:

## Dependencies:
The web-mapping-components library has the following dependencies;

* [maplibre-gl](https://www.npmjs.com/package/maplibre-gl)
* [promise-polyfill](https://www.npmjs.com/package/promise-polyfill)

## Source Tree:
```
src/
├── basic-tools
│   ├── components
│   │   ├── evented.js
│   │   ├── popup.js
│   │   ├── templated.js
│   │   ├── tooltip.js
│   │   └── typeahead.js
│   ├── README.md
│   └── tools
│       ├── core.js
│       ├── dom.js
│       ├── net.js
│       ├── store.js # Provides methods for storing/retrieving data from local storage
│       └── util.js
├── main.js
└── mapbox-tools
    ├── components
    │   ├── control.js
    │   └── map.js
    ├── controls
    │   ├── bookmarks.js
    │   ├── download.js
    │   ├── fullscreen.js
    │   ├── group.js
    │   ├── legend.js
    │   ├── mapsList.js
    │   ├── mapsMenu.js # Contains logic for the MapsMenu Control
    │   ├── menu.js
    │   ├── navigation.js
    │   ├── opacity.js
    │   ├── search.js
    │   └── toc.js
    ├── README.md
    ├── styling
    │   ├── expression.js # Contains functions for generating mapbox data expressions for styling data
    │   └── layer.js # Provides methods for manipulating mapbox layers
    └── tools
        ├── factory.js # Factory for creating new components and control objects
        └── other.js
```

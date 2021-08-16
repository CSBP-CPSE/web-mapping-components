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
    │   ├── control.js # Logic for adding/removing controls in the map component
    │   └── map.js # Contains logic related to the map component
    ├── controls
    │   ├── bookmarks.js # Bookmarks control
    │   ├── download.js # Download link control
    │   ├── fullscreen.js # Fullscreen map control
    │   ├── group.js # Group control
    │   ├── legend.js # Legend control
    │   ├── mapsList.js # Maplist control
    │   ├── menu.js # Menu control
    │   ├── navigation.js # Navigation control
    │   ├── opacity.js # Opacity slider control
    │   ├── search.js # Search control
    │   └── toc.js # Table of Contents (TOC) control
    ├── README.md
    ├── styling
    │   ├── expression.js # Contains functions for generating mapbox data expressions for styling data
    │   └── osm.js # Defines predefined OpenStreetMap (OSM) map style
    └── tools
        ├── factory.js # Factory for creating new components and control objects
        └── other.js
```

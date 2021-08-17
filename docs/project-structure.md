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
│   │   ├── evented.js # Logic related to emitting and handling events
│   │   ├── popup.js # Popup component logic
│   │   ├── templated.js
│   │   ├── tooltip.js # Tooltip component logic
│   │   └── typeahead.js # Logic relating to typeahead widget used by search control
│   ├── README.md
│   └── tools
│       ├── core.js
│       ├── dom.js # Provides methods for adding/manipulating website content
│       ├── net.js # Methods for making requests and getting application URLs
│       ├── store.js # Provides methods for storing/retrieving data from local storage
│       └── util.js # Various utility methods
├── main.js # Entry point
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
        └── other.js # Various helper functions
```

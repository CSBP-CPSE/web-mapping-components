# Web-Mapping-Components Structure Notes:

## Dependencies:
The web-mapping-components library uses maplibre-gl for creating map viewer applications. As a result you 
will need to include a script tag referencing that resource in order to use this library.

Examples of how to add maplibre-gl to your viewer project using a script tag:

*mapLibre-gl library stored locally in your project:*
```html
<script src='./localdir/maplibre-gl.js'></script>
```

or 

*maplibre-gl provided remotely (e.g. by a CDN):*
```html
<script src='https://unpkg.com/maplibre-gl@1.14.0/dist/maplibre-gl.js'></script>
```

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
│   ├── polyfill
│   │   └── promise.min.js
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
    │   ├── menu.js
    │   ├── navigation.js
    │   ├── opacity.js
    │   ├── search.js
    │   └── toc.js
    ├── README.md
    └── tools
        ├── factory.js
        └── other.js
```

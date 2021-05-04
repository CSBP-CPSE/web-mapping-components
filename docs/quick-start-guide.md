# Quick Start Guide To Using The Web-Mapping-Components Library:
## Background:
The web-mapping-components library was originally part of the [web-mapping-dev](https://github.com/CSBP-CPSE/web-mapping-dev) repository, which included both core web mapping logic and various map viewer applications. In an effort to make this code more managable, the web-mapping-dev repository was separated between core functionality and the web mapping viewer applications which use it (e.g. [lode-viewer](https://github.com/CSBP-CPSE/lode-viewer)).

The web-mapping-components library is built on maplibre-gl technology (a fork of the mapbox-gl library) and includes the core logic needed to add a dynamic web map to a webpage, and related controls/components to enhance the map's functionality (e.g. a map legend).

The web-mapping-components library consists of a number of modules which is split between two categories 1) basic-tools and 2) mapbox-tools. The mapbox-tools portion of the library handles logic directly related to using the maplibre-gl web-mapping library, while the basic-tools portion of the library contains all non-maplibre functionality.

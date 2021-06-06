/**
 * The OSM style object represents a predefined map style using OpenStreetMap 
 * Raster Tile layers and the Open Font Glyphs which packages free fonts 
 * (required for symbol labelling). 
 * 
 * OSM: https://www.openstreetmap.org/
 * OSM Licence: OpenStreetMap® is open data, licensed under the Open Data 
 * Commons Open Database License (ODbL) by the OpenStreetMap Foundation (OSMF). 
 * https://www.openstreetmap.org/copyright
 * 
 * Open Font Glyphs: https://github.com/openmaptiles/fonts
 * Open Font Glyphs Licence: All fonts packaged in Open Font Glyphs is licensed
 * under Open File Licence (OFL) or Apache.
 */
export const OSM = {
	version: 8,
	glyphs: "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
	sources: {
		osm: {
			type: 'raster',
			tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
			tileSize: 256,
			attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}
	},
	layers: [
		{
			id: 'osm',
			type: 'raster',
			source: 'osm'
		}
	]
};

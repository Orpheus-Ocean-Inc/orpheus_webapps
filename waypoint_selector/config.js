// ------------------------------------------------------------
//  Edit this file to change where the map opens and which
//  basemaps are offered.
//  You can also override the start location per visit with URL parameters:
//    ?lat=48.8584&lon=2.2945&zoom=17
// ------------------------------------------------------------
const CONFIG = {
  // Starting location [latitude, longitude]
  center: [41.98018306, -70.68301767],

  // Starting zoom: 1 (whole world) to 20 (very close)
  zoom: 19,

  // Highest zoom the map allows. Layers with less detail are stretched
  // beyond their own maximum so you can still place points precisely.
  maxZoom: 20,

  // Decimal places used in the coordinate output
  decimals: 8,

  // Which basemap is shown first (must match a "name" below)
  defaultLayer: "Satellite (Esri)",

  // Basemaps shown in the layer switcher (top right of the map).
  // All of these are free and need no API key. Remove any you don't want.
  layers: [
    {
      name: "OpenStreetMap",
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      maxNativeZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    {
      name: "Satellite (Esri)",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      maxNativeZoom: 19,
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
    },
    {
      name: "Satellite with labels (Esri)",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      // Optional transparent layer drawn on top (roads, place names)
      labelsUrl:
        "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      maxNativeZoom: 19,
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
    },
    {
      name: "Topographic (Esri)",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      maxNativeZoom: 19,
      attribution:
        "Tiles &copy; Esri &mdash; Esri, HERE, Garmin, USGS, NGA, and other contributors",
    },
    {
      name: "Terrain (OpenTopoMap)",
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      subdomains: "abc",
      maxNativeZoom: 17,
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Style &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
    },
  ],
};

# Waypoint Selector

A single-page, no-backend map tool for picking waypoints and exporting them as plain-text coordinates. Click the map to drop a pin, drag pins to adjust them, and copy or download the list as `lat, lon` pairs — one per line, up to 8 decimal places.

Built with [Leaflet](https://leafletjs.com/) and free tile sources (OpenStreetMap, Esri, OpenTopoMap). No API keys, no build step, no server — it's two files you can host on GitHub Pages.

## Live demo

<!-- `https:///waypoint_selector/` -->

*(Replace with your actual Pages URL after deploying — see below.)*

## Features

- **Click-to-add waypoints** — click anywhere on the map to drop a numbered, draggable pin. Click a pin for a delete button.
- **Coordinate output** — a read-only panel lists every waypoint as `lat, lon`, one per line, to 8 decimal places, updating live. Click the box to select all, then copy, or use the **Copy coordinates** button. **Download** saves the same text as a `.txt` file.
- **Distance between waypoints** — a running list shows the distance from each waypoint to the previous one (meters or kilometers), plus a total route distance.
- **Multiple basemaps** — switch between OpenStreetMap, Esri Satellite (with or without labels), Esri Topographic, and OpenTopoMap terrain from the layer switcher (top right of the map).
- **Configurable start location** — set where the map opens by editing `config.js`, by URL parameters (`?lat=...&lon=...&zoom=...&layer=...`), or from inside the app:
  - **Set start to current view** — save the map's current center, zoom, and basemap as the new start (saved to your browser only).
  - **Set start from coordinates** — type a latitude and longitude directly to set and save a new start location.
  - **Go to start** / **Copy link** / **Use default** — jump back to the saved start, copy a shareable link to it, or discard the saved start and revert to `config.js`.
- **Bounding box grid (lawn-mower pattern)** — draw a rectangle on the map (click **Draw bounding box**, then click-and-drag), set a spacing in meters, and **Generate grid** fills the box with waypoints in a back-and-forth mowing path, added to your existing list.
- **Load / paste waypoints**:
  - **Load from file** — reload a previously downloaded `.txt` file; it redraws every point on the map and replaces the current waypoints (with a confirmation if you have unsaved ones).
  - **Paste coordinates** — paste `lat, lon` pairs (one per line) into the box to add them as new waypoints alongside whatever's already there.
- **Undo / Clear all** — undo the last waypoint, or clear everything (waypoints and the bounding box) at once.
- Responsive layout (map on top, panel below on narrow screens) and dark-mode aware styling.

## Getting started

### Run it locally

1. Clone or download this repository.
2. From the project folder, start a local server (opening `index.html` directly can cause some tile providers to block requests):
   ```bash
   python3 -m http.server
   ```
3. Open `http://localhost:8000` in your browser.

### Deploy to GitHub Pages

1. Create a public GitHub repository and add `index.html` and `config.js` to its root on the `main` branch.
2. Go to **Settings → Pages**.
3. Under "Build and deployment," choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. After a minute or two, your site is live at `https://YOUR-USERNAME.github.io/REPO-NAME/`.

## Configuration

All settings live in `config.js`:

```js
const CONFIG = {
  center: [51.5007, -0.1246], // starting [latitude, longitude]
  zoom: 19,                   // starting zoom (1–20)
  maxZoom: 20,                // highest zoom the map allows
  decimals: 8,                // decimal places in the coordinate output
  defaultLayer: "Satellite (Esri)", // must match a "name" below
  layers: [ /* basemap definitions */ ],
};
```

- **Change the start location or zoom:** edit `center` and `zoom`, then commit.
- **Change the default basemap:** set `defaultLayer` to any `name` listed in `layers`.
- **Add or remove basemaps:** edit the `layers` array. Each entry needs a tile `url`, `maxNativeZoom`, and `attribution`; an optional `labelsUrl` overlays a transparent labels layer on top (used for "Satellite with labels").

A saved start location (set from inside the app) is stored in your browser and takes priority over `config.js` until you click **Use default**. A `?lat=&lon=&zoom=&layer=` URL takes priority over both, for one visit.

## Coordinate output format

```
42.35843000, -71.06060000
42.35892000, -71.05930000
42.35921000, -71.05780000
```

This is also the format expected when loading a file or pasting coordinates: one `lat, lon` pair per line. Lines that don't parse as a valid pair (or fall outside ±90° latitude / ±180° longitude) are skipped and reported.

## Precision note

Coordinates are always formatted to 8 decimal places (about 1 mm of resolution), but the practical accuracy of a clicked point is limited by pixel size at the current zoom level (roughly 0.1–0.3 m at maximum zoom) and by the basemap's own positional accuracy. Treat the trailing digits as formatting, not measurement precision.

## Tile usage

The default OpenStreetMap layer uses OSM's public tile server, which is fine for personal or light use but not for high-traffic deployments — see the [OSM tile usage policy](https://operations.osmfoundation.org/policies/tiles/). For heavier use, switch to a provider such as MapTiler or Stadia Maps and update the relevant `url` in `config.js`.

## License

Add a license of your choice (e.g. MIT) here.

# Survey Mission Calculator

A single-file, browser-based planning tool for **underwater photogrammetry surveys**, built by [Orpheus Ocean](https://orpheusocean.com). Pick a camera, set altitude, speed and overlap, and the calculator returns image footprint, ground sampling distance (GSD), line spacing, trigger timing, and — given a survey area — a full lawnmower mission plan with photo counts, run time and storage estimates.

No build step, no dependencies, no network access required.

## Quick start

1. Open `index.html` in any modern browser (Chrome, Firefox, Safari, Edge).
2. Choose a camera from the **Camera** dropdown in the header.
3. Adjust the mission parameters in the sidebar.
4. Optionally enter a survey area **Width** and **Length** to unlock mission sizing.
5. Click **Copy Results** to put a plain-text summary on your clipboard.

To host it, drop the file on any static web server (GitHub Pages, S3, Netlify, etc.).

## Inputs

| Input | Units | Default | Notes |
|---|---|---|---|
| Camera profile | — | MV100 3.2MP + 2.7mm Dome | Sets sensor size, FOV, port type and max frame rate |
| Horizontal FOV | ° | from profile | Cross-track field of view |
| Vertical FOV | ° | from profile | Along-track field of view; marked *estimated* when derived from aspect ratio |
| Altitude above seafloor | m | 2.0 | Slider 0.5–20 m; number box accepts up to 5000 m |
| Vehicle speed | m/s | 1.0 | Slider 0.05–5 m/s |
| Forward overlap | % | 75 | Along-track overlap between consecutive frames |
| Side overlap | % | 60 | Cross-track overlap between adjacent swaths |
| Survey area width / length | m | empty | Optional; enables the mission sizing section |

Each slider is paired with a number box. Typing a value outside the slider's range is allowed; the slider simply clamps to its end stop.

## Outputs

**Per image (always shown)**

- Footprint width (cross-track) and height (along-track), in metres
- GSD cross-track and along-track, in mm/px
- Line spacing between swath centres
- Trigger distance between frame centres
- Trigger interval (s) and required frame rate (fps), with a warning if the rate exceeds the camera's maximum

**Mission sizing (when a survey area is entered)**

- Side-by-side comparison of two lawnmower orientations: lines parallel to the width, and lines parallel to the length. Each shows swath count, photos per swath, time per swath, total path length, total photos and total time.
- A **Recommended** badge on the orientation that needs fewer swaths (fewer turns is generally better for AUVs and ROVs).
- To-scale plan views of both tracks, with swath coverage shading, start marker and scale bar.
- Total image count plus estimated JPEG and RAW storage for the recommended orientation.

**Visualisations (always shown)**

- Overlap view: a conceptual 3 × 4 grid of footprints showing line spacing and trigger distance.
- Side view: camera, FOV cone, altitude and footprint width over the seafloor.

## How it calculates

For a flat seafloor and a nadir-pointing camera at altitude *h*:

```
footprint_w = 2 · h · tan(HFOV / 2)
footprint_h = 2 · h · tan(VFOV / 2)

GSD_x = footprint_w / pixels_x      (reported in mm/px)
GSD_y = footprint_h / pixels_y

line_spacing     = footprint_w · (1 − side_overlap)
trigger_distance = footprint_h · (1 − forward_overlap)
trigger_interval = trigger_distance / speed
frame_rate       = 1 / trigger_interval
```

**Flat-port refraction.** Dome ports preserve the in-air FOV underwater. For flat ports, the tool converts the in-air FOV to an underwater FOV with Snell's law, using n = 1.334 for seawater:

```
θ_water = 2 · asin( sin(θ_air / 2) / 1.334 )
```

A notice appears above the results showing the corrected angles, and every downstream value uses them.

**Mission sizing.** For a lawnmower pattern where each swath has length *L* and the swaths together must cover a cross-track distance *C*:

```
swaths          = 1 + ceil( max(0, C − footprint_w) / line_spacing )
photos_per_swath = 1 + ceil( max(0, L − footprint_h) / trigger_distance )
total_photos    = swaths × photos_per_swath
total_path      = swaths × L
total_time      = total_path / speed
```

The first and last swaths are placed so their footprint edges line up with the survey boundary.

**Storage.** JPEG is estimated at ~0.5 bytes per pixel and RAW at 2 bytes (16 bits) per pixel.

### Worked example

Default settings (MV100 3.2MP dome, 120° × 90°, 2048 × 1536 px, 2 m altitude, 1 m/s, 75 % / 60 % overlap):

| Result | Value |
|---|---|
| Footprint | 6.93 m × 4.00 m |
| GSD | 3.38 mm/px cross-track, 2.60 mm/px along-track |
| Line spacing | 2.77 m |
| Trigger distance | 1.00 m |
| Trigger interval / rate | 1.00 s / 1.00 fps (within the 35.4 fps limit) |

## Camera profiles

Built-in profiles:

| Profile | Resolution | HFOV × VFOV | Port | Max fps |
|---|---|---|---|---|
| MV100 3.2MP + 2.7mm Dome | 2048 × 1536 | 120° × 90° | dome | 35.4 |
| MV100 2.3MP + 2.7mm Dome | 1920 × 1200 | 105° × 65.6° | dome | 48.3 |
| MV100 1.6MP + 2.7mm Dome | 1440 × 1080 | 101° × 75.8° | dome | 71.6 |
| MV100 3.2MP + 2.8mm Flat | 2048 × 1536 | 76.3° × 57.2° (in air) | flat | 35.4 |
| MV100 3.2MP + 6mm Flat | 2048 × 1536 | 43° × 32.3° (in air) | flat | 35.4 |
| Custom Camera | 1920 × 1080 | 90° × 50.6° | dome | 60 |

All MV100 models are from Deep Sea Power & Light and use 3.45 µm pixels.

### Adding a camera

Add an object to the `PROFILES` array near the top of the `<script>` block. No other code changes are needed; the dropdown is built from this array.

```js
{
  id: 'my-cam',                 // unique key
  name: 'My Camera + 4mm Dome', // dropdown label
  mfr: 'Manufacturer',
  model: 'PART-NUMBER',
  px: 4096, py: 3000,           // sensor resolution in pixels
  pixUm: 3.45,                  // pixel pitch in µm (display only)
  hfov: 95, vfov: 69.6,         // degrees; for flat ports, enter IN-AIR values
  port: 'dome',                 // 'dome' or 'flat'
  maxFps: 24,                   // used for the frame-rate warning
  vfovEst: true,                // shows the "estimated" badge on VFOV
  note: 'Optional note shown under Camera Info.',
},
```

If you only know the horizontal FOV, the bundled profiles estimate VFOV as `HFOV × (py / px)` (an equidistant fisheye approximation). Replace it with calibrated values when you have them.

## Limitations

Keep these in mind before using the numbers for a real dive:

- **Flat seafloor, nadir camera.** Terrain relief, pitch and roll all change the real footprint and overlap.
- **Turns are not included.** Total path and time cover the straight swaths only; add turn time and transit for your vehicle.
- **Estimated VFOV.** Most bundled VFOVs are derived from aspect ratio, not calibration. Verify against lens data before mission-critical use.
- **Recommendation is by swath count only.** It does not weigh current direction, vehicle endurance or seabed features.
- **Plan view spacing.** The drawn tracks spread swaths evenly across the area, so their spacing can be slightly tighter than the calculated line spacing (which is a maximum).
- **Storage figures are rough.** Real JPEG size depends heavily on scene content and compression settings.
- **Clipboard access** needs a secure context (HTTPS or `localhost`) in most browsers; copying may fail when the file is opened from a `file://` path in some browsers.

## Project structure

```
index.html   Everything: markup, CSS (dark theme via CSS variables) and JavaScript
README.md    This file
```

Main JavaScript sections in `index.html`:

| Function | Purpose |
|---|---|
| `PROFILES` | Camera profile definitions |
| `computeImaging()` | Footprint, GSD, spacing and timing |
| `flatCorrect()` | Snell's law FOV correction for flat ports |
| `computeOrientations()` | Lawnmower mission sizing for both orientations |
| `recalc()` | Reads inputs and refreshes all results on every change |
| `drawMissionPlan()`, `drawOverlap()`, `drawSide()` | Canvas visualisations |
| `copyResults()` | Builds the plain-text clipboard summary |

## Responsive layout

Below 820 px wide, the sidebar stacks above the results and the canvases and orientation cards stack into a single column.

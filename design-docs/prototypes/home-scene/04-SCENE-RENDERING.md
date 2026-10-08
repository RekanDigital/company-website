# 04 Scene rendering

Source: the terrain loops, `contours`, the scan block and the vertex shader in `source/world.js`.

## One point cloud

- Everything except the blue frame is one `THREE.Points` object with a custom shader. About 672,000 points on desktop.
- Each point carries: position, three random numbers, a site number (0 for landscape, 1 to 7 for the business objects), a type flag, its scan position and a scan width factor.
- Points are square, 1 to 2.8 pixels before device scaling, larger when close.

## Point types

| Flag | Type | Notes |
|---|---|---|
| 0 | Land dot, or body of an object | |
| 1 | Edge of an object | drawn blue once the object is assembled |
| 2 | Water | moves with the waves |
| 3 | Blue link | dashed line from the hub to an object |
| 4 | Beach band | three dots per grid cell within 26 units of the shore. Islands use it too |
| 6 | City and industrial buildings | context, never framed |
| 7 | Contour line, river bank | faint |

## Colours

The world is always dark.

| Role | Colour |
|---|---|
| Background | `#090C11` |
| Objects, assembled | `#E9EEF3` |
| Objects, not yet assembled | `#3C4450` |
| Terrain base | `#58616E`, brightened toward `#B0BAC8` during the scanning flight |
| Blue (scan, frame, links, object edges) | `#3179CB` |
| Page ground outside the window | `#F6F8FA` |

## Brightness levels (locked)

Each value is the share of the layer's normal brightness that is kept. The rest fades to the background.

| Layer | Level | When |
|---|---|---|
| Land A dots and contours | 20% | always |
| Land B dots and contours | 70% | always, rising to 97% at the Agriculture stop |
| Mountain dots | 60% | always |
| Mountain contours | 70% | always |
| Beach band | 55% | always |
| City and industrial buildings | 70% | outside Business Overview |
| City and industrial buildings | 7% | during Business Overview |
| Sea | 100% | outside Business Overview, 70% during it (97% at Agriculture) |
| Business objects | 100% | when shown |

- **Land A** is the land around the mountains and around the city: `max(smoothstep(150, 300, z), 1 - smoothstep(380, 620, distance to the city centre))`.
- **Land B** is the rest: the southern plain where the business objects stand.
- **Mountain** is a blend by point height: `smoothstep(16, 120, y)`.
- All three blend smoothly into each other. There is no boundary line anywhere in the land texture.

## Land texture

- One dot per grid cell on all land, the same rule for mountain and lowland.
- Contour lines: one level every 6 units of height. A point is kept only if it lies within a quarter of the sampling step of the exact level, measured along the ground, so every line is about one point wide on any slope.
- Contour point spacing: 1.2 units in the north, 1.8 units in the south, in the lowlands and in the first 350 units outside the detailed area.
- Contours use 64% of the terrain colour before the levels above are applied.

## Sea

- Three wave trains move the water points up and down (up to about 4.4 units) and slightly sideways.
- Crests are brighter and larger.
- Around the fish farm (within about 190 to 340 units of its centre) the waves are half height.

## Scan line (frames 005 to 036)

- Every landscape point has a scan position: the distance along the flight path of the nearest point on it, as a fraction of the path length. Past the end of the path it keeps increasing in the direction of travel, so the scan can cross the city.
- The scan runs 0.2 of the path length ahead of the camera. From frame 029 it crosses the city at a steady rate, reaches the far edge at frame 035, and fades out by frame 036.
- The line is the set of points within a narrow window of the scan value: about 5.6 units wide on the ground. The window is corrected by the path's curvature at each point so the width is the same everywhere.
- Points on the line turn blue, grow 2.3 times, and rise 2.5 units.
- **Ahead of the line** the land is unscanned: 38% dimmer, dots 15% smaller and scattered by up to 5 units. **Behind it** the land is sharp.

## Business objects

- Before its stop an object is a dim scattered cloud: each point is displaced by up to 52 units sideways and lifted. It assembles as the camera arrives (see `02-SCROLL-TIMELINE.md`).
- Assembled points are 55% larger than landscape points. Edge points are blue.

## Blue links

- Dashed arcs from the hub above the technology building to each of the other six objects. Dashes travel outward.
- They grow point by point as the link value rises from 0 to 1.

## Blue frame

- Four thin bars and a 3% blue veil, drawn as meshes, facing the camera. See `03-CAMERA.md` for size.

## Fades applied to everything

- **Distance haze:** fades to background between 520 and 1500 units from the camera.
- **Text quiet zone:** while a text chapter shows, the left third of the screen fades to background, blending out by 54% of the width. In portrait, and for the hero headline, the top of the screen fades instead.

## Lighter devices

When the shorter screen side is under 700 pixels or the device reports 4 GB of memory or less: grid spacing 3.4, object detail step 1.25, point size 200, pixel ratio capped at 1.5.

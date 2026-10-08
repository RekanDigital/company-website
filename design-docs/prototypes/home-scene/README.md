# RekanMU Home scroll scene

The scroll-driven 3D scene behind the RekanMU Home page: the map, the scroll timeline, the camera and how the scene is drawn. This folder is the reference another agent needs to replicate it.

## Status

- **Visual: locked by the design owner (Dinda), 4 Oct 2026.** Do not change the map, timeline, camera or brightness values without her approval.
- **Page shell: updated 6 Oct 2026** to the approved site shell. The world script is unchanged from the locked version.
- **Not yet presented to the project owner.**
- **three.js is not yet in TECH-STACK.md.** TECH-STACK.md leaves the 3D technology open until the design is approved. This scene needs three.js or an equivalent.
- This is a prototype, built as one self-contained HTML page. It is not production code.

## What the scene is

One dark point-cloud world. The page opens on the logo square, which becomes a window into the world ("Through the Square"). Scrolling then:

1. flies over coast, mountains, lowlands and city while a blue scan line sweeps the land (frames 000 to 036)
2. visits the seven business objects one at a time inside a blue frame (frames 037 to 082)
3. shows the technology and data core with blue links growing out to the other six (frames 083 to 088)
4. shows the whole group from one side and pans right (frames 089 to 096)
5. shrinks the window back into the logo and returns to the light page (frames 096 to 100)

"Frame N" everywhere in these files means the scroll position through the scene in percent, 0 to 100. It is a unit for these documents only: the page shows no frame number and no progress indicator.

## Files

| File | Read it for |
|---|---|
| `01-MAP.md` | World coordinates, terrain zones, where everything stands |
| `02-SCROLL-TIMELINE.md` | What happens at which frame |
| `03-CAMERA.md` | Flight path, the seven stops, the closing move |
| `04-SCENE-RENDERING.md` | Point types, colours, brightness levels, scan line, sea, fades |
| `05-OBJECTS.md` | What each business object and the city are made of |
| `06-PAGE-SHELL.md` | The window, the header, the text chapters, what follows the scene, fallbacks |
| `scene-config.json` | The same key numbers, machine-readable, generated from the source |
| `source/world.js` | The world engine: `createWorld(THREE, opts)`. The ground truth |
| `source/page.js` | The page script that drives scroll, the window and the text |
| `source/prototype.html` | The complete working page in one file |
| `tools/render-frames.js` | Renders the scene at given frame numbers without a browser |
| `reference-renders/` | The scene at 19 frame numbers, plus a contact sheet |

`source/`, `tools/` and `reference-renders/` are delivered in `rekanmu-home-scene.zip`. If they are missing from this folder, ask the design owner for the zip and unpack it here.

If a number in a `.md` file and the source disagree, the source wins. Tell the design owner.

## How to run it

- Open `source/prototype.html` in a browser. It loads three.js r128 from cdnjs and needs nothing else.
- To check frames without a browser: `npm i three@0.128 gl pngjs`, then `xvfb-run -a node tools/render-frames.js 2 39 90`.

## How to replicate it in the real build

1. Keep `world.js` as one module. Its only interface is `createWorld(THREE, opts)`, which returns `{ scene, camera, update, holds, sites, count }`.
2. Call `update(p, time, pointerX, pointerY, portrait, width, height, windowOffset)` once per animation frame, then render. `p` is the timeline position from `coreP(scroll)` in `02-SCROLL-TIMELINE.md`.
3. Rebuild the page shell (`06-PAGE-SHELL.md`) as components. The shell owns scroll, the window clip and the text. The world owns everything 3D.
4. Verify against `reference-renders/` at the same frame numbers.

## Known limits

- **Start-up cost.** The world is generated in the browser at load: about 670,000 points on desktop, taking roughly 5 seconds of main-thread time in a headless test. For production, generate the point data at build time or in a worker.
- **Not measured on real devices.** Frame rate and memory on phones are untested.
- **The closing view at 1.5x zoom does not hold all seven objects at once.** The pan reveals them in turn. This is as requested.
- **One small step in the scan line near frame 010,** where the flight path turns inland.
- **Client strip uses names as text.** The approved logo files are in the Drive folder `partners-logo-transparent/`.

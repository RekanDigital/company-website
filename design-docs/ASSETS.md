# ASSETS.md — what is in `assets/`, and what is missing


The point-world imagery is generated from `prototypes/home-scene/source/world.js`; the light-palette stills were rendered from it with `tools/render-light.js`. The About page has one owner-approved photography exception, scoped to its team-photo slideshow. Do not use photography to replace point-world imagery elsewhere. If a world image needs a different crop, angle or palette, render it again from the world rather than editing it.


## Logo


| File | Notes |
|---|---|
| `assets/logo/logo-rekanmu.png` | The RekanMU mark: a white R on a blue square. Used in the header at 32 px and as the square that opens Home. The footer carries the name in type, not the mark. Ask the owner for a vector version before launch. |


## Renders


| File | Size | Weight | What it shows | Used on |
|---|---|---|---|---|
| `biz-hero-states.jpg` | 2880 x 600 | 160 KB | Three captures of the Businesses hero side by side | Businesses mockup only. Annotation. |
| `biz-hero-world.jpg` | 1440 x 901 | 123 KB | Capture of the Businesses hero with the world formed | Businesses mockup only. The live hero replaces it. |
| `horizon.jpg` | 1900 x 172 | 69 KB | Horizon strip, light palette | First footer. Not on any final page. |
| `plan-map.jpg` | 1376 x 928 | 296 KB | Top-down plan of the world, light palette | Earlier Businesses mockup. Not on any final page. Kept as reference for where each business sits. |
| `scene-city.jpg` | 1280 x 720 | 293 KB | The city, dark palette | Menu: Contact |
| `scene-closing.jpg` | 1280 x 720 | 222 KB | The whole world with links, dark palette | Closing card background; menu default and Businesses entry |
| `scene-coast.jpg` | 1280 x 720 | 245 KB | The coast, dark palette | Menu: Home |
| `scene-dark.jpg` | 1280 x 720 | 135 KB | Technology stop with the blue frame, dark palette | Home mockup, stands in for the live scene |
| `scene-data.jpg` | 1280 x 720 | 162 KB | The data halls, dark palette. Still shows the blue frame. | Menu: Products & Services. Re-render without the frame. |
| `scene-highlands.jpg` | 1280 x 720 | 111 KB | The highlands, dark palette | Menu: About |
| `scenes-businesses.jpg` | 1280 x 5760 | 1050 KB | Eight dark views stacked: closing, then the seven stops | A rejected Businesses option. Useful as reference stills of every stop. |
| `specimen-tech.jpg` | 900 x 1100 | 176 KB | Technology object, tall crop, light palette | Business detail hero (Technology). The other six need the same crop rendered. |
| `specimens.jpg` | 4480 x 640 | 731 KB | Seven business objects in one strip, light palette, 640 px tiles. Tile order: 0 Trading, 1 Technology, 2 Data, 3 Fisheries, 4 Health, 5 Agriculture, 6 Food & Beverage | Businesses plates; Business detail capabilities and Next row |
| `world-built.jpg` | 1200 x 512 | 175 KB | The whole world with links, light palette, wide | About mockup/reference only; replaced in the live About page by the photo slideshow |


## Approved About photography

These four owner-approved PNGs replace the old world band in the live About page. They are the only photographic use; keep them scoped to this slideshow. Each source image is 2732 x 1536. Desktop uses scroll-driven cross-fades where supported and motion is allowed; tablet/mobile, reduced motion, and unsupported browsers show all four in a static vertical sequence. `next/image` optimizes delivery.

| File | Source size | What it shows | Used on |
|---|---:|---|---|
| `about-slide-1.png` | 3.4 MB | The RekanMU team around a conference table | About slideshow |
| `about-slide-2.png` | 4.0 MB | RekanMU team outdoors | About slideshow |
| `about-slide-3.png` | 4.2 MB | Team beside information about Indonesian seaweed | About slideshow |
| `about-slide-4.png` | 3.9 MB | A large RekanMU team gathering indoors | About slideshow |

The render files above are JPEG stills used in mockups and as fallbacks where noted. For the build:


- Render the light-palette objects on a transparent or exact `#F6F8FA` ground and place them with `mix-blend-mode: multiply`.
- Fade the edges with a mask, never a hard crop.
- Each business page needs its own tall object crop like `specimen-tech.jpg`. Only Technology exists.
- The menu needs five dark views without the blue frame.
- Reference renders of the Home scene at nineteen timeline positions are in `prototypes/home-scene/reference-renders/`.


## Point data


The live Businesses hero draws these directly.


| File | Points | Business |
|---|---|---|
| `site-1-tech.b64` | 7,938 | Technology & Digitalization |
| `site-2-data.b64` | 12,880 | Data & Business Intelligence |
| `site-3-trading.b64` | 24,874 | General Trading & Supply Chain |
| `site-4-fisheries.b64` | 23,212 | Fisheries, Seaweed & Blue Economy |
| `site-5-health.b64` | 20,036 | Health & Bioscience |
| `site-6-agri.b64` | 6,797 | Agriculture & Green Economy |
| `site-7-fnb.b64` | 12,303 | Food & Beverage |


Total: 108,040 points.


Format: base64 of little-endian signed 16-bit integers, four per point: `x, y, z, flag`.


- `x, y, z` are tenths of a world unit, **relative to the business's own position**. Divide by 10, then add the business position from `tokens/tokens.json` (`world.x`, `world.z`) to place it in the world. `y` is height.
- `flag` is 1 for an edge point (drawn blue, drawn last) and 0 for a fill point (drawn in ink).
- Exported from the world by `tools/export-site.js` in this package (`node export-site.js 1` to `7`). If the world changes, export again.
- For production, ship one binary file instead of base64.


The ground under the businesses is not in these files. The hero generates it: a flat grid of points every 26 units from x -760 to 640 and z -330 to 500.


## Icons


| File | Notes |
|---|---|
| `assets/icons/instagram.svg`, `linkedin.svg`, `whatsapp.svg` | Simple single-path brand glyphs, 24 px box, `fill: currentColor`. Placeholders until the owner names the real platforms. TECH-STACK.md specifies Lucide for general interface icons; these three are brand marks and stay as custom SVG. |


The menu icon and the link arrow are drawn inline in the markup. See `components/component-sheet.html`.


## Fonts


Geist (400, 500, 600) and Geist Mono (400, 500). Open licence. Not included here: install through `next/font` or the `geist` package and self-host, as TECH-STACK.md requires.


## Remaining asset work


| What | Where it is or who has it |
|---|---|
| Partner logos, in one grey | `resources/assets/partners-logo-transparent/` in the Drive folder. Convert to a single colour `#757D88`. |
| Tall object renders for six businesses | Render from the world. |
| Five menu views without the blue frame | Render from the world. |
| Vector logo | Owner. |
| Real social links | Optional until supplied. The social column remains hidden under the integration lock. |
| Open Graph image and favicon set | Not designed. The logo square on `#F6F8FA` is the obvious starting point. |
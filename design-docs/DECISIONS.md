# DECISIONS.md — what is locked, what was rejected, what is open


Three lists. The first two are closed: do not reopen them during the build. The third needs an answer from the project owner or the designer; each item has a default so the build is never blocked.


---


## 1. Locked


| Area | Decision |
|---|---|
| Home concept | A scroll-driven flight through a dark world of points. Opens and closes with Through the Square: the logo square is a window that grows to full screen, and at the end the world shrinks back into the logo. |
| Home scene | Map, areas, buildings, camera, timeline and brightness are final. Dynamic camera with shots from different positions, not linear pans. |
| Blue frame | Only during the business stops: in from frame 037, out at frame 082. It carries a small label on its top left corner with the business number and name. |
| Scan line | Thin, from the start of the flight across the city to frame 035, gone at 036. |
| Home closing view | From frame 089: starts at 1.5 times zoom, pans right from frame 090 to the end. |
| Home after the scene | Products & Services, then partners, then the closing card, then the footer. Products & Services is a normal section after the scene, not a stop inside it. |
| Products & Services on Home | Pinned section; the row slides sideways with scroll. Opening panel one viewport wide; five stream panels showing a large number and the stream name; description opens when pointed at. |
| Partners on Home | One running line with all eleven approved logos, no separators, fading at both ends. The later owner-directed full-color and no-pointer-effect refinement below supersedes the original grey treatment. |
| Inner pages | Light. The world is present as objects and stills. Through the Square is not repeated on them. |
| Typeface | Geist and Geist Mono only. |
| Buttons | Fully round pill; ink cursor-origin fill on light surfaces and white fill on dark surfaces. Secondary actions are text links. |
| Tags | Brackets, mono. |
| Progress | None, anywhere. |
| Status strip | None. The strip with a chapter name and a clock was removed. |
| Home prototype | One file holds the scene, the approved shell and the approved sections after the scene. The world script is unchanged from the locked version. |
| Eyebrows | None, anywhere. |
| Point type | Designated display treatments use proportional point geometry at every viewport: pitch `0.055em`, radius `max(0.5px, 0.009em)`, edge `max(0.72px, 0.014em)`. No 100 px cutoff. |
| Footer | Full-width, seamless surface with no frame; four columns in order: Stay Connected, Quick Links, Contact Us, Follow Us, reflowing to two columns on tablet and one on mobile. The point field scales with the oversized bottom RekanMU wordmark. Its blue spotlight follows the cursor horizontally, stays anchored to the wordmark vertically, and eases smoothly. Email and phone are stacked directly; company details remain a separate block. Social profiles use icon-only links. |
| Closing card | Dark rounded card with a point-type title that inverts against the image, dimmed only behind the text. On Home, Businesses and About only. |
| Desktop header | Transparent sticky header; logo left, About, Businesses and Products & Services with EN/ID on the right. Compact 10 px vertical padding; nav text turns blue and lifts 3 px on hover or focus, matching the footer social icons. The current page keeps a blue underline. |
| Tablet/mobile menu | Full-screen dark world; each entry turns the view to that page's place. |
| Businesses page | Existing layout kept: two groups of business plates with descriptions and `View business`. |
| Businesses hero | Live: words, world, one business. No list of names. No descriptions. World appears when the pointer enters the picture. Names appear only for the business pointed at. All points drawn at exact positions. |
| Business detail | Hero with the object in front of the name, overview, capabilities, experience, inquiry, next business, footer. |
| Contact | No form. Contact buttons open email. Phone number to use: 0899 9933 349. |
| Content | Blocks without approved content are omitted. Food & Beverage follows the Drive document. |


## 2. Rejected. Do not reintroduce.


| What | Why it was rejected |
|---|---|
| Right rail, frame readout, progress dots, progress bar, corner ring, rotating square, status strip | Disturbs the view while reading the page. |
| Eyebrow labels and chapter counters such as `001 / 007` | Owner decision. |
| Arrow inside a circle on buttons; circles around social icons | Owner decision; too generic. |
| A second typeface, including any dot-matrix face | None fitted. |
| Square or lightly rounded buttons | Round chosen. |
| Blue point texture or gradient behind text | Made the text hard to read. |
| Cards, shadows, glass, glow, neon | Outside the visual language. |
| Dark full-screen world on inner pages | Would repeat Home and the menu. |
| Menu as a plain list, an index with preview, or a network diagram | Too flat. |
| Businesses page as a plan-map instrument, as sliding panels, or as a dark world selector | The existing page was preferred; only its hero changed. |
| Businesses hero as a still image, a row of seven objects, a square window, objects inside the headline, or a giant numeral | Not expressive or interactive enough. |
| Businesses hero with a list of names and descriptions | The hero shows only the picture. |
| Businesses hero drawn with a sample of the points and spring easing | Buildings looked blurred and undefined. |
| Business detail as an "object tour" with labelled parts | The simpler layout was preferred. |
| Home Products & Services as rows that open, running lines of names, one large number, columns, a poster, a contents list, the world behind the title, or a second dark card | The sliding panels were chosen. |
| Partners as a wall of cells, a rolling single name, a network, or large names with blue squares | The quiet running line was chosen; its original grey treatment was later superseded by the owner direction below. |
| A "core sample" 3D block in the Home positioning chapter | Removed on request. |
| Linear camera pans in the Home scene | Felt lifeless. |
| Wireframe boxes for the city | Must read as real buildings. |


## 3. Integration lock — 6 October 2026


The project owner accepted the approved design as the implementation baseline. The former open defaults are resolved as follows. These decisions are build instructions unless the project owner explicitly changes them later.


### Owner-side decisions


| # | Locked decision |
|---|---|
| O1 | No progress indicator. The designer's removal is accepted. |
| O2 | Replace the unapproved footer placeholder "Have something to explore?" with the already approved content heading **"Start a Conversation"** / **"Mulai Percakapan"**. |
| O3 | Hide the social column until real social-platform URLs are supplied. Do not ship placeholder social links. |
| O4 | Compute the five Products & Services stream counts from catalogue data at build time. Do not hard-code 13, 9, 16, 6, 10. |
| O5 | Keep the Home scene business-stop order exactly as designed: Trading, Technology, Data, Fisheries, Health, Agriculture, Food & Beverage. The different grouping/order used elsewhere is intentional. |
| O6 | On About → At a Glance, show **Focus without a numeric figure**. Do not pair it with 2024 and do not invent a replacement count. |
| O7 | Use all eleven approved partner-logo files. Names are fallback text only. |
| O8 | Use **Three.js on Home only** for the approved Home point-world scene. Use **plain WebGL** for the Businesses hero and the approved business overview/detail point viewers. Preserve the matching specimen stills as their fallback. This is reflected in `TECH-STACK.md`. |


### Designer-side defaults accepted for build


| # | Locked implementation decision |
|---|---|
| D1 | Use the responsive defaults in `design.md` section 8 for phone and tablet layouts. Validate and refine them during implementation without changing the design language. |
| D2 | Keep the Businesses hero 8-second idle delay. |
| D3 | Menu entries remain solid; do not enlarge them solely to restore point type. |
| D4 | Re-render the five menu place views without the blue frame before final QA. |
| D5 | Catalogue rows render at full strength. Do not add the optional 36% reading-state treatment. |
| D6 | Build Products & Services and About as mocked, using approved content from the content documents. |
| D7 | Stack the Home Products & Services panels vertically on narrow screens. |


### Owner-approved footer lock — 7 October 2026

The project owner reviewed and accepted the implemented footer. This later lock supersedes the earlier footer layout and interaction details in the design handoff and its prototypes. Preserve the four-column content order, seamless background, proportional point field, cursor-follow behavior anchored to the RekanMU wordmark, directly stacked email and phone, company-details separation, and supplied social links across all pages and locales. Do not change the footer without a new owner decision.


### Owner-approved header and tablet/mobile menu lock — 7 October 2026

The project owner reviewed and locked the current shared navigation. This owner lock supersedes the earlier header, menu, and language-switch descriptions above. Preserve the thin transparent sticky desktop header with its logo, About / Businesses / Products & Services links, and footer-like hover motion; preserve the compact 42 × 22 px black language pill with white thumb and in-pill EN/ID label (44 × 44 px hit area). On tablet and mobile, preserve the right-side full-screen menu, its separate top-layer hamburger-to-X control, current link order, image assignments and crops, smooth slide motion, and the in-menu language toggle without labels. Do not change these visuals or interactions without a new owner decision.

### Owner-approved Home desktop hero lock — 7 October 2026

At viewport widths of 901 px and wider, keep the Home hero headline at `min(9.2vw, 13.4svh)` and size its column to `calc(68vw - min(20svh, 15vw) - var(--gutter))`. This column ends at the left edge of the square, whose center remains at `68vw` and whose side is `min(40svh, 30vw)`. Use `clamp(24px, 5svh, 56px)` section vertical padding. The heading retains Geist 500, `0.9` line height and `-0.05em` tracking; its CTA gap is 32 px and CTA minimum height is 56 px.

At 1440 × 900, the expected heading is 120.6 px with a 751.2 px column, five lines, and the CTA inside the viewport. This override is desktop-only; tablet/mobile type and square geometry remain unchanged. The point grid scales from each text element using the proportional values in the Point type lock above.

### Owner-approved Home tablet/mobile CTA placement — 7 October 2026

At portrait/tablet-mobile scene sizes, keep the Home CTA below the initial scene square with a 24 px gap, and keep it vertically anchored as the opening scene collapses. Do not move it upward over the point field. Preserve the square geometry, hero type, and desktop CTA behavior.

### Owner-approved responsive Home focus-frame refinement — 7 October 2026

Keep the business focus frame clear of chapter text and fully inside mobile/tablet viewports. Tall portrait mobile/tablet viewports use 0.90 of the prior 74% width ratio, about 67% of viewport width, keeping the frame label at least 48 px below the active subtitle at 390 × 844 and 768 × 1024. Compact landscape viewports up to 1280 × 900 with an aspect ratio from 0.8 to 1.6 scale the normal frame ratio by 0.60 (about 44% of viewport height), with at least 40 px between the frame and chapter text. Preserve wide desktop framing, camera positions, map, timeline and chapter order.

### Owner-approved responsive Home focus-frame labels — 7 October 2026

Show the numbered business label above the blue frame on desktop, tablet and mobile while the frame faces the camera. Preserve the existing label style, projected position, chapter fade and exit behavior.

### Owner-approved continuous Home hero transition — 7 October 2026

Keep the foreground and behind-the-world hero copies in the same arrangement as the opening window turns the screen dark: position, width, type scale, line breaks and proportional point grid stay matched. Keep the hero CTA anchored in its opening position until the hero fades.

### Owner-approved Home Products & Services lock — 7 October 2026

Preserve the Home section's current responsive layout. Above 820 px, the opening panel is one viewport wide and the five catalogue panels move linearly with scroll when scroll-driven animation is supported and motion is allowed. At 1440 × 900, the section title is about 100 px (83% of the 120.6 px hero), with counts at 3.75×, stream names at 0.568×, intro lead at 0.243× and descriptions at `max(16px, 0.18×)` the section title. Keep the number/name group within panel bounds and its gap between 20 and 32 px; counts are derived from approved catalogue data.

At 820 px and below, keep the five category panels stacked, each sized to its content, with counts in normal flow, descriptions open, and the owner-approved 28–36 px category title scale and 16–20 px / 8–12 px vertical gaps. Do not restore the pinned row or introduce unused panel height, overlap or overflow. Reduced-motion and unsupported-browser layouts remain static with content visible. Do not change this section without a new owner decision.

### Owner-directed Home Clients & Partners refinement — 7 October 2026

The owner directed that all eleven approved partner PNGs appear in their supplied colors, larger and more densely spaced, and that pointer movement have no effect on either the logos or the marquee. This supersedes the earlier grey-logo and hover-pause/hover-color treatment. Keep the current dotted heading legible at mobile and tablet sizes using the local point-grid floor documented in `DESIGN-SYSTEM.md` 1.3. The section is still in refinement and has not been declared finally locked; preserve this direction and the current implementation during Sprint 3, and wait for owner direction before changing it.

### Remaining implementation work, not design decisions


- Validate layouts with the Bahasa Indonesia copy and implement language routing/state.
- Instantiate the shared business-detail template for all seven business routes.
- Populate all five Products & Services streams from the approved catalogue content.
- Produce the six remaining tall business-object renders.
- Re-render the five menu views without the blue frame.
- Perform real-device performance testing of the Home scene, Businesses hero, and business-page point viewers.
- A dedicated 404 design and route-transition system remain outside the approved design; do not invent them as signature experiences during the initial build.

### Owner-approved global CTA Origin Button interaction — 7 October 2026

Use the Origin Button cursor-origin circle fill for every CTA across pages, locales, and viewport sizes. Preserve each CTA's Next.js link semantics, existing label and destination, and site pill geometry and size variants. Use an ink outline and fill on light surfaces, and a white outline and fill on dark surfaces; switch the label to a contrasting color while filled. Pointer hover/press starts the 0.5 s fill at the pointer; keyboard focus starts it at the center. Keep visible focus styling and disable scale motion when reduced motion is requested. All CTA links must use the shared `ButtonLink` / `OriginButton` implementation.

### Owner-approved business point views and About slideshow — 8 October 2026

The approved Sprint 3 integration adds these scoped visual behaviors and supersedes the earlier static-only page descriptions and About world-band mockup:

- Businesses overview plates use a fixed, non-rotating point view for each business. On pointer-capable devices with motion enabled, the view scales to 1.12 on hover. Matching tiles from `specimens.jpg` remain the fallback when WebGL cannot render.
- Business-detail heroes use a rotating point view with a visible Pause/Resume control while rotation is available. Rotation pauses on pointer hover, keyboard focus, and while the view is off screen; reduced motion stops rotation and hides the toggle. The Next-business point view remains fixed.
- About replaces the mockup's world band with four approved team photographs. On desktop, scroll-driven cross-fades run when CSS scroll timelines are supported and motion is allowed. Tablet/mobile, reduced-motion, and unsupported-browser layouts show all four images in a static vertical sequence. Preserve the supplied bilingual alt text.
- Keep this photography scoped to About. The point-world system remains the imagery direction for other pages, and Three.js remains exclusive to Home.

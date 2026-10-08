# 06 Page shell

Source: `source/page.js` and the markup and styles in `source/prototype.html`.

The shell owns scroll, the window, the text and the header. The world (`world.js`) owns everything drawn in 3D.

The shell has **no** rail, no frame readout, no progress indicator, no chapter counters and no labels above headings. Do not add any. The one small label it does have is the label on the blue frame, described below.

## Layers, back to front

1. Light page ground `#F6F8FA`.
2. Hero headline copy that sits behind the world once the window is full, so terrain can pass in front of it.
3. Dark world background `#090C11`, clipped to the window.
4. The WebGL canvas (transparent clear), clipped to the same window.
5. Logo square and window outline.
6. Header, text chapters, the hero button and the label on the blue frame.

The header and the hero headline use `mix-blend-mode: difference`, so they read dark on the light page and light over the dark world, switching exactly at the window edge. Chapters after the hero are only ever shown over the dark world and are plain light text.

## Through the Square

- **At rest (frame 000):** the logo square sits right of centre: centre at 68% of the width and 63% of the height, side `min(40% of height, 30% of width)`. In portrait: centre at 50% and 64%, side `min(56% of width, 34% of height)`.
- **Opening (frames 000 to 005):** the square grows until it covers the screen. The logo image fades out after 2 to 2.9 seconds or as soon as the user scrolls. The outline fades as the window fills.
- **Flight (frames 005 to 096.5):** the window is the whole screen.
- **Exit (frames 096.5 to 100):** the window shrinks onto the logo in the header. The logo image fades back in at the end.
- The window is a CSS `clip-path: inset(...)` applied to the world background and the canvas together.

## Header

Logo and "RekanMU" on the left. `EN / ID` and a `Menu` button on the right. Nothing else. 20 px above and below, page gutter at the sides. In this prototype the `Menu` button does nothing; the menu itself is specified in `design.md` at the top of the handoff package.

## Text chapters

One chapter at a time.

| Chapter | Frames | Where | Content |
|---|---|---|---|
| Hero | 000 to 012 | Top left, in the space left of the square | "Beyond Technology." solid and "Building Strategic Industries." in point type; the button `About RekanMU` under it |
| Positioning | 017 to 023 | Bottom left | One paragraph, set as a lead |
| Seven businesses | 038 to 081 | Bottom left | The business name, large, and its one-line summary. The name links to the business page |
| From Intelligence to Execution | 084 to 087 | Bottom left | Heading and paragraph |
| From Source to Market | 089 to 096 | Bottom left | Heading, paragraph and the button `Explore Our Businesses` |

- Copy comes from HOME.md. Do not rewrite it here.
- Business order, names and summaries follow HOME.md: General Trading & Supply Chain, Technology & Digitalization, Data & Business Intelligence, Fisheries, Seaweed & Blue Economy, Health & Bioscience, Agriculture & Green Economy, Food & Beverage.
- Chapter block: 40% of the width up to 580 px, anchored `clamp(40px, 8vh, 84px)` above the bottom edge. The business name is `clamp(38px, min(6.1vw, 11vh), 92px)`. These sizes keep the longest name clear of the blue frame, whose left edge sits at about 44% of the width.
- **Home desktop hero — owner lock, 7 October 2026; viewport width at least 901 px.** The square center is `68vw` and its side is `min(40svh, 30vw)`. Headline width is `calc(68vw - min(20svh, 15vw) - var(--gutter))`, which is the square's left edge minus the page gutter. Font size is `min(9.2vw, 13.4svh)`; section vertical padding is `clamp(24px, 5svh, 56px)`. It keeps Geist 500, line height `0.9`, tracking `-0.05em`, a 32 px CTA gap and a 56 px minimum CTA height. At 1440 × 900: 120.6 px type, 751.2 px text width, five headline lines, CTA inside the viewport. At 900 px and below, this desktop override does not apply; keep the locked tablet/mobile layout.
- **Hero button.** It is not inside the knock-out headline, so its blue hover sweep stays blue. It switches to a light outline as soon as the window passes over it.
- As the window opens, the behind-the-world hero copy keeps the same position, width, type scale, line breaks and point grid as the foreground hero. Keep the hero button anchored in the same composition until it fades.
- In portrait and under 900 px wide, every chapter moves to the top and spans the width. The owner-locked responsive layouts remain authoritative below the desktop breakpoint.

## Label on the blue frame

During each business stop a small label sits just above the top left corner of the blue frame.

- Text: the business number in visiting order and the business name in capitals, two spaces apart. For example `004  FISHERIES, SEAWEED & BLUE ECONOMY`.
- Style: Geist Mono, 500, 12 px, tracking 0.04em, colour `#6FA8E8`, one line.
- Position: the world reports the frame's top left corner each frame as `label.x` and `label.y` (fractions of the stage). The label is placed there, 20 px higher.
- It fades with the chapter text, using the same opacity.
- It is shown on desktop, tablet and mobile while the frame faces the camera (`label.front`), and never during the exit. This responsive visibility follows the owner-approved 7 October 2026 refinement.
- It is decorative and hidden from assistive technology: the business name is already the chapter heading.

## After the sequence

Normal page sections, in this order. They are not part of the scroll scene and they are all in `source/prototype.html`.

1. **Products & Services:** a pinned section whose row of panels moves sideways with scroll. An opening panel one viewport wide, then five stream panels.
2. **Partners:** "Built Through Collaboration" and one grey running line of partner names, fading at both ends.
3. **Closing card:** "Start a Conversation", dark, rounded.
4. **Footer.**

Their behaviour and values are in `design.md` and `design-system.md` at the top of the handoff package.

## Fallbacks

- **Reduced motion, no WebGL, or three.js failing to load:** the page switches to a static layout. The sequence collapses to normal height, the header returns to normal flow, and every chapter is shown as ordinary stacked text in ink on the light ground.
- **WebGL context lost** while running: same static layout.
- **Small or low-memory devices** (`min(width, height) < 700` or `deviceMemory <= 4`): the world is generated at a coarser spacing and a lower pixel ratio. The exact options are in `source/page.js`.

## Scroll smoothing

The page does not hijack scroll. It reads native scroll and eases the scene toward it: `Ps += (P - Ps) * 0.085` per animation frame. Pointer position adds a small parallax, eased at 0.06.

# design-system.md — RekanMU website design system

Status: approved for build. Values follow the approved mockups and later owner-approved locks in `DECISIONS.md`; a lock takes precedence where it replaces a baseline.

- The shared stylesheet is `tokens/site.css`. Every rule in it is used by at least one page. It is the baseline source for mockup values; later owner locks in `DECISIONS.md` supersede stated values.
- The menu overlay keeps its own rules in `pages/menu.html`. The scroll-pinned row and the two live scenes keep theirs in `prototypes/`.
- Tokens as variables: `tokens/tokens.css` and `tokens/tokens.json`.
- Every component drawn on one page: `components/component-sheet.html` and `.jpg`.
- Page-level use: `DESIGN.md`.

Sizes below are given as written in the stylesheet, with the result at a 1440 px wide desktop in brackets.

---

## 1. Foundations

### 1.1 Colour

| Token | Value | Use |
|---|---|---|
| `ground` | `#F6F8FA` | Page background on every light page. Text on dark. |
| `ink` | `#0E1116` | Text, rules that open a section, points of the world on light pages. |
| `blue` | `#3179CB` | The thing pointed at, pressed or selected. Edge points of objects. Links between businesses. The logo square. |
| `blue-deep` | `#1F5FA8` | Blue text on the light ground (link hover, selected tag, selected row name). Use this, not `blue`, for text. |
| `mute` | `#5B6470` | Body text, labels, tags at rest. |
| `hairline` | `#DDE2E8` | Rules between rows, panel dividers, quiet borders. |
| `night` | `#090C11` | The dark world: Home scene, menu, closing card. |
| `sky` | `#7FB2EE` | Blue text on `night`, when blue text is needed there. |
| `partner-grey` | `#757D88` | Legacy neutral partner token; the Home logo line now uses the supplied full-color PNGs. |
| `card-border` | `#E4E8ED` | Light-card outline token; not used by the owner-approved footer. |
| `white` | `#FFFFFF` | CTA label on black fill. The large name in the footer. |

Proportion on a light page: roughly 90% `ground`, 8% `ink`, under 2% `blue`. Blue never fills a section. Dark appears only in the Home scene, the menu and the closing card.

Blue on the light ground is not used for body text. `blue-deep` on `ground` passes contrast for text; `blue` on `ground` does not at small sizes.

### 1.2 Typography

Families: **Geist** (400, 500, 600) and **Geist Mono** (400, 500). No other typeface. In Next.js use the `geist` package or `next/font`.

| Role | Class | Size | Line height | Tracking | Weight |
|---|---|---|---|---|---|
| Display | `.disp` | `clamp(52px, 11vw, 164px)` [158] | 0.9 | -0.05em | 500 |
| Section display | `.disp2` | `clamp(40px, 7.4vw, 112px)` [107] | 0.94 | -0.045em | 500 |
| Heading | `.h2` | `clamp(30px, 4.6vw, 68px)` [66] | 1 | -0.035em | 500 |
| Small heading | `.h3` | `clamp(22px, 2.4vw, 36px)` [35] | 1.08 | -0.025em | 500 |
| Lead | `.lead` | `clamp(19px, 1.8vw, 27px)` [26] | 1.3 | -0.012em | 400 |
| Body | `.body` | `clamp(16px, 1.25vw, 19px)` [18], colour `mute` | 1.5 | 0 | 400 |
| Label | `.mono` | 12 px, uppercase, Geist Mono | normal | 0.04em | 400 |
| Figure | `.num` | `clamp(88px, 17vw, 260px)` [245] | 0.82 | -0.06em | 500 |
| Statement | `.disp2` with a smaller inline size, about 63 to 66 px | 1 | | 500 |

#### Home desktop hero — owner lock, 7 October 2026

This override applies at viewport widths of **901 px and wider**. The desktop square stays centered at `68vw`, with a side of `min(40svh, 30vw)`. The headline column ends at the square's left edge, less the page gutter:

```css
.foundationHero.homeHero { padding-block: clamp(24px, 5svh, 56px); }
.foundationHero.homeHero h1 {
  width: calc(68vw - min(20svh, 15vw) - var(--gutter));
  font-size: min(9.2vw, 13.4svh);
}
```

The heading keeps the shared display metrics: Geist, 500, `0.9` line height and `-0.05em` tracking. Keep the CTA 32 px below it and at least 56 px high. At **1440 × 900**, the expected font size is **120.6 px**, the text column is **751.2 px**, the headline occupies five lines, and the CTA remains inside the viewport. This is a desktop-only override; the locked tablet and mobile layouts are unchanged.

#### Home Products & Services desktop title — owner lock, 7 October 2026

The opening title is 83% of the Home desktop hero title, or approximately **100 px** at **1440 × 900**. Keep the rest of the desktop type proportional to this title: intro lead `0.243×`, stream count `3.75×`, stream name `0.568×`, and description `max(16px, 0.18×)`. Keep the count-to-copy gap between 20 and 32 px. The section title remains smaller than the hero. This rule applies above the locked tablet breakpoint; tablet and mobile sizing remain unchanged.

#### Other pages — desktop display hierarchy, owner-approved 7 October 2026

At **901 px and wider**, About, Products & Services, Businesses, and business-detail hero titles use the Home hero formula `min(9.2vw, 13.4svh)`. At **821 px and wider**, their primary section titles use the Home Products & Services title size: `83%` of the hero formula from 901 px upward, and `calc(var(--fs-display) * 0.83)` from 821–900 px. This gives a **100.1 px** primary section title at **1440 × 900**. Preserve the compact capability and inquiry headings within business-detail pages. Below **821 px**, keep existing non-Home type sizes; do not alter the locked Home, tablet, or mobile configuration.

#### Home Products & Services tablet/mobile categories — owner-approved refinement, 7 October 2026

Below **821 px**, keep the five category panels stacked with descriptions open. Put each count in normal flow above its category name; size the name with `clamp(28px, 4.5vw, 36px)` and the count at **3.75×** that size. Use a **16–20 px** count-to-name gap, an **8–12 px** name-to-description gap, and `clamp(24px, 5vw, 40px)` panel padding. Let each panel height follow its content; descriptions stay at least 16 px. This refinement applies to the category panels only; the opening panel and desktop layout remain unchanged.

At **1440 × 900**, the expected section title is **100.1 px**, the stream count about **375 px**, the stream name about **56.9 px**, the intro lead about **24.3 px**, and the description **18 px**. Counts come from the approved catalogue data at build time; do not hard-code them. At widths above 820 px, the row is pinned only when scroll-driven animation is supported and reduced motion is not requested. Otherwise the panels remain in normal vertical flow with descriptions visible.

Rules:

- Sentence case for body. Title case for headings, as in the content documents.
- Headings are split in two tones: the first part solid ink, the second part in points (display roles) or simply solid (smaller roles).
- Never set body text below 16 px. Labels are 12 px mono and are never used for sentences that carry content.
- No eyebrow labels above headings.

### 1.3 Point type

Point type is a selected display treatment, not a minimum-size effect. The grid scales from the rendered font size at every viewport:

```css
.dots {
  --dot-pitch: 0.055em;
  --dot-radius: max(0.5px, 0.009em);
  --dot-edge: max(0.72px, 0.014em);
  color: transparent;
  background-image: radial-gradient(circle at center, #0E1116 0 var(--dot-radius), transparent var(--dot-edge));
  background-size: var(--dot-pitch) var(--dot-pitch);
  -webkit-background-clip: text;
  background-clip: text;
}
```

The `em` values resolve from that text element's own font size. At the 120.6 px Home desktop reference size, pitch is 6.63 px, radius 1.09 px and soft edge 1.69 px. The 0.5 px radius and 0.72 px edge are minimum floors for smaller type.

Apply points only to designated fragments of display treatments: `.disp`, `.disp2` where specified, approved figure or stream numbers, the Home Partners heading fragment, and the closing-card title. Keep the other headline fragment solid. Do not use point type on other `.h2` or `.h3` headings, statements, menu entries, body text, labels or buttons. Menu entries remain solid by owner lock. There is no 100 px cutoff, and point geometry remains proportional on desktop, tablet and mobile. The Home Partners heading has a local visibility floor so its dots remain visible at small rendered sizes: pitch `max(2.4px, 0.055em)`, radius `max(0.4px, 0.009em)`, edge `max(0.6px, 0.014em)`. Keep this exception scoped to that heading.

On desktop at **901 px and wider**, Home catalogue counts and the dotted About figure use a finer proportional grid for numeric legibility: pitch `0.04em`, radius `max(0.35px, 0.0065em)`, edge `max(0.5px, 0.01em)`. Keep the global figure grid on tablet and mobile.

### 1.4 Space and grid

| Token | Value |
|---|---|
| Page gutter `.gut` | `clamp(20px, 3.4vw, 48px)` left and right [48] |
| Section padding `.sec` | `clamp(72px, 12vh, 150px)` top and bottom |
| Two-column split `.split` | `6fr 6fr`, gap `clamp(24px, 5vw, 88px)`, aligned to the bottom |
| List row `.row` | `5fr 7fr`, gap `8px 32px`, padding `22px 0` |
| Collapse to one column | at 820 px and below |

There is no 12-column grid. Layouts are halves, 5/7 and 7/5 splits, and free placement for large objects.

### 1.5 Lines, radii, elevation

- Rule that opens a section or list: 1 px `ink`.
- Rule between rows and panels: 1 px `hairline`.
- Selected row: its rule turns `blue`.
- Radii: buttons 999 px; closing card 36 px. The owner-approved footer has no border or radius.
- No shadows. No gradients as decoration. No blur, glass or glow.

### 1.6 Motion

| Token | Value | Use |
|---|---|---|
| `ease-standard` | `cubic-bezier(.7, 0, .2, 1)` | Almost everything: sweeps, shifts, reveals |
| `ease-out-soft` | `cubic-bezier(.2, .7, .2, 1)` | Things that follow the pointer (footer field, object scale) |
| `ease-fade` | `cubic-bezier(.2, 0, 0, 1)` | Cross-fades of scenes (menu) |
| Fast | 0.25 to 0.35 s | Colour and opacity |
| Medium | 0.45 to 0.6 s | Shifts, sweeps, reveals |
| Slow | 0.7 s | Scene cross-fades, the footer field |

Scroll-driven movement is linear with scroll and has no easing of its own. Respect `prefers-reduced-motion` everywhere.

### 1.7 Imagery: the world

The point world remains the site-wide visual system, in two palettes. About is the sole approved photography exception: a four-image slideshow using supplied RekanMU team photos.

- **Dark palette (Home scene, menu, closing card):** light points on `night`, blue edges.
- **Light palette (business point views):** ink points on `ground`, blue edges, with no visible box. Business overview and detail views use plain WebGL and matching specimen stills when WebGL is unavailable. Raster renders use `mix-blend-mode: multiply` and edge masks rather than hard crops.
- **About photography:** keep the four approved team photos in the About slideshow only; they are separate from the point-world system.
- **The blue frame** is a 2 px `blue` rectangle that holds a business object during the Home business stops. It appears only there.
- Objects never sit in cards or frames on light pages. They stand in the page, and large type may pass behind them.

Files and how they were made: `ASSETS.md`.

### 1.8 Icons

Only three kinds: the two-line menu icon on tablet and mobile, the arrow in text links (inline SVG, 20 by 12, 1.5 px stroke), and social icons (`assets/icons/`, drawn at 22 px in a 44 px target, no circle around them). No icon set, no decorative icons.

---

## 2. Components

### 2.1 Header

Desktop: `logo (32 px) + "RekanMU" (20 px, 500)` left. About, Businesses, Products & Services, then `EN / ID` in mono on the right. The transparent header sticks at the top and uses the page ground color after scrolling. Keep 10 px top and bottom padding and the page gutter. Nav links turn `blue-deep` and lift 3 px over 0.3 s on hover and focus, matching the footer social icons; reduced-motion settings remove the lift. The current page keeps a blue underline.

Tablet and mobile: hide the inline links and language switch and show the menu trigger. Its three-line icon morphs to an X as the menu opens and back on close. All targets remain at least 44 px high.

### 2.2 Menu overlay

See `DESIGN.md` 5.2 and `pages/menu.html`. The full-screen overlay is used on tablet and mobile; desktop navigation stays inline.

- Full-screen `night` layer with the world behind a left-to-right dark gradient (0.94 to 0 opacity across the left 72%) so the entries stay readable.
- Entries: `max(30px, 6.2cqw)` [89], 500, `ground`, solid. Stacked on the left, vertically centred.
- Pointing at an entry: it moves right by 1.6% of the width; the others drop to 40% opacity; the background cross-fades in 0.7 s; the page headline appears bottom right (width 30%, right-aligned).
- Bottom bar: `EN / ID`, email, social icons.

### 2.3 Button

The only pill on the site.

```css
.cta{
  --button-sweep: var(--ink);
  --button-active-foreground: var(--white);
  position: relative; display: inline-flex; align-items: center;
  min-height: 56px; padding: 0 30px;
  border: 1.5px solid currentColor; border-radius: 999px;
  font-size: 18px; font-weight: 500; line-height: 1;
  overflow: hidden; isolation: isolate;
  transition: color .3s .12s, border-color .3s;
}
.originButton__fill{
  position: absolute; z-index: -1; border-radius: 50%;
  background: var(--button-sweep); pointer-events: none;
}
.cta[data-origin-active="true"]{
  color: var(--button-active-foreground);
  border-color: var(--button-sweep);
}
.cta.sm{ min-height: 48px; font-size: 16px; padding: 0 24px; }
```

- At rest: transparent fill with ink `#0E1116` (RGB 14, 17, 22) text and outline on light surfaces, and white text and outline on dark surfaces.
- Pointer hover or press: a circle grows from the pointer position to cover the pill over 0.5 s. It fills with ink on light surfaces and white on dark surfaces; the label switches to the contrasting color. Keyboard focus starts the fill from the pill's center.
- Reduced-motion settings remove the scale animation while preserving the theme-colored focus/hover state.
- On the closing card the button has a white outline and transparent fill at rest, then fills white with a dark label.
- Label only. No arrow or icon; the circle is the button's animated fill, not a separate control.
- One button per section at most. A second action in the same place is a text link.

### 2.4 Text link

`.lk`: 17 px, 500, a 1.5 px underline 6 px below the text, followed by the arrow. Minimum height 48 px. Hover: `blue-deep`. Used for the secondary action beside a button.

### 2.5 Roll link (footer and site map)

The label sits in a 1.3em-high window. On hover it rolls up (0.45 s, `ease-standard`) and the same label in `blue` rolls in from below. In the footer these are 600 weight, `clamp(18px, 1.5vw, 22px)`, and end with a full stop.

### 2.6 Tag

```css
.tag{ font-family: "Geist Mono"; font-size: 12px; letter-spacing: .04em; text-transform: uppercase;
      color: #5B6470; min-height: 32px; white-space: nowrap; }
.tag::before{ content: "["; margin-right: 6px; }
.tag::after { content: "]"; margin-left: 6px; }
.tag.on{ color: #1F5FA8; }
```

Used for the stream bar and sub-group labels on Products & Services. Not used as an eyebrow above headings.

### 2.7 Figure

A very large number (`.num`, or the stream panel number). May be in points. Always paired with a small heading and a line of text that says what the number counts. Never decorative: only numbers that are true and sourced (see `CONTENT-MAP.md`).

### 2.8 Statement

One sentence in large solid text (about 63 to 66 px at desktop), spanning most of the width, with generous space above and below. Used once or twice per page to break the rhythm. Solid ink only.

### 2.9 Ruled list

A list opened by a 1 px ink rule, each row closed by a hairline. Name left (`.h3` or slightly smaller), description right (`.body`). Used for capabilities, the product catalogue, the mission and corporate information.

- Selected or current row: name `blue-deep`, rule `blue`.
- Optional reading state on long catalogues: rows not yet reached at 36% opacity. Only if driven reliably by scroll; never leave a list mostly pale.

### 2.10 Business plate

Used on Businesses. A column: the business object (one tile of `specimens.jpg`, square, multiply-blended), the name (`.h3`), the description (`.body`), and a small button `View business` (`.cta.sm`). Gap 14 px. No border, no background. Plates in a group are different sizes and staggered vertically.

### 2.11 Stream panel

Used in the Home sliding row. See `DESIGN.md` 7.2.

- Padding `clamp(28px, 3.4vw, 48px)`. Divided from its neighbour by a hairline.
- Number: `clamp(210px, 28vw, 400px)` [400], 500, tracking -0.07em, in points, fixed to the top left.
- Name: `clamp(34px, 4.2vw, 62px)` [60], at the bottom.
- Description: hidden at rest; opens under the name (max-height and opacity, 0.55 s). Always open on touch.
- Hover or focus: number becomes solid `blue` and scales to 0.86 from its top-left corner.

### 2.12 Partner line

One line that runs continuously from right to left.

- Use all eleven approved PNG logos from `resources/assets/partners-logo-transparent/` in their supplied colors and source order. Do not turn them grey or add pointer-dependent color, scale or pause states. The repeated second set is decorative and hidden from assistive technology.
- Desktop logo width is `clamp(164px, 17vw, 250px)` with a `clamp(32px, 4vw, 64px)` gap. At tablet/mobile widths, logo width is `clamp(164px, 42vw, 220px)` and the gap is 28 px.
- Preserve each logo's aspect ratio. Some source files contain white background pixels; the implementation blends them against the light ground so they do not appear as white tiles while their artwork stays colored.
- Both ends fade over the outer 12% of the width. The line loops in 46 s, continues while pointed at, and stops under reduced motion.
- The heading is “Built Through Collaboration” / “Dibangun Melalui Kolaborasi”. Its second phrase is point type. Keep the local dot visibility floor in section 1.3 so the phrase remains visibly dotted on mobile and tablet.

### 2.13 Closing card

```css
.endc{
  border-radius: 36px; margin: 0 8px 8px; overflow: hidden;
  min-height: clamp(380px, 40vw, 560px);
  background: #090C11 url(scene-closing.jpg) center 46% / cover no-repeat;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; gap: 26px; padding: 48px 24px; color: #F6F8FA;
}
.endc::before{ /* partial dimming behind the text only */
  content: ""; position: absolute; inset: 0;
  background: radial-gradient(ellipse 50% 66% at 50% 50%, rgba(9,12,17,.6) 0, rgba(9,12,17,.6) 40%, rgba(9,12,17,0) 100%);
}
.endc h2{ font-size: clamp(44px, 8vw, 120px); line-height: .9; letter-spacing: -.05em;
          /* white point type */ mix-blend-mode: difference; }
.endc p { font-size: clamp(17px, 1.5vw, 21px); max-width: 30em; color: #fff; mix-blend-mode: difference; }
```

- Title in white point type with `mix-blend-mode: difference`, so it inverts against whatever part of the image is behind it.
- The image is dimmed only in an ellipse behind the text, not across the card.
- Button has a white outline at rest, then fills white with a dark label.
- Appears on Home, Businesses and About only.

### 2.14 Footer

The owner-approved implementation supersedes the older footer shown in the mockups. One seamless, full-width footer with no border or rounded frame; `min-height: clamp(520px, 52vw, 720px)` on desktop.

- **Point field:** proportional blue points fade from faint at the top to full at the bottom. A brighter elliptical spotlight eases with the cursor horizontally and stays vertically anchored to the RekanMU wordmark. It remains active across the desktop footer; on touch layouts it activates below the Stay Connected CTA. Reduced-motion settings remove the transitions.
- **Four columns**, gap 24 px: Stay Connected (heading, short subtext, existing Contact RekanMU CTA); Quick Links (roll links for Home, About, Businesses, Products & Services); Contact Us (email, phone immediately below it, then company name, location, NIB, and copyright); Follow Us (Instagram, Facebook, LinkedIn, and X icon links, without circular buttons).
- Company details are 14 px `mute`, line height 1.9; the phone remains directly under the email, with a distinct gap before those details.
- **The name:** “RekanMU” at `22.6cqw` of the footer width, 600, tracking -0.06em, white, centered at the bottom and cut by the footer edge. The point scale stays proportional to the wordmark.
- **Responsive layout:** four columns on desktop, two on tablet, one on mobile; keep the same content order and visual treatment at every size.

### 2.15 Names on the world

Used in the Businesses hero. A small label above the object: 15 px, 500, `blue-deep`, on a `ground` backing with 5 by 9 px padding, with a 1.5 px ink stem 22 px long pointing down at the object. One at a time.

### 2.16 Blue frame

A 2 px `blue` rectangle with no fill, used in the Home scene to hold the business object during a stop. It fades in at frame 037 and out at frame 082. Not used elsewhere.

**Its label.** Just above the frame's top left corner: the business number in visiting order and the business name in capitals, for example `004  FISHERIES, SEAWEED & BLUE ECONOMY`. Geist Mono, 500, 12 px, tracking 0.04em, colour `#6FA8E8`. It fades with the chapter text. Desktop only. This is the one small technical label in the scene; it is not an eyebrow and it is not repeated above headings.

---

## 3. Rules in one place

Always:

- Geist, on `ground`, with `ink` text.
- One `h1`, in two tones, at the top of every page.
- Hairlines and space for structure.
- A touch or keyboard equivalent for anything revealed on hover.

Never:

- Eyebrows, progress indicators, cards with shadows, gradients, glass, glow.
- A second typeface.
- Fixed-size point grids and font-size cutoffs for point type.
- Texture or imagery behind running text on light pages.
- An arrow inside a circle. A circle around an icon.
- Blue as a section background.
- Placeholder text where content is not approved.

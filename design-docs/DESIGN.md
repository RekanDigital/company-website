# design.md — RekanMU website design direction

Status: design approved for build. Written for the engineering agent that builds the production site.

Read with `DESIGN-SYSTEM.md` (tokens and components), `DECISIONS.md` (what is locked, what was rejected, what is still open) and `CONTENT-MAP.md` (which approved copy goes where).

Owner-locked decisions in `DECISIONS.md` take precedence where they explicitly supersede earlier values or behavior. Otherwise, the designated mockup or prototype in section 2 is the authority for its part.

---

## 1. The idea

RekanMU is a holding company with seven businesses. Its visual identity is anchored by **one world drawn entirely in points**, in which each business is a place. The About page has one owner-approved photographic exception: a dedicated slideshow of RekanMU team photos. It does not replace point-world imagery elsewhere.

Most site imagery comes from that world:

- **Home** flies through it, in the dark, in one continuous scroll.
- **The menu** opens onto it and turns to face the page you point at.
- **Businesses** lets the visitor form it out of the headline, turn it and pick a business from it.
- **Inner pages** are light. The world appears as point objects and stills, never as a dark full-screen scene again. About also uses its scoped team-photo slideshow.

The same motif runs through the type: large display text is partly drawn in points, and those points are literally the points of the world on the Businesses page.

Character: technical, precise, quiet, a little unexpected. Not decorative. Nothing is there only to fill space.

## 2. Which artefact is the authority

| Part | Authority | Where |
|---|---|---|
| Home, the whole page: scroll scene, header, text chapters, and the sections after the scene | The Home prototype and the scene package | `prototypes/home.html`, `prototypes/home-scene/` |
| Home Products & Services scroll movement and stream panels, on their own | The scroll prototype | `prototypes/home-products-services-scroll.html` |
| Businesses hero | The hero prototype | `prototypes/businesses-hero.html`, `prototypes/businesses-hero.source.js` |
| Layout, type, spacing and components of every other page | The page mockups and the shared stylesheet | `pages/*.html`, `tokens/site.css` |
| Copy | The content documents in the project Drive folder | see `CONTENT-MAP.md` |

The Home prototype remains the authority for the scene, sequence and post-scene behaviors except where a later owner-approved lock in `DECISIONS.md` explicitly supersedes a value or behavior. For the current implementation handoff, read the owner locks in `DECISIONS.md` and the exact Home type/layout values in `DESIGN-SYSTEM.md` before changing the Home shell or sections. `pages/home.html` is a still picture of the prototype baseline.

## 3. Principles

These came out of design review and are binding.

1. **No eyebrows.** No small label above a heading, anywhere.
2. **No progress indicator.** No bar, ring, counter or dots that track scroll.
3. **No cards, shadows, glass, glow, neon or gradients as decoration.** Structure comes from hairlines, space and type. The only rounded containers are the closing card and buttons. The approved footer is a seamless, unframed surface.
4. **Round means pressable.** Only buttons are pills. Nothing else is fully round.
5. **Nothing is drawn behind running text.** No texture, pattern or image under paragraphs or titles, except the dark closing card, which has its own contrast treatment.
6. **Point type is a selected display treatment.** Dot pitch and size scale with the rendered text at every viewport; there is no 100 px cutoff. See `DESIGN-SYSTEM.md` 1.3.
7. **One typeface family.** Geist, with Geist Mono for small technical labels.
8. **Blue is rare.** It marks the thing being pointed at, pressed or selected, and the edges of objects in the world. It is not a background colour for sections.
9. **Blocks without approved content are left out**, not filled with placeholder text.
10. **Every section must earn its place by showing something or doing something.** Review repeatedly rejected sections that were only a heading and a list.

## 4. Site map and navigation

```
/                      Home
/about                 About
/businesses            Businesses (overview of the seven)
/businesses/[slug]     Business detail, one per business (seven pages, one template)
/products-services     Products & Services
contact                not a page: the closing card and the footer carry the contact details;
                       the contact button opens email
```

- **Desktop header:** a transparent sticky row with the logo on the left; About, Businesses, Products & Services and `EN / ID` on the right. Nav text turns blue and lifts 3 px on hover and focus; the current page keeps a blue underline.
- **Tablet and mobile menu:** a full-screen overlay with five entries: Home, About, Businesses, Products & Services, Contact. See 5.2.
- **The seven businesses** are reached from Businesses (seven "View business" buttons), from the "Next" row at the foot of each business page, and from the Home scene stops.
- **Business order, site-wide:** Technology & Digitalization, Data & Business Intelligence, General Trading & Supply Chain, Fisheries, Seaweed & Blue Economy, Health & Bioscience, Agriculture & Green Economy, Food & Beverage. (The Home scene visits them in a different order. See `DECISIONS.md`, open items.)
- **No contact form.** Contact buttons open email.

## 5. Global shell

### 5.1 Header

Desktop header: `logo + RekanMU` left, About, Businesses, Products & Services, then `EN / ID` (mono) on the right. Keep 10 px top and bottom padding and the page gutter. The header is transparent at the top; once sticky while scrolling, it uses the page ground color. Nav links turn blue and lift 3 px on hover and focus, matching the footer social icons; the current page keeps a blue underline.

At tablet and mobile widths, hide the inline links and language switch and show the menu trigger instead.

### 5.2 Menu

Mockup: `pages/menu.html`. Screenshots: `menu.jpg`, `menu-pointing-at-businesses.jpg`. This overlay is for tablet and mobile; desktop uses the inline header links.

- Opens as a full-screen dark layer showing the world (the closing view).
- Five entries set large on the left. The hamburger morphs to an X as the panel opens and returns as it closes.
- **Pointing at an entry:** the entry steps right, the others dim to 40%, the background cross-fades (0.7 s) to that page's place in the world, and that page's headline appears bottom right.
- Bottom bar: `EN / ID` left, email centre, social icons right.

| Entry | Place shown | Headline shown |
|---|---|---|
| Home | the coast | Beyond Technology. Building Strategic Industries. |
| About | the highlands | About RekanMU |
| Businesses | the whole world, all seven and their links (also the view the menu opens on) | A Portfolio Built to Work Together. |
| Products & Services | the data halls | Practical Solutions Built Around Real Business Needs. |
| Contact | the city | Start a Conversation |

The mockup uses stills. In the build the stills may stay, or the live world may be used if the Home scene renderer is already loaded. One of the stills still shows the blue frame; render the five menu places without it.

Entries remain solid text by owner lock; their point treatment does not depend on font size.

### 5.3 Closing card

A dark rounded card that ends some pages, just above the footer. Details in `DESIGN-SYSTEM.md` 2.13.

| Page | Card | Title | Button |
|---|---|---|---|
| Home | yes | Start a Conversation | Contact RekanMU |
| Businesses | yes | Let's Explore What Fits, with email, phone and location | Start a Business Inquiry |
| About | yes | Start a Conversation | Contact RekanMU |
| Business detail | no | has a light inquiry section instead | |
| Products & Services | no | has a light inquiry section instead | |

### 5.4 Footer

One footer on every page. The owner-approved footer is a seamless, unframed surface with four columns: Stay Connected and its CTA, Quick Links, Contact Us, and Follow Us. The email sits directly above the phone; company details have a distinct gap below. The proportional point field and oversized RekanMU wordmark span the bottom. The blue spotlight follows the cursor horizontally while staying vertically anchored to the wordmark. See `DECISIONS.md` and `DESIGN-SYSTEM.md` 2.14.

### 5.5 Language

`EN / ID` is shown in the header, the menu and the footer. The page-map documents carry both English and Bahasa Indonesia copy. Every mockup in this package was laid out with the English copy only. Indonesian strings are often longer: check every heading, button and panel for overflow when the Indonesian copy goes in. Routing for the two languages is an engineering decision.

## 6. Pages

Each table lists the sections in order. "Source" names the content document; exact strings are in the mockups.

### 6.1 Home

Prototype: `prototypes/home.html` (the real page, scroll it). Mockup: `pages/home.html` (a still picture of it; the scene is represented by one still, and the sliding section by two parts with a line of explanation between them).

| # | Section | What it is | Behaviour | Source |
|---|---|---|---|---|
| 1 | Hero | Headline in two parts, "Beyond Technology." solid and "Building Strategic Industries." in points. `About RekanMU` button. The blue logo square. | Through the Square: the square is a window into the dark world and grows to fill the screen as the visitor scrolls. | HOME.md, hero |
| 2 | Scroll scene | One continuous flight through the dark world, about 20 screens of scroll. Text sits in a column on the left, one chapter at a time. | Scroll-driven. Timeline, camera and rendering are specified in `prototypes/home-scene/`. | HOME.md |
| 3 | Products & Services | A section that stays in place while its row of panels moves sideways. | See 7.2. | HOME.md, Products & Services |
| 4 | Partners | Heading "Built Through Collaboration" and one running line using the eleven supplied full-color partner logos. | The line continues on pointer hover; no logo changes state. See `DESIGN-SYSTEM.md` 2.12 and the current direction in `DECISIONS.md`. | HOME.md, clients |
| 5 | Closing card | Start a Conversation | | HOME.md, contact |
| 6 | Footer | | | |

Scene chapters, in order (frames are positions on a 0 to 100 timeline; see `02-SCROLL-TIMELINE.md`):

| Frames | Chapter | Text |
|---|---|---|
| 000 to 012 | Hero | Headline and `About RekanMU` |
| 017 to 023 | Positioning | One paragraph |
| 038 to 081 | Seven business stops | Business name and its one-line summary. The blue frame holds the business object, with a small label on its top left corner: the business number and name. |
| 084 to 087 | From Intelligence to Execution | Heading and paragraph |
| 089 to 096 | From Source to Market | Heading and paragraph |
| 096.5 to 100 | Exit | The world shrinks back into the header logo |

Each business stop should link to its business page.

### 6.2 Businesses

Mockup: `pages/businesses.html`.

| # | Section | What it is | Behaviour | Source |
|---|---|---|---|---|
| 1 | Hero | Headline "A Portfolio Built / to Work Together." and nothing else. One screen high. | Live. See 7.3. | BUSINESSES.md, hero title |
| 2 | Opening paragraph | The hero paragraph, set as a lead in the right half. | Static. | BUSINESSES.md, hero text |
| 3 | The Corporate Engine Behind the Group | Section heading (second half in points), one paragraph, then two business plates: Technology & Digitalization, Data & Business Intelligence. | Each plate shows its fixed point view, name, description and `View business`; the point view scales slightly on hover. | BUSINESSES.md |
| 4 | Where Capability Becomes Real-World Value | Same pattern with five plates: General Trading & Supply Chain; Fisheries, Seaweed & Blue Economy; Health & Bioscience; Agriculture & Green Economy; Food & Beverage. | Plates are staggered, not a uniform grid; each has its matching fixed point view. | BUSINESSES.md |
| 5 | Closing card | Let's Explore What Fits, with contact details | Button opens email. | BUSINESSES.md, contact |
| 6 | Footer | | | |

In the mockup, section 1 is shown as a still with three small stills and a line of explanation under it. Those stills and that line are annotations for the reader of the mockup. They are **not** part of the page.

The hero carries no business descriptions and no buttons. Descriptions and the links to the business pages live in sections 3 and 4.

### 6.3 Business detail (one template, seven pages)

Mockup: `pages/business-detail.html`, shown for Technology & Digitalization.

| # | Section | What it is |
|---|---|---|
| 1 | Hero | The business name set very large in two lines (second line in points). A rotating business point view sits on the right and overlaps the name. Below: the business tagline as a small heading and one lead paragraph. |
| 2 | Overview | One statement in large text, then two paragraphs in the right half. |
| 3 | Capabilities | Section heading on the left; on the right a ruled list, one row per capability: name left, description right. |
| 4 | Experience | One or two statements in large text. Only where approved content exists. |
| 5 | Inquiry | Light section: heading (second half in points), one paragraph, a button `Start a Business Inquiry` and a text link `Explore Products & Services`. |
| 6 | Next business | One full-width row: "Next:" and the next business name, with its fixed point view. Links to the next business in site order; the last links to the first. |
| 7 | Footer | No closing card on this page. |

- Business overview and detail point views use the supplied binary point data. Matching tiles from `assets/renders/specimens.jpg` provide the static fallback; each page uses its own content document.
- In the capabilities list, the row being read is marked: its name turns blue and its rule turns blue. This is the only state shown in the mockup. Do not dim the other rows on this page.
- Sections whose content document has nothing approved are omitted.

### 6.4 Products & Services

Mockup: `pages/products-services.html`. Two of the five streams are drawn in full; the other three follow the same pattern.

| # | Section | What it is |
|---|---|---|
| 1 | Hero | Headline "Practical Solutions / Built Around Real Business Needs." (second line in points) and a lead paragraph in the right half. |
| 2 | Stream bar | The five stream names as bracket tags in one ruled bar. The current stream is blue. Each tag jumps to its stream. |
| 3 | Five stream sections | Left: stream name as a section heading (second half in points) and its paragraph. Right: the catalogue as ruled rows, item name left and description right. Where a stream has sub-groups, each sub-group starts with a bracket tag. |
| 4 | Inquiry | Light section: "Looking for the Right Fit?", a paragraph and `Start a Business Inquiry`. |
| 5 | Footer | No closing card on this page. |

- Streams, in order: Digital Creative & Agency Services; Enterprise B2B Tech & Intelligent Automation; Enterprise System Integrator & B2G; Tech Talent & Professional Services; Strategic Real-Sector Initiatives.
- Reading state, as mocked in the second stream: the row at the reading position has a blue name and a blue rule; rows not yet reached sit at 36% opacity. If this is built, it must be driven by scroll position and must never leave most of a list pale on arrival. If that cannot be guaranteed, show all rows at full strength.
- Package names such as "Paket A (Trial UMKM)" are product names and stay as written.

### 6.5 About

Mockup: `pages/about.html`.

| # | Section | What it is |
|---|---|---|
| 1 | Hero | "About / RekanMU" (second line in points) and a lead paragraph in the right half. |
| 2 | Photo slideshow | Four approved v2 team photographs fill the section edge-to-edge. Desktop cross-fades them with scroll, covering the pinned viewport without a frame when supported and motion is allowed; tablet/mobile, reduced-motion and unsupported-browser layouts stack all four at full width and natural aspect ratio. |
| 3 | Story | Three short paragraphs stepping down across three columns, then one statement in large text. |
| 4 | At a glance | One lead paragraph, then three large figures, each with a small heading and a paragraph. The middle figure is in points. |
| 5 | Vision and mission | The vision as a large statement. The mission as a ruled list of five. |
| 6 | Values | Five values, each a name and one line. |
| 7 | Corporate information | Section heading and a ruled list of eight rows: label left, value right. |
| 8 | Closing card | Start a Conversation |
| 9 | Footer | |

Check the three figures in section 4 against ABOUT.md before building. See `CONTENT-MAP.md`, issue C3.

## 7. Behaviour of the live parts

### 7.1 Home scroll scene

Fully specified in `prototypes/home-scene/` (`README.md`, `01-MAP.md` to `06-PAGE-SHELL.md`, `scene-config.json`, `source/world.js`, `source/page.js`, reference renders). Do not change the map, timeline, camera or brightness values.

Text in the scene: the hero sits top left in the space beside the square; every later chapter sits bottom left, 40% of the width up to 580 px. Business names are sized so the longest one stops short of the blue frame. Exact values are in `06-PAGE-SHELL.md`.

### 7.2 Home Products & Services: panels that slide

Prototypes: in place in `prototypes/home.html`, and on its own in `prototypes/home-products-services-scroll.html`. Stills: `prototypes/stills/home-products-services-*.png`.

- The section is pinned for one screen height plus 2700 px of scroll.
- Inside it, one row moves left in direct proportion to scroll, from 0 to (row width minus viewport width). Stopping the scroll stops the row. Scrolling back reverses it.
- **Opening panel:** exactly one viewport wide. Heading "Products & Services" left (second word in points), paragraph and `Explore Products & Services` right.
- **Five stream panels:** each 46% of the viewport wide, never narrower than 340 px, separated by hairlines. Keep the dotted count and stream name together as a vertically centered group, with a proportional 20–32 px gap; keep the count below the sticky header and within the panel bounds. The description opens under the name. This grouping supersedes the earlier top-count / bottom-name placement in the scroll prototype. Use the locked 0.83 hero-title ratio and proportional type sizes in `DESIGN-SYSTEM.md` 1.2; do not resize the title or loosen the number/name grouping.
- **Pointing at a panel:** the number turns solid blue and shrinks slightly, and the stream description opens under the name. On touch devices the description is always open. The description also opens on keyboard focus.
- When the last panel reaches the right edge the section releases and the page continues.
- Widths through 820 px: the intro becomes one column and the five category panels stack vertically. Keep each count in normal flow above its name; descriptions stay open. Preserve the locked type ratios, gaps and content-fit spacing in `DESIGN-SYSTEM.md` 1.2.
- Reduced motion, or a browser without the needed scroll-animation support: do not pin or animate the row; leave the panels in normal vertical flow with descriptions visible.
- The prototype uses CSS scroll-driven animation with a small script fallback. Any implementation is fine if the movement stays linear with scroll.
- The phone and tablet layout is owner-approved and locked. Do not restore the horizontal pinned row on these widths.

### 7.3 Businesses hero: words, world, one business

Prototype: `prototypes/businesses-hero.html`. Readable source: `prototypes/businesses-hero.source.js`. Stills: `prototypes/stills/businesses-hero-*.png`.

The same 108,040 points (plus 1,728 ground points) are three things in turn.

| State | What is seen | How the visitor gets there |
|---|---|---|
| Words | The second line of the headline, "to Work Together.", drawn in live points. The points move away from the pointer and return. | Resting state. Pointer on the headline, or outside the hero. |
| World | The points fly out and form all seven businesses on a faint ground grid, with dashed blue links from the two engine businesses to the five industries. No names are shown. | The pointer moves into the picture area, which is everything below the headline. No click needed. |
| One business | The view moves in on one business. Its neighbours stay visible as faint grey structures. Its name is shown. | Click a business in the world. |

- **Pointing at a business in the world:** it turns blue, its name appears above it, the others dim, its links strengthen. Only one name is ever shown.
- **Drag:** turns the world. 0.006 radians per pixel horizontally; vertical drag tilts between 0.28 and 1.15 radians. A little momentum after release.
- **Click again**, or Escape: back out one level.
- **Pointer returns to the headline or leaves the hero:** back to words.
- **Nobody there for 8 seconds:** the hero alternates on its own between words and world, 8 seconds each.
- **Touch:** first tap on a business lights it and shows its name; second tap goes close. A tap on empty ground returns to words.
- The transition between words and world takes 1.15 seconds; each point leaves at a slightly different moment and travels on a slight arc.
- Once the world has formed, every point sits exactly on its position. Do not add per-point easing that leaves points lagging: that was tried and made the buildings look blurred.
- Blue edge points are drawn after ink points so outlines stay on top.
- Drawn with WebGL points, no library. Exact sizes, opacities and camera numbers are in the source file.
- Reduced motion: no automatic alternation; transitions are immediate.
- No WebGL: the headline stays as ordinary point type and the picture area is empty. Sections 2 to 4 of the page carry all content and links, so nothing is lost.
- The hero is not keyboard-operable by design. It is an opening, not the only route: the seven `View business` buttons below are the accessible route.

Known weakness, accepted for now: at rest the lower half of the hero is empty until the pointer enters or 8 seconds pass. If this tests badly, shorten the delay or let the world form once on load.

### 7.4 Smaller interactions

| Element | Behaviour |
|---|---|
| Button | A circle expands from the pointer over 0.5 s: ink on light surfaces, white on dark. The label switches to a contrasting color; keyboard focus starts from the center. Reduced motion applies the state without scaling. |
| Text link | Underlined, with an arrow. Colour shifts to deep blue. |
| Footer links | The label rolls up and is replaced by the same label in blue. |
| Footer point field | A brighter patch eases horizontally with the pointer and remains vertically anchored to the RekanMU wordmark. |
| Social icons | Turn blue and lift 3 px. |
| Partner line | Runs continuously; pointer hover does not pause it or change a logo. Reduced motion stops the loop. |
| Closing card title | Point type that inverts against whatever is behind it. |

## 8. Responsive behaviour

What exists: every size in the stylesheet is fluid (`clamp` with viewport units), grids collapse to one column at 820 px, and the mockups were checked at 1440 px wide only.

The original mockups did not specify tablet and phone layouts. Later owner-approved responsive locks in `DECISIONS.md` take precedence; do not use the defaults below to change a locked view.

| Part | Default to build |
|---|---|
| Home scene | The prototype already has a portrait layout: text column at the top, square recentred. Keep it. |
| Products & Services sliding panels | Stack vertically on narrow screens. See 7.2. |
| Businesses hero | Works by tap. See 7.3. Reduce the point count on low-power devices if the frame rate drops. |
| Menu | Entries scale with width. On portrait the headline preview may be dropped. |
| Footer | Four columns reflow to two on tablet and one on mobile. The point field and large name scale with the footer width. |
| Point type | Selected display treatments use proportional point geometry at every viewport. Use `DESIGN-SYSTEM.md` 1.3; the Home Partners heading has its documented local visibility floor. Do not add a global font-size cutoff. |
| Business plates, statements, lists | Single column in source order. |

Minimum touch target 44 px. Never rely on hover alone for content: every hover state in this design either repeats content available elsewhere or has a touch equivalent listed above.

## 9. Accessibility, motion and fallbacks

- All text meets contrast on its ground. Body text on the light ground uses `#5B6470` at 16 px or larger.
- Real text stays in the document wherever points are drawn by canvas (Businesses hero headline).
- Canvases are hidden from assistive technology. Their content is repeated as real content elsewhere on the page.
- `prefers-reduced-motion`: Home falls back to a static stacked layout; sliding panels unpin; the Businesses hero and business-detail point view stop moving; the About photographs remain visible as a static vertical sequence; the partner line stops.
- No WebGL or a renderer failing to load: Home falls back to its static layout; business point views show their matching specimen stills.
- Focus states are visible on every interactive element. Buttons use their hover state for focus.
- Headings follow document order: one `h1` per page.

## 10. Performance notes

- Home scene: three.js, about 670,000 points in the prototype. It is the heaviest thing on the site. Load it only on Home and after first paint.
- Businesses hero: 110,000 WebGL points, one draw call, no library. Pause when off screen (the prototype does).
- The binary business point data used by the Businesses hero and business-page viewers is 0.86 MB. Keep it as a binary asset, not base64 inside page HTML.
- Business overview/detail point views use plain WebGL with matching specimen stills as fallback. About uses the approved four-photo slideshow; other inner-page imagery remains approved stills.
- Fonts: Geist and Geist Mono, three weights and two weights, self-hosted through `next/font` as TECH-STACK.md requires.
- TECH-STACK.md locks the Home scene to Three.js and the Businesses hero plus approved business-page point views to plain WebGL. Home Products & Services and the About slideshow use scroll-driven layouts where supported. Keep ordinary page copy in HTML and preserve the static fallbacks.

## 11. Not designed

Listed so that nobody assumes they were considered and settled. Details in `DECISIONS.md`.

- Phone and tablet layouts for the inner pages.
- Layouts checked with the Indonesian copy. The copy exists; only English was laid out.
- The six business pages other than Technology & Digitalization (template only).
- Three of the five Products & Services streams (pattern only).
- A dedicated contact page (none is intended).
- Error, empty and loading states (the site has no forms, search or data fetching beyond its own assets). A 404 page is not designed.
- Page transitions between routes.

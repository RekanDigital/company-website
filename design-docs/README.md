# RekanMU website — design handoff

Everything needed to build the production site from the approved design. Prepared for the engineering agent. Start here.

Date: 6 October 2026\. Design owner: Dinda Punjung Puji Safitri.

## What this is

The design of the RekanMU company website is approved. It exists as page mockups, three working prototypes of the live parts, and the decisions behind them. This package turns that into documents, tokens, assets and references you can build from.

It does not contain a Next.js project. The technical baseline is `TECH-STACK.md` in the project Drive folder: Next.js App Router, React, TypeScript, Tailwind CSS v4, pnpm, static-first.

## Read in this order

1. **`DESIGN.md`** — the idea, the site map, every page section by section, and how each live part behaves.  
2. **`DESIGN-SYSTEM.md`** — colour, type, spacing, motion and every component, with exact values.  
3. **`DECISIONS.md`** — what is locked, what was rejected and must not come back, and what is still open (each with a default).  
4. **`CONTENT-MAP.md`** — which content document feeds which page, and what in the mockups is not approved content.  
5. **`ASSETS.md`** — what the image and data files are, how they were made, and what is missing.

## What is in the package

```
README.md
DESIGN.md
DESIGN-SYSTEM.md
DECISIONS.md
CONTENT-MAP.md
ASSETS.md


tokens/
  tokens.css            design tokens as CSS custom properties
  tokens.json           the same as data, plus the seven businesses (slug, group, sprite tile, world position)
  site.css              the shared stylesheet of the site: only rules the pages use


pages/                  static page mockups: open in a browser
  home.html  menu.html  businesses.html  business-detail.html  products-services.html  about.html
  screenshots/          each page at 1440 px wide, full length


components/
  component-sheet.html  every component on one page
  component-sheet.jpg


prototypes/             working references for behaviour: open in a browser
  home.html                               Home, the whole page: scroll scene, header, text, and the sections after the scene
  home-scene/                             full specification of the scene: map, timeline, camera, rendering, objects, page shell, source, reference renders
  home-products-services-scroll.html      Home: the section whose panels slide sideways with scroll
  businesses-hero.html                    Businesses: the live hero (words, world, one business)
  businesses-hero.source.js               its script, readable, without the point data
  stills/                                 captures of the live parts in each state


assets/
  logo/  renders/  point-data/  icons/


tools/                  scripts used to export point data and render light-palette stills from the world
```

&nbsp;

## Which thing to trust

1. **Owner-locked decisions** in `DECISIONS.md` win where they explicitly supersede an earlier value or behavior.
2. **`TECH-STACK.md`** is the technical baseline.
3. **Designated prototypes and page mockups** are the authority for the parts listed in `DESIGN.md` section 2, except where a later owner lock overrides them.
4. **Page maps** are the authority for page content and ordering.
5. **Supporting prose and token examples** explain those sources; they do not override a lock or its designated artifact.

## How to look at things

- Mockups and prototypes are plain HTML. Open them from this folder so the relative paths to `assets/` work. They load Geist from Google Fonts, so they need a connection to show the right typeface.  
- The prototypes need WebGL. `home.html` also loads three.js from a CDN and is heavy: about 670,000 points.  
- Mockups were designed and checked at **1440 px wide**. Apply the owner-approved responsive locks in `DECISIONS.md`; see `DESIGN.md` section 8 for the original baseline.

## Suggested build order

1. **Tokens and base.** Bring `tokens/tokens.css` into the Tailwind theme. Set up Geist through `next/font`.  
2. **Shell.** Header, footer, closing card, menu overlay. These appear on every page and settle most of the system.  
3. **Components.** Button, text link, roll link, tag, point type, ruled list, figure, statement, business plate.  
4. **Static pages.** About, Products & Services, Business detail (one template, seven pages), Businesses below its hero.  
5. **Home after the scene.** Sliding Products & Services section, then the partner line, closing card and footer. Follow the owner locks in `DECISIONS.md` and the measured typography/responsive details in `DESIGN-SYSTEM.md`.  
6. **Businesses hero.** Port `businesses-hero.source.js`. Ship the point data as one binary file.  
7. **Home scene.** Port from `prototypes/home.html` and `prototypes/home-scene/`. It is the largest single piece; keep it isolated so the rest of the site never waits for it.  
8. **Localization and fallback QA.** Then verify responsive behavior against the owner-locked layouts and QA against the screenshots.

## Acceptance checklist

A build matches the design when all of these are true.

**Shell**

- [ ] Desktop header is the logo and RekanMU with About, Businesses, Products & Services, and the owner-locked EN/ID pill; tablet/mobile use the locked menu.  
- [ ] No progress indicator, rail, readout or eyebrow anywhere.  
- [x] Footer is the owner-approved seamless surface: four-column desktop layout, responsive two-/one-column reflow, proportional point field with cursor spotlight anchored to the RekanMU wordmark, and wordmark cut by the bottom edge.  
- [ ] Closing card appears on Home, Businesses and About only.  
- [ ] Menu opens on the dark world; each entry turns the view and shows its headline.

**Type and colour**

- [ ] Geist and Geist Mono only.  
- [ ] Point type: designated display treatments use proportional geometry with no font-size cutoff; the Home Partners heading has a documented local visibility floor. See `DESIGN-SYSTEM.md` 1.3.  
- [ ] Blue appears only on selection, hover, object edges, links between businesses and the logo.  
- [ ] The only pills are buttons; they sweep to blue on hover and focus.

**Home**

- [ ] The scene matches the reference renders at the nineteen timeline positions.  
- [ ] Blue frame only during the seven stops, with its label on the top left corner; scan line only during the flight.  
- [ ] The world shrinks back into the header logo at the end.  
- [ ] At widths of 901 px and above, the Home hero uses the locked square-derived width, `min(9.2vw, 13.4svh)` type and `clamp(24px, 5svh, 56px)` vertical padding; at 1440 × 900 it is five lines and the CTA fits within the viewport. See `DESIGN-SYSTEM.md` 1.2 and `prototypes/home-scene/06-PAGE-SHELL.md`.
- [ ] Products & Services panels move in direct proportion to scroll, and stop when scroll stops.  
- [ ] Partner line: all eleven supplied full-color logos, no separators, fading at both ends, continuing on hover without logo state changes. Reduced motion stops the loop.

**Businesses**

- [ ] At rest the second headline line is live points that avoid the pointer.  
- [ ] Moving into the picture forms the world with no click.  
- [ ] Pointing at a business turns it blue and shows only its name.  
- [ ] Click goes close; neighbours stay faintly visible; click again returns.  
- [ ] Buildings are sharp: every point sits exactly on its position once the world has formed.  
- [ ] No names list and no descriptions in the hero; the plates below carry them.

**Everywhere**

- [ ] Copy comes from the content documents, unchanged.  
- [ ] Nothing that needs hover is unreachable by touch or keyboard.  
- [ ] `prefers-reduced-motion` and no-WebGL both leave a complete, readable page.  
- [ ] No console errors. No horizontal scroll. No clipped text in either language.

## Integration lock

Integration lock completed on 6 October 2026\. The approved design package is now the build baseline, and the former owner/designer defaults in `DECISIONS.md` section 3 have been resolved for implementation.

Key resolutions:

- no progress indicator;  
- footer placeholder replaced by approved **Start a Conversation / Mulai Percakapan**;  
- social links hidden until real URLs exist;  
- About **Focus** carries no numeric figure;  
- catalogue stream counts computed from source data;  
- all eleven approved partner logos used;  
- Home scene business-stop order preserved exactly as designed;  
- Three.js used for the Home point-world scene only, with the Businesses hero remaining plain WebGL;  
- responsive defaults in `DESIGN.md` section 8 are the implementation baseline.

Remaining items are implementation/asset work rather than design blockers: Indonesian layout validation, the other six business-detail instances, the remaining Products & Services streams, six tall business-object renders, five clean menu views, and real-device WebGL performance testing.

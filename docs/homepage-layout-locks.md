# Homepage layout locks — Sprint 3 handoff

**Status:** Owner-approved layout and interaction constraints, current as of 7 October 2026.
**Purpose:** Keep Sprint 3 implementation from reopening accepted Home layouts or restoring superseded prototype behavior.

This is an implementation handoff, not a new design. Correct code to match a lock. Change a lock only after the owner gives new direction. Exact approved copy remains in [`plans/page-maps/HOME.md`](../plans/page-maps/HOME.md).

## Authority

1. The owner-approved entries in [`design-docs/DECISIONS.md`](../design-docs/DECISIONS.md) govern locks and supersede earlier prototype states.
2. [`design-docs/DESIGN-SYSTEM.md`](../design-docs/DESIGN-SYSTEM.md) contains token values and measured type/layout ratios.
3. [`design-docs/DESIGN.md`](../design-docs/DESIGN.md), the Home prototype and scene package describe page sequence and behavior where a later owner decision has not superseded them.
4. Page maps govern visible copy, routes and CTA wording. Never infer copy from a screenshot when the page map has the approved string.
5. Tests protect observed layout behavior; they do not authorize changing a design decision to make an assertion pass.

The `design-docs/` baseline is present in the implementation workspace but excluded by Git. This repository handoff records the owner-approved constraints needed for the next sprint; keep it aligned with the local design package.

## Lock status

| Area | Status | Sprint 3 rule |
|---|---|---|
| Desktop header and tablet/mobile menu | Locked | Preserve the current layout, labels, toggle, images, crops, layering and motion. |
| Home hero | Locked | Preserve the mobile/tablet configuration. Apply the special desktop formula only from 901 px upward. |
| Home Products & Services | Locked | Preserve the desktop proportions and the stacked tablet/mobile layout. |
| Footer | Locked | Preserve the seamless visual, column order, contact spacing, point field and spotlight behavior. |
| Clients & Partners | Owner-directed refinement, still in progress | Keep the latest full-color/no-pointer direction; it has not been declared finally locked. |
| Home point-world flight | Approved design, pending implementation in the current route | Implement from the approved scene sources. Do not redesign its map, timeline, camera or chapter order. |

## Page order and implementation snapshot

The approved Home sequence is: shared header → Home hero → continuous point-world flight and text chapters → Products & Services → Clients & Partners → “Start a Conversation” closing card → shared footer. The point-world chapter order and timing remain specified in `design-docs/prototypes/home-scene/` and `design-docs/DECISIONS.md`.

**Observed in the app on 7 October 2026:** `FoundationPage` currently renders the hero, `HomeCatalogue` (Products & Services and Clients & Partners), and closing card. `Document` supplies the shared header and footer. The Home flight and its chapters are not currently mounted in the route. Build that missing piece from `design-docs/prototypes/home.html` and `design-docs/prototypes/home-scene/`; do not treat its absence as permission to alter the approved experience.

## Shared navigation

- At 821 px and wider, the header is a thin, transparent sticky row. Keep the 32 px supplied mark and RekanMU wordmark on the left; About, Businesses and Products & Services plus the language switch on the right. Use 10 px vertical padding. Nav text turns deep blue and lifts 3 px on hover/focus; the current page retains its blue underline.
- The language control remains a 42 × 22 px black oval inside a 44 × 44 px target. Keep the white thumb and the EN/ID label inside the pill; there is no separate language label or X icon.
- Through 820 px, hide the desktop nav and header language control. Keep the right-side, full-screen menu and its separate top-layer three-line control that morphs to X and back. The visible MENU/CLOSE labels stay hidden; accessible button names remain. Preserve link order, image assignments and crops, and the smooth slide. Do not attach the X to the moving panel.
- Existing menu images are assigned in `src/content/site.ts`; crop rules are in `src/components/site-shell.css`. Preserve these assignments and crops.

## Home hero

The approved headline/copy is in the Home page map. The first phrase stays solid; the second uses point type. Keep the logo square to the right and the CTA below the headline.

At widths **901 px and wider**, preserve the owner-locked layout:

```css
padding-block: clamp(24px, 5svh, 56px);
h1 width: calc(68vw - min(20svh, 15vw) - var(--gutter));
h1 font-size: min(9.2vw, 13.4svh);
```

The square center remains at `68vw` and its side is `min(40svh, 30vw)`. Keep Geist 500, `0.9` line height, `-0.05em` tracking, a 32 px CTA gap and CTA minimum height of 56 px. At **1440 × 900**, expect a 120.6 px heading, 751.2 px text column, five lines and a CTA inside the viewport.

**Do not apply this desktop override at 900 px or below.** Preserve the existing proportional tablet/mobile hero. The desktop navigation breakpoint (821 px) and the special hero breakpoint (901 px) are intentionally different.

## Products & Services

### Desktop and wider tablet: 821 px and up

- Keep the opening panel one viewport wide, with the title/lead/CTA; follow it with the five approved catalogue streams.
- When scroll-driven animation is supported and reduced motion is not requested, pin the section for one viewport plus 2700 px of scroll. Move the row linearly from zero to its full travel; stop when scrolling stops and reverse on scroll-up. Each stream panel is `max(46vw, 340px)` and separated by a hairline.
- The title remains **83% of the Home hero size**—about **100.1 px at 1440 × 900**, smaller than the hero. Preserve the type ratios to this title: count `3.75×`, stream name `0.568×`, intro lead `0.243×`, description `max(16px, 0.18×)`. Keep the count/name gap between 20 and 32 px and keep both inside the panel, below the sticky header.
- Hover or keyboard focus opens the description and turns the count blue while shrinking it to 0.86. The same information remains available without hover. Counts are derived from approved catalogue data at build time; do not hard-code them.

### Tablet and mobile: 820 px and below

- The opening panel becomes one column. The five categories stay vertically stacked; do not pin or scroll them sideways.
- Keep each count in normal flow above its name. Category names use `clamp(28px, 4.5vw, 36px)`; counts stay at `3.75×` that size.
- Keep the count-to-name gap at 16–20 px, name-to-description gap at 8–12 px, and panel padding at `clamp(24px, 5vw, 40px)`. Each panel follows its content height; descriptions stay open and at least 16 px.
- Preserve the fitted, compact composition: no large blank gaps, overlap, clipped dotted numbers, or horizontal overflow. Validate long Bahasa Indonesia labels too.

For reduced motion, or when scroll animation is unavailable, do not pin or animate the row; keep the content in normal vertical flow with descriptions visible.

## Clients & Partners

The latest owner direction replaces the original grey-logo/pointer-hover baseline:

- Use all eleven supplied color PNGs from `resources/assets/partners-logo-transparent/` in their approved order. Keep source artwork and aspect ratios; the duplicate set is only for the seamless loop and remains hidden from assistive technology.
- Keep logos proportionally larger and denser: desktop width `clamp(164px, 17vw, 250px)` with `clamp(32px, 4vw, 64px)` gaps; tablet/mobile width `clamp(164px, 42vw, 220px)` with 28 px gaps.
- Keep the single 46-second marquee, 12% end fades and no separators. Pointer hover does nothing: no pause, color/scale effect or active-logo state. Reduced motion stops the loop.
- The title is “Built Through Collaboration” / “Dibangun Melalui Kolaborasi”. Keep the first word solid and the following phrase dotted. The local point grid uses pitch `max(2.4px, 0.055em)`, radius `max(0.4px, 0.009em)` and edge `max(0.6px, 0.014em)` so the dots remain visible at small sizes. Do not spread this local floor to unrelated point-type text.
- This refinement is active, not finally locked. Continue only within this direction and wait for the owner before changing its composition or interaction.

## Closing card and footer

- Home keeps the approved dark “Start a Conversation” / “Mulai Percakapan” closing card and “Contact RekanMU” button. Contact CTAs open `mailto:rekanmu.digital@gmail.com`; there is no Home contact form or `/contact` page. Keep the Home hero CTA routed to About and the Products & Services CTA routed to `/products-services`.
- The footer is locked across pages and locales. It is full-width and seamless, with no frame. Preserve the four content groups in order: Stay Connected (subtext and existing CTA), Quick Links, Contact Us, Follow Us. Phone sits immediately below email; company details remain a separate block. Social links stay icon-only.
- Keep the blue point field proportional to the oversized RekanMU wordmark. The desktop spotlight follows cursor X and stays anchored to the wordmark's Y; do not make its height follow the cursor or clip its gradient. Preserve the same point/wordmark visual on mobile as content reflows. Do not change footer content, buttons or social links without a new owner decision.

## Type, motion and regression checks

- Use Geist and Geist Mono only. Body copy stays at least 16 px. No eyebrows, decorative card frames, background textures behind running text, or invented section content.
- Global point type remains proportional: `0.055em` pitch, `max(0.5px, 0.009em)` radius and `max(0.72px, 0.014em)` edge, with no font-size cutoff. The Home Partners title's local override above is the documented exception.
- Honor `prefers-reduced-motion`; keep all information in normal reading order and do not rely on hover alone. Preserve visible keyboard focus.
- Use the approved English/Indonesian copy. Check for clipped headings, dots or counters, overlap, dead CTAs and horizontal overflow at **1440 × 900**, **768 × 1024**, **390 × 844**, and **320 px**; also test keyboard and reduced motion.
- Run `pnpm exec playwright test tests/home-hero.spec.ts tests/home-catalogue.spec.ts` and `pnpm typecheck`. Keep the assertions in these tests aligned with the locks above; update a test only when an owner-approved design decision changes.

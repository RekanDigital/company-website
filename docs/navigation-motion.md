# Page-switch transitions

**Status:** Desktop owner-approved and locked on 8 October 2026; mobile/tablet sequence and toggle morph accepted on 9 October 2026.

Preserve the smooth 1.2s vertical fade from the exact hero ground (`--ground: #F6F8FA`) with staggered hero title rows and supporting copy. Cypher Capital was used as a visual reference. This lock does not reopen the locked Home composition or flight. Changes require new owner direction.

- With no reduced-motion preference, the destination fades from the hero ground while settling upward by 100px over 1.2s, using `cubic-bezier(0.16, 1, 0.3, 1)`. The shared header stays stationary. Mobile and tablet now use the same arrival motion.
- Native React ViewTransition and the installed Next.js App Router coordinate snapshots at the route commit. The outgoing snapshot is hidden; a hero-ground surface backs the incoming snapshot. No click interception, added scroll listeners, navigation delay, routing replacement or added dependency.
- Pathname keys prevent same-page updates from invoking the route fade.
- Reduced motion and unsupported browsers use normal page changes. Existing Home loading and flight run when returning Home.
- Locale roots are separate layouts; cross-locale navigation may reload and is not guaranteed to animate.

The final stagger was reviewed in desktop Chromium using captured title/copy transition frames and observed 1.2s durations with 0/180/360ms delays. Type checking passed. Tablet-width inspection confirmed no named hero transitions or page animation. Owner acceptance is recorded above; other-browser behavior and the full navigation regression suite remain unverified.

## Mobile and tablet sequence — 9 October 2026

The owner approved a leftward menu exit followed by the desktop-style page arrival. At 820 px and below, selecting a different page keeps the menu visible while the normal App Router navigation prepares the destination. At route commit, the modal closes and focus moves to the destination main without changing scroll position. Named snapshots of the photo panel and menu brand slide left over 620 ms. The toggle stays in its fixed position: the X's two diagonal bars straighten into the hamburger while its middle bar fades in over the same 620 ms. Its light-to-dark color crossfade follows the menu-to-ground handoff. The destination starts its 1.2-second fade and 100 px upward settle after that exit, with hero units at 620/800/980/1160 ms.

Header links at wider tablet sizes, footer links and page CTAs use the arrival without the menu delay. Ordinary X/Escape closing keeps its existing rightward slide. Same-page and Contact hash links retain native navigation; a cross-page Contact link animates the destination at its anchor. Modified/new-tab clicks do not dismiss the menu. Reduced motion and browsers without transition-type selector support omit the staged menu exit. Home keeps its locked live loader instead of the incoming page snapshot fade.

This supersedes the earlier tablet observation above. Mobile and tablet Chromium frames confirmed the photo-panel exit, toggle morph and arrival delays. The owner accepted the implementation on 9 October 2026; physical devices, other browsers and a full regression suite remain unchecked.

Businesses initialization repair: the hero no longer has a top border. Its WebGL context starts transparent while data loads, and resume draws synchronously before the next browser paint, preventing an unpainted black canvas from entering a route snapshot.

## Locked hero stagger

Owner requested sequential title rows and supporting copy while preserving the 1.2s fade and 100px settle. On desktop, the authored solid title row starts first, the point-type title row follows at 180ms, supporting copy at 360ms, and any hero CTA at 540ms. Each unit keeps its full 1.2s duration. A long title row that wraps naturally remains one semantic unit. The Businesses point renderer takes the second row's snapshot name when ready; its DOM fallback owns that name while loading. Home's locked loading/flight title is not split.

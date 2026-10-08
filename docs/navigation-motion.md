# Locked desktop page-switch transition

**Status:** Owner-approved and locked on 8 October 2026.

Preserve the smooth 1.2s vertical fade from the exact hero ground (`--ground: #F6F8FA`) with staggered hero title rows and supporting copy. Cypher Capital was used as a visual reference. This lock does not reopen the locked Home composition or flight. Changes require new owner direction.

- At 1025 px and above, with no reduced-motion preference, the destination fades from the hero ground while settling upward by 100px over 1.2s, using `cubic-bezier(0.16, 1, 0.3, 1)`. The shared header stays stationary.
- Native React ViewTransition and the installed Next.js App Router coordinate snapshots at the route commit. The outgoing snapshot is hidden; a hero-ground surface backs the incoming snapshot. No click interception, added scroll listeners, navigation delay, routing replacement or added dependency.
- Pathname keys prevent same-page updates from invoking the route fade.
- Mobile, tablet, reduced motion and unsupported browsers use normal page changes. Existing Home loading and flight run when returning Home.
- Locale roots are separate layouts; cross-locale navigation may reload and is not guaranteed to animate.

The final stagger was reviewed in desktop Chromium using captured title/copy transition frames and observed 1.2s durations with 0/180/360ms delays. Type checking passed. Tablet-width inspection confirmed no named hero transitions or page animation. Owner acceptance is recorded above; other-browser behavior and the full navigation regression suite remain unverified.

Businesses initialization repair: the hero no longer has a top border. Its WebGL context starts transparent while data loads, and resume draws synchronously before the next browser paint, preventing an unpainted black canvas from entering a route snapshot.

## Locked hero stagger

Owner requested sequential title rows and supporting copy while preserving the 1.2s fade and 100px settle. On desktop, the authored solid title row starts first, the point-type title row follows at 180ms, supporting copy at 360ms, and any hero CTA at 540ms. Each unit keeps its full 1.2s duration. A long title row that wraps naturally remains one semantic unit. The Businesses point renderer takes the second row's snapshot name when ready; its DOM fallback owns that name while loading. Home's locked loading/flight title is not split.

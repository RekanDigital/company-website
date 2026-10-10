# Products & Services split-scroll revision

Owner approved the proposed direction on 9 October 2026. Routes: `/products-services` and `/id/products-services`. Final visual acceptance remains with the owner.

## Requirements

Apply the four rules recorded in `about-page-hard-rules.md`: dedicated reading sections, efficient spacing, seamless flow without separators, and smooth scroll motion. Preserve the approved catalogue copy, stream anchors, subgroup labels, solid/dotted typography, shared navigation and page-switch transitions. Contact/CTA and footer styling stay locked to the homepage shared components.

## Composition

- Wide landscape layouts above 1100px and above 650px height use equal left/right columns. Each stream introduction sticks at 96px while its products scroll in the page on the right. There is no nested scroll container or wheel interception.
- Product titles sit above their descriptions. Complete units rise and settle with scroll; the left introduction has a larger upward settle during the stream entrance. Native sticky bounds carry the outgoing introduction away as the next stream arrives.
- Compact, portrait, and short-window layouts stack content. The full stream title is a compact sticky heading at 64px; the introduction and products remain in natural reading order beneath it.
- Catalogue section and row dividers are removed. Subgroup labels remain text, without rules. The five existing stream links retain their targets.
- Hero and inquiry retain dedicated reading views. Keep the existing business-inquiry copy and `/businesses#contact` action; the standard shared closing/contact card follows it, with the homepage mailto CTA and unchanged footer.
- Reduced motion and unsupported scroll timelines retain visible content. No new client-side scroll handler or dependency is introduced.

## Inspection

Browser inspection covered desktop EN at 1440×900, mobile ID at 390×844, portrait tablet at 834×1112, and wide landscape at 1280×800. All 54 catalogue entries remained. The desktop introduction was observed sticking at 96px while the catalogue advanced, and mobile category context at 64px after its introduction scrolled away. A stream link landed at its existing target. Checked horizontal overflow, removed borders, heading fit, and reduced motion (all catalogue entries visible, no active product animations).

No automated tests were run. Physical-device frame timing and other browser engines remain unverified.

## Sticky category masking repair — 10 October 2026

Compact sticky headings now paint an opaque ground-colored backdrop through the 64px region above the title and across both page gutters. This prevents outgoing catalogue text appearing above the active category. The backdrop follows the native sticky heading and its section bounds, accepts no pointer events, and applies in normal and reduced motion. Desktop split-column styling stays unchanged.

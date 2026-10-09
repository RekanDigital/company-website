# Businesses portfolio motion revision

Owner approved trying this direction on 9 October 2026. Routes: `/businesses` and `/id/businesses`. Final acceptance remains with the owner.

## Preserved

- Existing point-world hero and interaction, renderer/fallback behavior, fixed point-card views and hover behavior.
- Seven businesses, their order, approved descriptions, localized detail links, and the two existing content groups.
- Shared navigation/page transitions, contact/CTA variant, and footer.
- The four page rules in `about-page-hard-rules.md` govern this revision.

## Composition and motion

- The introduction rises into a compact reading section.
- Three portfolio views show two corporate-engine businesses, then the first two productive-sector businesses, then the remaining three. The latter two views stay within the original productive-sector section, without new category names or duplicate headings.
- Views use their natural content height, with 32px vertical padding and a 24px heading-to-plate gap. Point canvases retain their original full-width square dimensions and projection. Outer frames trim empty canvas space using object-specific projected bounds, including the existing 1.12 hover scale and a safety margin. Subgrid aligns illustration bottoms, titles, descriptions, and action baselines within each row. The static sprite fits inside each trimmed frame while WebGL initializes or remains unavailable.
- Complete ground-colored views rise through 24svh in natural flow, so taller views remain fully readable. Neighboring stages overlap the reserved 12svh tail, avoiding added blank gaps. Complete plates rise with a small stagger; existing headings reveal words horizontally in strict sequence.
- Compact, portrait, and short-window layouts stack plates with their original full-width square canvases inside trimmed point frames. The stage overlap reserve is 6svh. Each plate moves as a complete unit; text is not clipped.
- Section separators are removed. No new scroll handler, renderer, dependency, or invented copy is added.
- Reduced motion retains full visible text and all plates in normal flow.

## Inspection and limits

Inspected desktop EN/ID at 1440×900, mobile ID at 390×844, and portrait tablet at 834×1112. The initial 836px fit used smaller point containers; the owner rejected that reduction. Original square canvas sizes are restored; only empty outer-frame space is trimmed. At 1440×900, canvas widths remain 636.4px for two-card rows and 405.6px for the three-card row. Aligned view heights are approximately 982px, 691px, and 562px. At 390px and 834px viewport widths, square canvas widths remain 335.2px and 762.5px respectively, with no horizontal overflow. All seven original destinations remain. Existing point viewers reached their ready state. Checked horizontal overflow, separator removal, visible surface/plate movement, and reduced motion (no active portfolio animations or hidden heading words).

No automated tests were run. Physical-device frame timing, other browser engines, and forced no-WebGL behavior remain unverified in this revision; renderer/fallback code was not changed.

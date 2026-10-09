# About page hard rules

Owner: Sigit. Recorded 9 October 2026 from the owner's two consecutive About audit requests.
Applies to `/about` and `/id/about`, on desktop, tablet, and mobile.

These requirements govern the next layout and motion revision. They take precedence over earlier implementation choices where those choices conflict. Recording these rules does not mean the current page complies.

## 1. Dedicated section views

Each section must have its own dedicated reading view. Give each section a clear entrance, readable composition, and handoff to the next section. A transition may overlap outgoing and incoming content, but unrelated sections must not compete throughout the reading phase.

A dedicated view is not a requirement to compress long mobile content into one screen. Preserve readable type and complete content; use a coherent extended reading view where needed.

## 2. Efficient use of space

Minimize unnecessary whitespace within sections and between sections, including spaces between texts in one section. Keep headings, figures, labels, and their descriptions visually connected. Avoid compounded section padding and oversized empty scroll stages. Reading holds must serve visible content rather than create blank pauses.

## 3. Seamless flow without separators

Do not allow section separators: lines, borders, ornamental dividers, or other treatments that visibly partition consecutive sections. Sections must flow seamlessly into each other. Audit internal row dividers too; they must not undermine the seamless composition.

## 4. Smooth scroll motion

Transitions, animations, and motions must be smooth, with no stutters between scrolls. Coordinate entrances, reading holds, exits, and section handoffs. Check slow and fast scrolling, stop/resume, and reverse scrolling; avoid sudden position changes, abrupt sticky releases, and discontinuous motion.

Keep glyphs and numbers complete, and preserve the readable reduced-motion fallback. Browser inspection alone does not prove frame-time stability on all devices; report that limit explicitly.

## Relationship to existing locks

Preserve approved copy, assets, solid/dotted typography, sequential word reveals, and gallery photo/text behavior wherever compatible with these rules. The earlier numeric stage heights and gaps in `about-gallery-story-lock.md` are implementation choices subject to revision if they prevent compliance with these newer owner requirements.

## Audit checklist

- Each section has a dedicated reading composition at each breakpoint and in both languages.
- Section and internal text spacing have a visible reading purpose.
- No visible section separator remains, including pseudo-elements and shared-shell boundaries.
- Section handoffs remain continuous during forward, reverse, interrupted, and fast scrolling.
- No clipped text, numbers, horizontal overflow, or hidden content in reduced motion.

## Implementation revision — 9 October 2026

- Hero and the six subsequent reading sections use the available viewport below the 64px header as their minimum height. Longer compact-layout content retains natural height.
- Vision and Mission are separate sections. Values are one grouped reading composition; the five individual sticky stages were removed.
- About section padding is 28–48px, with smaller connected text spacing. Figures retain the approved zig-zag and their staggered entrance.
- Section, Mission, Values, and Corporate Information dividers are removed in normal and reduced-motion states.
- The shared closing/contact card, its CTA, and footer are locked to the homepage treatment. About must not override their frame, margins, colors, motion, content, or interaction. This explicit owner lock takes precedence over interpreting the separator rule as permission to alter the contact card.
- Reading sections rise as full ground-colored surfaces against untransformed stage timelines: 28svh travel on desktop and 18svh on compact layouts. Desktop surfaces have a short sticky reading hold; neighboring stages overlap its reserved space, so it does not add blank inter-section gaps. Compact surfaces stay in natural flow to accommodate long content.
- Figures, Mission rows, Values, and Corporate rows retain staged movement. Both statements retain the previously approved strictly sequential horizontal word fades and their local timeline ranges. Their whole-section surface motion is disabled so the reveal remains the sole text entrance.
- The approved gallery scene remains intact. Its following statement stage overlaps the gallery tail by 28svh to remove the empty handoff without changing pair timing.

Browser inspection covered desktop EN, mobile ID, tablet EN, separator removal, overflow, full Values reading compositions, and tablet reduced motion. The restored surface motion was additionally inspected at two desktop scroll positions and in reverse. Desktop Values decreased from 3,322px to 836px at 1440×900. Reduced motion has no active About animations. Physical-device frame timing and other browser engines remain unverified; no automated tests were run.

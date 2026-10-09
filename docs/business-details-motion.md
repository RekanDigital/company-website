# Business-detail motion

Owner approved implementation on 9 October 2026. Applies to all seven `/businesses/<slug>` routes and their `/id` equivalents on the canonical 4100 prototype.

## Preserved

- Approved content, section order, links, solid/dotted typography, page-switch transitions, hero object dimensions, rotation, hover behavior, and static specimen fallback.
- Existing main-checkout business-detail/content edits, including the separate General Trading supply-chain statement.
- Inquiry actions and the next-business cycle. Food & Beverage keeps its existing inline actions; no new inquiry copy or closing card is added.
- Shared homepage contact/CTA and footer components are unchanged.
- Owner copy revisions shorten the General Trading overview and replace the Food & Beverage downstream statement with “we manage the entire farm-to-market pipeline”. That final statement is left-aligned directly above its existing actions with a 20px gap in both locales.

## Reading composition

The four owner rules in `about-page-hard-rules.md` apply: dedicated reading compositions, efficient spacing, no separators, and continuous scroll motion.

- Section and capability-row borders are removed.
- Sections use 28–44px vertical padding instead of the previous 108px at a 900px desktop height. Overview and standalone statements have a bounded desktop reading view (60svh, capped at 600px); inquiry and compact-layout sections use natural content height to avoid empty pauses before the next-business link.
- Desktop capabilities retain their left heading, sticky at 96px during the reading phase, with complete title/description rows on the right. Additional lists remain grouped without invented headings.
- Portrait, widths up to 1100px, and short windows stack content in normal flow. Long content may extend beyond a viewport.

## Motion

- Untransformed stages drive ground-colored section surfaces through 22svh desktop / 14svh compact upward travel. The ground is the existing `--ground` token, `#F6F8FA`.
- Neighboring stages cancel their 12svh / 6svh handoff reserve; no extra blank scroll track is added. The final next-business stage has no tail reserve.
- Statements reuse the existing strictly sequential horizontal word-fade implementation. Every word has a disjoint local timeline interval; the next word begins after the previous word completes. No glyph clipping or text background is used.
- Capability rows rise 72px as complete title/description pairs on local view timelines. Supporting copy and inquiry blocks use the same existing movement curve.
- The next-business text and specimen rise together; viewer dimensions and projection are unchanged.
- Reduced motion and unsupported scroll-timeline browsers keep all content visible in normal flow. No new dependency, client module, scroll listener, or renderer change is introduced.

## Inspection

Browser inspection covered all seven desktop EN and mobile ID detail routes: original row counts, next-business destinations, separator removal, and horizontal overflow. Technology desktop showed sticky heading at 96px, row movement, partially completed sequential statement words, and forward/reverse scrolling. Agriculture ID at 834×1112 stacks into one column; its capability section decreased from about 1450px to 844px. At 320px no horizontal overflow was observed. Reduced motion has no detail-body animations or hidden statement words. No errors were reported by the inspected browser log.

No automated tests were run. Physical-device frame timing, other browser engines, and forced no-WebGL behavior remain unverified; renderer/fallback code is unchanged. Final design acceptance remains with the owner.

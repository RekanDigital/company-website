# Mobile/tablet interaction repairs — 10 October 2026

Branch: `repairs/mobile-ctas`. Worktree: `/tmp/rekanmu-cta-repairs`.
Final local production preview: `http://127.0.0.1:4103`.

## Repairs

- Home's decorative flight target covered the CTAs and intercepted pointer events even at zero opacity. Set `pointer-events: none`; touch hit tests and navigation reproduce the failure before the fix and pass afterward.
- The mobile/tablet hamburger was missing from the Home flight contrast selectors. Include `.site-menu-toggle` so its bars remain visible on the dark scene. The pre-fix color regression failed; post-fix menu taps and navigation pass.
- Updated the existing worker-failure test to the locked near-black hero CTA color and allowed the no-WebGL loader to complete. Removed a transient closing-style assertion sampled after menu closure; functional close/focus/reopen checks remain.

## Executed checks

Chromium touch contexts: mobile 390×844 and tablet 768×1024, English and Indonesian.

- 44 route/locale/viewport combinations: all 11 approved page routes.
- 686 visible non-menu links activated: 378 internal links and 308 external-protocol links. The 52 same-page hash checks are included in internal links. External clicks were captured with default navigation prevented; no external apps/services were opened.
- 44 keyboard skip-link flows: first Tab and Enter focused main content.
- 40 button/menu tests: open/close/reopen, focus trap, Escape/focus restore, all five menu destinations, language switching across every page plus contact hash, seven business viewer Pause/Resume controls in both locales, reduced-motion control hiding, overflow.
- 36 flight navigation cases: hero CTA, seven business links, closing business CTA × both locales × both viewport sizes.
- 4 dark-flight menu cases: icon contrast, touch opening, About navigation.
- 8 menu-motion tests: EN/ID reopening, missing transition-end recovery, reduced-motion closing.
- 8 fallback checks: reduced motion/keyboard, context loss, no WebGL, worker failure × tablet/mobile.
- Build, typecheck and `git diff --check` passed. The whole-site link audit recorded zero console errors and zero page errors. Representative menu/flight screenshots were inspected.

## Evidence and limits

New regression suites: `tests/home-cta.spec.ts`, `tests/home-menu-flight.spec.ts`, `tests/mobile-interactions.spec.ts`.

Temporary audit evidence: `/tmp/cta-runtime-audit-final-merged-results.json`; runners `/tmp/cta-runtime-audit-final.cjs` and `/tmp/cta-runtime-audit-replay-id-tablet.cjs`. The merged report retains the superseded audit-readiness failure with provenance. Browser runners used `/tmp/cta-playwright.config.ts` to target the isolated preview instead of the existing main server.

A flight initialization timeout and a viewer initialization timeout passed on isolated retries; the final controls suite passed all 40 cases. One keyboard harness attempt ran before the Home static fallback settled and passed after waiting for readiness. These are not physical-device performance measurements.

At the initial audit, the original checkout remained clean and the repairs were isolated, uncommitted and undeployed. Physical devices, Safari/WebKit and external destination availability were not tested. The worktree and evidence under `/tmp` are temporary.

## About first-photo repair — follow-up

The first About photo now fills the entire compact viewport with `object-fit: cover`, cropping at 65% horizontally to retain more central/right team faces. The desktop framing, photos 2–4, and their story layout remain unchanged. Removed the compact landscape aspect-ratio restriction and the 64px sticky header offset.

All 8 dedicated photo tests passed: EN/ID × mobile/tablet × normal/reduced motion. They verify viewport width/height, top-edge alignment, image cover, remaining three photos and no horizontal overflow. Mobile/tablet screenshots were visually inspected. Updated build, typecheck and diff checks passed. Evidence: `/tmp/about-photo-final`; regression: `tests/about-first-photo.spec.ts`.

## Business viewer controls — follow-up

Removed the visible Pause/Resume control from all compact business-detail hero viewers using the existing width <=1100px or portrait/square layout boundary. Desktop landscape retains Pause/Resume. Reduced-motion and fallback behavior are unchanged.

All 32 focused mobile/tablet cases passed: seven slugs in EN/ID plus reduced-motion sweeps. Two desktop tests passed: actual rotation pause/resume/reduced motion and control visibility across 1024px/1180px portrait tablet, 1100px landscape, and 1366px landscape. Paused state survives resizing and Resume returns on wide landscape. Mobile/tablet screenshots were inspected. Build, typecheck and diff checks passed. Evidence: `/tmp/viewer-control-final` and `/tmp/viewer-desktop-final`. This replaces the earlier compact Pause/Resume touch assertions.

## Products category masking — follow-up

Reproduced outgoing product text above the compact sticky category heading. Extended the heading backdrop through the top 64px and both gutters without intercepting clicks. Eight browser cases passed: EN/ID × mobile/tablet × normal/reduced motion, each scrolling all five categories. Screenshots confirm the top region is opaque; no horizontal overflow. Build, typecheck and diff checks passed. Evidence: `/tmp/products-sticky-final`; regression: `tests/products-sticky-heading.spec.ts`.

## Shared header consistency — owner revision, 10 October 2026

The owner requires navigation to remain sticky and transparent at every screen size. Shared header now sticks at top 0 with consistent 64px height; removed the scroll listener/state that painted an opaque desktop background. Home retains its fixed flight overlay, keeps the header above the loading scene, and no longer hides it after the sequence or animates/fades its header/brand out. Menu modal behavior and Home dark-scene contrast remain. This supersedes earlier mobile non-sticky and Home loading-hidden behavior.

Verification: 43 browser cases passed across the focused suites: 9 header cases (66 route/locale/viewport combinations checked at top, middle and bottom, plus Home loading/flight exit), 3 logo checks, 3 loader handoffs, 4 dark-flight menu cases, 8 menu-motion cases, 8 Products category masking cases and 8 About photo cases. Header/Product/About screenshots were inspected. The prior loader test incorrectly expected frame expansion before scrolling; it now checks expansion after scrolling into the flight, retaining logo/background handoff and monotonicity checks. Build, typecheck and diff checks passed. Evidence: `/tmp/header-final`, `/tmp/header-loading-final`, `/tmp/header-menu-final`, `/tmp/header-about-final`. Physical devices and Safari/WebKit remain untested.

## Header background — final owner revision, 10 October 2026

Supersedes the earlier transparent-everywhere instruction: sticky header uses the existing `--ground` page background on all pages and static/reduced-motion Home. During active Home flight scenes only, retain the transparent fixed overlay and existing contrast behavior. After the flight sequence it returns to the ground background; scrolling back into the flight restores transparency.

The header background suite passed 13 cases (two desktop touch-only cases intentionally skipped). It covers 66 route/locale/viewport combinations, normal loading, flight exit, scroll-back, and EN/ID dark-flight menus. White flight text is also gated off outside the flight track so the ground-colored header retains ink navigation. Updated build, typecheck and diff checks passed; page-colored mobile/tablet screenshots were inspected. Evidence: `/tmp/header-background-final`.

Final contrast guard verification also passed all seven focused Home transition/menu cases across desktop/tablet/mobile, including dark-flight → page-content jumps and reverse scrolling. Evidence: `/tmp/header-flight-transition-final`.

## Release checks and owner direction

A clean source copy of the staged repair files passed the production build. Typecheck and diff checks passed. Gallery regression checks were updated for the approved four-photo/story structure (9 cases passed); catalogue bounds checks now measure the final border box rather than transient entrance transforms (2 desktop cases passed); the multiline Agriculture CTA hit test now samples rendered text fragments (desktop EN passed); three desktop hero checks passed after awaiting the existing entrance animation. These are test-harness corrections, with no additional production changes.

The broader 375-case regression attempt recorded 117 passes, 24 failures, 53 skips, 2 interruptions and 179 unexecuted cases. Failures include stale pre-motion About/static-page assertions and flight/layout timing or measurement assertions. The 19-pose retry was interrupted; temporary browser artifacts exhausted storage during the extra runs. The owner directed publishing the already-validated repairs without completing this broader sweep. Do not describe the full regression suite as passing. Dedicated mobile/tablet repair checks above remain the release evidence; physical-device performance and Safari/WebKit remain unverified.

# Project State — RekanMU Company Profile Website

| Project status | Current state |
|---|---|
| Last updated | 2026-10-07 |
| Current phase | Phase 3 — Home experience completion (repo handoff) |
| Phase 2 | Engineering complete in this repository; verified 2026-10-07. Drive tracker sync is pending. |
| Current sprint | Sprint 3 (owner-locked Home completion and visual QA handoff) |
| PM status | Phase 3 implementation handoff active; the Drive Project Tracker remains authoritative for formal PM status. |
| Engineering focus | Implement the approved Home point-world flight and continue Clients & Partners refinement within current owner direction. Preserve locked Home, shared-shell, responsive, and cross-page typography decisions. |
| Active blockers | No technical blockers. Clients & Partners asset and visual refinements remain open owner decisions. |

---

## 1. Authoritative References & Boundaries

- **Drive Project Tracker:** [`rekanmu-website_ProjectTracker`](https://drive.google.com/file/d/1NjRTjkLEQkQjgCYh6O5lkYzaJ2cUcnvp/view?usp=drivesdk) (located in [Drive Project Root](https://drive.google.com/drive/u/0/folders/1yFTz_32GJBcD4YdiKrkGoAEL1ekaKU3F))
- **Project Brief:** [`PROJECT-BRIEF.md`](file:///home/sigisgood/rekanmu/company-website/PROJECT-BRIEF.md) (Approved implementation baseline)
- **Tech Stack:** [`TECH-STACK.md`](file:///home/sigisgood/rekanmu/company-website/TECH-STACK.md) (Locked technical architecture)
- **Design Handoff:** [`design-docs/`](file:///home/sigisgood/rekanmu/company-website/design-docs/) (Approved design package by Dinda Punjung Puji Safitri)
- **Content Authority:** [`plans/page-maps/`](file:///home/sigisgood/rekanmu/company-website/plans/page-maps/) (Bilingual English / Indonesian copy authority)
- **Brand & Assets:** [`resources/`](file:///home/sigisgood/rekanmu/company-website/resources/) & [`design-docs/assets/`](file:///home/sigisgood/rekanmu/company-website/design-docs/assets/)
- **Governance:** [`AGENTS.md`](file:///home/sigisgood/rekanmu/company-website/AGENTS.md) (Codex engineering ownership) & [`GEMINI.md`](file:///home/sigisgood/rekanmu/company-website/GEMINI.md) (Antigravity operational ownership)

---

## 2. Phase 2 completion and Phase 3 handoff

**Phase 2 engineering delivery is complete in the repository.** The static-page templates, Home catalogue/partner marquee, and Businesses live point renderer are present and covered by the checks listed in Recent Verified Changes. The following statuses describe observed engineering delivery; they do not imply formal PM acceptance or update the Drive tracker.

The full cross-phase backlog and formal lifecycle tracking remain authoritative in the [Drive Project Tracker](https://drive.google.com/file/d/1NjRTjkLEQkQjgCYh6O5lkYzaJ2cUcnvp/view?usp=drivesdk). The tracker has not been synchronized by this repository update.

| PhaseID | TaskID | TaskDescription | Owner | Status | Priority | StartDate | DueDate | CommitLink | DocLink | Sprint |
|---|---|---|---|---|---|---|---|---|---|---|
| P2 | T2.3 | Static Page Assembly (About, Products & Services catalogue, Businesses list, Business detail template) | Codex | Engineering complete — verified | High | 2026-10-07 | 2026-10-10 | — | [`plans/page-maps/`](file:///home/sigisgood/rekanmu/company-website/plans/page-maps/) | Sprint 2 |
| P3 | T3.1 | Home Sliding Products & Services Section & Partners Marquee | Codex | Engineering complete — verified; delivered during Sprint 2 | Medium | 2026-10-10 | 2026-10-12 | — | [`design-docs/prototypes/`](file:///home/sigisgood/rekanmu/company-website/design-docs/prototypes/) | Sprint 2 |
| P3 | T3.2 | Businesses Hero Live Point Renderer (Plain WebGL, binary point asset) | Codex | Engineering complete — verified; delivered during Sprint 2 | High | 2026-10-12 | 2026-10-15 | — | [`design-docs/prototypes/businesses-hero.source.js`](file:///home/sigisgood/rekanmu/company-website/design-docs/prototypes/businesses-hero.source.js) | Sprint 2 |

T3.1 and T3.2 have PhaseID P3, but their engineering implementation landed during Sprint 2. Their completion does not close Phase 3; the Home point-world flight and owner-directed Partners refinement remain open below.

### Phase 3 no-drift guardrails

Phase 3 must implement the approved experience without reopening locked design decisions. Start with [`docs/homepage-layout-locks.md`](docs/homepage-layout-locks.md), then consult [`design-docs/DECISIONS.md`](design-docs/DECISIONS.md), [`design-docs/DESIGN-SYSTEM.md`](design-docs/DESIGN-SYSTEM.md), and [`design-docs/DESIGN.md`](design-docs/DESIGN.md). The project owner’s explicit locks take precedence over older mockup/prototype defaults.

- **Home hero:** At 901 px and wider, preserve the 120.6 px headline / 751.2 px text column / five-line composition at 1440 × 900, the square geometry, and CTA placement. This desktop override must not leak into tablet/mobile; see the precise formulas in `DECISIONS.md` and `DESIGN-SYSTEM.md`.
- **Products & Services:** This section is locked. At 1440 × 900 its title is about 100 px (83% of the hero), and its count, stream names, lead and descriptions use the documented title ratios. Above 820 px keep the one-screen opening panel and linear pinned row. At 820 px and below keep the five categories stacked, content-sized, with descriptions open and the documented count/title/gap proportions. Never restore the pinned row on tablet/mobile or add excess panel height, overlap or overflow.
- **Other-page display proportions:** Preserve the approved Home-relative scale on About, Products & Services, Businesses, and business-detail pages: hero titles match Home at 901 px and wider; primary section titles match 83% of the Home hero from 821 px and wider. Keep Home unchanged, preserve compact business-detail capability/inquiry headings, and do not alter existing type below 821 px.
- **Clients & Partners:** Current owner-directed refinement: use all eleven supplied full-color partner PNGs, larger and denser, with no logo hover state and no marquee pause on pointer. The heading’s local dot visibility floor is documented in `DESIGN-SYSTEM.md`. This section is still being refined and is not marked finally locked; do not revert the current direction while Sprint 3 work proceeds.
- **Shared shell:** The desktop header and tablet/mobile menu are owner-locked. The footer is owner-locked, including its seamless surface, four-column content order, directly stacked email/phone, social links, proportional point field and cursor spotlight. Do not change either without new owner direction.
- **Observed Home implementation (2026-10-07):** `FoundationPage` currently renders the hero, `HomeCatalogue` (Products & Services and Clients & Partners), and closing card; `Document` supplies the shared header and footer. The approved Home point-world flight and its text chapters are not currently mounted in this route. Their design remains governed by `design-docs/prototypes/home.html` and `design-docs/prototypes/home-scene/`; treat the scene as pending implementation, not an open redesign.
- **Phase 3 scope boundary:** The approved Home point-world flight remains an outstanding implementation item. Build it from `design-docs/prototypes/home.html` and `design-docs/prototypes/home-scene/`, preserving the locked map, chapter order, business stops, camera, and timing. Continue the Partners section only within the full-color/no-pointer direction above; final visual refinement and asset selection remain open for owner review. Do not invent page content, claims, routes, assets, or interactions.
- **Regression gate:** Validate English and Indonesian at 1440 × 900, 768 × 1024 and 390 × 844, plus 320 px for narrow content fit. Check reduced motion, keyboard focus, pointer behavior, clipping and horizontal overflow. Keep `tests/home-hero.spec.ts` and `tests/home-catalogue.spec.ts` aligned with owner locks; do not weaken their layout assertions to make a redesign pass.

---

## 3. Recent Verified Changes

- **2026-10-07:** Sprint 1 engineering foundation verified and accepted ([`d4eb7f9`](https://github.com/RekanDigital/company-website/commit/d4eb7f9)). Next.js 16 App Router, Tailwind v4, Geist fonts, tokens, responsive shell, and UI component suite fully verified across 24 SSG pages and 34 passing Playwright test suites (0 failures).
- **2026-10-07:** Master Drive project tracker synchronized; Sprint 1 tasks (T1.1, T1.2, T2.1, T2.2) marked Done (overall project completion 46.2%). Sprint 2 active.
- **2026-10-07:** Repository Phase 2 engineering delivery marked complete after static-page, Home catalogue/hero, and Businesses hero Playwright verification. Phase 3 handoff is active; the Home point-world flight remains unmounted and Clients & Partners remains in owner-directed refinement. Drive tracker synchronization remains outstanding.
- **2026-10-06:** Baseline design handoff received, integration locked, operational PM baseline established, cloud repository initialized at `RekanDigital/company-website`.

---

## 4. Synchronization Notes

- **Engineering Execution:** Codex is the sole owner of code implementation under `src/` or Next.js app structure.
- **PM Tracking:** Antigravity maintains task progression, blockers, and alignment with approved Drive/repo artifacts.
- **Copy Changes:** No copy invention permitted. Any discrepancy between design mockups and page maps resolves in favor of `plans/page-maps/`.

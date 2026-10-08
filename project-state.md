# Project State — RekanMU Company Profile Website

| Project status | Current state |
|---|---|
| Last updated | 2026-10-08 |
| Current phase | Phase 3 — Home flight and bilingual route implementation complete; release validation remains |
| Phase 2 | Complete & verified in repo ([`0c2ce90`](https://github.com/RekanDigital/company-website/commit/0c2ce90e9f8419e2d5667c9f46a14d3943e23f84)). Drive tracker synchronized. |
| Current sprint | Sprint 3 Home delivery complete; approved business-view and About slideshow commits through `f23a406` are integrated locally; current working-tree and documentation changes remain uncommitted |
| PM status | T3.3 and T4.1 are verified in the repository. This update does not modify the Drive tracker; its last recorded sync here was 69.2% after Sprint 2. |
| Engineering focus | Complete real-device WebGL performance validation before release and continue the owner-directed Clients & Partners refinement. Further Home immersion improvements remain deferred. |
| Active blockers | No blocker to Sprint 3 implementation. Real-device performance validation and final Clients & Partners direction remain open. |

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

## 2. Phase 2 Completion & Sprint 3 Delivery

**Phase 2 engineering delivery is accepted and verified.** Static-page templates, Home catalogue/partner marquee, and Businesses live point renderer are committed and covered by the 99 passing Playwright tests. Master Drive Project Tracker is synchronized (overall completion: 69.2%).

### Completed Sprint 2 Tasks

| PhaseID | TaskID | TaskDescription | Owner | Status | Priority | StartDate | DueDate | CommitLink | DocLink | Sprint |
|---|---|---|---|---|---|---|---|---|---|---|
| P2 | T2.3 | Static Page Assembly (About, Products & Services catalogue, Businesses list, Business detail template) | Codex | Done | High | 2026-10-07 | 2026-10-07 | [`0c2ce90`](https://github.com/RekanDigital/company-website/commit/0c2ce90e9f8419e2d5667c9f46a14d3943e23f84) | [`plans/page-maps/`](file:///home/sigisgood/rekanmu/company-website/plans/page-maps/) | Sprint 2 |
| P3 | T3.1 | Home Sliding Products & Services Section & Partners Marquee | Codex | Done (Delivered in Sprint 2) | Medium | 2026-10-07 | 2026-10-07 | [`0c2ce90`](https://github.com/RekanDigital/company-website/commit/0c2ce90e9f8419e2d5667c9f46a14d3943e23f84) | [`design-docs/prototypes/`](file:///home/sigisgood/rekanmu/company-website/design-docs/prototypes/) | Sprint 2 |
| P3 | T3.2 | Businesses Hero Live Point Renderer (Plain WebGL, binary point asset) | Codex | Done (Delivered in Sprint 2) | High | 2026-10-07 | 2026-10-07 | [`0c2ce90`](https://github.com/RekanDigital/company-website/commit/0c2ce90e9f8419e2d5667c9f46a14d3943e23f84) | [`design-docs/prototypes/businesses-hero.source.js`](file:///home/sigisgood/rekanmu/company-website/design-docs/prototypes/businesses-hero.source.js) | Sprint 2 |

### Sprint 3 Tasks

| PhaseID | TaskID | TaskDescription | Owner | Status | Priority | StartDate | DueDate | CommitLink | DocLink | Sprint |
|---|---|---|---|---|---|---|---|---|---|---|
| P3 | T3.3 | Home Scene Three.js Point-World Integration (Timeline, camera, stops, frame, through-the-square) | Codex | Done — verified in repo | High | 2026-10-07 | 2026-10-10 | — | [`docs/homepage-layout-locks.md`](docs/homepage-layout-locks.md), [`design-docs/prototypes/home-scene/`](file:///home/sigisgood/rekanmu/company-website/design-docs/prototypes/home-scene/) | Sprint 3 |
| P4 | T4.1 | Bilingual Content Ingestion (EN/ID toggle, metadata, strict copy fidelity) | Codex | Done — verified in repo | High | 2026-10-07 | 2026-10-12 | — | [`docs/development.md`](docs/development.md), [`plans/page-maps/PAGE-MAP.md`](file:///home/sigisgood/rekanmu/company-website/plans/page-maps/PAGE-MAP.md) | Sprint 3 |

**Sprint 3 verification (2026-10-07):** Typecheck and production build passed. The full Playwright matrix reported 139 passed and 29 skipped across desktop, tablet, and mobile. All 19 approved Home flight reference positions were captured; representative opening and mid-flight poses were visually compared with the references. The Home point generation runs in a Worker; reduced-motion, unavailable-WebGL, worker-error, and context-loss fallbacks passed. Real-device performance has not been measured. `CommitLink` remains `—` because this delivery has not been committed.

### Phase 3 no-drift guardrails

Phase 3 must implement the approved experience without reopening locked design decisions. Start with [`docs/homepage-layout-locks.md`](docs/homepage-layout-locks.md), then consult [`design-docs/DECISIONS.md`](design-docs/DECISIONS.md), [`design-docs/DESIGN-SYSTEM.md`](design-docs/DESIGN-SYSTEM.md), and [`design-docs/DESIGN.md`](design-docs/DESIGN.md). The project owner’s explicit locks take precedence over older mockup/prototype defaults.

- **Home hero:** At 901 px and wider, preserve the 120.6 px headline / 751.2 px text column / five-line composition at 1440 × 900, the square geometry, and CTA placement. This desktop override must not leak into tablet/mobile; see the precise formulas in `DECISIONS.md` and `DESIGN-SYSTEM.md`.
- **Products & Services:** This section is locked. At 1440 × 900 its title is about 100 px (83% of the hero), and its count, stream names, lead and descriptions use the documented title ratios. Above 820 px keep the one-screen opening panel and linear pinned row. At 820 px and below keep the five categories stacked, content-sized, with descriptions open and the documented count/title/gap proportions. Never restore the pinned row on tablet/mobile or add excess panel height, overlap or overflow.
- **Other-page display proportions:** Preserve the approved Home-relative scale on About, Products & Services, Businesses, and business-detail pages: hero titles match Home at 901 px and wider; primary section titles match 83% of the Home hero from 821 px and wider. Keep Home unchanged, preserve compact business-detail capability/inquiry headings, and do not alter existing type below 821 px.
- **Clients & Partners:** Current owner-directed refinement: use all eleven supplied full-color partner PNGs, larger and denser, with no logo hover state and no marquee pause on pointer. The heading’s local dot visibility floor is documented in `DESIGN-SYSTEM.md`. This section is still being refined and is not marked finally locked; do not revert the current direction while Sprint 3 work proceeds.
- **Shared shell:** The desktop header and tablet/mobile menu are owner-locked. The footer is owner-locked, including its seamless surface, four-column content order, directly stacked email/phone, social links, proportional point field and cursor spotlight. Do not change either without new owner direction.
- **Observed Home implementation (2026-10-07):** `FoundationPage` mounts `HomeScene` on both localized Home routes, followed by `HomeCatalogue` and the closing card; the shared document supplies the header and footer. The flight follows `design-docs/prototypes/home.html` and `design-docs/prototypes/home-scene/`. English/Indonesian copy and localized route metadata are implemented.
- **Phase 3 scope boundary:** Preserve the approved Home map, chapter order, business stops, camera, and timing. The flight is implemented; further immersion improvements are deferred by owner direction. Continue Clients & Partners only within the full-color/no-pointer direction above; its final visual refinement and asset selection remain open for owner review. Do not invent page content, claims, routes, assets, or interactions.
- **Regression gate:** Validate English and Indonesian at 1440 × 900, 768 × 1024 and 390 × 844, plus 320 px for narrow content fit. Check reduced motion, keyboard focus, pointer behavior, clipping and horizontal overflow. Keep `tests/home-hero.spec.ts`, `tests/home-catalogue.spec.ts`, `tests/home-scene.spec.ts`, and `tests/locale-metadata.spec.ts` aligned with owner locks; do not weaken layout assertions to make a redesign pass.

---

## 3. Recent Verified Changes

- **2026-10-07:** Sprint 1 engineering foundation verified and accepted ([`d4eb7f9`](https://github.com/RekanDigital/company-website/commit/d4eb7f9)). Next.js 16 App Router, Tailwind v4, Geist fonts, tokens, responsive shell, and UI component suite fully verified across 24 SSG pages and 34 passing Playwright test suites (0 failures).
- **2026-10-07:** Master Drive project tracker synchronized; Sprint 1 tasks (T1.1, T1.2, T2.1, T2.2) marked Done (overall project completion 46.2%). Sprint 2 active.
- **2026-10-07:** Sprint 2 engineering delivery verified and committed ([`0c2ce90`](https://github.com/RekanDigital/company-website/commit/0c2ce90e9f8419e2d5667c9f46a14d3943e23f84)). T2.3 (Static pages), T3.1 (Home catalogue & partners marquee), and T3.2 (Businesses hero WebGL renderer) passed 99 Playwright tests. Phase 2 completed; the Drive tracker was synchronized to 69.2% as Sprint 3 began.
- **2026-10-07:** Sprint 3 implementation verified in the working tree. T3.3 (Home point-world flight) and T4.1 (bilingual Home content and localized metadata) are complete; typecheck and production build passed; Playwright reported 139 passed and 29 project-conditional skips across desktop, tablet, and mobile. All 19 approved flight poses were captured, with representative poses visually compared to references. Changes remain uncommitted; real-device WebGL performance validation remains open.
- **2026-10-08:** Approved assets-integration commits `70d9cf2`, `37fd18f`, and `f23a406` were fast-forwarded into the local `assets-integration` branch; they are not pushed. The change adds business point viewers and the About photo slideshow. Fresh typecheck passed; 9 static-page route/layout checks passed with the configured three workers; the Businesses hero suite reported 19 passed and 2 skipped. Four cases that timed out under the initial parallel run passed when rerun after increasing only their outer test budgets.
- **2026-10-06:** Baseline design handoff received, integration locked, operational PM baseline established, cloud repository initialized at `RekanDigital/company-website`.

---

## 4. Synchronization Notes

- **Engineering Execution:** Codex is the sole owner of code implementation under `src/` or Next.js app structure.
- **PM Tracking:** Antigravity maintains task progression, blockers, and alignment with approved Drive/repo artifacts.
- **Copy Changes:** No copy invention permitted. Any discrepancy between design mockups and page maps resolves in favor of `plans/page-maps/`.

# RekanMU Company Profile Website — Project Brief

**Status:** Approved implementation baseline  
**Project:** PT Rekan Makmur Utama / RekanMU company-profile website  
**Project state:** Greenfield implementation

## 1\. Objective

Design and build the official public company-profile website for PT Rekan Makmur Utama (RekanMU).

The website should translate the company's existing profile material into a high-quality web experience that is credible, clear, responsive, accessible, performant, and suitable for public-facing corporate use.

The project uses the approved experimental design package in `design-docs/`. Its visual language, interaction model, motion behavior, page composition, responsive defaults, point-world imagery, and experience-specific implementation requirements are defined by that package.

This is a greenfield project. Deleted or superseded website concepts, prototypes, plans, visual directions, and implementation decisions remain outside the baseline. The approved `design-docs/` package is explicitly part of the current baseline.

## 2\. Authoritative Source Material

The current factual, commercial, and brand sources are:

- `resources/COMPANY-PROFILE` — authoritative company-profile and corporate source material;  
- `resources/assets/logo-rekanmu` — official RekanMU brand mark;  
- `Product & Pricelist - RekanDigital` — approved source for the current product and service catalogue.

The company-profile material is the source of truth for public corporate information currently available to the project.

The approved product catalogue is the source of truth for product and service names and their stated functional scope. Internal commercial fields such as base cost, recommended pricing, gross margin, target-customer notes, prioritization/wave status, and delivery economics are not public website content unless separately approved.

For implementation-facing public copy, routes, CTA wording, and page-level content, use the approved bilingual documents under `plans/page-maps/`. Those documents normalize the approved source material for the website and are the direct content authority during implementation.

The official logo is the source of truth for the current RekanMU brand mark.

## 3\. Content Governance

All public-facing claims about RekanMU must be supported by the authoritative source material or by later approved project documents.

The implementation may adapt source material for web readability, hierarchy, navigation, and presentation, but it must not:

- invent company capabilities, clients, partnerships, achievements, numbers, locations, certifications, or market claims;  
- materially change the meaning of source-supported statements;  
- present assumptions or inferred information as established company facts;  
- silently import content from deleted or superseded website plans.

When the source material is incomplete or ambiguous, the implementation should preserve that uncertainty rather than fill the gap with unsupported content.

Individual commercial product and service names belong on the approved Products & Services catalogue page. Business-detail pages describe the related capabilities and activities in generic terms and link to the standalone catalogue.

## 4\. Website Type

The initial product is a public corporate/company-profile website.

Its purpose is to:

- establish RekanMU's identity and positioning;  
- communicate the company's business areas and capabilities;  
- present the approved product and service catalogue through a dedicated public route;  
- present relevant company information in a web-native format;  
- provide a credible point of reference for prospective clients, partners, stakeholders, and other public visitors;  
- provide clear paths to company contact information and relevant business information.

## 5\. Initial Scope

The initial website includes:

- public company-profile content;  
- a standalone Products & Services catalogue at `/products-services`;  
- capability-level product/service context embedded in relevant business-detail copy without naming individual products there;  
- responsive desktop, tablet, and mobile experiences;  
- navigation and page structure appropriate to the approved content;  
- company branding and approved design system;  
- approved imagery and visual assets;  
- the experimental web experience defined by the approved `design-docs/` package;  
- accessibility and reduced-motion behavior;  
- technical SEO and metadata appropriate to a public corporate site;  
- production-ready implementation and deployment.

The information architecture, page composition, visual language, and interaction model are governed by the approved content documents and the approved `design-docs/` package according to the authority rules below.

## 6\. Design Inputs and Authority

The approved design handoff is located in `design-docs/` and is part of the active project baseline.

Read it in this order:

1. `design-docs/README.md` — engineering handoff and build order.  
2. `design-docs/DESIGN.md` — page composition, interaction, responsive defaults, and authority by artefact.  
3. `design-docs/DESIGN-SYSTEM.md` — visual foundations, tokens, components, and motion rules.  
4. `design-docs/DECISIONS.md` — locked, rejected, and integration-locked decisions.
5. `docs/homepage-layout-locks.md` — repository Sprint 3 handoff for current Home layout locks, responsive behavior, section states, and regression checks. It summarizes owner decisions and does not supersede `DECISIONS.md`.
6. `design-docs/CONTENT-MAP.md` — mapping from approved content documents into the design.
7. `design-docs/ASSETS.md` — asset inventory, generation sources, and remaining asset work.

Supporting implementation references live under `design-docs/pages/`, `design-docs/components/`, `design-docs/prototypes/`, `design-docs/assets/`, `design-docs/tokens/`, and `design-docs/tools/`.

Authority is separated by concern:

- Approved page-map/content documents are the authority for public copy, factual claims, CTA wording, catalogue content, and routes.  
- `design-docs/DESIGN.md`, `design-docs/DESIGN-SYSTEM.md`, and the artefacts they designate are the authority for composition, visual treatment, interaction, motion, responsive defaults, and implementation fidelity.  
- `design-docs/DECISIONS.md` section 3, Integration lock — 6 October 2026, is the final authority for design decisions that were previously open or provisional.  
- `TECH-STACK.md` is the final authority for technology and engineering architecture. If an older explanatory sentence elsewhere conflicts with it, `TECH-STACK.md` wins.  
- When a mockup contains text that differs from approved content, the approved content document wins.  
- When prose design documentation conflicts with a prototype or mockup that `design.md` explicitly designates as authoritative for that part, the designated prototype or mockup wins unless superseded by the integration lock.  
- Deleted or superseded visual concepts and the earlier `plans/asset-maps/HOME.md` are not implementation sources.

## 7\. Technical Foundation

Engineering decisions are defined separately in:

- `TECH-STACK.md`

The implementation must follow the locked technical baseline in that document unless the project owner explicitly approves a change.

The current locked foundation includes Next.js App Router, React, TypeScript, Tailwind CSS v4, pnpm, server/static-first rendering, Three.js only for the Home point-world scene, plain WebGL for the Businesses hero, and Playwright for browser and visual QA.

## 8\. Quality Requirements

The completed site must be:

- responsive across desktop, tablet, and mobile;  
- accessible and usable with keyboard navigation;  
- compatible with reduced-motion preferences;  
- performant and efficient in its use of client-side JavaScript;  
- free of avoidable layout shift, clipping, overlap, overflow, and broken responsive states;  
- semantically structured;  
- maintainable and understandable by future contributors;  
- suitable for production deployment.

Responsive behavior must be designed deliberately rather than treated as a desktop layout patched for smaller screens.

Both English and Bahasa Indonesia layouts must be validated in the actual implementation.

## 9\. Implementation Principles

- Preserve factual accuracy.  
- Prefer the simplest implementation that satisfies the approved design.  
- Treat the approved design as a system, not as a collection of isolated screenshots.  
- Build reusable components where repetition or shared behavior justifies them.  
- Do not abstract prematurely.  
- Use client-side interactivity only where it adds real value.  
- Keep the two WebGL experiences isolated from ordinary page content.  
- Test the real implementation in browsers throughout development.  
- Treat accessibility, performance, responsive behavior, reduced motion, and non-WebGL fallbacks as part of implementation rather than post-build cleanup.  
- Generate missing design-derived visual assets from the supplied point-world source rather than substituting unrelated imagery.

## 10\. Explicit Non-Goals for the Initial Version

Unless later requirements add them, the initial project does not include:

- CMS integration;  
- database;  
- authentication;  
- user accounts;  
- application backend;  
- ecommerce;  
- customer portal;  
- administrative dashboard;  
- unsupported marketing claims;  
- functionality unrelated to the company-profile website;  
- a route-transition system unless separately designed and approved;  
- a signature custom 404 experience unless separately designed and approved.

## 11\. Roles and Decision Authority

### Project owner

The project owner retains final authority over project scope, approved content, design direction, and major technical changes.

### Codex

Codex owns the website's design-to-implementation engineering work within the approved project brief, technical stack, design documents, repository rules, and available project tooling.

Codex may make implementation-level decisions needed to reproduce the approved design, including responsive refinement, code architecture, performance optimization, accessibility implementation, fallback behavior, asset generation from approved sources, and package-level choices within the locked technology families.

Codex must not redefine approved company facts, project intent, routes, content authority, design language, or locked design decisions without explicit approval.

## 12\. Current Baseline

The implementation baseline consists of:

- the authoritative company-profile and legal source material under `resources/`;  
- the official RekanMU logo and approved partner assets under `resources/assets/`;  
- the approved Product & Pricelist catalogue as the source for Products & Services;  
- the approved page map and bilingual page-content documents under `plans/page-maps/`;  
- this project brief;  
- the locked `TECH-STACK.md`;  
- the approved `design-docs/` engineering handoff, including the design system, integration decisions, prototypes, page mockups, full-page screenshots, component references, tokens, point-world assets, source code, reference renders, and generation tooling;  
- the project-local engineering rules, skills, and tooling used by Codex.

Implementation must reproduce the approved design using the approved content without reintroducing deleted concepts or inventing unsupported content.

## 13\. Implementation Readiness and Handoff

The project is ready to move into local Codex implementation. No additional product, information-architecture, visual-direction, or technology-selection phase is required before scaffolding and building the site.

The following remaining work is part of implementation and is not a design blocker:

- instantiate the shared business-detail template for all seven business routes;  
- populate all five Products & Services streams from the approved catalogue content;  
- generate the six remaining tall business-object renders from the supplied point-world source;  
- generate the five clean menu views without the blue frame from the supplied point-world source;  
- implement and validate Bahasa Indonesia layouts and language state/routing;  
- refine tablet and mobile layouts using the approved responsive defaults without changing the design language;  
- implement reduced-motion and no-WebGL fallbacks;  
- optimize and validate the Home and Businesses WebGL experiences on real devices;  
- prepare ordinary production metadata assets such as favicon and Open Graph imagery as part of implementation;  
- replace the raster logo with a vector version if an approved vector becomes available before release.

Real social links are not required to start implementation. The social column remains hidden until approved URLs exist.

The recommended build order is the one defined in `design-docs/README.md`: tokens and base → shared shell → reusable components → static pages → Home post-scene sections → Businesses hero → Home scene → bilingual/responsive/accessibility/fallback work → Playwright and visual QA.

For the local implementation workspace, the baseline material that must be available to Codex is:

- `PROJECT-BRIEF.md`;  
- `TECH-STACK.md`;  
- `plans/page-maps/`;  
- `design-docs/`;  
- the relevant source and approved assets under `resources/`.

Once those materials are present in the local repository, Codex may begin implementation directly.

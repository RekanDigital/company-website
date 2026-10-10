# RekanMU Company Profile Website

Official public company-profile website for **PT Rekan Makmur Utama (RekanMU)**.

## Prototype Environments

- **Live Hosted Prototype:** [https://rekanmu.netlify.app](https://rekanmu.netlify.app) (Deployed on Netlify)
- **Canonical Local Prototype:** `http://127.0.0.1:4100` (Local design canvas; source is `/home/sigisgood/rekanmu/company-website` on `main`)

See [prototype authority and operation](docs/canonical-prototype.md) and [Netlify hosting](docs/netlify-hosting.md).

---

## 1. Project Overview & Purpose

This repository houses the public-facing corporate website for PT Rekan Makmur Utama. The website establishes RekanMU's corporate positioning, communicates its business pillars and capabilities, and presents the approved Products & Services catalogue through a dedicated public experience.

The site is built according to the approved experimental design baseline, featuring a point-world visual system, interactive 3D/WebGL experiences on designated routes, and an accessible, static-first responsive architecture.

---

## 2. Technical Stack Summary

Architecture and technical constraints are locked in [`TECH-STACK.md`](file:///home/sigisgood/rekanmu/company-website/TECH-STACK.md):

- **Framework:** Next.js (App Router)
- **Language & Runtime:** TypeScript, React
- **Styling:** Tailwind CSS v4, custom design tokens ([`design-docs/tokens/tokens.css`](file:///home/sigisgood/rekanmu/company-website/design-docs/tokens/tokens.css))
- **Package Manager:** pnpm
- **Typography:** Geist & Geist Mono
- **Rendering Strategy:** Static-first, React Server Components by default; Client Components restricted to interactive elements.
- **Interactive Visuals:**
  - **Home Point-World:** Three.js scroll-driven scene; point generation runs in a module Worker. Reduced motion and WebGL/Worker failures use the complete static Home content ([`design-docs/prototypes/home-scene/`](file:///home/sigisgood/rekanmu/company-website/design-docs/prototypes/home-scene/), [`docs/homepage-layout-locks.md`](docs/homepage-layout-locks.md)).
  - **Businesses Hero:** Plain WebGL point renderer with binary point data ([`design-docs/prototypes/businesses-hero.source.js`](file:///home/sigisgood/rekanmu/company-website/design-docs/prototypes/businesses-hero.source.js)).
  - **Business Views:** Plain WebGL point viewers on business plates and business-detail hero/Next sections, with matching static specimens as fallback.
  - **About:** Four approved team photographs in a scroll-driven desktop slideshow; mobile/tablet and reduced-motion layouts stack the images.
  - **Other inner-page content:** Server-rendered HTML/CSS/React with approved still assets; no other WebGL.

English and Indonesian Home content and route metadata share the approved locale-specific copy. See [`docs/development.md`](docs/development.md) for runtime behavior and current verification.

---

## 3. Authoritative Source Documents

Development and content must strictly follow the approved project baseline:

1. **Project Brief & Governance:** [`PROJECT-BRIEF.md`](file:///home/sigisgood/rekanmu/company-website/PROJECT-BRIEF.md)
2. **Technical Specifications:** [`TECH-STACK.md`](file:///home/sigisgood/rekanmu/company-website/TECH-STACK.md)
3. **Design Handoff & Specifications:** [`design-docs/README.md`](file:///home/sigisgood/rekanmu/company-website/design-docs/README.md)
   - Layout & interaction: [`design-docs/DESIGN.md`](file:///home/sigisgood/rekanmu/company-website/design-docs/DESIGN.md)
   - Visual tokens & components: [`design-docs/DESIGN-SYSTEM.md`](file:///home/sigisgood/rekanmu/company-website/design-docs/DESIGN-SYSTEM.md)
   - Locked decisions: [`design-docs/DECISIONS.md`](file:///home/sigisgood/rekanmu/company-website/design-docs/DECISIONS.md)
   - Asset inventory: [`design-docs/ASSETS.md`](file:///home/sigisgood/rekanmu/company-website/design-docs/ASSETS.md)
4. **Content & Copy Authority:** [`plans/page-maps/`](file:///home/sigisgood/rekanmu/company-website/plans/page-maps/)
   - Content map: [`plans/page-maps/PAGE-MAP.md`](file:///home/sigisgood/rekanmu/company-website/plans/page-maps/PAGE-MAP.md)
   - Catalogue: [`plans/page-maps/PRODUCTS-SERVICES.md`](file:///home/sigisgood/rekanmu/company-website/plans/page-maps/PRODUCTS-SERVICES.md)
5. **Brand & Assets:** [`resources/`](file:///home/sigisgood/rekanmu/company-website/resources/)

---

## 4. Operating Roles & Governance

- **Sigit Dani Perkasa:** Project Director & Final Authority.
- **Codex:** Primary engineering executor owning all software implementation, architecture files, tests, build configurations, and components.
- **Antigravity:** Operational execution agent managing project records, PM state ([`project-state.md`](file:///home/sigisgood/rekanmu/company-website/project-state.md)), synchronization, and repository hygiene.

Detailed project tracking is maintained in the [Google Drive Project Tracker](https://drive.google.com/file/d/1NjRTjkLEQkQjgCYh6O5lkYzaJ2cUcnvp/view?usp=drivesdk); compact active sprint state is maintained in [`project-state.md`](file:///home/sigisgood/rekanmu/company-website/project-state.md).

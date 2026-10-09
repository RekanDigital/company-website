# Local development

Requirements: Node.js 20.9+ and pnpm 10.34.6. No global installation is needed.

```sh
pnpm install --frozen-lockfile
pnpm dev --port 3100
pnpm typecheck
pnpm build
pnpm test
```

If pnpm is unavailable, run each command through `npm exec --yes --package pnpm@10.34.6 -- pnpm`, for example:

```sh
npm exec --yes --package pnpm@10.34.6 -- pnpm dev --port 3100
```

Both development and production servers bind to `127.0.0.1`. The browser checks use port 3100 and reuse an existing local development server. Install Chromium with `pnpm exec playwright install chromium` if it is not already available.

English routes use `/`; Indonesian routes use `/id`. The language switch preserves the current route and contact anchor. Both locales are prerendered with localized document language, title and description.

## Canonical design canvas

The owner-designated prototype runs at **http://127.0.0.1:4100** from **`/home/sigisgood/rekanmu/company-website`**. Use this checkout for current design work. The 3100 commands and historical checks above describe the separate baseline. See [canonical-prototype.md](canonical-prototype.md).

## Current application behavior

- `FoundationPage` renders approved page bodies. `HomeScene` mounts only on localized Home routes; the Businesses hero and business pages load plain-WebGL point viewers on demand.
- Business overview/detail viewers use supplied binary point data and matching static specimens as the WebGL fallback. The rotating business-detail hero pauses on pointer hover, focus, off-screen state, and reduced motion.
- About starts with four approved team photographs. Supported desktop scroll timelines cross-fade the images; tablet/mobile, reduced-motion, and unsupported-browser layouts show them as a static vertical sequence.
- The Home flight uses Three.js after first paint. A module Worker generates the point data and transfers its typed-array buffers to the renderer. The normal point count is 672,052; low-memory or compact viewports use 376,041.
- The approved flight uses a 20-viewport scroll track and a sticky viewport-sized stage. DOM headings, descriptions and links remain available independently of the canvas.
- Reduced motion, unavailable WebGL, Worker failure and WebGL context loss switch the Home scene to its complete static reading flow. This preserves the content and links without requiring the flight.
- Home titles and descriptions are generated from the localized page content. Both locale layouts currently set `noindex,nofollow`; changing that for public release remains a release decision.

In development only, `/?components=1` and `/id?components=1` show component specimens using approved content. This adds no public route and is excluded from production rendering.

The production source contains normalized approved copy, design tokens and required assets; it does not import ignored handoff documents at runtime. Preserve the original handoff under `design-docs/`, `plans/` and `resources/` for fidelity checks.

`node tools/render-menu.mjs` regenerates the five approved menu stills from the Home scene source. It is offline asset tooling and is separate from the Home runtime renderer.

Browser screenshots and failure traces are written under `test-results/` and are ignored by Git.

## Sprint 3 verification — 7 October 2026

Typecheck and the production build passed. The full Playwright matrix reported 139 passed and 29 project-conditional skips across desktop, tablet and mobile. It covered bilingual Home content and metadata, the 19 approved flight positions, keyboard focus, reduced motion, unavailable WebGL, Worker failure, context loss, navigation cleanup and narrow viewport overflow. All 19 desktop poses were captured; representative opening and mid-flight poses were visually compared against the approved references.

Real-device GPU and frame-time performance have not yet been measured; the technical stack keeps that validation as a pre-release requirement. Browser screenshots verify the approved composition but do not replace physical-device performance checks.

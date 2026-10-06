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

English routes use `/`; Indonesian routes use `/id`. Language switches preserve the current route and contact anchor. Both languages are prerendered with their own document language.

## Sprint 1 boundary

Sprint 1 implements the foundation, shared shell, and reusable component suite. The eleven approved page routes currently render their approved hero copy with the shared shell. Full page bodies, the Home flight, and the live Businesses hero belong to later sprints. Preview routes are marked `noindex` until the site is complete.

In development only, `/?components=1` and `/id?components=1` show component specimens using approved content. This adds no public route and is excluded from production rendering.

The production source contains normalized approved copy, design tokens, and the assets it needs; it does not import ignored handoff documents at runtime. Preserve the original handoff under `design-docs/`, `plans/`, and `resources/` for fidelity checks.

`node tools/render-menu.mjs` regenerates five menu stills from the approved `design-docs/prototypes/home-scene/source/world.js` with the reference Three.js r128 renderer. It removes the blue frame and scan line for the menu. Three.js is used only by this offline asset tool in Sprint 1; it is not shipped to the application.

Browser screenshots and failure traces are written under `test-results/` and are ignored by Git.

## Sprint 1 verification — 6 October 2026

Type checking and the production build passed; all 22 EN/ID page foundations are prerendered. The production dependency audit reported no known vulnerabilities. All 18 Playwright checks passed at desktop, tablet, and mobile sizes, covering both languages, menu keyboard focus and reopening, route/hash-preserving language switches, reduced motion, WebGL-unavailable rendering, fonts, overflow, and approved route foundations. Desktop closing/footer and desktop/mobile menus and component specimens were visually inspected against the approved references.

Owner-approved contrast adjustment: button hover and keyboard-focus sweeps and borders use `#3077C7`, giving white text 4.58:1 contrast. The brand blue remains `#3179CB` everywhere else. The browser regression check measures the rendered sweep color and verifies the 4.5:1 minimum in both interaction states.

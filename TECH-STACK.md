# RekanMU Company Profile Website — Technical Stack


**Status:** Locked implementation baseline — approved design integrated


## Core


- Next.js
- App Router
- React
- TypeScript
- Tailwind CSS v4
- pnpm


## Rendering Architecture


- Use React Server Components by default.
- Use Client Components only where browser-side interaction is required.
- Prefer static/prerendered content wherever practical.
- Do not introduce a backend, database, authentication layer, or CMS unless a later requirement justifies one.
- Keep WebGL limited to the approved point-world scenes and business viewers so the rest of the site remains ordinary HTML/CSS/React.


## Approved Experience Implementation


The approved `design-docs/` package defines the experience requirements.


### Home point-world scene


- Use Three.js for the Home point-world scene, following the approved Home prototype and `prototypes/home-scene/` package.
- Load the Home WebGL experience only on the Home route and after first paint.
- The prototype contains roughly 670,000 points; preserve the approved scene, camera, timeline, business stops, blue frame, scan line, and Through-the-Square opening/closing behavior.
- Do not introduce GLB/GLTF models or a separate modeled-asset pipeline. The approved world is generated from the supplied point-world source and data.
- If WebGL or Three.js is unavailable, fall back to the complete static stacked Home layout defined by the approved design.
- Under `prefers-reduced-motion`, use the approved static/reduced-motion behavior rather than the scroll-driven scene.


### Businesses hero


- Implement the Businesses hero as the approved plain WebGL point renderer, using `prototypes/businesses-hero.source.js` and the supplied binary point data as the reference.
- Do not add Three.js to this hero unless an implementation constraint later justifies changing the approved approach.
- Ship point data as binary assets rather than embedding base64 in the production page.
- Pause rendering when the hero is off screen.
- Preserve a complete readable non-WebGL fallback.


### Other pages


- Inner pages use approved still renders/photos and standard HTML/CSS/React.
- Businesses overview plates and business-detail hero/Next views use the approved plain WebGL point viewers, with matching specimen stills as fallback.
- Do not extend WebGL to other pages or sections; keep Three.js exclusive to Home.
- The Home Products & Services section is scroll-pinned on wider screens and maps movement linearly to scroll.
- No smooth-scrolling system or additional animation framework is required by the baseline. Prefer browser APIs and CSS/JavaScript unless a later implementation constraint justifies another dependency.


## Styling


- Use Tailwind CSS v4.
- Treat `design-docs/tokens/tokens.css`, `tokens.json`, and `site.css` as the approved design-token/value references.
- Define the production visual system through CSS custom properties/design tokens and expose those values through Tailwind where useful.
- Custom components are the default.
- Do not allow a component library to alter the approved visual identity.


## Components


- Use a custom-first React component architecture.
- Keep shared shell and repeated components reusable where the approved design repeats them.
- Third-party components may be used only as implementation primitives when they reproduce the approved behavior and appearance without imposing their own design system.


## Icons


- Do not use a general icon library in the approved interface.
- Use the approved two-line menu mark, inline arrow SVG, and supplied social SVG assets only where specified by the design system.
- Do not introduce decorative icons.


## Typography


- Use Geist (400, 500, 600) and Geist Mono (400, 500) only.
- Load fonts through `next/font` or the official Geist package in a self-hosted/local configuration.
- Follow the exact typography roles and point-type rules in `design-docs/design-system.md`.


## Images and Point-World Assets


- Use the supplied point-world source, binary point data, reference renders, stills, generated object crops, and the approved About slideshow photos according to `design-docs/ASSETS.md`.
- Use `next/image` for raster stills where appropriate.
- Prefer static imports for project assets.
- Optimize source assets before shipping without changing their approved appearance.
- Preserve meaningful crops and masks at responsive breakpoints.
- Do not substitute unrelated stock, photographic, AI-generated, or decorative imagery for the approved point-world system. The owner-approved About photos are a scoped exception and must not replace point-world imagery elsewhere.


## Responsive and Accessibility Requirements


- Follow the responsive defaults in `design-docs/design.md` section 8 for phone and tablet behavior.
- Minimum touch target: 44 px.
- Never make required content hover-only.
- Preserve real document text wherever canvas draws a visual version of text.
- Hide canvases from assistive technology when equivalent real content exists.
- Respect `prefers-reduced-motion`.
- No-WebGL and reduced-motion states must remain complete and readable.
- Validate both English and Bahasa Indonesia layouts.


## Testing and QA


- Use Playwright for browser, interaction, and responsive QA.
- Validate desktop, tablet, and mobile behavior.
- Check keyboard interaction, focus states, reduced motion, touch behavior, and no-WebGL fallbacks.
- Check console errors and warnings.
- Check layout overflow, clipping, overlap, and unintended horizontal scrolling.
- Compare implementation against the approved full-page screenshots, component sheet, Businesses hero prototype, and Home reference renders.
- Validate the Home scene against its nineteen approved timeline reference positions.
- Test real-device performance for the Home scene, Businesses hero, and business-page point viewers before release.


## Explicitly Out of Scope Initially


- CMS
- database
- authentication
- application backend
- user accounts
- custom API layer
- ecommerce
- analytics platform selection
- route-transition system unless later designed and approved


These may only be introduced when supported by an actual project requirement.


## Engineering Principles


- Static-first.
- Server-first.
- Client JavaScript only where required by the approved experience.
- Isolate heavy rendering from ordinary page content.
- Custom visual identity over library defaults.
- Progressive enhancement.
- Accessibility, reduced motion, non-WebGL fallback, and responsive behavior are implementation requirements.
- Prefer the simplest technology capable of reproducing the approved design faithfully.


## Versioning Policy


This document locks technology families and major architectural choices, not exact package versions. Exact versions belong in `package.json` and the lockfile once the project is scaffolded.
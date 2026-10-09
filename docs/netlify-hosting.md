# Netlify hosted prototype

Owner selected Netlify and a `netlify.app` address on 10 October 2026.

## Import settings

Connect `RekanDigital/company-website` from GitHub in the Netlify dashboard and select `main` as the production branch. The repository root is the base directory.

The committed `netlify.toml` supplies:

- Build command: `pnpm build`.
- Publish directory: `.next`.
- Node.js: 24.x.
- Dependency installation: frozen lockfile with hoisting, following Netlify's pnpm guidance. The exact pnpm version, 10.34.6, is already specified in `package.json`.

Netlify detects Next.js and applies its current OpenNext adapter automatically. Use the normal framework deployment; uploading `.next` manually does not create a complete deploy. The application requires no site-specific API keys or database environment variables.

Choose an available site name when creating the project; Netlify assigns its `<site-name>.netlify.app` URL. No custom domain or DNS change is needed for this initial hosted prototype. The local canonical design canvas remains port 4100.

## Release state

Both locales intentionally retain `noindex,nofollow` for the hosted prototype. A public search-indexed launch requires an explicit indexing decision and the final domain for canonical/locale metadata and a sitemap.

After the first Netlify build succeeds, inspect the actual hosted URL for:

- EN/ID direct routes and refreshes, page-switch/menu transitions, and inquiry links.
- Home loading handoff, Worker/point assets, WebGL/static fallback, and reduced motion.
- About gallery and statements, Products split scroll, and Businesses/detail motion.
- Mobile/tablet reading flow, clipping, overflow, console/network errors, and scroll continuity.

Local production-build/browser checks do not verify Netlify's adapter, CDN, or deployed functions. The actual Netlify build and hosted checks remain required. No deployment or account linkage is performed by adding this configuration.

## Sources

- [Next.js on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/)
- [Next.js build settings](https://docs.netlify.com/snippets/frameworks/nextjs-config-values/)
- [Build dependency and Node/pnpm configuration](https://docs.netlify.com/build/configure-builds/manage-dependencies/)

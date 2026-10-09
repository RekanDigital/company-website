# Canonical RekanMU prototype

Owner decision: 9 October 2026.

## Active design authority

- Prototype URL: **http://127.0.0.1:4100**.
- Source checkout: **`/home/sigisgood/rekanmu/company-website`**.
- All subsequent website design, layout, motion, and interaction work uses this checkout and preview as the canonical prototype.
- The merged `main` branch is the prototype baseline. Preserve subsequent working-tree changes; do not replace them with an older commit or a fresh copy of remote `main`.
- Port 3100 is a separate baseline preview; it is not the active design canvas.

Owner-approved locks and the four page rules in [about-page-hard-rules.md](about-page-hard-rules.md) continue to apply. This designation does not change approved copy, assets, accessibility requirements, or the source-of-truth order for other project decisions.

## Local operation

```sh
cd /home/sigisgood/rekanmu/company-website
npm run dev -- --port 4100
```

Reuse the running 4100 server when available. Keep its build directory independent from other checkouts. Do not overwrite this checkout while synchronizing another baseline.

The prototype now resides in the persistent main checkout. The former `/tmp/rekanmu-main-4100` clone is retained as a recovery copy and is no longer the active canvas. Automatic server startup is not configured.

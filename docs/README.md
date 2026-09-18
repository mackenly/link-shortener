See docs for Nextra for editing information: [Nextra Docs](https://nextra.site/docs)

Run `pnpm next` for dev. Production build: `pnpm build` (static export to `out/`).

## Cloudflare Workers (Static Assets)

This site is a Next.js static export (`output: 'export'`). It does **not** need `@cloudflare/next-on-pages` (deprecated), OpenNext, or vinext. There is no SSR or middleware — Cloudflare should serve the HTML in `out/` as [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/).

Local deploy (builds, then uploads `out/`):

```sh
pnpm deploy
```

Preview the production export locally with `pnpm preview` (after `pnpm build`, or let Wrangler run the build).

### One-time dashboard cutover

Create or connect a **Workers** project (not Pages) pointing at this repo. Settings that cannot live only in git:

- **Root directory:** `docs`
- **Build command:** `pnpm build` (Workers Builds does not run Wrangler's `[build]` block)
- **Deploy command:** `npx wrangler deploy` (default)
- Attach the custom domain (`linkshortener.dev`) on the Worker after the first deploy, then remove it from the old Pages project

Node is pinned via `.nvmrc` (22). Workers Builds reads that file; override with `NODE_VERSION` only if needed.

Do not set the build or deploy command to `npx @cloudflare/next-on-pages@1`.

TypeScript stays on `~5.6.2` because Nextra 3's highlighter (twoslash) is not compatible with TypeScript 7. That pin is independent of the Cloudflare deploy path.

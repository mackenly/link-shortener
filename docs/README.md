See docs for Nextra for editing information: [Nextra Docs](https://nextra.site/docs)

Run `pnpm next` for dev. Production build: `pnpm build` (static export to `out/`).

## Cloudflare Workers (Static Assets)

This site is a Next.js static export (`output: 'export'`). It does **not** need `@cloudflare/next-on-pages` (deprecated), OpenNext, or vinext. There is no SSR or middleware — Cloudflare should serve the HTML in `out/` as [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/).

Local deploy (builds, then uploads `out/`):

```sh
pnpm deploy
```

Preview the production export locally with `pnpm preview` (after `pnpm build`, or let Wrangler run the build).

CI deploys this Worker from GitHub Actions (`.github/workflows/deploy-docs.yml`) with Node 22, `pnpm build`, and `wrangler deploy`. That is the supported path.

The old **Pages** Git integration still runs `npx @cloudflare/next-on-pages@1` on Node 18. That adapter is deprecated and the v2 Pages image ignores this lockfile. Turn off Pages automatic deployments for this project (or delete the Pages project) so those builds stop failing.

After the first Worker deploy, attach `linkshortener.dev` on the **link-shortener-docs** Worker, then remove the domain from Pages.

Node is pinned via `.nvmrc` (22). Do not set the build command to `npx @cloudflare/next-on-pages@1`.

TypeScript stays on `~5.6.2` because Nextra 3's highlighter (twoslash) is not compatible with TypeScript 7. That pin is independent of the Cloudflare deploy path.

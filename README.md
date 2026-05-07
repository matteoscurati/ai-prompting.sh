# ai-prompting.sh

Marketing + docs site for the [`ai-prompting`](https://github.com/matteoscurati/ai-prompting) Skill
and CLI.

Built with **Astro 5** + **Tailwind v4** + **TypeScript** + **MDX**. Static-only output. No
runtime JavaScript except a 10-line copy-button on `<CodeBlock>`.

## Develop

```bash
npm install
npm run dev    # http://localhost:4321
```

## Build & preview

```bash
npm run build
npm run preview
```

The static output lands in `dist/`. Drop it on any static host (Vercel, Netlify, Cloudflare Pages,
GitHub Pages, S3 + CloudFront, ...).

## Type-check

```bash
npm run check
```

Wraps `astro check` — TypeScript + Astro template type-check.

## Format

```bash
npm run format
```

Prettier with `prettier-plugin-astro`.

## Project layout

```
.
├── astro.config.mjs        # integrations: mdx, sitemap, tailwind via Vite plugin
├── public/                 # static assets shipped as-is
│   ├── favicon.svg
│   ├── og-image.svg
│   └── robots.txt
└── src/
    ├── components/         # reusable Astro components
    ├── layouts/
    │   └── BaseLayout.astro
    ├── pages/              # routes
    │   ├── index.astro     # /
    │   ├── docs/index.mdx  # /docs
    │   ├── skill/index.mdx # /skill
    │   ├── examples/index.astro
    │   └── changelog/index.mdx
    └── styles/
        └── global.css      # Tailwind v4 @theme + base styles
```

## Why Astro + Tailwind v4

- **Astro** ships zero JavaScript by default. Each page is static HTML; only the components that
  need interactivity (the copy-button) ship a tiny script. Bundle target: ≤ 50 KB JS gzipped on
  the home.
- **Tailwind v4** uses CSS-first config via `@theme`. No runtime, no JIT process to babysit, and
  it integrates cleanly with Vite via `@tailwindcss/vite`.
- **MDX** lets the docs and changelog reuse the same components as the home, without forking
  templates.

## Deploy

The site is a static export. The production deployment uses **Cloudflare
Workers with Static Assets** (the unified replacement for Cloudflare Pages
that Cloudflare is rolling out to most accounts). Free tier: unlimited
bandwidth, 320+ edge POPs, ~30s builds, preview deploys per branch. The
repo ships `.nvmrc` and `public/_headers` so the platform picks the right
Node version and applies sensible cache rules out of the box.

### Cloudflare Workers (Static Assets) — first-time setup

1. **Push the repo to GitHub** (one-time):
   ```bash
   gh repo create matteoscurati/ai-prompting.sh --public --source=. --push
   ```
2. **Create a Worker connected to Git**:
   dash.cloudflare.com → Workers & Pages → Create → Connect to Git → pick
   `matteoscurati/ai-prompting.sh`. The dashboard names the Worker
   `ai-prompting-sh` (Workers names can't contain dots, so the domain dot
   becomes a hyphen).
3. **Build settings** (Cloudflare auto-detects most of these):
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: leave empty
4. **Save and Deploy.** The first build runs `npm ci && npm run build` and
   takes ~30s. Every subsequent push to `main` auto-deploys; PRs get preview
   URLs.
5. **Custom domain**: Worker → Settings → Domains & Routes → Add Custom
   Domain → `ai-prompting.sh`. SSL is automatic. Add `www.ai-prompting.sh`
   as a redirect from the same panel if desired.

> Note: existing accounts may still have a "Cloudflare Pages" project type
> in the dashboard. The setup is equivalent — just use Pages instead of
> Workers in step 2. Build settings and behavior are identical.

### Other hosts (also work)

- **Vercel**: framework detection picks Astro automatically; same build/output;
  100GB bandwidth on free tier (lower than Cloudflare).
- **Netlify**: same build/output; drop a `netlify.toml` if you want CI config
  in-repo.
- **GitHub Pages**: enable Pages on the repo, set source to a `gh-pages`
  branch, add a deploy job to `.github/workflows/ci.yml` that pushes `dist/`
  there. No automatic preview branches.

## Analytics

Analytics are **off by default** and gated behind environment variables, so
local dev, PR previews, and any deploy that doesn't opt in ship zero
tracking code.

The site uses **Umami Cloud** (EU region) when enabled: no cookies, no
fingerprinting, IP hashed with a daily-rotating salt and discarded. See
[`/privacy`](https://ai-prompting.sh/privacy) for the full policy.

The analytics script and ingest endpoint are served from a first-party
subdomain (`analytics.ai-prompting.sh`) via a small **Cloudflare Worker
proxy** so ad-blockers (uBlock, Brave) don't drop them. Setup and deploy
instructions for the proxy live in [`worker/README.md`](./worker/README.md).

To enable on production:

1. Create a website on [cloud.umami.is](https://cloud.umami.is), region **EU**.
2. Set the website's `Domain` field to `ai-prompting.sh`. Copy the **Website ID**.
3. Deploy the Cloudflare Worker proxy — see [`worker/README.md`](./worker/README.md).
4. In the site Worker (`ai-prompting-sh`) → Settings → **Build** → **Build
   variables** (Production scope, NOT "Variables and Secrets" — those are
   runtime-only and Astro can't read them at build time):
   - `PUBLIC_UMAMI_WEBSITE_ID` = the website ID from Umami
   - `PUBLIC_UMAMI_SCRIPT_URL` = `https://analytics.ai-prompting.sh/script.js`
5. Trigger a new deploy (push any commit, or use Deployments → Retry).
   Build variables are read by `astro build` when it inlines
   `import.meta.env.PUBLIC_*` into the static bundle. The script tag
   appears in HTML only when both vars are set.

To disable, unset either variable and redeploy. See `.env.example` for the
full reference.

## Performance budget

Enforced by reviewer + CI (when budgets are added):

- Home gzipped JS ≤ 50 KB
- Home gzipped CSS ≤ 100 KB
- Lighthouse: Performance / Accessibility / SEO / Best Practices ≥ 95
- LCP ≤ 1.5 s on 4G

## License

Code: [MIT](./LICENSE). Content (prose, diagrams, examples): CC BY 4.0.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). The Skill itself lives in
[`matteoscurati/ai-prompting`](https://github.com/matteoscurati/ai-prompting) — bug reports about
the Skill or CLI go there. Issues about the website (copy, layout, broken links) go here.

# aiprompting.sh

Marketing + docs site for the [`aiprompting`](https://github.com/matteoscurati/aiprompting) Skill
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

The site is a static export. The recommended path is Vercel via the GitHub integration:

1. Create the GitHub repo (`gh repo create matteoscurati/aiprompting.sh --public --source=.`).
2. Connect it to Vercel. Detect framework: Astro. Build command: `npm run build`. Output: `dist`.
3. Add `aiprompting.sh` (or your domain of choice) under Project Settings → Domains.

For other hosts:

- **Netlify**: same build/output. Drop a `netlify.toml` if you want CI config in-repo.
- **GitHub Pages**: enable Pages on the repo, set source to `gh-pages` branch, add a deploy step
  to the CI workflow that pushes `dist/` to `gh-pages`.
- **Cloudflare Pages**: detect framework Astro, no further config needed.

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
[`matteoscurati/aiprompting`](https://github.com/matteoscurati/aiprompting) — bug reports about
the Skill or CLI go there. Issues about the website (copy, layout, broken links) go here.

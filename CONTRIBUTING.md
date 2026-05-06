# Contributing

This repo is the **website** for the `ai-prompting` Skill + CLI. The Skill and CLI themselves live
in [`matteoscurati/ai-prompting`](https://github.com/matteoscurati/ai-prompting).

## What belongs where

| Issue / PR is about | Open it in |
|---|---|
| Bug in the CLI (`ai-prompting improve`, `ai-prompting doctor`) | [ai-prompting](https://github.com/matteoscurati/ai-prompting) |
| Bug in the Skill (`/ai-prompting:improve` slash command, SKILL.md) | [ai-prompting](https://github.com/matteoscurati/ai-prompting) |
| New rubric category, new task type, new agent target | [ai-prompting](https://github.com/matteoscurati/ai-prompting) |
| Typo / broken link / wrong claim on the website | here |
| New copy, new section, new before/after example on the website | here |
| Performance regression on the website (Lighthouse, bundle size) | here |

## Local setup

Requires Node ≥ 20.

```bash
git clone git@github.com:matteoscurati/ai-prompting.sh.git
cd ai-prompting.sh
npm install
npm run dev
```

Open `http://localhost:4321`.

## Conventions

- **Tone.** Technical, direct. Vetoed marketing words: "revolutionary", "game-changing",
  "AI-powered", "supercharge", "blazing-fast". If you catch one in a PR, replace it.
- **Claims.** No measured-gain claims about the CLI ("makes prompts 30% better") without test
  data. The 100-point score is heuristic and we say so on every page.
- **Style.** Match `bun.sh`, `biomejs.dev`, `astro.build`. Minimal, monospace for code,
  dark-first, single accent color (the lime in `--color-accent`).
- **Images.** No stock photos, no AI-generated illustrations. Real CLI screenshots or asciinema
  GIFs only.
- **Fonts.** System font stack and `JetBrains Mono` (self-hosted if added). No Google Fonts.
- **JS.** Default to zero. Add interactivity via small inline scripts in components, not
  framework hydration.
- **Tracking.** No third-party analytics, no cookies, no consent banner. If you want stats, the
  pattern is self-hosted Umami enabled by an env var, off by default.

## Performance budgets

Enforced manually until CI is wired up:

- Home gzipped JS ≤ 50 KB
- Home gzipped CSS ≤ 100 KB
- Lighthouse Performance / Accessibility / SEO / Best Practices ≥ 95

Run a Lighthouse audit before opening a PR that touches the home page or `BaseLayout.astro`.

## Pull request flow

1. Branch off `main`. Name it `<type>/<short-slug>` (`fix/copy-cta-typo`,
   `feat/add-aider-card`).
2. Make the change. Run `npm run check` and `npm run build` locally.
3. If you touched copy, re-read the page in the rendered output (`npm run dev`); markdown looks
   different from MDX-rendered HTML.
4. Open the PR. The template asks for: what changed, what you tested, screenshots if visual.

## Adding a new before/after example

Examples on `/examples` are sourced from `src/pages/examples/index.astro`. Add a new entry to the
`examples` array with `label`, `before`, `after`, `scoreBefore`, `scoreAfter`. Run
`npm run dev` and verify the new card renders with correct delta colors.

If the example is also useful as a regression test, mirror it in the
[main repo's `examples/`](https://github.com/matteoscurati/ai-prompting/tree/main/ai-prompting/examples).

## Adding a new agent to the compatibility matrix

Edit `src/pages/skill/index.mdx`. Add an `<AgentLogo>` with `name`, `supported`
(`native` / `adapter` / `none`), and an optional `note`. Keep entries sorted by support level,
then alphabetically.

## Updating the changelog

The `/changelog` page is **synced from the package repo**, not edited here. Source of truth:
[`ai-prompting/CHANGELOG.md`](https://github.com/matteoscurati/ai-prompting/blob/main/ai-prompting/CHANGELOG.md).
Workflow:

1. Land the changelog entry in the package repo first.
2. Run `npm run sync-changelog` from this site repo. The script reads
   `../ai-prompting/CHANGELOG.md` (sibling directory) and replaces the content
   between the `{/* BEGIN AUTOGEN */}` / `{/* END AUTOGEN */}` markers in
   `src/pages/changelog/index.mdx`. (MDX rejects HTML comments, so the
   markers use MDX expression syntax.)
3. Commit the resulting MDX change.

The intro paragraph above the AUTOGEN block stays manual; everything below the
markers is regenerated.

CI safety: `npm run build` runs `sync-changelog --check` first and fails if the
two are out of sync. If CI clones the site without the sibling package, the check
is skipped silently — drift detection is a local convenience, not a hard gate.

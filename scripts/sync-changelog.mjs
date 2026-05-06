#!/usr/bin/env node
// Sync the package's CHANGELOG.md into the site's /changelog page.
//
// Reads:  ../aiprompting/CHANGELOG.md  (sibling repo, source of truth)
// Writes: src/pages/changelog/index.mdx (between the AUTOGEN markers)
//
// Usage:
//   node scripts/sync-changelog.mjs           — write the synced content
//   node scripts/sync-changelog.mjs --check   — exit 1 if out of sync (for CI)

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, relative } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const packageChangelog = resolve(repoRoot, '..', 'aiprompting', 'CHANGELOG.md');
const siteChangelog = resolve(repoRoot, 'src', 'pages', 'changelog', 'index.mdx');

// MDX rejects HTML comments, so we use the MDX expression syntax instead.
const BEGIN_MARKER = '{/* BEGIN AUTOGEN */}';
const END_MARKER = '{/* END AUTOGEN */}';

const isCheck = process.argv.includes('--check');

function fail(message) {
  console.error(`sync-changelog: ${message}`);
  process.exit(1);
}

let packageSource;
try {
  packageSource = await readFile(packageChangelog, 'utf8');
} catch (error) {
  if (error.code === 'ENOENT') {
    if (isCheck) {
      // CI may clone the site standalone, without the sibling package.
      // The drift check is a courtesy in that case — don't break the build.
      console.log(`sync-changelog: source not found (${packageChangelog}); skipping --check.`);
      process.exit(0);
    }
    fail(`source not found: ${packageChangelog} — is the sibling package checked out?`);
  }
  throw error;
}

// Strip everything before the first `## [version]` heading. The package's
// "# Changelog" header and Keep-a-Changelog intro live in its own README;
// the site has its own intro paragraph above the AUTOGEN block.
const firstVersionMatch = packageSource.match(/^## \[/m);
if (!firstVersionMatch) {
  fail(`no \`## [\` heading found in ${packageChangelog}`);
}
const versionsBlock = packageSource.slice(firstVersionMatch.index).trimEnd();

const siteSource = await readFile(siteChangelog, 'utf8');
const beginIndex = siteSource.indexOf(BEGIN_MARKER);
const endIndex = siteSource.indexOf(END_MARKER, beginIndex + BEGIN_MARKER.length);
if (beginIndex === -1 || endIndex === -1) {
  fail(`markers ${BEGIN_MARKER} / ${END_MARKER} missing from ${relative(repoRoot, siteChangelog)}`);
}

const before = siteSource.slice(0, beginIndex + BEGIN_MARKER.length);
const after = siteSource.slice(endIndex);
const next = `${before}\n\n${versionsBlock}\n\n${after}`;

if (next === siteSource) {
  console.log('sync-changelog: site changelog already in sync with package.');
  process.exit(0);
}

if (isCheck) {
  console.error('sync-changelog: site changelog is out of sync with package CHANGELOG.md.');
  console.error('  Run `npm run sync-changelog` to update.');
  process.exit(1);
}

await writeFile(siteChangelog, next);
console.log(`sync-changelog: updated ${relative(repoRoot, siteChangelog)} from package CHANGELOG.md.`);

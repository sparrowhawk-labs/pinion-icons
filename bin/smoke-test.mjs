#!/usr/bin/env node
/**
 * smoke-test.mjs — dependency-free sanity check for the `auto` tune-reactive
 * icon feature (no PHPUnit/Jest in this repo; this matches the zero-dep style
 * of build-icon-data.mjs rather than pulling in a test framework for one
 * feature). Run with: node bin/smoke-test.mjs
 *
 * Checks:
 *   1. TUNE_VARIANT_MAP (resources/js/pn-icon.js) covers exactly the 11
 *      shipped tune presets, each mapped to a real Solar/pixelarticons
 *      variant name.
 *   2. build-icon-data.mjs actually bundles every variant the map can
 *      request, for a representative icon, from real files on disk.
 *   3. The generated data module is syntactically valid and importable.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
let failures = 0;

async function check(label, fn) {
    try {
        await fn();
        console.log(`  ok  — ${label}`);
    } catch (e) {
        failures++;
        console.error(`FAIL — ${label}\n       ${e.message}`);
    }
}

// 1. TUNE_VARIANT_MAP completeness
const EXPECTED_TUNES = [
    'default', 'minimal', 'sharp', 'corporate', 'tech', 'brutal',
    'editorial', 'luxury', 'soft', 'pixel', 'draft',
];
const KNOWN_VARIANTS = ['outline', 'linear', 'bold', 'line-duotone', 'bold-duotone', 'broken', 'pixel'];

const pnIconSrc = readFileSync(join(root, 'resources/js/pn-icon.js'), 'utf8');
const mapMatch = pnIconSrc.match(/TUNE_VARIANT_MAP\s*=\s*\{([\s\S]*?)\};/);
let requiredVariants = [];

await check('TUNE_VARIANT_MAP is present in pn-icon.js', () => {
    if (!mapMatch) throw new Error('export const TUNE_VARIANT_MAP = {...} not found');
});

if (mapMatch) {
    const entries = [...mapMatch[1].matchAll(/(\w+):\s*'([\w-]+)'/g)].map((m) => [m[1], m[2]]);
    const map = Object.fromEntries(entries);
    requiredVariants = [...new Set(entries.map(([, v]) => v))];

    await check(`covers exactly the 11 shipped tunes (found ${entries.length})`, () => {
        const missing = EXPECTED_TUNES.filter((t) => !(t in map));
        const extra = Object.keys(map).filter((t) => !EXPECTED_TUNES.includes(t));
        if (missing.length) throw new Error(`missing tune(s): ${missing.join(', ')}`);
        if (extra.length) throw new Error(`unexpected tune(s) not in the 11-preset lineup: ${extra.join(', ')}`);
    });

    await check('every mapped variant is a known Solar/pixelarticons style', () => {
        const bad = entries.filter(([, v]) => !KNOWN_VARIANTS.includes(v));
        if (bad.length) throw new Error(`unrecognised variant(s): ${bad.map(([t, v]) => `${t}=${v}`).join(', ')}`);
    });
}

// 2 & 3. build-icon-data.mjs produces a complete, importable bundle
const tmp = mkdtempSync(join(tmpdir(), 'pinion-icons-smoke-'));
const outFile = join(tmp, 'pn-icon-data.js');
try {
    await check('build-icon-data.mjs runs cleanly for a real icon name', () => {
        execFileSync('node', [join(root, 'bin/build-icon-data.mjs'), '--out', outFile, 'home'], { stdio: 'pipe' });
    });

    await check('generated module is valid JS (importable)', () => {
        execFileSync('node', ['--check', outFile], { stdio: 'pipe' });
    });

    await check('bundled data covers every variant the tune map can request', async () => {
        const mod = await import(`file://${outFile}`);
        const variants = Object.keys(mod.default.home || {});
        const missing = requiredVariants.filter((v) => !variants.includes(v));
        if (missing.length) throw new Error(`"home" bundle is missing variant(s): ${missing.join(', ')}`);
    });
} finally {
    rmSync(tmp, { recursive: true, force: true });
}

if (failures > 0) {
    console.error(`\n${failures} check(s) failed.`);
    process.exit(1);
}
console.log('\nAll checks passed.');

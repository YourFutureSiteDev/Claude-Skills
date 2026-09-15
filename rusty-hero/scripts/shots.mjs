// shots.mjs: screenshot every subject of a rusty-hero page, desktop and phone,
// so the "clicked every subject" line of Done means has evidence.
//
//   node ~/.claude/skills/rusty-hero/scripts/shots.mjs <url or file path> <out dir>
//
// Uses playwright-core with the Chromium already on this PC (no download).
// Writes <out>/desktop-<id>.png for every subject, <out>/phone-<id>.png for the
// first and last, and <out>/reduced-motion.png. Prints the subject list it found.

import { chromium } from 'playwright-core';
import { mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [,, target, outArg] = process.argv;
if (!target) { console.error('usage: shots.mjs <url|file> [outdir]'); process.exit(1); }
const out = resolve(outArg || 'rusty-shots');
mkdirSync(out, { recursive: true });
const url = /^https?:/.test(target) ? target : pathToFileURL(resolve(target)).href;

const candidates = [
  process.env.RUSTY_CHROME,
  `${process.env.LOCALAPPDATA}\\ms-playwright\\chromium-1234\\chrome-win64\\chrome.exe`,
  `${process.env.LOCALAPPDATA}\\ms-playwright\\chromium-1194\\chrome-win64\\chrome.exe`,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
].filter(Boolean);
const executablePath = candidates.find(p => existsSync(p));
if (!executablePath) { console.error('no chromium found; set RUSTY_CHROME'); process.exit(1); }

const browser = await chromium.launch({ executablePath, headless: true });
async function run(viewport, prefix, reduced = false) {
  const ctx = await browser.newContext({ viewport, reducedMotion: reduced ? 'reduce' : 'no-preference', deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(400);
  const subjects = await page.evaluate(() => {
    const s = document.querySelector('[data-rusty-subjects]');
    return s ? JSON.parse(s.textContent).map(x => ({ id: x.id, colour: x.colour, title: x.title })) : [];
  });
  if (!subjects.length) { console.log(`${prefix}: no [data-rusty-subjects] found`); await ctx.close(); return { subjects, errors }; }
  const pick = prefix === 'phone' ? [subjects[0], subjects[subjects.length - 1]] : subjects;
  for (const s of pick) {
    await page.evaluate(id => {
      const scope = document.querySelector('[data-rusty]');
      const api = window.__rusty || (window.__rusty = window.RustyHero.init(scope));
      api.go(id);
    }, s.id);
    await page.waitForTimeout(reduced ? 150 : 900);
    const bg = await page.evaluate(() => getComputedStyle(document.querySelector('[data-rusty]')).backgroundColor);
    await page.screenshot({ path: `${out}/${prefix}-${s.id}.png`, fullPage: false });
    console.log(`${prefix}-${s.id}.png  scope bg ${bg}  (${s.colour} ${s.title})`);
  }
  await ctx.close();
  return { subjects, errors };
}

const d = await run({ width: 1280, height: 800 }, 'desktop');
const p = await run({ width: 390, height: 844 }, 'phone');
const r = await run({ width: 1280, height: 800 }, 'reduced', true);
await browser.close();
const errors = [...d.errors, ...p.errors, ...r.errors];
console.log(`\n${d.subjects.length} subjects, shots in ${out}`);
if (errors.length) { console.log('page errors:'); errors.forEach(e => console.log('  ' + e)); process.exit(2); }

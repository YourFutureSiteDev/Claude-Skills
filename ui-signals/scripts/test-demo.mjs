// Headless regression check of every signal on assets/demo.html.
// Needs: the demo served on http://localhost:8123 (npx -y serve -l 8123 assets),
// playwright-core (borrowed from Desktop/Claude/Skills/Site Audit) and the
// Playwright chromium under %LOCALAPPDATA%/ms-playwright. Run: node scripts/test-demo.mjs
// Prints a pass/fail line per signal and saves a screenshot of each state to scripts/shots/.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
const require = createRequire('C:/Users/PC/OneDrive/Desktop/Claude/Skills/Site Audit/package.json');
const { chromium } = require('playwright-core');

const outDir = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), 'shots');
fs.mkdirSync(outDir, { recursive: true });
const shot = async (page, name, sel) => {
  const el = sel ? page.locator(sel).first() : null;
  if (el) await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  await (el ? el.screenshot({ path: path.join(outDir, name + '.png') }) : page.screenshot({ path: path.join(outDir, name + '.png') }));
};
const results = [];
const check = (name, ok, detail) => results.push({ name, ok: !!ok, detail });

const exe = fs.readdirSync('C:/Users/PC/AppData/Local/ms-playwright').find(d => d.startsWith('chromium-'));
const browser = await chromium.launch({ executablePath: `C:/Users/PC/AppData/Local/ms-playwright/${exe}/chrome-win64/chrome.exe`, headless: true });
const page = await browser.newPage({ viewport: { width: 1000, height: 900 } });
const errors = [];
page.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.location()?.url || '')) errors.push(m.text() + ' @ ' + (m.location()?.url || '')); });
page.on('pageerror', e => errors.push(e.message));
await page.goto('http://localhost:8123/demo', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

// 15 headline emphasis
const em = await page.evaluate(() => { const h = document.querySelector('[data-sig-headline]'); return { isIn: h.classList.contains('is-in'), color: getComputedStyle(h.querySelector('em')).color, opacity: getComputedStyle(h).opacity }; });
check('15 headline-emphasis: h1 visible and phrase teal after settle', em.isIn && em.opacity === '1' && em.color === 'rgb(45, 212, 191)', JSON.stringify(em));
await shot(page, '15-headline', 'h1');

// 16 section reveal: below-fold sections hidden at load, no warning for hero
const rv0 = await page.evaluate(() => [...document.querySelectorAll('[data-sig-reveal]')].map(e => ({ id: e.id, isIn: e.classList.contains('is-in'), op: getComputedStyle(e).opacity })));
check('16 section-reveal: below-fold sections still hidden at load', rv0.every(r => !r.isIn && r.op === '0'), JSON.stringify(rv0));

// 01 dropzone over
await page.click('[data-dz="over"]');
await page.waitForTimeout(400);
const dz = await page.evaluate(() => { const dz = document.getElementById('dz'); const over = dz.querySelector('[data-when="over"]'); return { state: dz.dataset.state, border: getComputedStyle(dz).borderColor, glow: getComputedStyle(dz, '::before').opacity, over: getComputedStyle(over).opacity, idle: getComputedStyle(dz.querySelector('[data-when="idle"]')).opacity, copy: dz.querySelector('[data-sig-dropcopy]').textContent }; });
check('01 drop-answer: border teal, glow on, copy swapped', dz.border === 'rgb(45, 212, 191)' && dz.glow === '1' && dz.over === '1' && dz.idle === '0' && dz.copy.includes('hero-banner'), JSON.stringify(dz));
await shot(page, '01-dropzone-over', '#dz');
await page.click('[data-dz="idle"]');
await page.waitForTimeout(300);
const dz2 = await page.evaluate(() => { const dz = document.getElementById('dz'); return { state: dz.dataset.state, glow: getComputedStyle(dz, '::before').opacity }; });
check('01 drop-answer: returns to idle, glow off', dz2.state === 'idle' && dz2.glow === '0', JSON.stringify(dz2));

// 02 honest progress mid-flight
await page.click('#up1-go');
await page.waitForTimeout(1200);
const pr = await page.evaluate(() => { const u = document.getElementById('up1'); return { state: u.dataset.state, pct: u.querySelector('[data-pct]').textContent, eta: u.querySelector('[data-eta]').textContent, rate: u.querySelector('[data-rate]').textContent, etaOn: u.querySelector('[data-eta]').classList.contains('is-on'), scale: getComputedStyle(u.querySelector('.sig-bar-fill')).transform }; });
check('02 honest-progress: percent, time left and rate shown, bar scaled', pr.state === 'uploading' && parseInt(pr.pct) > 0 && /left/.test(pr.eta) && /MB\/s/.test(pr.rate) && pr.etaOn && pr.scale !== 'none', JSON.stringify(pr));
await shot(page, '02-progress', '#up1');
await page.waitForTimeout(2500);
const prDone = await page.evaluate(() => document.getElementById('up1').dataset.state);
check('02 honest-progress: reaches done', prDone === 'done', prDone);

// 03 inline retry
await page.click('#up1-fail');
await page.waitForTimeout(3600);
const fl = await page.evaluate(() => { const u = document.getElementById('up1'); return { state: u.dataset.state, pct: u.querySelector('[data-pct]').textContent, status: u.querySelector('[data-status]').textContent, fill: getComputedStyle(u.querySelector('.sig-bar-fill')).backgroundColor, rows: getComputedStyle(u.querySelector('.sig-retry-row')).gridTemplateRows, cardOp: getComputedStyle(u.querySelector('.sig-retry-card')).opacity }; });
check('03 inline-retry: red at 90%, error row open, file kept', fl.state === 'error' && fl.pct === '90%' && fl.fill === 'rgb(240, 80, 110)' && parseFloat(fl.rows) > 40 && /kept/.test(fl.status), JSON.stringify(fl));
await shot(page, '03-retry', '#up1');
await page.click('#up1 [data-retry]');
await page.waitForTimeout(500);
const rs = await page.evaluate(() => { const u = document.getElementById('up1'); return { state: u.dataset.state, status: u.querySelector('[data-status]').textContent, pct: u.querySelector('[data-pct]').textContent, rows: getComputedStyle(u.querySelector('.sig-retry-row')).gridTemplateRows }; });
check('03 inline-retry: resumes from 90, row collapses', rs.state === 'uploading' && /Resuming from 90/.test(rs.status) && parseInt(rs.pct) >= 90 && parseFloat(rs.rows) < 1, JSON.stringify(rs));
await page.waitForTimeout(2000);
const rsDone = await page.evaluate(() => document.getElementById('up1').dataset.state);
check('03 inline-retry: completes after retry', rsDone === 'done', rsDone);

// 04 preview
await page.click('#pv1-show');
await page.waitForTimeout(600);
const pv = await page.evaluate(() => { const pv = document.getElementById('pv1'); return { hidden: pv.hidden, op: getComputedStyle(pv).opacity, tf: getComputedStyle(pv).transform, tick: getComputedStyle(pv.querySelector('.sig-tick-path')).strokeDashoffset }; });
check('04 upload-preview: card in, tick drawn', !pv.hidden && pv.op === '1' && pv.tf === 'none' && pv.tick === '0px', JSON.stringify(pv));
await shot(page, '04-preview', '#pv1');

// 05 queue
await page.click('#q1-go');
await page.waitForTimeout(2200);
const qMid = await page.evaluate(() => { const q = document.getElementById('q1'); return { counter: q.querySelector('[data-done]').textContent, states: [...q.querySelectorAll('[data-sig-queue-item]')].map(r => r.dataset.state) }; });
await shot(page, '05-queue-mid', '#q1');
await page.waitForTimeout(8000);
const qEnd = await page.evaluate(() => { const q = document.getElementById('q1'); return { counter: q.querySelector('[data-done]').textContent, states: [...q.querySelectorAll('[data-sig-queue-item]')].map(r => r.dataset.state), tick: getComputedStyle(q.querySelector('[data-state="done"] .sig-tick-path')).strokeDashoffset }; });
check('05 own-lane-queue: rows finish independently, counter counts, ticks draw', qMid.states.includes('uploading') && qEnd.states.every(s => s === 'done') && qEnd.counter === '5 of 5 done' && qEnd.tick === '0px', JSON.stringify({ qMid, qEnd }));
await shot(page, '05-queue-done', '#q1');

// 07 focus glow
await page.focus('#name');
await page.keyboard.press('Tab'); await page.keyboard.press('Shift+Tab');
await page.waitForTimeout(300);
const fg = await page.evaluate(() => { const i = document.getElementById('name'); return { focused: document.activeElement === i, shadow: getComputedStyle(i).boxShadow, border: getComputedStyle(i).borderColor }; });
check('07 focus-glow: ring and accent border on focus-visible', fg.focused && fg.shadow !== 'none' && fg.border === 'rgb(45, 212, 191)', JSON.stringify(fg));
await shot(page, '07-focus', '#f1');

// 09 field-error + 08 submit error path
await page.click('#f1 .sig-submit');
await page.waitForTimeout(500);
const fe = await page.evaluate(() => { const f = document.querySelector('#f1 .sig-field'); const b = document.querySelector('#f1 .sig-submit'); return { field: f.dataset.state, rows: getComputedStyle(f.querySelector('.sig-field-msg')).gridTemplateRows, btn: b.dataset.state, btnBg: getComputedStyle(b).backgroundColor, minW: b.style.minWidth }; });
check('09 field-error: message open under the empty field', fe.field === 'error' && parseFloat(fe.rows) > 10, JSON.stringify(fe));
check('08 submit-states: error state, width locked', fe.btn === 'error' && fe.btnBg === 'rgb(240, 80, 110)' && /px/.test(fe.minW), JSON.stringify(fe));
await shot(page, '08-09-submit-error', '#f1');
await page.waitForTimeout(1800);
await page.fill('#name', 'Test'); await page.fill('#email', 'test@example.com'); await page.fill('#msg', 'Hello');
await page.click('#f1 .sig-submit');
await page.waitForTimeout(300);
const ld = await page.evaluate(() => { const b = document.querySelector('#f1 .sig-submit'); return { btn: b.dataset.state, spinner: getComputedStyle(b.querySelector('.sig-spinner')).opacity, label: getComputedStyle(b.querySelector('.sig-submit-label')).opacity, cleared: [...document.querySelectorAll('#f1 .sig-field')].every(f => f.dataset.state === 'idle') }; });
check('08 submit-states: loading shows spinner, hides label, errors cleared on input', ld.btn === 'loading' && ld.spinner === '1' && ld.label === '0' && ld.cleared, JSON.stringify(ld));
await shot(page, '08-submit-loading', '#f1');
await page.waitForTimeout(1600);
const dn = await page.evaluate(() => { const b = document.querySelector('#f1 .sig-submit'); return { btn: b.dataset.state, done: getComputedStyle(b.querySelector('.sig-submit-done')).opacity, tick: getComputedStyle(b.querySelector('.sig-submit-done .sig-tick-path')).strokeDashoffset, toast: document.querySelector('.sig-toast')?.classList.contains('is-on'), toastText: document.querySelector('.sig-toast')?.textContent }; });
check('08 submit-states: done with tick, toast fired', dn.btn === 'done' && dn.done === '1' && dn.tick === '0px' && dn.toast && /sent/i.test(dn.toastText), JSON.stringify(dn));
await shot(page, '08-submit-done-13-toast', 'body');

// 11 state glow: only one active
await page.click('[data-step]:nth-of-type(3)');
await page.waitForTimeout(300);
const gl = await page.evaluate(() => ({ active: [...document.querySelectorAll('.sig-glow.is-active')].length, third: document.querySelectorAll('[data-step]')[2].classList.contains('is-active') }));
check('11 state-glow: exactly one active after click', gl.active === 1 && gl.third, JSON.stringify(gl));
await shot(page, '11-glow', '#s10 .grid2');

// 10 + 12 copy-swap and tick
await page.click('#sw1-go');
await page.waitForTimeout(1400);
const sw = await page.evaluate(() => ({ b: getComputedStyle(document.querySelector('#sw1 [data-when="b"]')).opacity, a: getComputedStyle(document.querySelector('#sw1 [data-when="a"]')).opacity, tick: getComputedStyle(document.querySelector('#tk1 .sig-tick-path')).strokeDashoffset }));
check('10 copy-swap + 12 tick-draw: Saved shown, Saving gone, tick drawn', sw.b === '1' && sw.a === '0' && sw.tick === '0px', JSON.stringify(sw));

// 16 reveal + 14 chips + 17 card lift on scroll
await page.locator('#s13').scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
const rv = await page.evaluate(() => { const s = document.getElementById('s13'); const chips = s.querySelector('.sig-chips'); return { isIn: s.classList.contains('is-in'), op: getComputedStyle(s).opacity, chipsIn: chips.classList.contains('is-in'), lastChipOp: getComputedStyle(chips.lastElementChild).opacity, delays: [...chips.children].map(c => c.style.getPropertyValue('--i')).join(',') }; });
check('16 section-reveal: section revealed on scroll', rv.isIn && rv.op === '1', JSON.stringify(rv));
check('14 chip-stagger: chips numbered and revealed', rv.chipsIn && rv.lastChipOp === '1' && rv.delays === '0,1,2,3,4,5,6,7', JSON.stringify(rv));
await page.hover('#s13 a.sig-card');
await page.waitForTimeout(300);
const cl = await page.evaluate(() => ({ link: getComputedStyle(document.querySelector('#s13 a.sig-card')).transform, static: getComputedStyle(document.querySelector('#s13 div.card')).transform }));
check('17 card-lift: clickable card lifts, static card does not', /matrix\(1, 0, 0, 1, 0, -2\)/.test(cl.link) && cl.static === 'none', JSON.stringify(cl));
await shot(page, '14-16-17-page', '#s13');

// 18 nav underline
const nv = await page.evaluate(() => ({ active: getComputedStyle(document.querySelector('.sig-nav a[aria-current]'), '::after').transform, other: getComputedStyle(document.querySelectorAll('.sig-nav a')[1], '::after').transform }));
check('18 nav-underline: active link underlined, others not', nv.active === 'matrix(1, 0, 0, 1, 0, 0)' && /matrix\(0,/.test(nv.other), JSON.stringify(nv));

// 19 count-up + 20 skeleton
await page.locator('#s19').scrollIntoViewIfNeeded();
const t0 = Date.now();
await page.waitForTimeout(900);
const early = await page.evaluate(() => document.querySelector('[data-sig-count]').textContent);
check('19 count-up: still counting at 0.9s (slow on purpose)', early !== '398', 'at 0.9s: ' + early);
await page.waitForTimeout(1800);
const cu = await page.evaluate(() => [...document.querySelectorAll('[data-sig-count]')].map(e => e.textContent));
check('19 count-up: stats land on their values with prefix and suffix', cu[0] === '398' && cu[1] === '4.5%' && cu[2] === 'A$20/yr', JSON.stringify(cu));
const sk = await page.evaluate(() => ({ anim: getComputedStyle(document.querySelector('.sig-skeleton'), '::after').animationName }));
check('20 skeleton: shimmer running', sk.anim === 'sig-shimmer', JSON.stringify(sk));
await shot(page, '19-20-stats', '#s19');

// reduced motion
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(600);
await page.click('[data-dz="over"]');
await page.locator('#s19').scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
const rm = await page.evaluate(() => ({ h1op: getComputedStyle(document.querySelector('[data-sig-headline]')).opacity, h1tf: getComputedStyle(document.querySelector('[data-sig-headline]')).transform, icon: getComputedStyle(document.querySelector('#dz [data-when="over"] .sig-icon')).transform, count: document.querySelector('[data-sig-count]').textContent, shimmer: getComputedStyle(document.querySelector('.sig-skeleton'), '::after').animationName, s19: getComputedStyle(document.getElementById('s19')).opacity, border: getComputedStyle(document.getElementById('dz')).borderColor }));
check('reduced motion: content visible, transforms gone, colour kept, count jumps', rm.h1op === '1' && rm.h1tf === 'none' && rm.icon === 'none' && rm.count === '398' && rm.shimmer === 'none' && rm.s19 === '1' && rm.border === 'rgb(45, 212, 191)', JSON.stringify(rm));

check('no console or page errors', errors.length === 0, errors.join(' | ') || 'clean');
await browser.close();

let fails = 0;
for (const r of results) { if (!r.ok) fails++; console.log((r.ok ? 'PASS ' : 'FAIL ') + r.name + (r.ok ? '' : '\n      ' + r.detail)); }
console.log(`\n${results.length - fails}/${results.length} passed. Screenshots in ${outDir}`);
process.exit(fails ? 1 : 0);

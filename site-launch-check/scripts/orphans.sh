#!/bin/bash
# orphans.sh: item 24 from the outside. Reads the site's sitemap.xml, loads
# every page in it, and prints how many other pages link to each one (0 is an
# orphan), which sitemap pages each page links to and its first contact link
# (tel, mailto, or a link with contact, book, quote or enquire in it), any
# internal page that is linked but missing from sitemap.xml, and
# whether an HTML sitemap page exists and covers every page.
# Usage: bash orphans.sh https://site.pages.dev   (or the sitemap.xml URL)
# Needs node 18 or later. Only <a href> counts; it only reads.
if [ -z "$1" ]; then echo "usage: bash orphans.sh <base url | sitemap url>"; exit 2; fi
read -r -d '' JS <<'EOF'
const arg = process.argv[1];
const smUrl = /\.xml$/.test(arg) ? arg : arg.replace(/\/$/, '') + '/sitemap.xml';
const UA = { headers: { 'user-agent': 'Mozilla/5.0' }, redirect: 'follow' };
const get = async u => { const r = await fetch(u, UA); return { status: r.status, url: r.url, text: await r.text() }; };
const locs = x => [...x.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m => m[1]);
const PAGE = /(\/|\/[^./]+|\.html?)$/i;
let hosts = new Set();
// One key per page: host-free path, no query or hash, no .html, no index, no trailing slash.
const key = u => {
  let p = new URL(u).pathname.replace(/\/index(\.html?)?$/i, '/').replace(/\.html?$/i, '');
  if (p.length > 1) p = p.replace(/\/$/, '');
  return p || '/';
};

(async () => {
  const sm = await get(smUrl);
  if (sm.status !== 200) { console.log(`sitemap ${smUrl}: HTTP ${sm.status}`); process.exit(1); }
  let urls = [];
  for (const u of locs(sm.text)) urls.push(...(/\.xml$/.test(u) ? locs((await get(u)).text) : [u]));
  const base = new URL(sm.url).origin;
  hosts.add(new URL(sm.url).host);
  for (const u of urls) hosts.add(new URL(u).host);
  const src = {};
  for (const u of urls) if (!src[key(u)]) src[key(u)] = u;
  const pages = Object.keys(src);
  const inbound = Object.fromEntries(pages.map(p => [p, new Set()]));
  const out = {}, contact = {}, extra = {};
  for (const p of pages) {
    let r;
    try { r = await get(src[p]); } catch (e) { out[p] = null; continue; }
    hosts.add(new URL(r.url).host);
    if (r.status !== 200) { out[p] = `HTTP ${r.status}`; continue; }
    const links = new Set();
    let toContact = '';
    for (const m of r.text.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["']/gi)) {
      const h = m[1].trim();
      // Cloudflare's email obfuscation swaps mailto: links for this path.
      const mail = /\/cdn-cgi\/l\/email-protection/i.test(h);
      if (!toContact && (/^(tel|mailto|sms):/i.test(h) || mail || /(^|[\/#?=_.-])(contact|contact-us|book|bookings?|quotes?|enquire|enquiry|get-in-touch)(\b|$)/i.test(h)))
        toContact = mail ? 'mailto:' : h.replace(/^(tel|mailto|sms):.*/i, '$1:');
      if (mail || /^(mailto|tel|sms|javascript|data):/i.test(h)) continue;
      let abs;
      try { abs = new URL(h, r.url); } catch { continue; }
      if (!/^https?:$/.test(abs.protocol) || !hosts.has(abs.host)) continue;
      if (!PAGE.test(abs.pathname)) continue;
      const k = key(abs.href);
      if (k === p) continue;
      links.add(k);
      if (inbound[k]) inbound[k].add(p);
      else (extra[k] = extra[k] || new Set()).add(p);
    }
    out[p] = links;
    contact[p] = toContact;
  }
  const w = Math.max(...pages.map(p => p.length), 8);
  console.log(`sitemap: ${smUrl}, ${pages.length} pages\n`);
  console.log('inbound links from other sitemap pages (0 = orphan)');
  for (const p of pages) {
    const from = [...inbound[p]];
    console.log(`  ${String(from.length).padStart(2)}  ${p.padEnd(w)}  ${from.length ? '<- ' + from.join(' ') : 'ORPHAN'}`);
  }
  console.log('\neach page links to (other sitemap pages)');
  for (const p of pages) {
    const o = out[p];
    if (o == null || typeof o === 'string') { console.log(`  ${p.padEnd(w)}  could not load ${o || ''}`); continue; }
    const to = [...o].filter(k => inbound[k]);
    const not = pages.filter(k => k !== p && !o.has(k));
    const list = !to.length ? '(none)' : !not.length ? `all ${to.length} others`
      : to.length > 6 ? `${to.length} of ${pages.length - 1}, not ${not.join(' ')}` : to.join(' ');
    console.log(`  ${p.padEnd(w)}  -> ${list}   contact: ${contact[p] || 'NO'}`);
  }
  console.log('\nlinked from the site but not in sitemap.xml');
  const ex = Object.keys(extra);
  if (!ex.length) console.log('  none');
  for (const k of ex) console.log(`  ${k.padEnd(w)}  <- ${[...extra[k]].join(' ')}`);
  console.log('\nhtml sitemap page');
  const home = (await get(base + '/')).text;
  const tries = [...new Set([...ex, ...pages].filter(k => /sitemap/i.test(k)).concat(['/sitemap', '/sitemap.html']))];
  let found = false;
  for (const t of tries) {
    let r;
    try { r = await get(src[t] || base + t); } catch { continue; }
    if (r.status !== 200 || r.text === home || !/<a\b/i.test(r.text)) continue;
    const covered = new Set([...r.text.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["']/gi)]
      .map(m => { try { return key(new URL(m[1], r.url).href); } catch { return ''; } }));
    const missing = pages.filter(p => p !== key(r.url) && !covered.has(p));
    console.log(`  ${t}: found, links ${pages.length - missing.length} of ${pages.length} sitemap pages${missing.length ? ', missing ' + missing.join(' ') : ''}`);
    found = true;
    break;
  }
  if (!found) console.log(`  none found (tried ${tries.join(', ')})`);
})();
EOF
exec node -e "$JS" "$1"

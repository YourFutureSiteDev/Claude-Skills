#!/bin/bash
# schema.sh: items 22 and 23 from the outside. For each page it prints every
# ld+json block's @type and the fields item 22 asks for, flags what is
# missing, checks those facts also appear in the page's visible text, looks
# for a visible licence number, ABN and hours, and asks the Schema.org
# validator (validator.schema.org) for its error and warning count.
# Usage: bash schema.sh https://site.pages.dev [more urls or local .html files]
# Needs node 18 or later. It only reads; whether a fact is right is still
# checked against what the client supplied and their Google Business Profile.
if [ -z "$1" ]; then echo "usage: bash schema.sh <url or file> [more]"; exit 2; fi
read -r -d '' JS <<'EOF'
const fs = require('fs');
const KEY = ['name', 'url', 'telephone', 'email', 'address', 'areaServed', 'openingHours', 'openingHoursSpecification', 'sameAs', 'taxID', 'priceRange', 'image', 'logo'];
const BUSINESS = /Business|Organization|Store|Service|Contractor|Electrician|Plumber|Painter|Locksmith|Restaurant|Cafe|Salon|Shop|Dentist|Physician|Agent|Office|Repair|Moving|Roofing|HVAC|Barber|Bakery|Gym|Club/;
const one = v => Array.isArray(v) ? v : (v == null ? [] : [v]);
const dec = s => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;|&lsquo;/g, "'").replace(/&quot;|&ldquo;|&rdquo;/g, '"').replace(/&ndash;|&mdash;/g, '-').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const short = v => { const s = typeof v === 'string' ? v : JSON.stringify(v); return s.length > 90 ? s.slice(0, 87) + '...' : s; };
const names = v => one(v).map(x => typeof x === 'string' ? x : (x && (x.name || x.addressLocality)) || '').filter(Boolean);
const digits = s => String(s).replace(/[\s().-]/g, '');
const national = t => { const d = digits(t); return d.startsWith('+61') ? '0' + d.slice(3) : d; };

async function get(src) {
  if (fs.existsSync(src)) return { html: fs.readFileSync(src, 'utf8'), web: false };
  const r = await fetch(src, { headers: { 'user-agent': 'Mozilla/5.0' }, redirect: 'follow' });
  return { html: await r.text(), web: true, status: r.status };
}

function nodes(html) {
  const out = [], bad = [];
  const re = /<script[^>]*type=["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    let j;
    try { j = JSON.parse(m[1]); } catch (e) { bad.push(e.message); continue; }
    for (const x of one(j)) for (const n of (x['@graph'] ? one(x['@graph']) : [x])) out.push(n);
  }
  return { out, bad };
}

function visible(html) {
  return dec(html.replace(/<(script|style|noscript|template|svg)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
}

async function validator(url) {
  try {
    const r = await fetch('https://validator.schema.org/validate', { method: 'POST', body: new URLSearchParams({ url }), signal: AbortSignal.timeout(40000) });
    const j = JSON.parse((await r.text()).replace(/^\)\]\}'\s*/, ''));
    const types = (j.tripleGroups || []).flatMap(g => (g.nodes || []).flatMap(n => (n.types || []).map(t => t.value)));
    return `validator.schema.org: ${types.length} item(s)${types.length ? ' [' + types.join(', ') + ']' : ''}, ${j.totalNumErrors} errors, ${j.totalNumWarnings} warnings`;
  } catch (e) {
    return `validator.schema.org: could not reach (${e.message}); check by hand at https://validator.schema.org/#url=${encodeURIComponent(url)}`;
  }
}

(async () => {
  for (const src of process.argv.slice(1)) {
    console.log(`=== ${src}`);
    let page;
    try { page = await get(src); } catch (e) { console.log(`could not read: ${e.message}\n`); continue; }
    if (page.status && page.status !== 200) console.log(`HTTP ${page.status}`);
    const { out, bad } = nodes(page.html);
    const text = visible(page.html), flat = digits(text), low = text.toLowerCase();
    for (const b of bad) console.log(`ld+json block that does not parse: ${b}`);
    if (!out.length) console.log('ld+json: none (item 22 fails)');
    for (const n of out) {
      const type = one(n['@type']).join(', ') || '(no @type)';
      console.log(`@type ${type}`);
      for (const k of KEY) if (n[k] != null) {
        const v = k === 'address' && typeof n[k] === 'object'
          ? ['streetAddress', 'addressLocality', 'addressRegion', 'postalCode'].map(f => n[k][f]).filter(Boolean).join(', ')
          : k === 'openingHoursSpecification'
            ? one(n[k]).map(s => `${one(s.dayOfWeek).map(d => String(d).replace(/.*\//, '').slice(0, 3)).join('/')} ${s.opens}-${s.closes}`).join('; ')
            : short(k === 'areaServed' || k === 'sameAs' ? names(n[k]).join('; ') || n[k] : n[k]);
        console.log(`  ${k.padEnd(26)}${v}`);
      }
      if (!BUSINESS.test(type)) continue;
      const miss = [];
      if (!n.name) miss.push('name');
      if (!n.url) miss.push('url');
      if (!n.areaServed) miss.push('areaServed');
      if (!n.openingHours && !n.openingHoursSpecification) miss.push('hours');
      if (!n.telephone && !n.email) miss.push('telephone or email');
      console.log(`  missing for item 22: ${miss.length ? miss.join(', ') : 'nothing'}`);
      if (one(n['@type']).includes('LocalBusiness')) console.log('  note: plain LocalBusiness. Use the closest schema.org subtype if the trade has one; leave it if it has none.');
      const seen = [];
      if (n.name) seen.push(`name ${low.includes(String(n.name).toLowerCase()) ? 'yes' : 'NO'}`);
      if (n.telephone) seen.push(`phone ${flat.includes(national(n.telephone)) || flat.includes(digits(n.telephone)) ? 'yes' : 'NO'}`);
      if (n.email) seen.push(`email ${low.includes(String(n.email).toLowerCase()) ? 'yes' : 'NO'}`);
      for (const a of names(n.areaServed)) seen.push(`area "${a}" ${low.includes(a.toLowerCase()) ? 'yes' : 'NO'}`);
      if (n.address && n.address.addressLocality) seen.push(`locality ${low.includes(String(n.address.addressLocality).toLowerCase()) ? 'yes' : 'NO'}`);
      console.log(`  also in visible text: ${seen.join(', ') || '(no facts to compare)'}`);
    }
    const lic = text.match(/licen[cs]e[^.]{0,30}?(?:no\.?|number|#)?\s*[:#]?\s*([A-Z]{0,4}\s?\d[\d\s-]{3,12}\d[A-Z]?)\b/i);
    const abn = text.match(/\bABN\b[\s:]*(\d{2}\s?\d{3}\s?\d{3}\s?\d{3})/i);
    const hrs = text.match(/\b(Mon(day)?|Tue(s|sday)?|Wed(nesday)?|Thu(rs|rsday)?|Fri(day)?|Sat(urday)?|Sun(day)?)\b[^.]{0,40}?\d{1,2}(:\d{2})?\s?(am|pm)/i);
    console.log(`visible facts (item 23): licence number ${lic ? '"' + lic[1].trim() + '"' : 'not found'}, ABN ${abn ? '"' + abn[1] + '"' : 'not found'}, hours ${hrs ? '"' + short(hrs[0]) + '"' : 'not found'}`);
    if (page.web) console.log(await validator(src));
    console.log('');
  }
})();
EOF
exec node -e "$JS" "$@"

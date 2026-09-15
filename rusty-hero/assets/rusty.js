/* rusty.js
   Product-colour hero switcher. Pairs with rusty.css.

   Markup contract (see demo.html):
     <section data-rusty="full" ...>            scope: receives the page colour
       <div class="rusty-hero" data-rusty-hero>  the card
         ... .rusty-swap elements with data-field="title|desc|amount|kicker|ghost"
         <img class="rusty-product" data-field="image">
         <div class="rusty-chips" data-field="chips">
         <div class="rusty-variants" data-field="variants">
         <div class="rusty-thumbs" data-thumbs>
         <button data-prev> <button data-next>
         <a class="rusty-cta" data-field="cta">
       </div>
       <script type="application/json" data-rusty-subjects>[ {...}, {...} ]</script>
     </section>

   Subject shape:
     { "id":"fanta", "colour":"#f28c28", "title":"Fanta taste", "kicker":"Guava flavour",
       "desc":"...", "image":"img/fanta.png", "thumb":"img/fanta.png",
       "chips":["Sugar free","Vegan"], "variants":["250","500","1000"], "variant":1,
       "amount":"$79.50", "amountNote":"per case", "ghost":"FANTA",
       "cta":{"label":"Add to cart","href":"#"} }

   Everything is optional except id, colour and title. Missing fields are hidden.
   Public API: RustyHero.init(scope?) returns { go(indexOrId), next(), prev(), current }.
*/
(function () {
  'use strict';

  function hexToHsl(hex) {
    var m = hex.replace('#', '');
    if (m.length === 3) m = m.split('').map(function (c) { return c + c; }).join('');
    var r = parseInt(m.slice(0, 2), 16) / 255, g = parseInt(m.slice(2, 4), 16) / 255, b = parseInt(m.slice(4, 6), 16) / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b), h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  }
  function hsl(h, s, l) { return 'hsl(' + Math.round(h) + ' ' + Math.round(Math.max(0, Math.min(100, s))) + '% ' + Math.round(Math.max(0, Math.min(100, l))) + '%)'; }
  function luminance(hex) {
    var m = hex.replace('#', ''); if (m.length === 3) m = m.split('').map(function (c) { return c + c; }).join('');
    var c = [0, 2, 4].map(function (i) { var v = parseInt(m.slice(i, i + 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }

  /* Rusty's palette from one colour: page is a lighter tint of the hue, card is the
     colour itself, deep is the card's edge, glow is the lighter centre behind the product. */
  function derive(colour) {
    var c = hexToHsl(colour);
    var dark = luminance(colour) < 0.3;
    return {
      page: hsl(c.h, c.s * 0.9, Math.min(80, c.l + 18)),
      card: colour,
      deep: hsl(c.h, c.s, c.l - 12),
      glow: hsl(c.h, c.s * 0.92, c.l + 14),
      ink: dark ? '#ffffff' : (c.l > 62 ? '#111111' : '#ffffff'),
      cta: dark ? '#ffffff' : '#0b0b0b',
      ctaInk: dark ? colour : '#ffffff'
    };
  }

  function paint(scope, hero, colour) {
    var p = derive(colour);
    scope.style.setProperty('--rusty-base', colour);
    scope.style.setProperty('--rusty-page', p.page);
    hero.style.setProperty('--rusty-card', p.card);
    hero.style.setProperty('--rusty-deep', p.deep);
    hero.style.setProperty('--rusty-glow', p.glow);
    hero.style.setProperty('--rusty-ink', p.ink);
    hero.style.setProperty('--rusty-cta', p.cta);
    hero.style.setProperty('--rusty-cta-ink', p.ctaInk);
  }

  function reduced() { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  function init(scope) {
    scope = scope || document.querySelector('[data-rusty]');
    if (!scope) return null;
    if (scope._rusty) return scope._rusty;      /* one instance per scope: a second init hands back the first */
    var hero = scope.querySelector('[data-rusty-hero]') || scope;
    var dataEl = scope.querySelector('[data-rusty-subjects]');
    if (!dataEl) return null;
    var subjects;
    try { subjects = JSON.parse(dataEl.textContent); } catch (e) { console.warn('rusty: bad subjects JSON', e); return null; }
    if (!subjects.length) return null;

    var fields = {};
    hero.querySelectorAll('[data-field]').forEach(function (el) { fields[el.getAttribute('data-field')] = el; });
    var thumbs = hero.querySelector('[data-thumbs]');
    var dots = hero.querySelector('[data-dots]');
    var prev = hero.querySelector('[data-prev]');
    var next = hero.querySelector('[data-next]');
    var index = Math.max(0, subjects.findIndex(function (s) { return s.id === scope.getAttribute('data-rusty-start'); }));
    var busy = false;

    function setText(name, value) {
      var el = fields[name]; if (!el) return;
      if (value == null || value === '') { el.hidden = true; return; }
      el.hidden = false; el.textContent = value;
    }
    function fillChips(name, list, pressedIndex, onPick) {
      var el = fields[name]; if (!el) return;
      el.innerHTML = '';
      if (!list || !list.length) { el.hidden = true; return; }
      el.hidden = false;
      list.forEach(function (label, i) {
        var b = document.createElement(onPick ? 'button' : 'span');
        b.className = onPick ? '' : 'rusty-chip';
        b.textContent = label;
        if (onPick) {
          b.type = 'button';
          b.setAttribute('aria-pressed', i === pressedIndex ? 'true' : 'false');
          b.addEventListener('click', function () {
            el.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
            b.setAttribute('aria-pressed', 'true');
            onPick(i, label);
          });
        }
        el.appendChild(b);
      });
    }
    function render(s) {
      setText('title', s.title); setText('kicker', s.kicker); setText('desc', s.desc);
      setText('amount', s.amount); setText('ghost', s.ghost);
      if (fields.amountNote) { setText('amountNote', s.amountNote); }
      fillChips('chips', s.chips);
      fillChips('variants', s.variants, s.variant == null ? 0 : s.variant, function (i) {
        scope.dispatchEvent(new CustomEvent('rusty:variant', { detail: { subject: s, variant: s.variants[i], index: i } }));
      });
      if (fields.cta) {
        if (s.cta) { fields.cta.hidden = false; fields.cta.textContent = s.cta.label || 'Buy now'; if (s.cta.href) fields.cta.setAttribute('href', s.cta.href); }
        else fields.cta.hidden = true;
      }
      if (fields.image) {
        if (s.image) { fields.image.hidden = false; fields.image.src = s.image; fields.image.alt = s.imageAlt || s.title || ''; }
        else fields.image.hidden = true;
      }
      if (thumbs) thumbs.querySelectorAll('button').forEach(function (b, i) { b.setAttribute('aria-pressed', i === index ? 'true' : 'false'); });
      if (dots) dots.querySelectorAll('i').forEach(function (d, i) { d.classList.toggle('is-active', i === index); });
      scope.setAttribute('data-rusty-current', s.id);
    }

    function go(target, dir) {
      var to = typeof target === 'number' ? target : subjects.findIndex(function (s) { return s.id === target; });
      if (to < 0 || to >= subjects.length || to === index || busy) return;
      dir = dir || (to > index ? 1 : -1);
      var s = subjects[to];
      index = to;
      paint(scope, hero, s.colour);
      scope.dispatchEvent(new CustomEvent('rusty:change', { detail: { subject: s, index: to } }));

      var swaps = hero.querySelectorAll('.rusty-swap');
      var img = fields.image || hero.querySelector('.rusty-product'); /* a typographic mark carrying the product class slides like a product */
      if (reduced() || !img) { swaps.forEach(function (el) { el.classList.remove('is-leaving'); }); render(s); return; }

      busy = true;
      swaps.forEach(function (el) { el.classList.add('is-leaving'); });
      img.classList.add(dir > 0 ? 'is-out-left' : 'is-out-right');
      var done = false;
      function swapIn() {
        if (done) return; done = true;
        render(s);
        img.classList.remove('is-out-left', 'is-out-right');
        img.classList.add(dir > 0 ? 'is-in-right' : 'is-in-left');
        void img.offsetWidth;                       /* commit the start position before animating in */
        img.classList.remove('is-in-right', 'is-in-left');
        swaps.forEach(function (el) { el.classList.remove('is-leaving'); });
        busy = false;
      }
      img.addEventListener('transitionend', swapIn, { once: true });
      setTimeout(swapIn, 600);                      /* transitionend can be swallowed by a cached image */
    }

    if (thumbs) {
      thumbs.innerHTML = '';
      subjects.forEach(function (s, i) {
        var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', s.title || s.id);
        if (s.thumb || s.image) { var im = document.createElement('img'); im.src = s.thumb || s.image; im.alt = ''; b.appendChild(im); }
        else { b.textContent = s.short || (s.title || '').slice(0, 3); b.style.color = 'inherit'; b.style.fontSize = '0.7rem'; }
        b.addEventListener('click', function () { go(i); });
        thumbs.appendChild(b);
      });
    }
    if (dots) { dots.innerHTML = ''; subjects.forEach(function () { dots.appendChild(document.createElement('i')); }); }
    if (prev) prev.addEventListener('click', function () { go((index - 1 + subjects.length) % subjects.length, -1); });
    if (next) next.addEventListener('click', function () { go((index + 1) % subjects.length, 1); });
    hero.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { go((index + 1) % subjects.length, 1); }
      if (e.key === 'ArrowLeft') { go((index - 1 + subjects.length) % subjects.length, -1); }
    });

    /* Deep link: #rusty=<id> or ?rusty=<id> lands on that subject */
    var wanted = (location.hash.match(/rusty=([\w-]+)/) || location.search.match(/rusty=([\w-]+)/) || [])[1];
    if (wanted) { var w = subjects.findIndex(function (s) { return s.id === wanted; }); if (w >= 0) index = w; }

    paint(scope, hero, subjects[index].colour);
    render(subjects[index]);
    scope.classList.add('is-ready');
    var api = { go: go, next: function () { next && next.click(); }, prev: function () { prev && prev.click(); }, get current() { return subjects[index]; }, subjects: subjects };
    scope._rusty = api;
    return api;
  }

  window.RustyHero = { init: init, derive: derive };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { document.querySelectorAll('[data-rusty]').forEach(function (s) { init(s); }); });
  else document.querySelectorAll('[data-rusty]').forEach(function (s) { init(s); });
})();

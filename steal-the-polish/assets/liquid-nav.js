/* liquid-nav.js
   Drives liquid-nav.css. Plain JS, no dependencies, works on iPhone Safari.

   1. The indicator. Finds the link with aria-current (or the first link),
      puts a pill behind it, and glides the pill to whichever link is
      clicked. The glide is a real damped spring baked into a CSS linear()
      easing; browsers without linear() get a cubic-bezier overshoot.
      Reduced motion: the pill jumps.

   2. Scroll spy (data-spy on the nav). For one page sites: the pill follows
      the #section currently in the middle of the screen. It holds still
      while a clicked link is still scrolling the page there.

   3. Glass refraction (data-glass="refract"). Chromium only, because only
      Chromium runs SVG filters inside backdrop-filter. Builds a displacement
      map for the pill's exact size on a canvas, feeds it to an SVG
      feImage plus feDisplacementMap, and applies it with
      backdrop-filter: url(#id) blur(). Safari and Firefox keep the frosted
      blur from the CSS, which is the right look there anyway.

   4. Theme toggle ([data-theme-toggle], anywhere on the page). Sets
      data-theme="light|dark" on <html> and remembers it. Where the browser
      has document.startViewTransition, the new theme is revealed as a
      circle growing from the button; elsewhere, and with reduced motion,
      it switches instantly. Put this in <head> to avoid a flash of the
      wrong theme on load:
        <script>try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t;}catch(e){}</script>
*/
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- a damped spring, sampled into a linear() easing ----
  function springEasing(stiffness, damping) {
    var x = 0, v = 0, dt = 1 / 240, t = 0, pts = [0], still = 0;
    while (t < 2) {
      var a = -stiffness * (x - 1) - damping * v;
      v += a * dt; x += v * dt; t += dt;
      pts.push(x);
      if (Math.abs(x - 1) < 0.001 && Math.abs(v) < 0.01) { if (++still > 10) break; } else still = 0;
    }
    var step = Math.max(1, Math.floor(pts.length / 48)), out = [];
    for (var i = 0; i < pts.length; i += step) out.push(+pts[i].toFixed(4));
    out.push(1);
    return { easing: 'linear(' + out.join(', ') + ')', ms: Math.round(t * 1000) };
  }
  var spring = springEasing(380, 26);   // a short settle with one small overshoot
  var hasLinear = window.CSS && CSS.supports && CSS.supports('transition-timing-function', 'linear(0, 1)');
  var glide = reduce ? 'none'
    : hasLinear ? 'transform ' + spring.ms + 'ms ' + spring.easing + ', width ' + spring.ms + 'ms ' + spring.easing
    : 'transform 460ms cubic-bezier(0.34, 1.56, 0.64, 1), width 460ms cubic-bezier(0.34, 1.56, 0.64, 1)';

  // ---- Chromium check for backdrop-filter: url() ----
  function canRefract() {
    if (!(window.CSS && CSS.supports && CSS.supports('backdrop-filter', 'url(#a) blur(1px)'))) return false;
    var ua = navigator.userAgent;
    if (navigator.userAgentData && navigator.userAgentData.brands) {
      return navigator.userAgentData.brands.some(function (b) { return /Chromium/.test(b.brand); });
    }
    return /Chrome\/\d+/.test(ua) && !/CriOS|FxiOS|EdgiOS|Firefox/.test(ua);
  }

  // displacement map for a pill of w by h: neutral grey in the middle, the
  // rim pushes sideways along its outward normal so the backdrop bends there
  function pillMap(w, h, band) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    var ctx = c.getContext('2d'), img = ctx.createImageData(w, h), d = img.data;
    var r = h / 2, x0 = r, x1 = w - r;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var cx = Math.max(x0, Math.min(x1, x + 0.5)), dx = x + 0.5 - cx, dy = y + 0.5 - r;
        var len = Math.sqrt(dx * dx + dy * dy) || 1;
        var inside = r - len;                                // px in from the rim
        var k = Math.max(0, 1 - inside / band); k = k * k;   // eases off toward the middle
        var o = (y * w + x) * 4;
        d[o] = 128 + (dx / len) * k * 127;
        d[o + 1] = 128 + (dy / len) * k * 127;
        d[o + 2] = 128;
        d[o + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return c.toDataURL('image/png');
  }

  var uid = 0;
  function setupRefraction(nav) {
    var id = 'ln-glass-' + (++uid), NS = 'http://www.w3.org/2000/svg';
    var holder = document.createElementNS(NS, 'svg');
    holder.setAttribute('aria-hidden', 'true');
    holder.setAttribute('width', '0');
    holder.setAttribute('height', '0');
    holder.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    holder.innerHTML =
      '<filter id="' + id + '" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">' +
      '<feImage x="0" y="0" preserveAspectRatio="none" result="map"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="G"/>' +
      '</filter>';
    document.body.appendChild(holder);
    var feImage = holder.querySelector('feImage'), disp = holder.querySelector('feDisplacementMap');
    var lastW = 0, lastH = 0;
    function build() {
      var w = Math.round(nav.offsetWidth), h = Math.round(nav.offsetHeight);
      if (!w || !h || (w === lastW && h === lastH)) return;
      lastW = w; lastH = h;
      feImage.setAttribute('width', w);
      feImage.setAttribute('height', h);
      feImage.setAttribute('href', pillMap(w, h, Math.min(h * 0.5, 26)));
      disp.setAttribute('scale', String(-Math.round(h * 0.85)));
      nav.style.setProperty('--ln-refract', 'url(#' + id + ')');
      nav.classList.add('is-refracting');
    }
    build();
    if ('ResizeObserver' in window) new ResizeObserver(build).observe(nav);
    else window.addEventListener('resize', build);
  }

  function setupNav(nav) {
    var track = nav.querySelector('.liquid-nav__track') || nav;
    var links = [].slice.call(track.querySelectorAll('a'));
    if (!links.length) return;
    var pill = document.createElement('span');
    pill.className = 'liquid-nav__pill';
    pill.setAttribute('aria-hidden', 'true');
    track.insertBefore(pill, track.firstChild);

    var active = links.filter(function (a) { return a.hasAttribute('aria-current'); })[0] || links[0];
    function place(a, animate) {
      pill.style.transition = animate ? glide : 'none';
      pill.style.width = a.offsetWidth + 'px';
      pill.style.transform = 'translateX(' + a.offsetLeft + 'px)';
    }
    function activate(a, animate) {
      if (!a) return;
      links.forEach(function (l) { if (l !== a) l.removeAttribute('aria-current'); });
      a.setAttribute('aria-current', a.getAttribute('aria-current') || (nav.hasAttribute('data-spy') ? 'location' : 'page'));
      active = a;
      place(a, animate);
      // keep the active item in view when the track scrolls on a phone
      var l = a.offsetLeft, r = l + a.offsetWidth;
      if (l < track.scrollLeft || r > track.scrollLeft + track.clientWidth) {
        track.scrollTo({ left: l - 16, behavior: reduce ? 'auto' : 'smooth' });
      }
    }
    place(active, false);
    active.setAttribute('aria-current', active.getAttribute('aria-current') || 'page');

    var lockUntil = 0;
    links.forEach(function (a) {
      a.addEventListener('click', function () { lockUntil = performance.now() + 1000; activate(a, true); });
    });
    window.addEventListener('scrollend', function () { lockUntil = 0; });

    // fonts loading or a resize change the widths; re-seat without animating
    var reseat = function () { place(active, false); };
    if ('ResizeObserver' in window) new ResizeObserver(reseat).observe(track);
    window.addEventListener('resize', reseat);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(reseat);

    if (nav.hasAttribute('data-spy') && 'IntersectionObserver' in window) {
      var map = new Map();
      links.forEach(function (a) {
        var hash = a.getAttribute('href');
        if (!hash || hash.charAt(0) !== '#' || hash.length < 2) return;
        var sec = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (sec) map.set(sec, a);
      });
      var io = new IntersectionObserver(function (entries) {
        if (performance.now() < lockUntil) return;
        entries.forEach(function (e) { if (e.isIntersecting) activate(map.get(e.target), true); });
      }, { rootMargin: '-45% 0px -50% 0px' });
      map.forEach(function (_, sec) { io.observe(sec); });
    }

    if (nav.dataset.glass === 'refract' && canRefract()) setupRefraction(nav);
  }

  // ---- theme toggle ----
  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

  function currentTheme() {
    var t = document.documentElement.dataset.theme;
    if (t) return t;
    return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function paintToggle(btn) {
    var dark = currentTheme() === 'dark';
    if (!btn.hasAttribute('data-keep-icon')) btn.innerHTML = dark ? SUN : MOON;
    btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }
  function applyTheme(t) {
    document.documentElement.dataset.theme = t;
    document.documentElement.style.colorScheme = t;
    try { localStorage.setItem('theme', t); } catch (e) {}
    document.querySelectorAll('[data-theme-toggle]').forEach(paintToggle);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', getComputedStyle(document.body).backgroundColor);
  }
  function toggleTheme(btn) {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    if (reduce || !document.startViewTransition) { applyTheme(next); return; }
    var r = btn.getBoundingClientRect();
    var x = r.left + r.width / 2, y = r.top + r.height / 2;
    var end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    var vt = document.startViewTransition(function () { applyTheme(next); });
    vt.ready.then(function () {
      document.documentElement.animate(
        { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + end + 'px at ' + x + 'px ' + y + 'px)'] },
        { duration: 560, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' }
      );
    }).catch(function () {});
  }

  function init() {
    document.querySelectorAll('[data-liquid-nav]').forEach(setupNav);
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      paintToggle(btn);
      btn.addEventListener('click', function () { toggleTheme(btn); });
    });
  }
  window.LiquidNav = { applyTheme: applyTheme, springEasing: springEasing };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

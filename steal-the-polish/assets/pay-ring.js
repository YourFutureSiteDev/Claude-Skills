/* pay-ring.js
   Drives pay-ring.css. Plain JS, no dependencies, works on iPhone Safari.

   The kit never runs a payment. Your own code (or the Square checkout link)
   does that, and tells the button what happened:

     PayRing.start(btn)              collapse to the ring, indeterminate spin
     PayRing.progress(btn, 0.6)      optional: switch to a real fill, 0 to 1
     PayRing.success(btn)            green tick, short burst, "Payment received"
     PayRing.fail(btn, "Card declined. Check the details or try another card.")
     PayRing.reset(btn)              back to idle

   btn can be the element or a selector. Each call also returns a promise
   that settles once the state is on screen.

   Honest by design: the ring spins with no number until progress() is called
   with a real fraction. Never feed it a timer pretending to be progress.

   Data attributes (all optional):
     data-pay-ring            enhance this button (or "link" for an <a> that
                              leaves for a hosted checkout: the ring starts on
                              click and the browser navigates as normal;
                              the Back button, or coming back from a new
                              tab, puts it back to idle. Link mode never
                              shows success: only the checkout knows that)
     data-label-busy          status while waiting   (default "Processing payment…")
     data-label-done          status after success   (default "Payment received")
     data-label-retry         button label after an error (default "Try again")
     data-burst="off"         no particle burst on success
     data-min-busy="700"      ms the ring stays up at least, so a fast reply
                              does not flash (Vercel: 300 to 500ms minimum)

   A form example:
     form.addEventListener('submit', async e => {
       e.preventDefault();
       PayRing.start(btn);
       try { const r = await pay(); r.ok ? PayRing.success(btn) : PayRing.fail(btn, r.message); }
       catch (err) { PayRing.fail(btn, "We could not reach the payment service. Check your connection and try again."); }
     });
   While the ring is up, clicks and Enter are swallowed so nobody pays twice.
*/
(function () {
  var SVGNS = 'http://www.w3.org/2000/svg';
  var R = 20, C = 2 * Math.PI * R;          // ring radius in a 48 box, and its length
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var store = new WeakMap();

  function $(el) { return typeof el === 'string' ? document.querySelector(el) : el; }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function svg(tag, attrs) {
    var n = document.createElementNS(SVGNS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  function enhance(el) {
    el = $(el);
    if (!el) throw new Error('PayRing: element not found');
    if (store.has(el)) return store.get(el);

    // the label
    var label = el.querySelector('.pay-ring__label');
    if (!label) {
      label = document.createElement('span');
      label.className = 'pay-ring__label';
      while (el.firstChild) label.appendChild(el.firstChild);
      el.appendChild(label);
    }
    el.classList.add('pay-ring');

    // the ring and the tick, hidden from assistive tech: the status line speaks
    var ring = svg('svg', { 'class': 'pay-ring__ring', viewBox: '0 0 48 48', 'aria-hidden': 'true', focusable: 'false' });
    ring.appendChild(svg('circle', { 'class': 'pay-ring__track', cx: 24, cy: 24, r: R }));
    var arc = svg('circle', { 'class': 'pay-ring__arc', cx: 24, cy: 24, r: R });
    arc.style.strokeDasharray = C;
    arc.style.strokeDashoffset = C * 0.72;
    ring.appendChild(arc);
    var tick = svg('svg', { 'class': 'pay-ring__tick', viewBox: '0 0 48 48', 'aria-hidden': 'true', focusable: 'false' });
    tick.appendChild(svg('path', { d: 'M15 24.5l6.2 6.2L33.5 18' }));
    el.appendChild(ring);
    el.appendChild(tick);

    // wrapper, status and error lines
    var wrap = el.parentElement && el.parentElement.classList.contains('pay-ring-wrap') ? el.parentElement : null;
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'pay-ring-wrap';
      el.parentNode.insertBefore(wrap, el);
      wrap.appendChild(el);
    }
    if (el.classList.contains('pay-ring--block')) wrap.classList.add('pay-ring-wrap--block');
    var status = document.createElement('p');
    status.className = 'pay-ring__status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    var error = document.createElement('p');
    error.className = 'pay-ring__error';
    error.setAttribute('role', 'alert');
    error.id = 'pr-err-' + Math.random().toString(36).slice(2, 8);
    wrap.appendChild(status);
    wrap.appendChild(error);

    var s = {
      el: el, label: label, arc: arc, wrap: wrap, status: status, error: error,
      original: label.innerHTML, startedAt: 0, queue: Promise.resolve()
    };
    store.set(el, s);
    el.dataset.state = 'idle';

    // swallow repeat clicks while busy or paid, so nobody pays twice
    el.addEventListener('click', function (e) {
      var st = el.dataset.state;
      if (st === 'busy' || st === 'success') { e.preventDefault(); e.stopImmediatePropagation(); return; }
      if (el.dataset.payRing === 'link') start(el);   // hosted checkout: let it navigate
    }, true);
    var form = el.form || el.closest('form');
    if (form) form.addEventListener('submit', function (e) {
      var st = el.dataset.state;
      if (st === 'busy' || st === 'success') { e.preventDefault(); e.stopImmediatePropagation(); }
    }, true);

    // back button from the checkout restores this page from cache with the
    // ring still spinning; put it back to idle
    if (el.dataset.payRing === 'link') {
      window.addEventListener('pageshow', function (e) { if (e.persisted) reset(el); });
      // checkout opened in a new tab: reset when the visitor comes back
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible' && el.dataset.state === 'busy') reset(el);
      });
    }
    return s;
  }

  function collapse(s) {
    var el = s.el;
    el.style.width = el.offsetWidth + 'px';
    void el.offsetWidth;                       // commit the start width
    el.dataset.state = 'busy';
    el.style.width = getComputedStyle(el).height;
  }

  function expand(s) {
    var el = s.el, from = el.offsetWidth;
    el.style.width = '';
    var to = el.offsetWidth;                   // natural width with the new label
    el.style.width = from + 'px';
    void el.offsetWidth;
    el.style.width = to + 'px';
    var done = function () { el.style.width = ''; el.removeEventListener('transitionend', onEnd); };
    var onEnd = function (e) { if (e.propertyName === 'width') done(); };
    el.addEventListener('transitionend', onEnd);
    setTimeout(done, reduce ? 0 : 500);        // in case transitionend never fires
  }

  function start(el, opts) {
    var s = enhance(el);
    if (s.el.dataset.state === 'busy') return s.queue;
    opts = opts || {};
    s.startedAt = performance.now();
    s.error.textContent = '';
    s.el.removeAttribute('aria-describedby');
    s.el.removeAttribute('data-progress');
    s.arc.style.strokeDashoffset = C * 0.72;
    s.el.setAttribute('aria-busy', 'true');
    s.el.setAttribute('aria-disabled', 'true');
    collapse(s);
    s.status.removeAttribute('data-tone');
    s.status.textContent = opts.label || s.el.dataset.labelBusy || 'Processing payment…';
    s.queue = Promise.resolve();
    return s.queue;
  }

  function progress(el, p) {
    var s = enhance(el);
    if (s.el.dataset.state !== 'busy') return;
    p = Math.max(0, Math.min(1, +p || 0));
    s.el.dataset.progress = Math.round(p * 100);
    s.arc.style.strokeDashoffset = C * (1 - p);
  }

  // hold the ring up for at least data-min-busy ms, then run fn
  function settle(s, fn) {
    var min = +(s.el.dataset.minBusy || 700);
    var left = Math.max(0, min - (performance.now() - s.startedAt));
    s.queue = s.queue.then(function () { return wait(left); }).then(fn);
    return s.queue;
  }

  function success(el, opts) {
    var s = enhance(el);
    opts = opts || {};
    if (s.el.dataset.state !== 'busy') start(el);
    return settle(s, function () {
      s.el.dataset.progress = 100;
      s.arc.style.strokeDashoffset = 0;
      s.el.dataset.state = 'success';
      s.el.removeAttribute('aria-busy');
      s.status.dataset.tone = 'success';
      s.status.textContent = opts.label || s.el.dataset.labelDone || 'Payment received';
      if (s.el.dataset.burst !== 'off' && !reduce) burst(s);
      return wait(reduce ? 0 : 560);
    });
  }

  function fail(el, msg) {
    var s = enhance(el);
    if (s.el.dataset.state !== 'busy') start(el);
    return settle(s, function () {
      s.el.removeAttribute('aria-busy');
      s.el.removeAttribute('aria-disabled');
      s.el.removeAttribute('data-progress');
      s.label.textContent = s.el.dataset.labelRetry || 'Try again';
      s.el.dataset.state = 'error';
      expand(s);
      s.status.textContent = '';
      s.error.textContent = msg || 'The payment did not go through. Check your details and try again.';
      s.el.setAttribute('aria-describedby', s.error.id);
      if (!reduce) {
        s.el.classList.remove('is-shaking');
        void s.el.offsetWidth;
        s.el.classList.add('is-shaking');
        setTimeout(function () { s.el.classList.remove('is-shaking'); }, 420);
      }
      return wait(reduce ? 0 : 420);
    });
  }

  function reset(el) {
    var s = enhance(el);
    s.queue = Promise.resolve();
    s.label.innerHTML = s.original;
    s.el.removeAttribute('aria-busy');
    s.el.removeAttribute('aria-disabled');
    s.el.removeAttribute('aria-describedby');
    s.el.removeAttribute('data-progress');
    s.status.textContent = '';
    s.status.removeAttribute('data-tone');
    s.error.textContent = '';
    var was = s.el.dataset.state;
    s.el.dataset.state = 'idle';
    if (was === 'busy' || was === 'success') expand(s);
    return s.queue;
  }

  // eight to ten dots thrown out from the button centre, gone in 650ms
  function burst(s) {
    var el = s.el, wrap = s.wrap;
    var cx = el.offsetLeft + el.offsetWidth / 2, cy = el.offsetTop + el.offsetHeight / 2;
    var colours = [getComputedStyle(el).getPropertyValue('--pr-success').trim() || '#16a34a', '#86efac', '#facc15'];
    var n = 10;
    for (var i = 0; i < n; i++) {
      var d = document.createElement('span');
      d.className = 'pay-ring__spark';
      d.setAttribute('aria-hidden', 'true');
      d.style.left = cx + 'px';
      d.style.top = cy + 'px';
      d.style.background = colours[i % colours.length];
      wrap.appendChild(d);
      var a = (i / n) * Math.PI * 2 + Math.random() * 0.4;
      var dist = el.offsetHeight * (0.75 + Math.random() * 0.45);
      var anim = d.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: 'translate(' + Math.cos(a) * dist + 'px,' + Math.sin(a) * dist + 'px) scale(0.2)', opacity: 0 }
      ], { duration: 560 + Math.random() * 120, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'forwards' });
      anim.onfinish = (function (node) { return function () { node.remove(); }; })(d);
    }
  }

  window.PayRing = { start: start, progress: progress, success: success, fail: fail, reset: reset, enhance: enhance };

  function init() { document.querySelectorAll('[data-pay-ring]').forEach(function (el) { enhance(el); }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

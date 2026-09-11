/* ui-signals: the JS half. Dependency free, no build step.
   Load after signals.css. Call Signals.init() once, or wire pieces by hand.
   Every helper only touches the element it is given; nothing is global. */

(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function nextFrame(fn) { requestAnimationFrame(function () { requestAnimationFrame(fn); }); }
  function fmtBytes(b) {
    if (b == null) return '';
    if (b >= 1048576) return (b / 1048576).toFixed(1) + ' MB';
    if (b >= 1024) return Math.round(b / 1024) + ' KB';
    return b + ' B';
  }
  function fmtSecs(s) {
    if (s == null || !isFinite(s)) return '';
    if (s < 1) return 'under 1s left';
    if (s < 60) return Math.ceil(s) + 's left';
    return Math.ceil(s / 60) + 'm left';
  }

  /* copy-swap: mark the [data-when] child matching `state` inside `el`. */
  function setState(el, state) {
    el.setAttribute('data-state', state);
    $$('.sig-swap', el).concat(el.classList.contains('sig-swap') ? [el] : []).forEach(function (swap) {
      $$(':scope > [data-when]', swap).forEach(function (child) {
        child.classList.toggle('is-on', child.getAttribute('data-when') === state);
      });
    });
  }

  /* state-glow: only one live element at a time, page wide. */
  function glow(el) {
    $$('.sig-glow.is-active').forEach(function (other) { if (other !== el) other.classList.remove('is-active'); });
    if (el) el.classList.add('is-active');
  }

  /* drop-answer: the dropzone answers a drag. onFiles(files) on drop or pick. */
  function dropzone(el, opts) {
    opts = opts || {};
    var input = $('input[type="file"]', el);
    var depth = 0;
    var overCopy = $('[data-when="over"] [data-sig-dropcopy]', el);
    setState(el, 'idle');

    function describe(dt) {
      if (!dt || !dt.items || !dt.items.length) return '';
      var n = dt.items.length;
      var type = dt.items[0].type || '';
      var kind = type.indexOf('image/') === 0 ? 'image' : type === 'application/pdf' ? 'PDF' : type.indexOf('video/') === 0 ? 'video' : 'file';
      return n === 1 ? '1 ' + kind : n + ' files';
    }

    el.addEventListener('dragenter', function (e) {
      e.preventDefault();
      depth++;
      if (overCopy) overCopy.textContent = describe(e.dataTransfer);
      setState(el, 'over');
      if (el.classList.contains('sig-glow')) glow(el);
    });
    el.addEventListener('dragover', function (e) { e.preventDefault(); });
    el.addEventListener('dragleave', function () {
      depth = Math.max(0, depth - 1);
      if (depth === 0) { setState(el, 'idle'); el.classList.remove('is-active'); }
    });
    el.addEventListener('drop', function (e) {
      e.preventDefault();
      depth = 0;
      setState(el, 'idle');
      el.classList.remove('is-active');
      if (opts.onFiles) opts.onFiles(Array.prototype.slice.call(e.dataTransfer.files));
    });
    if (input) {
      input.addEventListener('change', function () {
        if (opts.onFiles) opts.onFiles(Array.prototype.slice.call(input.files));
      });
    }
    return { setState: function (s) { setState(el, s); } };
  }

  /* honest-progress + inline-retry: a controller for one .sig-progress. */
  function progress(el, opts) {
    opts = opts || {};
    var pct = $('[data-pct]', el);
    var eta = $('[data-eta]', el);
    var rate = $('[data-rate]', el);
    var status = $('[data-status]', el);
    var retry = $('[data-retry]', el);
    var last = 0;

    function set(p, meta) {
      meta = meta || {};
      last = Math.max(0, Math.min(100, p));
      el.style.setProperty('--p', (last / 100).toString());
      if (pct) pct.textContent = Math.round(last) + '%';
      if (eta) { eta.textContent = fmtSecs(meta.secondsLeft); eta.classList.toggle('is-on', !!eta.textContent); }
      if (rate) { rate.textContent = meta.rate || ''; rate.classList.toggle('is-on', !!meta.rate); }
      if (status && meta.status != null) status.textContent = meta.status;
      if (el.getAttribute('data-state') !== 'uploading') el.setAttribute('data-state', 'uploading');
    }
    function fail(message) {
      el.setAttribute('data-state', 'error');
      if (status) status.textContent = 'Paused at ' + Math.round(last) + '%, file kept in memory';
      var msg = $('[data-error-msg]', el);
      if (msg && message) msg.textContent = message;
      if (eta) eta.classList.remove('is-on');
      if (rate) rate.classList.remove('is-on');
    }
    function resume() {
      el.setAttribute('data-state', 'uploading');
      if (status) status.textContent = 'Resuming from ' + Math.round(last) + '%';
      if (opts.onResume) opts.onResume(last);
    }
    function done() {
      set(100, { status: 'Uploaded' });
      el.setAttribute('data-state', 'done');
      if (eta) eta.classList.remove('is-on');
      if (rate) rate.classList.remove('is-on');
      if (opts.onDone) opts.onDone();
    }
    if (retry) retry.addEventListener('click', resume);
    return { set: set, fail: fail, resume: resume, done: done, value: function () { return last; } };
  }

  /* upload-preview: reveal a .sig-preview card after success. */
  function preview(card, file) {
    if (file) {
      var name = $('[data-name]', card); if (name) name.textContent = file.name;
      var size = $('[data-size]', card); if (size) size.textContent = fmtBytes(file.size);
      var type = $('[data-type]', card); if (type) type.textContent = (file.name.split('.').pop() || '').toUpperCase();
      var img = $('img[data-thumb]', card);
      if (img && file.type && file.type.indexOf('image/') === 0 && window.URL) img.src = URL.createObjectURL(file);
    }
    card.hidden = false;
    nextFrame(function () { card.classList.add('is-in'); });
    return {
      hide: function () { card.classList.remove('is-in'); setTimeout(function () { card.hidden = true; }, 240); }
    };
  }

  /* own-lane-queue: one controller per row, plus a done counter. */
  function queue(list) {
    var rows = $$('[data-sig-queue-item]', list);
    var counter = $('[data-done]', list);
    var doneCount = 0;
    function refresh() { if (counter) counter.textContent = doneCount + ' of ' + rows.length + ' done'; }
    refresh();
    return rows.map(function (row) {
      var pct = $('[data-pct]', row);
      return {
        el: row,
        set: function (p) {
          p = Math.max(0, Math.min(100, p));
          row.style.setProperty('--p', (p / 100).toString());
          if (pct) pct.textContent = Math.round(p) + '%';
          if (row.getAttribute('data-state') !== 'uploading') row.setAttribute('data-state', 'uploading');
        },
        done: function () {
          row.style.setProperty('--p', '1');
          if (row.getAttribute('data-state') !== 'done') { doneCount++; row.setAttribute('data-state', 'done'); refresh(); }
        },
        fail: function () { row.setAttribute('data-state', 'error'); }
      };
    });
  }

  /* submit-states: form submit button, width locked so it never jumps.
     handler(formData) returns a promise; resolve = done, reject = error. */
  function submit(form, handler, opts) {
    opts = opts || {};
    var btn = $('.sig-submit', form) || $('[type="submit"]', form);
    if (!btn) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (btn.getAttribute('data-state') === 'loading') return;
      btn.style.minWidth = btn.offsetWidth + 'px';
      btn.setAttribute('data-state', 'loading');
      btn.disabled = true;
      Promise.resolve(handler(new FormData(form))).then(function () {
        btn.setAttribute('data-state', 'done');
        setTimeout(function () { btn.setAttribute('data-state', 'idle'); btn.disabled = false; }, opts.doneMs || 1800);
      }, function () {
        btn.setAttribute('data-state', 'error');
        setTimeout(function () { btn.setAttribute('data-state', 'idle'); btn.disabled = false; }, opts.errorMs || 1600);
      });
    });
  }

  /* field-error: one field, one message. */
  function field(wrap) {
    var msg = $('.sig-field-msg > *', wrap);
    var input = $('input, textarea, select', wrap);
    var api = {
      error: function (text) { if (msg && text) msg.textContent = text; wrap.setAttribute('data-state', 'error'); },
      clear: function () { wrap.setAttribute('data-state', 'idle'); }
    };
    if (input) input.addEventListener('input', api.clear);
    return api;
  }

  /* toast: one element reused, so a second call retargets the transition. */
  var toastEl, toastTimer;
  function toast(text, opts) {
    opts = opts || {};
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'sig-toast' + (opts.className ? ' ' + opts.className : '');
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = text;
    toastEl.setAttribute('data-kind', opts.kind || 'info');
    nextFrame(function () { toastEl.classList.add('is-on'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, opts.ms || 2800);
  }

  /* section-reveal: below-fold only. Above-fold elements are shown at once
     and a warning is logged, because that placement is a mistake. */
  function reveal(root) {
    var els = $$('[data-sig-reveal]', root);
    if (!els.length) return;
    var vh = window.innerHeight;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    els.forEach(function (el) {
      if (el.getBoundingClientRect().top < vh * 0.9) {
        el.style.transition = 'none';
        el.classList.add('is-in');
        console.warn('ui-signals: [data-sig-reveal] is on an above-the-fold element, revealed instantly. Remove the attribute from it.', el);
        return;
      }
      io.observe(el);
    });
  }

  /* chip-stagger: number the children, reveal once in view. */
  function chips(root) {
    var lists = $$('.sig-chips', root);
    if (!lists.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.2 });
    lists.forEach(function (list) {
      $$(':scope > *', list).forEach(function (c, i) { c.style.setProperty('--i', i); });
      io.observe(list);
    });
  }

  /* headline-emphasis: once, on load. */
  function headline(root) {
    $$('[data-sig-headline]', root).forEach(function (h) { nextFrame(function () { h.classList.add('is-in'); }); });
  }

  /* count-up: stats only. Reduced motion jumps straight to the value. */
  function countUp(root) {
    var els = $$('[data-sig-count]', root);
    if (!els.length) return;
    function run(el) {
      var target = parseFloat(el.getAttribute('data-sig-count'));
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var decimals = (el.getAttribute('data-decimals') | 0);
      var dur = 800;
      function paint(v) { el.textContent = prefix + v.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix; }
      if (reduce) { paint(target); return; }
      var start = performance.now();
      function tick(now) {
        var t = Math.min(1, (now - start) / dur);
        var eased = 1 - Math.pow(1 - t, 3);
        paint(target * eased);
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.5 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* Demo and mockup helper only: fakes an upload against a progress
     controller. Never ship this on a real form. */
  function simulateUpload(ctrl, opts) {
    opts = opts || {};
    var sizeMB = opts.sizeMB || 48;
    var rateMB = opts.rateMBps || 6;
    var failAt = opts.failAt;
    var from = opts.from || 0;
    var totalMs = Math.max((sizeMB / rateMB) * 1000 * (opts.speed || 0.25) * ((100 - from) / 100), from > 0 ? 1500 : 0);
    var start = performance.now();
    var cancelled = false;
    function step(now) {
      if (cancelled) return;
      var p = from + ((now - start) / totalMs) * (100 - from);
      if (failAt != null && p >= failAt) { ctrl.set(failAt, { secondsLeft: 0 }); ctrl.fail(opts.failMessage || 'Connection lost'); return; }
      if (p >= 100) { ctrl.done(); return; }
      var left = ((100 - p) / 100) * (sizeMB / rateMB);
      ctrl.set(p, { secondsLeft: left, rate: rateMB.toFixed(1) + ' MB/s', status: from > 0 ? undefined : 'Uploading' });
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    return { cancel: function () { cancelled = true; } };
  }

  function init(root) {
    root = root || document;
    reveal(root);
    chips(root);
    headline(root);
    countUp(root);
    $$('[data-sig-dropzone]', root).forEach(function (el) { if (!el._sig) el._sig = dropzone(el); });
  }

  window.Signals = {
    init: init,
    setState: setState,
    glow: glow,
    dropzone: dropzone,
    progress: progress,
    preview: preview,
    queue: queue,
    submit: submit,
    field: field,
    toast: toast,
    reveal: reveal,
    chips: chips,
    headline: headline,
    countUp: countUp,
    simulateUpload: simulateUpload,
    fmtBytes: fmtBytes
  };
})();

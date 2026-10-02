/* scroll-sequence.js
   Scroll scrubbed image sequence for scroll-sequence.css. Plain JS with
   IntersectionObserver and requestAnimationFrame, no dependencies.

   Markup:
     <section class="scroll-seq" data-scroll-seq
              data-frames="frames/latte-{n}.jpg" data-count="60" data-pad="3"
              data-frames-small="frames-720/latte-{n}.jpg"   (optional, phones)
              data-fit="cover">                               (or "contain")
       <div class="scroll-seq__stage">
         <div class="scroll-seq__media">
           <canvas class="scroll-seq__canvas" aria-hidden="true"></canvas>
           <img class="scroll-seq__still" src="frames/latte-001.jpg"
                width="720" height="960" alt="An iced latte in a tall glass">
         </div>
         <div class="scroll-seq__side">
           <div class="scroll-seq__step" data-at="0">...</div>
           <div class="scroll-seq__step" data-at="0.4">...</div>
           <div class="scroll-seq__step" data-at="0.8">...</div>
         </div>
       </div>
     </section>

   {n} is replaced by the frame number, starting at 1 and zero padded to
   data-pad digits, which is exactly what ffmpeg's %03d writes. The <img> is
   the poster: frame 1 shows the moment HTML arrives, before any JS, and it
   is also the still that reduced motion and no JS users get (point its src
   at the finished frame if that reads better as a still).

   Each .scroll-seq__step shows from its data-at (0 to 1 through the
   section) until the next step's data-at. Keep all real copy in the steps,
   never baked into the frames, so the page ranks and screen readers read it.

   Making the frames from a video (ffmpeg is at ~/.local/bin/ffmpeg):
     ffmpeg -i latte.mp4 -vf "fps=24,scale=1280:-2" -q:v 4 frames/latte-%03d.jpg
   WebP is about a third smaller:
     ffmpeg -i latte.mp4 -vf "fps=24,scale=1280:-2" -c:v libwebp -quality 72 frames/latte-%03d.webp
   Phone set: same again with scale=720:-2 into frames-720/. Aim for 60 to
   120 frames and under 5 MB in total; every frame is a download.

   GSAP ScrollTrigger works too, if the site already loads it from cdnjs:
     ScrollTrigger.create({ trigger: section, start: 'top top', end: 'bottom bottom',
       scrub: true, onUpdate: function (self) { ScrollSequence.seek(section, self.progress); } });
   and pass data-driver="external" so this file stops listening to scroll.
*/
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var instances = [];

  function pad(n, w) { n = String(n); while (n.length < w) n = '0' + n; return n; }

  function Seq(root) {
    this.root = root;
    this.canvas = root.querySelector('.scroll-seq__canvas');
    this.ctx = this.canvas.getContext('2d');
    this.still = root.querySelector('.scroll-seq__still');
    this.steps = [].slice.call(root.querySelectorAll('.scroll-seq__step'))
      .map(function (el) { return { el: el, at: parseFloat(el.dataset.at) || 0 }; })
      .sort(function (a, b) { return a.at - b.at; });
    this.count = parseInt(root.dataset.count, 10) || 1;
    var small = root.dataset.framesSmall && window.matchMedia('(max-width: 760px)').matches;
    this.pattern = small ? root.dataset.framesSmall : root.dataset.frames;
    this.padW = parseInt(root.dataset.pad, 10) || 3;
    this.fit = root.dataset.fit || 'cover';
    this.frames = new Array(this.count);
    this.loaded = new Array(this.count);
    this.current = -1;
    this.target = 0;
    this.progress = 0;
    this.started = false;
    this.ticking = false;

    root.classList.add('scroll-seq--live');
    this.size();
    this.update();

    var self = this;
    // frame 1 first, so the canvas can take over from the poster straight away
    this.load(0, function () { self.draw(true); });

    // load the rest only once the section is within two screens
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        self.near = e.isIntersecting;
        if (e.isIntersecting && !self.started) { self.started = true; self.preload(); }
      });
    }, { rootMargin: '200% 0px' });
    io.observe(root);

    if ('ResizeObserver' in window) new ResizeObserver(function () { self.size(); self.draw(true); }).observe(this.canvas);
    else window.addEventListener('resize', function () { self.size(); self.draw(true); });
  }

  Seq.prototype.src = function (i) {
    return this.pattern.replace('{n}', pad(i + 1, this.padW));
  };

  Seq.prototype.load = function (i, cb) {
    if (this.frames[i]) { if (cb && this.loaded[i]) cb(); return; }
    var self = this, img = new Image();
    img.decoding = 'async';
    this.frames[i] = img;
    img.onload = function () {
      var finish = function () { self.loaded[i] = true; if (cb) cb(); self.draw(); };
      img.decode ? img.decode().then(finish, finish) : finish();
    };
    img.onerror = function () { if (cb) cb(); };
    img.src = this.src(i);
  };

  // coarse to fine: every 16th frame, then every 8th, 4th, 2nd, then the
  // rest, so a fast scroller always has a near frame to show
  Seq.prototype.preload = function () {
    var order = [], seen = {}, n = this.count;
    [16, 8, 4, 2, 1].forEach(function (step) {
      for (var i = 0; i < n; i += step) if (!seen[i]) { seen[i] = 1; order.push(i); }
    });
    if (!seen[n - 1]) order.push(n - 1);
    var self = this, live = 0, max = 6, k = 0;
    (function next() {
      while (live < max && k < order.length) {
        var i = order[k++];
        if (self.frames[i]) continue;
        live++;
        self.load(i, function () { live--; next(); });
      }
    })();
  };

  Seq.prototype.size = function () {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);   // 3x phones gain nothing visible at 3x the pixels
    var w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    if (!w || !h) return;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
  };

  Seq.prototype.nearest = function (i) {
    if (this.loaded[i]) return i;
    for (var d = 1; d < this.count; d++) {
      if (i - d >= 0 && this.loaded[i - d]) return i - d;
      if (i + d < this.count && this.loaded[i + d]) return i + d;
    }
    return -1;
  };

  Seq.prototype.draw = function (force) {
    var i = this.nearest(this.target);
    if (i < 0 || (i === this.current && !force)) return;
    var img = this.frames[i], c = this.canvas, cw = c.width, ch = c.height;
    if (!cw || !ch) return;
    var iw = img.naturalWidth, ih = img.naturalHeight;
    var s = this.fit === 'contain' ? Math.min(cw / iw, ch / ih) : Math.max(cw / iw, ch / ih);
    var dw = iw * s, dh = ih * s;
    this.ctx.clearRect(0, 0, cw, ch);
    this.ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    this.current = i;
    if (!this.drawn) { this.drawn = true; this.root.classList.add('is-drawn'); }
  };

  Seq.prototype.update = function () {
    var r = this.root.getBoundingClientRect();
    var run = r.height - window.innerHeight;
    var p = run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 0;
    this.seek(p);
  };

  Seq.prototype.seek = function (p) {
    this.progress = p;
    this.target = Math.round(p * (this.count - 1));
    this.root.style.setProperty('--seq-p', p.toFixed(4));
    this.draw();
    var active = 0;
    for (var k = 0; k < this.steps.length; k++) if (p >= this.steps[k].at) active = k;
    for (var j = 0; j < this.steps.length; j++) {
      var on = j === active;
      if (this.steps[j].el.classList.contains('is-active') !== on) this.steps[j].el.classList.toggle('is-active', on);
    }
  };

  function onScroll() {
    instances.forEach(function (s) {
      if (s.root.dataset.driver === 'external' || s.near === false || s.ticking) return;
      s.ticking = true;
      requestAnimationFrame(function () { s.ticking = false; s.update(); });
    });
  }

  function init() {
    if (reduce) return;   // reduced motion keeps the still and the stacked steps
    document.querySelectorAll('[data-scroll-seq]').forEach(function (root) {
      if (!root.querySelector('.scroll-seq__canvas') || !root.dataset.frames) return;
      instances.push(new Seq(root));
    });
    if (instances.length) {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
    }
  }

  window.ScrollSequence = {
    seek: function (root, p) {
      for (var i = 0; i < instances.length; i++) if (instances[i].root === root) instances[i].seek(p);
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

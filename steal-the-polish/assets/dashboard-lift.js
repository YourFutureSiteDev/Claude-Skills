/* dashboard-lift.js
   Two helpers for dashboard-lift.css. Plain JS, no dependencies. Drop into
   the project's existing js folder and load after the DOM.

   1. Ghost bars. Mark up:
        <div class="ghost-bars" data-groups="80:6,90:7,70:5,85:7,95:8,50:3"></div>
      Each pair is target:actual. Target sets the grey bar height (0-100),
      actual is how many of the 14 bars turn black. Real data goes in the
      attribute server-side or from your own fetch; this only draws it.

   2. Count-up on stats (ported from Magic UI number-ticker, spring swapped
      for ease-out cubic so it needs no library). Mark up:
        <div class="dot-num" data-to="28460" data-prefix="$">$0</div>
      Optional data-suffix="%". Runs once when 40% of the element is on
      screen. Respects prefers-reduced-motion: the final value is set
      straight away with no animation.
*/
(function(){
  // ---- ghost bars ----
  document.querySelectorAll('.ghost-bars[data-groups]').forEach(function(el){
    el.dataset.groups.split(',').forEach(function(pair){
      var p=pair.split(':'), target=+p[0]||0, actual=+p[1]||0;
      var g=document.createElement('div'); g.className='ghost-bars__grp';
      for(var i=0;i<14;i++){
        var b=document.createElement('b');
        b.style.setProperty('--t',(target*(0.85+Math.random()*0.15))+'%');
        if(i<actual){ b.classList.add('act'); b.style.setProperty('--a',(target*(0.55+Math.random()*0.5))+'%'); }
        g.appendChild(b);
      }
      el.appendChild(g);
    });
  });

  // ---- count-up ----
  var reduce=window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fmt=function(n){ return n.toLocaleString('en-AU'); };
  var targets=document.querySelectorAll('[data-to]');
  if(!targets.length) return;
  var finish=function(el){
    el.textContent=(el.dataset.prefix||'')+fmt(+el.dataset.to)+(el.dataset.suffix||'');
  };
  if(reduce || !('IntersectionObserver' in window)){ targets.forEach(finish); return; }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting) return;
      var el=e.target, to=+el.dataset.to, pre=el.dataset.prefix||'', suf=el.dataset.suffix||'';
      io.unobserve(el);
      var t0=performance.now(), dur=1400;
      (function tick(now){
        var p=Math.min(1,(now-t0)/dur), ease=1-Math.pow(1-p,3);
        el.textContent=pre+fmt(Math.round(to*ease))+suf;
        if(p<1) requestAnimationFrame(tick);
      })(t0);
    });
  },{threshold:.4});
  targets.forEach(function(el){ io.observe(el); });
})();

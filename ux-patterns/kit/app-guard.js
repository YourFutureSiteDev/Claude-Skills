/* app-guard.js: the four things every app must have so a user never sees a blank or dead screen.
   Drop-in for hand-written HTML/CSS/JS apps. Load it FIRST in <head> (before any other script), then
   call window.AppGuard.ready() once the first screen is on. Retheme via the CSS variables below.

   1. Boot guard: a script that fails to load or throws before ready() -> one automatic reload with the
      cache bypassed, then a plain panel with a Reload button (stale cached file after a publish is the
      usual cause).
   2. Runtime error screen: any uncaught error or unhandled promise rejection after ready() -> an in-app
      panel with what happened, Reload and a way home. Never a silent console error.
   3. Offline banner: "You're offline" while navigator.onLine is false; gone when back.
   4. AppGuard.fail(kind, detail) for your own code: 'load' (a screen could not load), 'network' (can't reach
      the server), 'session' (signed out), 'error' (anything else). Same panel, plain words per kind.

   Copy this file into the project's own js folder, never a new one. */
(function () {
  var K = "appguard.retry", READY = false, panelEl = null;
  var T = window.APPGUARD_TEXT || {};
  var name = T.name || document.title || "This app";
  var home = T.home || "/";
  var contact = T.contact || "";
  var css = "" +
    ".ag-panel{position:fixed;inset:0;z-index:99999;background:var(--ag-bg,#111318);color:var(--ag-ink,#f2f2f2);font:16px/1.5 var(--ag-font,system-ui,sans-serif);display:flex;align-items:center;justify-content:center;padding:24px}" +
    ".ag-panel.ag-inline{position:absolute;inset:0;z-index:50}" +
    ".ag-box{max-width:26rem}.ag-kicker{font-size:.75rem;letter-spacing:.3em;text-transform:uppercase;color:var(--ag-muted,#8a8a8a);margin-bottom:.6rem}" +
    ".ag-box h1{font-size:1.25rem;margin:0 0 .5rem;font-weight:700}.ag-box p{margin:0 0 1.2rem;color:var(--ag-muted-2,#c8c8c8)}" +
    ".ag-btn{background:var(--ag-btn,#fff);color:var(--ag-btn-ink,#000);border:0;padding:.8rem 1.4rem;font:inherit;font-weight:700;letter-spacing:.14em;text-transform:uppercase;font-size:.85rem;cursor:pointer;margin-right:.8rem}" +
    ".ag-link{color:var(--ag-ink,#f2f2f2);font-weight:600}" +
    ".ag-offline{position:fixed;top:0;left:0;right:0;z-index:99998;background:var(--ag-warn,#7a5b00);color:#fff;font:14px/1.4 var(--ag-font,system-ui,sans-serif);padding:.5rem 1rem;text-align:center}" +
    "body.ag-is-offline .ag-primary{opacity:.5;pointer-events:none}";
  var COPY = {
    boot:    { h: name + " did not load properly", p: "Usually an update landing while the page was open. Reloading fixes it." },
    error:   { h: "Something went wrong", p: "The last action did not finish. Nothing was lost; reload and try again." },
    load:    { h: "Couldn't load this screen", p: "The information for this screen did not arrive. Reload to try again." },
    network: { h: "Can't reach the system right now", p: "Check your connection, then reload. Your work on this screen was not sent." },
    session: { h: "Your session ended", p: "You were signed out after a break. Sign in again to carry on." }
  };
  function style() { if (document.getElementById("ag-style")) return; var s = document.createElement("style"); s.id = "ag-style"; s.textContent = css; (document.head || document.documentElement).appendChild(s); }
  function hardReload() {
    try { if (window.caches) caches.keys().then(function (ks) { ks.forEach(function (k) { caches.delete(k); }); }); } catch (e) {}
    var u = new URL(location.href); u.searchParams.set("r", Date.now()); location.replace(u.toString());
  }
  function panel(kind, detail, mount) {
    if (panelEl) return;
    style();
    var c = COPY[kind] || COPY.error;
    var d = document.createElement("div"); d.className = "ag-panel" + (mount ? " ag-inline" : ""); d.setAttribute("role", "alert");
    var tail = contact ? " If it keeps happening, tell " + contact + "." : "";
    d.innerHTML = '<div class="ag-box"><div class="ag-kicker">' + name + '</div><h1>' + c.h + '</h1><p>' + c.p + tail + (detail ? ' <span style="opacity:.6">(' + String(detail).slice(0, 120) + ')</span>' : '') + '</p>' +
      (kind === "session" ? '<button class="ag-btn" data-ag="signin">Sign in again</button>' : '<button class="ag-btn" data-ag="reload">Reload</button><a class="ag-link" href="' + home + '">Go to the start</a>') + '</div>';
    d.addEventListener("click", function (e) {
      var a = e.target.getAttribute && e.target.getAttribute("data-ag");
      if (a === "reload") hardReload();
      if (a === "signin") { panelEl = null; d.remove(); if (typeof T.onSignIn === "function") T.onSignIn(); else location.replace(home); }
    });
    (mount || document.body).appendChild(d); panelEl = d;
  }
  function onBootFail() {
    if (READY) return;
    if (!sessionStorage.getItem(K)) { sessionStorage.setItem(K, "1"); hardReload(); return; }
    if (document.body) panel("boot"); else document.addEventListener("DOMContentLoaded", function () { panel("boot"); });
  }
  function onRuntimeFail(e) {
    if (!READY) return onBootFail();
    var msg = e && (e.reason && e.reason.message || e.message || e.reason) || "";
    if (/Failed to fetch|NetworkError|Load failed/i.test(String(msg))) return panel("network", "", mountEl());
    panel("error", msg, mountEl());
  }
  function mountEl() { return T.mount ? document.querySelector(T.mount) : null; }
  window.addEventListener("error", onRuntimeFail, true);
  window.addEventListener("unhandledrejection", onRuntimeFail);
  window.addEventListener("load", function () { setTimeout(function () { if (!READY) onBootFail(); }, T.bootTimeout || 8000); });
  // offline banner
  var off = null;
  function offline(on) {
    document.body && document.body.classList.toggle("ag-is-offline", on);
    if (on && !off) { style(); off = document.createElement("div"); off.className = "ag-offline"; off.textContent = T.offline || "You're offline. Changes will not save until you're back."; document.body.appendChild(off); }
    if (!on && off) { off.remove(); off = null; }
  }
  window.addEventListener("online", function () { offline(false); });
  window.addEventListener("offline", function () { offline(true); });
  document.addEventListener("DOMContentLoaded", function () { if (navigator.onLine === false) offline(true); });
  window.AppGuard = {
    ready: function () { READY = true; sessionStorage.removeItem(K); },
    fail: function (kind, detail) { panel(kind || "error", detail, mountEl()); },
    clear: function () { if (panelEl) { panelEl.remove(); panelEl = null; } },
    reload: hardReload
  };
})();

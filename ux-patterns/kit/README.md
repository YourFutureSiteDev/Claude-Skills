# The kit: what every app must have

Patterns cover how a module behaves. This folder covers what has to be true of the whole app before anyone outside Byron uses it. Learned the hard way on 20 Sep 2026: the Fineline dashboard went live with no cache headers, a user's browser paired a new page with an old script, and they got a blank screen with no way out but a hard refresh they could not know about.

## Drop-in

`app-guard.js`: load first in `<head>`, call `AppGuard.ready()` once the first screen is on. Gives the app a boot guard (auto-retry once with cache bypass, then a Reload panel), a runtime error screen for uncaught errors and rejected promises, an offline banner, and `AppGuard.fail('load' | 'network' | 'session' | 'error', detail)` for the app's own failures. Retheme through the `--ag-*` CSS variables; copy the file into the project's own js folder.

```html
<script>window.APPGUARD_TEXT = { name: "Fineline Stock", home: "/", contact: "Byron", mount: "#main", onSignIn: () => showSignIn() };</script>
<script src="js/app-guard.js"></script>
```

## The checklist (copy into the build's RESUME_HERE and tick each one)

| # | Must have | Pattern / kit | Proof |
|---|---|---|---|
| 1 | Boot guard: a script that fails to load never leaves a blank page | `app-guard.js` | block the main script, see one retry then the panel |
| 2 | Error screen for any uncaught error or failed screen load, with Reload and a way home | `app-guard.js`, error-states | throw on purpose, see the panel |
| 3 | Offline banner and primary buttons held while offline | `app-guard.js` | toggle offline in devtools |
| 4 | Session expired lands on a sign-in with a reason, not a silent 401 | error-states, sign-in row | expire the token, click a tab |
| 5 | Cache-safe publish: html no-cache, assets versioned by content hash, CDN invalidated | `tools/publish.mjs` in the Fineline project is the template | headers on the live URLs |
| 6 | Every screen has loading, empty and error states with a next action | loading-states-system, empty-states, error-states | screenshots of each |
| 7 | Every button that sends cannot double-fire and shows pending, done or failed | double-submit-guard, behind-the-button | two fast clicks, one request |
| 8 | Destructive actions name the verb, sit off the primary spot, and offer undo where the API allows | destructive-actions, undo-ux | dialog copy |
| 9 | Success is confirmed in the user's words (toast or inline), errors say what to do | toast-notifications, microcopy | screenshots |
| 10 | A 404 page in the app's own look, with a way home | error-states | open a wrong URL |
| 11 | Unsaved changes warn before leaving | autosave-ux (status) or a beforeunload guard | edit, then navigate |
| 12 | Works at 390 wide: 44px targets, 16px inputs, no sideways scroll, primary action reachable | fitts-law, hover-trap, responsive-table | 390 screenshots |
| 13 | Keyboard: visible focus, Tab order, Enter submits, Escape closes | focus-states | tab through |
| 14 | A "?" or help page in plain words, per screen, linked from where people get stuck | tooltip-design, microcopy | help links resolve |
| 15 | Numbers formatted with units and tabular figures; status as a word plus a colour | number-formatting, color-accessibility | screenshots |

Nothing ships to a client without 1 to 9 and 12. The rest are expected on anything a stranger will use.

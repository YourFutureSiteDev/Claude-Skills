---
name: ux-patterns
description: A library of 112 UX patterns rebuilt as exact HTML/CSS/JS replicas of the @designmotionhq reels (settings systems, data tables, forms, pricing, modals, navigation, notifications, cards, typography, dark mode, motion timing and more), with a routing table that picks the few best patterns for whatever design module is being built instead of dumping all of them. Use it whenever Byron asks to build, design, redesign, fix or polish any product UI module: a settings page, dashboard, data table, form, sign-up, checkout, pricing table, landing hero, modal, drawer, nav, search, filters, upload, chat, calendar, notifications, buttons, cards, or says "make this feel premium", "this looks AI-made", "what's the right pattern for", "how should a X work". Also use it when he names designmotionhq, UX Engine, or a pattern by name. It sits next to `ui-signals` (motion on interactive elements) and `steal-the-polish` (finished components to lift): this one decides how a module should behave and what states it needs, then hands over the exact component.
---

# UX Patterns

112 reels from @designmotionhq, each rebuilt scene for scene as a working component. Library root: `C:\Users\PC\OneDrive\Desktop\Claude\Skills\UX Patterns\patterns\<slug>\` (four files each: `demo.html`, `pattern.css`, `pattern.js`, `README.md`). Gallery: `site/` (deployed, link in the project CLAUDE.md). Catalogue with categories, hooks, insights and do/don'ts: `catalog.json` at the project root.

## The one rule

**Pick the best few for the module, never all of them.** A settings page gets four or five patterns, not forty. "Best" means: the most specific pattern for that module first, and when two overlap, the newer "X is a system" reel over the older one-liner (so `data-table-system` over `data-table`, `border-radius-system` over `border-radius`, `dark-mode-surfaces` over `dark-mode`). List what you picked and what you deliberately left out, in one line each, before building.

## Workflow

1. **Name the module.** What is being built: settings page, data table, sign-up form, pricing section, and so on. If the request is a whole app or site, split it into modules and route each one.
2. **Route** with the table below. Take the primary set; add from the secondary set only when the module actually has that element (a search box, a destructive action, an upload).
3. **Read each chosen pattern's `README.md`** for the rule, the insights and the do/don'ts. That is the spec. Then read its `pattern.css` and `pattern.js` for the component.
4. **Build to the spec.** Port the component into the project's own stylesheet and script (Byron's sites are hand-written HTML/CSS/JS on Cloudflare Pages, no React). Keep the structure, states and behaviour exactly as the pattern has them. Retheme through the tokens at the top of `pattern.css` to the project's DESIGN.md palette; the reel palette (near-black, teal) is the library's, not the client's.
5. **Check every state the pattern names** before calling it done: loading, empty, error, disabled, focus, hover on touch, destructive confirm, rollback. Missing a named state is the most common miss.
6. Tell Byron which patterns were used, by name, so he can open the reels.

## Every app must have (before a stranger uses it)

Patterns are per module. These are per app, and they are not optional: a user can never be left on a blank or dead screen waiting for Byron. The drop-in and the full 15-point checklist with proofs live in `kit/` (source of truth: `C:\Users\PC\OneDrive\Desktop\Claude\Skills\UX Patterns\kit\`: `app-guard.js`, `README.md`, `test/run.mjs`).

1. **Boot guard**: a script that fails to load reloads once with the cache bypassed, then shows a Reload panel. (`kit/app-guard.js`)
2. **Error screen**: any uncaught error, rejected promise, failed screen load, network failure or expired session shows a panel in the app's own look with what happened, Reload, and a way home. Never only a console error. (`AppGuard.fail(kind)`)
3. **Offline banner** and primary buttons held while offline.
4. **Cache-safe publish**: html no-cache, assets versioned by content hash, CDN invalidated. Copy `Fineline/Inventory System/tools/publish.mjs`.
5. **Loading, empty and error states** on every screen, each with a next action.
6. **Submit guard** on every button that sends; pending, done, failed.
7. **Destructive actions** named, off the primary spot, undo where the API allows.
8. **Success and failure in the user's words** (toast or inline).
9. **A 404 page** in the app's look with a way home.
10. **390-wide check**: 44px targets, 16px inputs, no sideways scroll, primary action reachable.

Copy the checklist into the build's RESUME_HERE and tick each with its proof before publishing. Load `app-guard.js` first in `<head>`, call `AppGuard.ready()` once the first screen is on, retheme the `--ag-*` variables.

## Routing table

| Module being built | Primary (use these) | Secondary (only if that element exists) |
|---|---|---|
| Settings page | settings-system, toggle-anatomy, form-field-states, autosave-ux | destructive-actions, disabled-buttons, dark-mode-surfaces |
| Dashboard / admin home | de-ai-dashboard, number-formatting, charts-that-lie, loading-states-system, empty-states | skeleton-loading, notification-badge, avatar-system |
| Data table / list of records | data-table-system, responsive-table, bulk-actions, pagination, empty-states | inline-editing, context-menu, filter-chips, search-experience-system, text-truncation |
| Form (any) | form-field-states, form-validation-timing, microcopy, double-submit-guard | input-masking, otp-input, password-field-ux, date-pickers, range-sliders, focus-states |
| Long form (7+ fields) / onboarding | stepper-wizard, form-field-states, zeigarnik-effect, peak-end-rule | autosave-ux, microcopy |
| Sign-up / login | password-field-ux, form-validation-timing, microcopy, otp-input | focus-states, error-states |
| Checkout / payment | input-masking, double-submit-guard, behind-the-button, error-states, peak-end-rule | stepper-wizard, loading-states-system |
| Pricing section | von-restorff, decoy-effect, pricing-psychology, perfect-card | serial-position, microcopy |
| Landing page | landing-page-skeleton, de-ai-landing-hero, visual-hierarchy, perfect-card, reverse-engineered-linear | scroll-driven-animations, gradient-design, typography-system |
| Modal / dialog / drawer | modal-hierarchy, modal-backdrop, animation-timing, focus-states | destructive-actions, bottom-sheets (mobile) |
| Destructive action (delete, cancel, remove) | destructive-actions, undo-ux, disabled-buttons | modal-hierarchy, toast-notifications |
| Navigation / app shell | navigation-patterns, tabs-system, focus-states | bottom-sheets, command-palette, scroll-restoration, resizable-panels |
| Search / filters | search-experience-system, filter-chips, empty-states | command-palette, loading-states-system, pagination |
| Notifications / feedback | notification-system, toast-notifications, notification-badge, undo-ux | optimistic-ui, error-states |
| Buttons (primary CTA, any button) | perfect-button, button-feedback, disabled-buttons, behind-the-button | buy-button-css, hover-trap, double-submit-guard, fitts-law |
| File upload | file-upload-ux, error-states, loading-states-system | undo-ux, drag-and-drop-tips |
| Drag and drop / kanban / reorder | drag-and-drop, drag-and-drop-tips, optimistic-ui | live-cursors, scroll-restoration |
| Chat / messaging / comments | chat-ui-system, avatar-system, notification-badge, text-truncation | live-cursors, empty-states |
| Calendar / scheduling | calendar-week-view, date-pickers, drag-and-drop | empty-states, tooltip-design |
| Cards / grids of items | perfect-card, card-hover-anatomy, card-spacing-fixes, border-radius-system | depth-layers, shadow-elevation, hover-trap, proximity-rule |
| Loading / waiting states | loading-states-system, skeleton-loading, perceived-performance, doherty-threshold | optimistic-ui, behind-the-button |
| Empty / error states | empty-states, error-states, kit/app-guard.js (whole-app error screen) | microcopy, undo-ux |
| Mobile screen | bottom-sheets, swipe-actions, hover-trap, pull-to-refresh, fitts-law | responsive-table, navigation-patterns |
| Dark mode / theming | dark-mode-surfaces, color-accessibility, depth-layers | design-tokens, gradient-design, glassmorphism |
| Typography / hierarchy pass | typography-system, visual-hierarchy, pop-out-effect, serial-position | golden-ratio, proximity-rule, whitespace-types, gestalt-laws |
| Design system / tokens | design-tokens, design-system-build, atomic-design, border-radius-system, typography-system | design-system-kit, whitespace-types, color-harmony, icon-design-rules |
| Motion / animation pass | animation-timing, easing-curves, card-hover-anatomy | scroll-driven-animations, button-feedback (then hand to `ui-signals` for placement) |
| Rating / reviews | star-rating, microcopy | empty-states |
| Tooltips / context menus / dropdowns | tooltip-design, context-menu, dropdown-design | z-index-mastery, focus-states, css-has-selector |
| Colour / palette choice | color-harmony, color-accessibility, gradient-design | rounded-shapes, radius-spectrum, optical-corrections |
| "This looks AI-made" | de-ai-landing-hero or de-ai-dashboard (whichever it is), reverse-engineered-linear, visual-hierarchy, perfect-card | typography-system, whitespace-types |

Copy-to-clipboard, number-formatting, text-truncation, scroll-restoration and css-has-selector are utilities: pull them in wherever the element appears, they are never a module on their own.

## What "use the pattern" means

Each `pattern.css` is prefixed (`.ou-`, `.st-`, and so on) and self-contained; each `pattern.js` exports plain functions. In a project: copy the rules and functions you need into the project's existing css and js files (never a new folder), rename the prefix to the project's, and swap the token values. The `demo.html` is the replica of the reel for reference and for the gallery; it is not what ships to a client.

When a module has no row here, search `catalog.json` by category and hook, pick by the same rule, and add the row to this table in the same session.

## Credit

Patterns are @designmotionhq's teaching, rebuilt as our own code. When Byron shows a build publicly, credit the pattern by name and link the reel (`instagram` in `catalog.json`).

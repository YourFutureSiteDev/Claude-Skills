# What Tebex actually permits

Verified against docs.tebex.io, August 2026. Tebex move things, so if something here contradicts what you can see in the panel, believe the panel and flag it.

## The five facts that decide every job

### 1. Custom HTML and CSS on the *template* is Plus-only
Custom **templates and theme CSS**, meaning the store's wrapper (header, nav, product grid layout, footer), are on the **Plus** plan (about £12.49/month, billed by Tebex to the client, not by us). Free-plan servers cannot change the template at all.

**This does not mean no custom HTML.** See "The CMS pages lane" below, which is the single most commercially useful thing in this file.

### 2. The new storefront system has HTML and CSS disabled entirely
Tebex's own docs: *"Full HTML & CSS Editing is currently unavailable on new stores using our new storefronts system."* No date given for its return.

**This is the most important line in this file.** A client can be paying for Plus and still be unable to take a custom theme. Any recently created store is affected. So "we will restyle your Tebex store" is not something to promise before checking.

### 3. Custom domains on the hosted store are Plus-only, and rented
Set up by CNAME, so in practice it is a subdomain (`store.theirserver.com`, not `theirserver.com`). Tebex's docs say plainly that if Plus expires, the custom domain stops working.

Useful as a signal: a store on a custom domain means they pay for Plus and care about presentation, which qualifies them. A store on `*.tebex.io` means free plan.

### 4. FiveM is contractually locked to Tebex
Cfx.re's Platform License Agreement requires FiveM and RedM servers to monetise through Tebex, and prohibits every other payment provider. **Never build a client their own checkout.** It can get their server shut down and their account banned.

Cfx.re also restrict what may be sold: cosmetics, priority queue, Discord roles, memberships and assets the server owns are allowed. Pay-to-win, in-game currency, chance-based boxes, cash-out and other people's IP are not.

### 5. Tebex take their cut regardless
Roughly 5% platform fee plus about 2.9% + $0.30 processing. Nothing we build changes that, and we should never imply it does. What we change is conversion.

## The CMS pages lane: custom HTML on every plan

Tebex's **Pages** feature (Webstore, Pages, Create Custom Page) has a **Code View** for entering custom HTML directly. Tebex's docs say it works *"without needing to upgrade your store plan"*, and you can create **unlimited** pages.

Each page gets:
- Its own HTML body, written by you
- Its own URL slug, for example `/vip`, `/rules`, `/vehicles`
- An automatic navigation entry, or "Do Not Add to Menu" if you want it unlisted
- Visibility options, including customers-only

**This is real custom design work inside the client's own Tebex store, on the free plan.** It is the answer whenever someone says the whole point is custom HTML and CSS.

### What it can and cannot reach

| | |
|---|---|
| **Yours to design** | Everything inside the page body: layout, sections, grids, hero blocks, tables, embedded media, custom buttons |
| **Still Tebex's** | The surrounding chrome: header, navigation bar, footer, and the built-in category and package pages |

So a client on the free plan can have genuinely custom-designed pages sitting inside a stock Tebex frame. That is a much better product than "we tidied your categories", and it is honest about what it is.

### The one thing to test before promising it

**Tebex's docs do not say whether `<style>` or `<script>` tags survive the editor.** They may be stripped. This matters enormously, because inline `style` attributes alone are far more limiting than a `<style>` block.

Find out in five minutes on a real store, before quoting page work:
1. Create a throwaway page
2. Code View, paste a `<style>` block with an obvious rule plus a `<div>` that uses it
3. Save, view the page, reopen the editor
4. Check whether the rule applied, and whether the tag is still there when you reopen

If `<style>` survives, page work is a strong product and worth pricing properly. If only inline attributes survive, it still works, it is just more tedious, so price for the extra time. **Record the answer per store, because it may differ between the legacy and new storefront systems.**

Also worth testing the same way: whether **package/item descriptions** accept HTML through a code view. Tebex's editor reportedly accepts HTML there too, which would let you style individual package pages without touching the template.

## What you CAN do, by plan

| Task | Free (Starter) | Plus + legacy Appearance | Plus + new storefront |
|---|---|---|---|
| Category structure | Yes | Yes | Yes |
| Package/item names, descriptions, images | Yes | Yes | Yes |
| Store logo and favicon | Yes | Yes | Yes |
| Built-in templates and themes (Exo, 10 themes) | Yes | Yes | Yes |
| Sales, coupons, gift cards | Yes | Yes | Yes |
| Sidebar modules | Yes | Yes | Yes |
| **CMS pages with custom HTML** | **Yes** | **Yes** | **Yes** |
| Custom CSS on the *template* | **No** | **Yes** | **No** |
| Custom Twig templates | **No** | **Yes** | **No** |
| Custom domain on the Tebex store | **No** | Yes | Yes |
| Headless API catalog on our own site | Yes | Yes | Yes |

Two rows matter most. **CMS pages give custom HTML on every plan**, which is the in-store design product. And **everything we build on our own sites works on the free plan.** No package requires the client to buy Plus, which is a real selling point against anyone pitching "custom Tebex themes".

## The Headless API, which is the way around all of it

`https://headless.tebex.io/api/accounts/{public_token}`

Authenticates with a **public token** from the client's control panel. Read-only against their catalog. Cannot touch payouts. Safe for a client to share, and worth saying so when asking, because they will hesitate otherwise.

What it gives you:

| Capability | Notes |
|---|---|
| Webstore info | Name, currency, description, logo |
| Categories and packages | Real names, prices, images, descriptions |
| CMS pages | Their existing custom page content, as HTML |
| Sidebar modules | Top customers, featured packages, payment goals |
| Basket create and manage | Add, remove, change quantities |
| Coupons, gift cards, creator codes | Full promo support |
| Subscriptions and tiers | Including upgrade and downgrade |
| Checkout link | Every basket returns `links.checkout` |

**Tebex.js** completes it: a `<tebex-checkout>` web component rendering checkout as a popup or inline, so the player never leaves the site. Available to everyone on every plan, so it is not a differentiator to sell, just the correct way to build.

## How to explain the limits to a client

Do not lead with what is blocked. Lead with the outcome, and use the limit as the reason your approach is better.

**Weak:** "Tebex won't let me theme your store."

**Strong, if they want the work inside Tebex:** "Tebex lock down the template itself, so the header and the product grid stay theirs. But custom pages are wide open on every plan, including the free one. I can build you a proper designed VIP page, a vehicles page, a rules page, all hand-coded and sitting on your own store URL. That is where the design work actually shows."

**Strong, if they want the whole thing to look like theirs:** "The bit Tebex will never let anyone change is the frame around your store. So for a fully custom look I pull your real packages onto a site through their official API and design all of it. Same store, same payouts, same control panel for you."

Both turn a platform restriction into a choice between two real products, rather than an apology. Lead with whichever fits their budget.

## Sources

- [Webstore appearance and theming](https://docs.tebex.io/creators/tebex-control-panel/webstore/appearance)
- [Starter and Plus plans](https://docs.tebex.io/creators/pricing-overview/starter-and-plus-plans)
- [Headless API endpoints](https://docs.tebex.io/developers/headless-api/endpoints)
- [Integration methods compared](https://docs.tebex.io/developers/integration-methods)
- [Subdomains and custom domains](https://docs.tebex.io/creators/tebex-control-panel/webstore/subdomain-and-custom-domain)
- [CMS pages, with Code View for custom HTML](https://docs.tebex.io/creators/tebex-control-panel/webstore/pages)
- [Team Accounts](https://docs.tebex.io/creators/tebex-control-panel/settings/team-accounts)
- [Tebex.js](https://github.com/tebexio/Tebex.js/)

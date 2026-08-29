# Store work: jobs done inside the Tebex panel

This is the `$120 Tebex store cleanup` and anything else done in the client's own control panel. It needs no code, works on every Tebex plan, and produces a visible before-and-after in an afternoon. It is the easiest thing the business sells.

**Access:** Team Account only. The client adds your email under Settings, Team, and you log in as yourself. Never their password. See SKILL.md step 2.

## Before touching anything

1. **Screenshot the current state.** Every category page and the homepage. Without a before, there is no before-and-after, and the before-and-after is the sales asset.
2. **Write down what is there** so nothing gets silently lost: category names, package/item names, prices, which have images.
3. **Check the plan and storefront system** (`tebex-limits.md`). It decides whether theming is even on the table.
4. **Ask before deleting anything.** Renaming and reordering are reversible in practice. Deleting a package can break links players have bookmarked and can affect existing subscriptions.

## The work, in order of return

### 1. Category structure

Most stores are a single flat list of everything, which is the biggest conversion problem on the page. A visitor cannot scan it and gives up.

Group into 4 to 7 categories with names a player would use, not internal ones:

- **Ranks** or **VIP** — the recurring stuff, always first, because it is the highest value and the most likely purchase
- **Vehicles** or **Cars** — usually the biggest category, may need sub-categories by tier
- **Cosmetics** — clothing, tattoos, emotes
- **Bundles** — put these second if they exist, because bundles raise average order value
- **Extras** — the leftovers

Order matters. Put the thing you most want sold at the top left. Do not order alphabetically.

### 2. Package/item names

Names should say what the thing is, not what it is called internally.

| Weak | Better |
|---|---|
| `GTR` | `Nissan GT-R R35` |
| `vip1` | `VIP Bronze, monthly` |
| `carpack2` | `Supercar Bundle, 5 vehicles` |
| `donator` | `Supporter, one-off` |

Include the tier, the count, and whether it recurs. A player deciding between two packages should not have to open both.

### 3. Descriptions

The single highest-return change on most stores, and the one most owners have never done.

A description needs to answer four things:
1. **What is it**, concretely
2. **What does it look like or do** in game
3. **What else comes with it**, if anything
4. **How long does it last**: permanent, monthly, until wipe

Three or four sentences. Not one line, not an essay.

**Example, before:** `GT-R`

**Example, after:**
> The Nissan GT-R R35, fully tuned and ready to drive. Custom handling, a spoiler and a paint job you can change at any respray. Yours permanently on this character, and it survives wipes. Delivered to your garage within a minute of purchase.

Write these against the real packages after reading the store. Do not invent features the server does not have. If you are unsure what a package actually includes, ask the client rather than guessing, because a description promising something that does not exist is a refund and a bad review.

### 4. Images

Every package/item needs one. A store where half the packages have images and half do not looks broken.

- Consistent size and shape across the whole store
- Consistent style: same treatment, same background, same framing
- The actual thing, not a stock photo. In-game screenshots beat everything.
- Readable at thumbnail size, because that is how most people see them

If the client has no images, this is the `$80 Package/item image pack` add-on, or the basic-image part of a care plan.

### 5. Branding

Logo and favicon in the panel's branding section. Store name and description written properly. These are quick and they change first impressions.

### 6. Theme

On the free plan or the new storefront, you are choosing from Tebex's built-in templates and themes (the Exo template ships with 10). Pick the one closest to the server's identity and set its colours to match their brand. That is the whole of what is available, and it is worth saying to the client so they know you did not stop early.

On **Plus with the legacy Appearance system only**, custom CSS becomes possible. That is the `$120 Tebex theme (CSS)` add-on. Confirm eligibility before quoting it, every single time.

### 7. Custom pages, which is where the real design work happens

**This is the highest-value thing you can do inside a Tebex store, and it works on every plan.**

Tebex's Pages feature (Webstore, Pages, Create Custom Page) has a **Code View** for entering custom HTML. Unlimited pages, each with its own URL slug and an automatic navigation entry. Tebex's docs say it works without upgrading the plan.

Before quoting page work on a store you have not used before, spend five minutes finding out what survives the editor:

1. Create a throwaway page
2. Code View, paste a `<style>` block with an obvious rule plus a `<div>` using it
3. Save, view the page, then reopen the editor
4. Did the rule apply, and is the tag still there on reopen?

If `<style>` blocks survive, you can build genuinely designed pages. If only inline `style` attributes survive, it still works but takes longer, so price accordingly. Record the answer against that store, because it may differ between the legacy and new storefront systems. Delete the test page afterwards.

Pages worth building, in rough order of what clients actually want:

- **A VIP or ranks page** laying the tiers out side by side with what each includes. This is a comparison table, and comparison tables sell subscriptions.
- **A vehicles or cosmetics showcase** with real screenshots, which no stock Tebex category page can do well
- **Rules**, which every server needs and most keep in a Discord channel nobody reads
- **A "new here?" page** explaining how to join, which converts browsers into players
- **Wipe schedule or changelog** for Rust and similar

What stays out of reach: the header, navigation, footer and the built-in category and package pages. So the honest description is "custom designed pages inside your store", not "a custom store". Say it that way and nobody is disappointed later.

### 8. Sales and promotions

If they have never run one, set up something simple and time-bound. A visible sale with an end date converts better than a permanently discounted price, which just reads as the real price.

## Finishing

1. **Screenshot the after**, matching the before shots
2. **Tell the client what changed**, specifically, and what you deliberately left alone
3. **Say what was not possible and why**, if the plan or storefront system blocked something
4. **Offer the natural next step**: if the store is now good but their site is still a Tebex subdomain, that is the Makeover Plus conversation

## The honest limit of this work

With custom pages in play, a lot more is possible than "we tidied your categories". You can hand-code real designed pages that live on the client's own store URL, on any plan.

What you still cannot touch is the **frame**: header, navigation, footer, and the built-in category and package pages. Those stay stock unless the store is on Plus with the legacy Appearance system. So a store with beautiful custom pages still has a stock Tebex shell around them.

Describe it accurately and nobody is disappointed: *"Custom designed pages inside your store"*, not *"a custom store"*.

The bridge upward is then honest rather than a fallback: *"The pages are yours and they can look like anything. The frame around them is Tebex's and always will be. If you want every pixel to look like your server, that is a site build, and it starts at $150."*

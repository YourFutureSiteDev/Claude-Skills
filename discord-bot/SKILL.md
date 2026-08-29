---
name: discord-bot
description: Change the Your Future Site Discord bot or server. Use whenever the user asks to add, change, remove or fix anything about their Discord bot, its slash commands, its buttons or forms, the server's roles, channels, categories or permissions, the verification gate, ticket flows, project channels, affiliate referrals, booking hours, pricing shown in Discord, or the bot's hosting and uptime. Triggers on phrasings like "change the discord bot to...", "add a command that...", "make the bot...", "add a channel for...", "the bot isn't...", "give X role access to...", "fix the roles", "add a button that...". Also use when checking whether the bot is running or why something in the server stopped working.
---

# Your Future Site: Discord bot

The bot lives at `C:\Users\PC\OneDrive\Desktop\Claude\YourFutureSite\bot`. It is discord.js v14 on Node 22, running under pm2 as `yfs-bot`.

**Read the code, not this file, for current facts.** Several sessions have edited this codebase in parallel, so prices, package names and channel lists change without warning. `config/structure.js` is the single source of truth. Anything below that contradicts the code is out of date, and the code wins.

## Before touching anything

```bash
cd "C:\Users\PC\OneDrive\Desktop\Claude\YourFutureSite\bot" && pm2 list
```

If `yfs-bot` is not `online`, start it with `pm2 start ecosystem.config.cjs`. Do not use `npm start`: that creates a second instance alongside pm2's, and two bots answer every button twice. This has already caused duplicate tickets on this project more than once.

Then read `config/structure.js`. It exports `BRAND, ROLES, EVERYONE_PERMS, DANGEROUS_PERMS, CATEGORIES, PACKAGES, CARE_PLANS, ADDONS, AFFILIATE, BOOKING_HOURS, PAYMENT_PLANS, MAKEOVER_RULES, BILLING_SPLIT, TEBEX, HOURLY_RATE`. Almost every request is a change to one of those objects rather than new code.

## Where things live

| You need to change | Edit |
|---|---|
| Roles, permissions, channels, categories | `config/structure.js` |
| Prices, packages, care plans, add-ons | `config/structure.js` |
| Booking hours, commission rate | `config/structure.js` |
| **What a channel card says** | `cards/cards.js`, then `npm run cards`. Most channels are images now, not embeds. |
| What an embed says | `src/embeds.js`, or `src/channel-embeds.js` for per-channel headers. Still used by `/quote`, `/panel`, tickets, projects, `#verify` and `#founder-desk`. |
| Buttons, modals, panels | `src/panels.js` |
| What happens when a button or form is used | `src/handlers/interactions.js` |
| Turning a quote ticket into a project | `src/handlers/convert.js` |
| Building the server from config | `src/handlers/setup.js` |
| **What the bot posts into each channel** | `src/handlers/content.js` — ONE list, used by `/setup`, `/update` and `npm run refresh` |
| A slash command | `src/commands/<name>.js` |
| Where JSON records are read and written | `src/store.js` |

Commands are auto-loaded from `src/commands/`. A new file needs `data` (a `SlashCommandBuilder`) and `execute` exports, nothing else.

## The workflow that actually works

1. Read `config/structure.js` and the file you are about to change.
2. Make the change.
3. `node --check <file>` on everything you edited. Syntax errors here take the bot down.
4. If you added or changed a slash command: `npm run deploy`.
5. `pm2 restart yfs-bot`.
6. `npm run audit`.
7. If you changed anything a channel displays: `npm run cards` first (the channels are images), then `npm run refresh -- --apply`, or tell the user to run `/update`.

Skipping step 6 is how permission mistakes reach production.

Anything that changes **channel permissions or the category list** must then be applied to the live server with `npm run apply`, or it is not done. Green tests and an unchanged server is the failure mode this is here to prevent.

## The scripts

| Command | Does |
|---|---|
| `npm run audit` | Checks roles, permission drift, hierarchy, 22 real access rules ("can a Verified member see #staff-chat"), that the shop window blocks slash commands, and that every command's deployed permissions match its source. Run after every change. |
| `npm run doctor` | Checks the token, bot permissions, role position and that commands are registered. |
| `npm run deploy` | Registers slash commands with Discord. Needed after adding or editing any command, including a permission change. |
| `npm run apply` | Writes the blueprint to the live server: roles, role order, categories, channels, every permission overwrite. The same `buildServer()` `/setup` and `/update` run. **This is how a permission change actually reaches Discord from a terminal.** It deliberately will not grant Founder, trim `@everyone`, or strip permissions from pre-existing roles: those stay with `/update`. |
| `npm run cards` | Renders `bot/cards/cards.js` to PNGs in `bot/assets/cards/`, using the installed Chrome in headless mode. **The channels are images now, so this must run after any price or copy change, before the refresh.** Add a card name to render just one. |
| `npm run refresh` | Brings the bot's own posts in line with config. Dry run unless you pass `-- --apply`. Edits in place where it can; only ever touches messages the bot itself wrote. |
| `npm run reset-testing` | Strips prospect roles off the owner and clears his test records. Dry run by default. |
| `npm run cleanup` | Removes Discord's stock leftover channels. |

`/setup` and `/update` are the in-Discord equivalents. `/update` also trims `@everyone`, strips elevated permissions from roles that predate the bot, and refreshes the bot's own posts. `/setup` only ever seeds a channel that is completely empty.

## Who can run which command

Discord has no per-subcommand permission, so every command's `setDefaultMemberPermissions` is a blunt instrument and the tiers below are the intended model. `npm run audit` section 8 prints the live version of this table and fails if the deployed permissions have drifted from the source.

| Tier | How it is expressed | Commands |
|---|---|---|
| Founder only | `ManageGuild`, `ManageChannels` or `ManageRoles` — all held by Founder, none by Staff | `/brief` `/call` `/lead` `/referral` `/panel` `/tier` `/scan` |
| Founder, hidden entirely | `0n` plus a `requireOwner` user-ID check | `/setup` `/update` |
| Staff and Founder | `ManageMessages` | `/quote` `/close` |
| Everyone, gated in code | no default at all | `/availability` (read-only), `/project` (only `add`/`remove` reach clients; the rest check for Founder in `execute`) |

Two rules worth keeping. **Anything that shows money, the pipeline or the outreach budget is founder-only**, because Staff cannot see `#daily-brief` and a command must not become a second door into it. And **a client holds zero server permissions**, so any `default_member_permissions` value at all hides a command from clients completely — if clients need a subcommand, the command must be open and gated in code.

## Five things that will bite you

These were each found the hard way on this project. Do not rediscover them.

**Clearing a channel's permission overwrites does not make it inherit from its category.** Discord has no inherit flag. `permissionOverwrites.set([])` makes a channel **wide open**, not synced. A channel is "synced" only when it carries a copy of its parent's overwrite list. This briefly exposed every staff and client channel. Always write an explicit list.

**Discord refuses to hide any channel referenced by Onboarding**, failing with error `350003`. That covers the Default Channels list *and* channels named in Server Guide to-do tasks. The Server Guide is not reachable through discord.js or the API, so those tasks can only be edited in the Discord UI. This is why `#portfolio`, `#show-your-server` and `#free-site-audit` stay readable to unverified visitors, and why the verification gate is enforced **in code** in `interactions.js` (`requireVerified`) as well as by permissions. If you add a gated entry point, gate it in code too.

**New roles are created at the bottom.** Whatever is created first ends up highest. `enforceRoleOrder` in `handlers/setup.js` fixes the order explicitly and keeps third-party integration roles (Tebex, Wick) high, because a bot that drops below the roles it assigns silently stops working.

**Wick sits above Founder deliberately.** An anti-nuke bot can only strip roles from accounts it outranks. It looks alarming and it is correct. Do not "fix" it.

**A timer that touches a deleted channel crashes the process.** `setTimeout(() => interaction.channel.delete().catch(...))` throws synchronously on null, and `.catch()` never sees it. Capture the channel in a variable and use optional chaining. `index.js` now has an `uncaughtException` handler as a backstop, but write the safe version anyway.

**Denying `SendMessages` does not stop slash commands.** A read-only channel still lets anyone who can see it run a command that posts publicly, which is how unverified visitors could once fire `/availability show` into the shop window. `preview` and `previewOpen` now deny `UseApplicationCommands` to `@everyone` and grant it back to verified members. Buttons are components, not commands, so panels are unaffected.

**The channels are images, and images have their own trap.** Cards are rendered HTML, never generated art, because they carry prices and a model that invents a digit is a refund waiting to happen. Two rules keep them readable: Discord displays an image at about **550px wide**, so a 1200px card shows at roughly 46% and anything under 24px of type is unreadable on a phone; and a card taller than about **4:3 gets scaled down to fit**, so more height makes the text smaller rather than fitting more in. `npm run cards` measures each card and warns when one crosses that line. Split it rather than shrinking the type. `#verify` and `#founder-desk` stay text on purpose: one is read by people locked out, the other exists to be copy-pasted.

**Embeds have two size limits and you will hit both.** A single field caps at **1024 characters**, and a whole message caps at **6000 across all its embeds**. Adding one paragraph to the pricing embed broke both in one go. `#pricing` is the card that lives closest to those ceilings, so check it after any copy change: it currently sits at about 5,000 of the 6,000. Before shipping copy, render it: build every payload in `content.js` and check `total > 6000` or any `field.value.length > 1024`, because the API error says only "Invalid Form Body" and names no field.

**Pinning makes a system message, authored by the bot.** Type 6, `ChannelPinnedMessage`. Any code that reasons about "the bot's own posts" must filter to `MessageType.Default` or it counts the pin notice as content. This one bit hard: the content refresh saw one post too many in every pinned channel, decided the shape had changed, deleted and re-posted, then re-pinned, which made another notice. Every single run. A refresh that says "replaced" twice in a row for the same channel is this bug.

**Moving a channel between categories in `structure.js` used to strand it.** `ensureChannels` matched on name *and* parent, so a moved channel meant a new empty twin next to the old one. It now adopts and re-parents the existing channel, but only when the channel already sits in one of our own categories, so a fresh server's stock `#general` is left for `npm run cleanup`.

## Roles and the gate

Only `Founder` has real power. `Staff` gets moderation but deliberately not ManageGuild, ManageRoles, ManageChannels, ManageWebhooks or BanMembers. **Every other role has zero server-wide permissions** and gets access purely from channel overwrites, so a mis-assigned client role can never do damage.

`Verified` is granted by **Wick** after its CAPTCHA, never by our bot. Nothing else may hand it out. If you add a self-assign button for any role listed in `pastTheGate` (see `overwritesFor` in `handlers/setup.js`), it must call `requireVerified` first, or it becomes a free bypass of the whole gate.

Unverified visitors can read `#welcome`, `#portfolio`, `#pricing` and post only in `#verify`.

## Channel visibility presets

Set `visibility` on a category, or on a single channel to override its category. Defined in `overwritesFor`.

| Preset | Who |
|---|---|
| `gateway` | everyone reads and posts. Only `#verify`. |
| `preview` | everyone reads, staff post. The shop window. |
| `previewOpen` | everyone reads, verified members post. |
| `public` | verified only, they can talk |
| `announce` | verified only, read-only, buttons still work |
| `clientsOnly` | client tier roles plus staff |
| `clientsAnnounce` | clients read, staff post |
| `affiliates` | affiliate role plus staff |
| `staffOnly` / `hidden` | staff and founder |
| `founderOnly` | founder alone, with **staff explicitly denied** rather than merely left off, so it survives inside a staff category |

The `👑 FOUNDER` category uses `founderOnly` and holds `#daily-brief` (the 9am brief and call reminders) and `#founder-desk` (the intake template and private notes). Both are marked `records: true` in `handlers/content.js`, which means a content refresh may update their pinned header and must never delete anything else in them.

## Data

`data/*.json` holds tickets, projects and referrals. **This is the client list and the commission ledger. It is gitignored and there is no other copy.**

Never write test fixtures with `store.write` against the real directory — set `YFS_DATA_DIR` to a temp folder first. A test once overwrote the live files this way.

Affiliate commission is **15% of money actually received**, never of the quoted price. Payments are recorded with `/project payment`. A client who pays a deposit and disappears must not generate a payout on the full figure.

## Money and prices

Never invent a price. Read `PACKAGES` and `CARE_PLANS` from `config/structure.js`. There are deliberately three build tiers plus the Makeover, and a cap the owner set on purpose. If a change would add a tier or exceed the cap, say so and confirm before doing it.

**As of 7 August 2026 the business leads with the $99 Makeover**, improving a site the client already has, and the three build tiers are the ladder above it. Copy written for Discord should reflect that order. `BUSINESS-PLAN.md` in the project root is the authority on positioning; `structure.js` is the authority on numbers.

After changing any price, run `npm run refresh -- --apply`, or tell the user to run `/update`, or Discord will keep showing the old numbers.

## Hosting

pm2 restarts the bot on crash and a launcher in the Windows Startup folder brings it back at logon. **It is still only up while the PC is on and logged in.** `deploy/HOSTING.md` covers moving it to a VPS, and `deploy/vps-setup.sh` does the whole server setup on any Ubuntu host in one command.

Because pm2 wraps the bot in `ProcessContainerFork.js`, searching the process list for `index.js` finds nothing even when it is healthy. Use `pm2 list`.

## When the user asks for something that would break the gate

Say so in one sentence, offer the version that works, and build that. The recurring example: a self-assign button in a channel unverified people can read. The fix is always to gate it in code rather than to abandon the feature.

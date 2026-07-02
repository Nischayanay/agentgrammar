# Founder Setup — plain-language checklist

These are the things **only you can do** (they need your accounts, cards, or 2FA). I (Claude) do all
the coding; you do the account/ownership steps below. Do the ⭐ ones first — they block launch.

---

## ⭐ 1. Reserve the npm name `agentgrammar`

**Why it matters:** the whole magic UX is `npx agentgrammar`. That word must be an npm package you
own. If someone else takes the name, the command changes and the brand weakens. Reserve it now.

**Steps (10 minutes):**
1. Make an npm account at https://www.npmjs.com/signup (free).
2. Turn on 2FA when it asks (Account → Two-Factor Authentication). Keep the backup codes.
3. Check if the name is free — open: https://www.npmjs.com/package/agentgrammar
   - "package not found" = it's free. 
   - If it shows a package = it's taken; tell me and we pick a fallback (e.g. `agentgrammar-cli`).
4. You don't publish anything yet. I'll prepare the package; when it's ready I'll give you one
   command (`npm publish --access public`) to run. Reserving = just having the account ready + name free.

**What I need from you:** just tell me "npm name is free" or "it's taken."

---

## ⭐ 2. Get the domain

**Why it matters:** it's your home base — the website, docs, and the API can live here
(e.g. `api.agentgrammar.dev`). Also secures the brand.

**Which name to buy (in order of preference):**
1. `agentgrammar.dev` — best for a dev tool, short, credible.
2. `agentgrammar.com` — most familiar; grab it too if affordable.
3. `agentgrammar.ai` — nice but pricier; optional.

**Steps (15 minutes):**
1. Go to a registrar — any of these is fine: Namecheap, Cloudflare Registrar (cheapest, no markup),
   or Porkbun. **Cloudflare is recommended** because it's at-cost and plays well with hosting.
2. Search `agentgrammar` and check `.dev`, `.com`, `.ai`.
3. Buy the one(s) available. `.dev` is usually ~$12–15/year.
4. **Don't configure anything yet.** Once you own it, I'll tell you the exact DNS records to add so
   the site and API point to it. You'll just paste 2–3 records in the dashboard when I say so.

**How to find out what's available (easiest way):**
- Just type the name into the search box on Cloudflare/Namecheap — it shows availability + price
  instantly. No command line needed.

**What I need from you:** tell me which domain you bought (e.g. "got agentgrammar.dev").

---

## 3. Create a Vercel account (for the API + later the website)

**Why it matters:** this is where the free registry API gets deployed. Free tier is plenty for launch.

**Steps (5 minutes):**
1. Sign up at https://vercel.com with your GitHub account (the one with the agentgrammar repo).
2. That's it for now. When the API code is ready, I'll walk you through connecting the repo — it's
   mostly clicking "Import Project" and "Deploy."

**What I need from you:** "Vercel account ready."

---

## 4. Create the X / Twitter handle `@agentgrammar`

**Why it matters:** marketing starts today (see `docs/06-MARKETING.md`). The handle is the megaphone.

**Steps (5 minutes):**
1. Sign up / create the handle `@agentgrammar` (or closest available, e.g. `@agentgrammarhq`).
2. Post the Day 1 tease from the marketing doc (I can tailor it once you're ready).

**What I need from you:** the handle you secured.

---

## What you do WHILE I code (summary)

While I build the API and MCP server, you knock out the accounts above. Concretely, in order:

1. ⭐ Check npm name → tell me free/taken.
2. ⭐ Buy the domain → tell me which one.
3. Make a Vercel account (GitHub login).
4. Grab the X handle + post Day 1 tease.

That's the whole list. Everything technical (DNS records, deploy config, npm package, the actual
`npm publish` command) I prepare and hand you step-by-step — you'll never have to figure out config
on your own.

## When it's time to publish (later, I'll prep everything)

You'll run just these, and I'll tell you exactly when:
```bash
npm login            # once, uses your account + 2FA
cd packages/mcp
npm publish --access public
```
After that, anyone in the world can type `npx agentgrammar` and it works.

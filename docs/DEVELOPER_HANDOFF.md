# LMC COMMAND — Developer Handoff

**To:** Jen (LMC Operations, developer on this build)
**From:** Work Official LLC
**Date:** 2026-09-04
**Status:** v1 handoff — enough to start building. Seed data arrives via the
extraction prompts (`EXTRACTION_PROMPTS.md`).

> If you're loading this into ChatGPT or Claude to build from: **Jen is a
> developer helping build the LMC COMMAND command center. Treat this as a build
> spec and produce code/artifacts, not advice.**

---

## 1. What we're building — in one line

An **in-house command center** that runs every LMC project, task, idea and piece
of gear in one place — owned by LMC, not rented. It's the system Leo has always
wanted: a place to dump ideas at 1 a.m., organize the constant flow, and never
lose a follow-up (or a $100 cardellini).

## 2. Why (the real problems, from the call)

1. **Leo's brain never stops and never sleeps on schedule.** Ideas, follow-ups,
   and overseas vendor calls land at 10pm–1am when nobody's at their best. He
   needs to *capture and organize thoughts on the fly* instead of one-offs.
2. **Everything is always changing** across many parallel projects — construction,
   cabinetry, lighting, studio buildout, the TV show, client work. No single place
   shows "where we are on everything."
3. **Gear walks away.** ~90% is in Cheqroom with SKUs + QR labels, but Cheqroom
   charges per SKU/QR, so small grip (C-stands, arms, knuckles, cardellinis —
   ~$100 each) isn't tracked. Kits check out whole; individual pieces can't.
4. **Subscription sprawl.** Paying professionally for "every kind of AI" and more.
   LMC is **anti-subscription** and wants to own its tools.
5. **Hardware gap.** Current Mac is an M1 / 8GB / 2020 — not enough. Min **M4**
   for the Mac side; heavy AI/render runs on the owned Ryzen node (see §6).

## 3. Modules (build order)

### A. Task & Project Command *(build first — this is the heartbeat)*
- Projects → tasks, with owner (Leo / Jen / Kemp / vendor), status, priority,
  due/timeframe, blocked_by, next_action.
- **Shared task lists** for Leo and Jen; filter by person, project, category.
- A single "where are we on everything" board across all projects.
- Seed from `lmc_projects_tasks.csv`.

### B. Idea Inbox / Thought Capture *(the "1 a.m. brain" feature)*
- Dead-simple capture: one field, from phone or desktop, any hour. Text it in.
- Each capture becomes an item: idea / follow-up / decision-needed / waiting-on.
- Later triaged into a project + next action. Nothing gets lost.
- Seed from `lmc_ideas_followups.csv`.

### C. Gear & Inventory *(own-your-Cheqroom)*
- SKU + quantity + location + kit membership. **QR labels printed in-house** —
  no per-SKU fee, so *every* item can have one, down to the grip.
- Check-out / check-in at the **piece** level, not just the kit. Loss flags when a
  piece doesn't return with its kit.
- Migrate the existing Cheqroom export as the starting catalog; add the untracked
  small items. Seed context from `lmc_gear_notes.md`.
- Goal: retire the Cheqroom subscription once parity is reached.

### D. Subscription Ledger
- Every paid tool: cost, owner, what it does, local alternative?, keep/cut/review.
- Feeds the consolidation decision. Kemp populates it; seed from
  `lmc_subscriptions.csv`.

### E. Studio & Spaces
- Front studio (rented) + backspace (private), layout/grid, remodel status,
  photo/asset needs. Seed from `lmc_studio.md` + the PeerSpace layout.

### F. Contacts & Vendors
- People, manufacturers, overseas reps (timezone matters for those late calls),
  clients. Seed from `lmc_contacts.csv`.

## 4. Data model (minimum viable)

Entities and their key links — keep it boring and relational:

```
Project(id, name, category, status, owner, notes)
Task(id, project_id, title, owner, status, priority, due, blocked_by, next_action)
Idea(id, text, type, related_project_id, owner, needs_response_from, status, created_at)
GearItem(id, sku, name, category, qty, unit_cost, location, kit_id, qr_printed)
Kit(id, name, notes)
Checkout(id, gear_item_id, who, out_at, due_at, in_at, status)
Subscription(id, service, category, monthly_cost, owner, local_alt, decision)
Contact(id, name, role_company, relationship, region_tz, notes)
Space(id, name, kind[front|back], status, notes)
```

Everything is **additive and reversible** — new tables/columns only, migrations
with rollbacks, no destructive deletes of data. Secrets in env vars, never in
source or any public page.

## 5. Handoff / interchange format (so your ChatGPT output drops straight in)

- **Tables** (projects, tasks, gear, subs, contacts) → **CSV**, header row, one
  record per line, `UNKNOWN` for missing fields. Filenames as in the extraction
  prompts.
- **Narrative / instructions** → **Markdown (.md)**.
- We ingest those files as seed data with no reformatting. Keep sending updated
  versions the same way — the system is designed to grow from repeated imports.

## 6. Hardware / environment (for tomorrow's "best-practice computers" talk)

- **Mac side (edit, orchestrate, run the command center):** minimum **M4**; more
  unified memory is better. The M1/8GB won't carry this.
- **AI / render node (owned, local):** **AMD Ryzen AI Max+ 395, 128GB unified** —
  runs local video (LTX 2.3 on Radeon), a local LLM, ComfyUI, Blender+TRIPOINT,
  mocap. This is what lets LMC drop the recurring AI bill. See
  `CREATIVE_PIPELINE.md`.
- **Cloud stays for burst only** (occasional hero shots), billed at cost.

## 7. Your side / our side (how we work)

- **You (Jen):** developer + operations. You run the extraction prompts, send the
  seed files, and build/iterate on the command center on your end; you manage Leo
  personally and professionally and set expectations.
- **Us (Work Official):** deliver this handoff, the brand/logo, the architecture,
  the local pipeline, and the living hub; we ingest your seed data and stand up
  the modules.
- **Cadence:** on-the-fly, text-based, fast turnaround. No 24-hour waits.
- **Shared build thread:** you're starting a shared chat we build from; we'll work
  against the seed files it produces.
- **Your login:** the board (`command.html`) is live. Sign in on the site with the
  username + password Work Official sends you (no GitHub account needed). Work
  Official is owner/admin and creates, resets and removes accounts. Steps in
  `JEN_ONBOARDING.md`; the board's **Guide** tab (Gemini) walks you through it.

## 8. Open items / what we still need from you

- [ ] Logo / brand assets for the command center (Leo to drop in the thread)
- [ ] PeerSpace link (front-studio layout) + note on remodel changes
- [ ] The seven extraction files (`EXTRACTION_PROMPTS.md`)
- [ ] Cheqroom export (current gear catalog) when ready
- [ ] Kemp's subscription pull

## 9. First milestone

1. ~~Stand up **Task & Project Command** + **Idea Inbox**~~ — live at `command.html`,
   reading the seed-file schemas. Ingest Jen's real files when they land.
2. Import Cheqroom export → **Gear & Inventory** with piece-level check-in/out.
3. Populate **Subscription Ledger** → produce the first consolidation/cut list.
4. Review together, then graduate to watchers/agents (follow-up, subscription,
   equipment) once the data is trusted.

---

*Additive, reversible, owned-not-rented, secrets-safe. Live hub:
https://borngifted.github.io/lmc-command/*

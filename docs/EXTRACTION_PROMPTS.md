# LMC COMMAND — Extraction Prompts

**For:** Jen (LMC Operations, developer on the build)
**Use:** Drop each block, in order, into the shared ChatGPT thread that already
holds Leo's project files (construction, cabinetry review, lighting review, TV
show, studio, etc.). Each prompt asks ChatGPT to return **handoff-format** output
— `.md` for narrative, `.csv` for anything that becomes a table/row in the system.
Save each output with the filename noted at the top of the block and send them
back to us. That is everything we need to build the first version.

Run them one at a time; let each finish before the next. If ChatGPT asks a
clarifying question, answer it — the goal is completeness, not speed.

---

## 0 · Set the frame (run this first)

```
You are helping me produce a developer handoff for an in-house operations and
project "command center" we're building for Leo Marshall Creative (LMC). I am
Jen — I run operations and I'm acting as a developer on this build. Everything I
ask for from here should be delivered in HANDOFF FORMAT so a developer can load
it directly into a system:
- Narrative / instructions → Markdown (.md)
- Anything list-like (projects, tasks, gear, contacts, subscriptions) → CSV,
  with a header row and one record per line.
Be exhaustive and literal. Pull from every file and message in this thread.
Where a field is unknown, write "UNKNOWN" rather than guessing. Do not summarize
away detail — this is source data, not a recap. Confirm you understand, then wait
for my first extraction request.
```

---

## 1 · Master project + task list  → `lmc_projects_tasks.csv`

```
From everything in this thread, produce a CSV named lmc_projects_tasks.csv of
every project and every task you can find. One row per task. Columns:

project, task, category, status, owner, due_or_timeframe, priority, blocked_by,
next_action, notes, source_file

- category examples: construction, studio buildout, cabinetry, lighting, gear,
  TV show, client work, admin, vendor/manufacturing, marketing, other
- status: not_started / in_progress / blocked / waiting / done / UNKNOWN
- owner: Leo / Jen / Kemp / vendor / UNKNOWN
- priority: high / medium / low / UNKNOWN
Include finished items too, marked done. Be exhaustive — every construction line
item, every review, every follow-up. Output only the CSV.
```

---

## 2 · Leo's ideas, follow-ups & open loops  → `lmc_ideas_followups.csv`

```
Leo generates ideas and follow-ups at all hours (including late-night calls with
overseas vendors). From this thread, extract every IDEA, FOLLOW-UP, or unresolved
"we should…" / "need to…" / "waiting on…" into a CSV named
lmc_ideas_followups.csv. One row each. Columns:

item, type, related_project, who_owns_it, needs_response_from, time_sensitivity,
status, notes, source_file

- type: idea / follow_up / decision_needed / waiting_on / reminder
Capture even half-formed one-off thoughts. This is the "get it out of Leo's head"
inventory. Output only the CSV.
```

---

## 3 · Gear & inventory reality  → `lmc_gear_notes.md`

```
We currently track ~90% of gear in Cheqroom with SKUs and QR labels, but small
grip items are NOT tracked (C-stands, arms, knuckles, cardellinis, etc.) because
Cheqroom charges per SKU/QR. Those items walk away. We're considering building our
own inventory system to own it and drop the subscription.

Produce a Markdown file lmc_gear_notes.md covering, from anything in this thread
and your knowledge of our operation:
- Categories of gear we own (camera, lens, lighting, grip, audio, etc.)
- Which categories are currently tracked vs. untracked
- The specific small/untracked items most prone to walking away, with rough unit
  cost where known
- How we currently print labels in-house (workflow, hardware if mentioned)
- Kit structure: what "kits" exist and what pieces belong to each
Mark unknowns as UNKNOWN. This feeds an inventory module design.
```

---

## 4 · Subscriptions to consolidate  → `lmc_subscriptions.csv`

```
We want to cut subscription costs — especially the many professional AI tools.
(Kemp, our editor, can fill gaps.) Produce a CSV named lmc_subscriptions.csv of
every paid software/AI/service subscription you can identify from this thread.
One row each. Columns:

service, category, plan_tier, monthly_cost, annual_cost, who_uses_it,
what_it_does, local_alternative_exists, keep_cut_or_review, notes

- category: AI / creative / storage / gear-mgmt / productivity / other
- keep_cut_or_review: keep / cut / review
Where cost is unknown, write UNKNOWN. Flag any that a local/owned tool could
replace. Output only the CSV.
```

---

## 5 · People, vendors & contacts  → `lmc_contacts.csv`

```
Produce a CSV named lmc_contacts.csv of the people, vendors, manufacturers, and
clients referenced in this thread. One row each. Columns:

name, role_or_company, relationship, timezone_or_region, what_we_work_on_together,
best_contact_method, notes

Include overseas manufacturing/vendor reps (e.g. China calls), internal team
(Leo, Jen, Kemp, Tarifa), and any clients or partners. UNKNOWN where needed.
Output only the CSV.
```

---

## 6 · Studio & spaces  → `lmc_studio.md`

```
Produce a Markdown file lmc_studio.md describing our physical studio from this
thread: the front studio (the part we rent out), the backspace (private), the
layout/grid, any remodel/construction changes since our PeerSpace listing, and
what still needs updated photos or documentation. Note anything relevant to
rentals, buildout status, or gear storage. Mark unknowns UNKNOWN.
```

---

## 7 · One-page ecosystem summary  → `lmc_ecosystem_summary.md`

```
Finally, write lmc_ecosystem_summary.md: a one-page executive summary of the
entire LMC ecosystem right now — the active projects, the state of the studio
buildout, the TV show, gear/inventory, vendor/manufacturing relationships, and
the biggest operational pain points. Write it for a developer who is about to
build a command center to run all of it. Plain, specific, no fluff.
```

---

**When done:** send back the seven files (5 CSV, 3 MD — counting summary). That
set becomes the seed data for LMC COMMAND. You don't need to format anything
further; we ingest it as-is.

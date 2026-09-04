# LMC COMMAND

**Leo Marshall Creative — Autonomous Command System**

A digital operations staff that never forgets. LMC COMMAND is the operational
intelligence layer for the studio: it remembers projects, decisions, vendors,
equipment and deadlines, watches the work with permissioned agents, and runs a
**local-first creative pipeline on hardware the studio owns**.

**Live hub:** the site in this repo is published via GitHub Pages and **grows
with input** — it renders `data/knowledge.json` client-side, so adding an entry
(by hand or by an agent) makes the hub grow with no rebuild.

## What's here

| Path | What it is |
|------|------------|
| `index.html` | The live hub — Vision, What it runs, Creative pipeline, The stack, Pricing, Knowledge feed |
| `command.html` | **The board** — Task & Project Command + Idea Inbox. GitHub sign-in, repo-backed sync, Gemini guide |
| `data/seed/*.csv` | Seed files in the extraction-prompt schema (`lmc_projects_tasks.csv`, `lmc_ideas_followups.csv`) |
| `data/users.json` | Site accounts (password-encrypted board token per user). Created by the owner from the board |
| `data/board.json` | Shared board state — status changes, captures, added tasks, change log. Written by the board via the GitHub API |
| `docs/JEN_ONBOARDING.md` | Jen's access + first-job walkthrough |
| `docs/GEMINI_GUIDE_GEM.md` | Gem instructions: Gemini as the onboarding guide |
| `docs/DEVELOPER_HANDOFF.md` / `EXTRACTION_PROMPTS.md` | Build spec and the prompts that produce the seed files |
| `data/knowledge.json` | The living feed. Add an entry → it appears on the site |
| `docs/CREATIVE_PIPELINE.md` | End-to-end local AI pipeline (video, LLM, 3D, mocap) |
| `docs/PRICING.md` | Setup fees and monthly management fees, kept separate |
| `docs/LMC_SYSTEM_AUDIT.md` | Phase 0 audit — the handoff's required starting point |

## How it grows

The hub is a static site (no server, offline-first). The "living" part is the
JSON feed:

```json
{
  "updated": "2026-09-03",
  "note": "Add an entry here and it appears on the site.",
  "entries": [
    { "date": "2026-09-03", "tag": "video", "title": "…", "body": "…" }
  ]
}
```

Append an object to `entries`, commit, and the hub shows it on next load.
An agent can do the same append — that is how "a system that never forgets"
compounds day to day.

## Access

Team members sign in on the board with a **username + password** — no GitHub
account. Accounts live in `data/users.json`: each entry is the board's
repo-scoped GitHub token encrypted (AES-GCM) under a PBKDF2 key derived from that
person's password, so the file is useless without the password. Work Official
(`borngifted`) owns the repo and is the system admin: one-time setup pastes the
token and sets the owner password; after that the owner panel creates, resets and
removes accounts and can rotate the token to cut everyone off at once. Every
board change is a commit under the person's username.

## The stack

Two-machine studio. The render node is the part that changes the economics:

- **Render node** — AMD Ryzen AI Max+ 395, 128GB unified memory. Runs LTX 2.3
  video on the Radeon iGPU, a local LLM in the unified memory pool, ComfyUI,
  Blender + TRIPOINT, and markerless mocap. The everyday model cost moves here,
  once — it "killed the $200/month AI bill."
- **Studio** — Mac / workstation for editing, color, sound, the LMC COMMAND hub
  and agent orchestration (Claude Code + MCP).

Cloud tools (SkyReels, frontier models) stay in the kit for burst hero shots,
billed at cost — not the daily default.

## Principles (from the handoff)

Additive development · feature-flagged · reversible migrations · secrets in env,
never in source · no destructive deletes of data or knowledge stores.

---

Built by Work Official LLC.

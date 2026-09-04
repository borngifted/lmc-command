# LMC_SYSTEM_AUDIT.md — Phase 0

**Leo Marshall Creative Autonomous Command System (LMC COMMAND)**
Audit date: 2026-09-03 · Status: baseline established for build.

Phase 0 of the handoff requires an honest audit of what exists before any code
is added. This is that document.

---

## 1. What exists today

| Area | Current state | Notes |
|------|---------------|-------|
| Operations memory | Informal — email, chat, memory | No single system that "never forgets"; this is the core gap LMC COMMAND fills |
| Project tracking | Ad hoc | No shared record of decisions, milestones, follow-ups |
| Creative tooling | Cloud AI, subscription-metered | ~$200+/mo of rented AI; recurring, forever |
| Render hardware | AMD Ryzen AI Max+ 395, 128GB unified | The render node — capable of local video + LLM + 3D |
| Studio machine | Mac / workstation | Editing, color, sound, orchestration |
| Automation | None | No agents, no watchers, no audit log |

## 2. Target system (what we're building toward)

- **Persistent memory** for the entities the studio actually runs on:
  Organization, User, TeamMember, Project, Task, Milestone, Decision, Idea,
  Contact, Vendor, Client, Equipment, Subscription, Invoice, Agent, Alert,
  ApprovalRequest.
- **Permissioned agents** (levels 0–5), approval-gated, fully audit-logged, each
  with a kill switch. First cohort: Executive Monitor, Project Watcher,
  Follow-Up, Decision, Subscription, Equipment Watcher, Studio Watcher,
  Knowledge, Intake.
- **Local-first creative pipeline** on the Ryzen render node — see
  `CREATIVE_PIPELINE.md`.
- **The living hub** (`index.html`) — a growing, always-current view for Leo,
  Operations, and the team.

## 3. Safety constraints (non-negotiable, from the handoff)

- Additive development only — never break what works.
- Feature flags on every new capability.
- Reversible migrations — every schema change has a rollback.
- Secrets live in environment variables — never hardcoded, never in a public page.
- No deleting databases or knowledge/LightRAG stores. Ever.
- Every agent action that touches the outside world is approval-gated and logged.

## 4. Gaps to close (priority order)

1. **Memory** — stand up the persistent store and the core entities.
2. **Hub** — the living site (done, this repo) so everyone sees the same truth.
3. **Pipeline** — wire the local creative stack on the Ryzen node end to end.
4. **Agents** — introduce watchers one at a time, read-only first, then gated actions.
5. **Autonomy** — graduate proven agents to higher permission levels under policy.

## 5. Documents to produce (handoff requirement)

Planned, in build order: SYSTEM_ARCHITECTURE · DATABASE_SCHEMA ·
AGENT_ARCHITECTURE · AUTONOMY_POLICY · EVENT_SYSTEM · KNOWLEDGE_ARCHITECTURE ·
INTEGRATIONS · SECURITY · DEPLOYMENT · BACKUP_RECOVERY · ROADMAP · CLAUDE.md.

`CREATIVE_PIPELINE.md` and `PRICING.md` are already written.

---

*Baseline for the build. Additive, reversible, secrets-safe by design.*

# Master project status

**Reconciled: 2026-10-03.** This is a public, curated snapshot of the master project records, not a live service monitor. Dates below identify the evidence; a recorded success does not certify current uptime. Private operational documents and client records remain local.

## System architecture

| Layer | Responsibility | Current boundary |
|---|---|---|
| LMC COMMAND | Public Pages hub, shared vocabulary, operational board and knowledge feed | Public documentation surface; not the private application or a live infrastructure dashboard |
| Master Command Center | Project chart, runbooks, machine/service inventory, agent contracts and run records | Local authority; existing project folders remain in place and are referenced through junctions |
| Private LMC workspace | Next.js project workspace on LEO | Production configuration uses port 3001; development uses 3000. JARVIS AI Console integration remains deferred |
| JARVIS | Portable agentic core: intent, routing, planning, tools, execution, verification and memory | M3 core released; studio-specific behavior belongs in adapters/configuration |
| JEV | Studio-wide decision/routing layer inside JARVIS | v2 extends structured decisions, attention, controls and replay; live v2 acceptance is pending |
| LMC Platform | API, orchestrator, worker routing, Postgres, Redis and object storage | Development infrastructure on SPARK; heavy/GPU jobs use registered handlers; client-data gate remains open |
| Executors and workers | Claude Code, Codex, tool adapters and capability-advertising workers | Claude is the designed primary reasoner; Codex supplies fallback/continuation. A model name is not a role or proof of capability |

Flow: **public board inputs / private workspace / companion → JARVIS → JEV decision and permission checks → tool adapters or platform jobs → verification receipts → private state and UI.** The companion/voice and full workspace panels remain staged roadmap work, not completed product surfaces.

The public board may supply source cards. JEV v2 labels and alerts stay in the private JARVIS database and private surfaces; they are **not written back to this repository**.

## Project status and next steps

| Project | Evidence and status | Next step / acceptance boundary |
|---|---|---|
| Master Command Center | Local chart, runbooks, infrastructure inventory, agent definitions and state schemas exist (Oct 1–3 records). Some older ledger prose predates later releases | Keep dated source records authoritative; dashboard/orchestrator phases are not implied complete by the chart existing |
| LMC COMMAND | Public architecture and vocabulary were on `main`; the separate local router checkout has an unpushed documentation commit and router edits | This publication reconciles public summaries only. Private deployment docs and unrelated router edits remain outside this update |
| JARVIS M3 | Master chart records `v0.3.0-mvp-core` merged Oct 2. M3 results record three live requests passing with claimable receipts and `mvp_three.py --live` exit 0 | AI Console remains deferred. M3 did not prove live approvals or platform job execution; the orchestrator was unreachable in those acceptance runs |
| JEV v2 slice 1 | Local development ledger records Tasks 1–15 complete/reviewed; Task 16 offline acceptance work underway. A 976-test run passed before later focused fixes; subsequent affected tests are recorded separately | Live acceptance awaits Claude quota recovery, recorded as Oct 5 at 9am Eastern. Production migration/configuration, service changes, release tag and push remain deferred. Do not present offline doubles as live acceptance |
| Blackland digital twin | Cabinetry audit: 295/295 parts within 0.5 mm. Real Vantage camera/material changes, window-only video and a saved-session restore were previously demonstrated in the POC | **Blocked, not ready for user acceptance.** Oct 3 18:45 UTC heartbeat records a responding Vantage process and connected bridge, but capture reports `ValueError: Vantage window is unavailable or minimized`; `browser_ready=false`. Restore the viewport, recalibrate native capture, then complete visual/performance and integration gates |
| LMC Platform | Master chart records five healthy containers at its last infrastructure check and a private repository push on Oct 1 | Current uptime not revalidated for this publication. P0-01 credential rotation remains the prerequisite for client data on SPARK |
| AndresAI | Master chart records 8K masters and editable PSD delivered Sep 30 | Real cast heights remain unverified estimates; duplicate assets and key rotation remain recorded follow-ups |
| PASSENGERS H3 | Last recorded live observation: Soul-reference hybrid Turbo render accepted and running Oct 1 at 20:23 UTC | Completion is **unverified**, not presumed still running. Inspect the existing job history, fresh MP4 and motion/identity; do not submit a duplicate. Frame-96 guide quality and final-quality approval remain open |

## Rendering and geometry boundaries

- Current Blackland direction: actual **Chaos Vantage** for the interactive viewport, **V-Ray** for finals, **Unreal/FBX** retained as an explicit fallback. The earlier Twinmotion/Datasmith migration remains an unresolved identity-preservation experiment, not the active accepted runtime.
- CAD/as-built drawings remain geometric authority. Persistent object IDs and material state must survive downstream changes. AI imagery is concept/look development unless separately validated; it must not silently redefine measured geometry.
- Noncommercial trial testing is authorized. That does not establish commercial release clearance or authorize new licence commitments.
- The previous POC encoded a 568×319 source viewport at 1920×1080. Upscaling is not native 1080p; decoded repeated frames are not verified renderer FPS; SDK acknowledgements are not measured visible latency.
- Remaining tour gates include native-resolution window-only video, appearance, sustained performance, all-floor navigation/collision, complete save/undo/restore of material and lighting history, app integration and matching final renders. No production promotion has been verified.
- The verified cabinetry result does not certify the whole house: opening heights, traced stairs/windows, some room depths, adjacency and remaining drawing conflicts still require validation or decisions.

## Machines, memory and controls

| Component | Recorded configuration / constraint |
|---|---|
| LEO | Windows workstation; i7-13700F, 128 GB RAM, RTX 4070 Ti with 12 GB VRAM. House authoring stays on Blender 4.4.3; do not save it through the newer default Blender association |
| SPARK | DGX Spark GB10, approximately 121 GB unified memory, Ubuntu; large-model/ComfyUI and platform workloads. Connect by configured hostname, not a DHCP address; preserve the one-GPU-job policy |
| Cloud | Explicitly selected reasoning and burst services. Local hardware does not imply every workflow is free or subscription-free |
| Current memory | Master chart, project memory, runbooks, JARVIS SQLite records and source-backed notes. M3 memory success is not evidence that full LightRAG/Obsidian ingestion is deployed |
| Target memory and interfaces | LightRAG plus Obsidian-backed memory on LEO; full tool autonomy, private panels, desktop/phone voice and workflow learning remain acceptance-gated roadmap work |
| Heartbeats | Recent timestamp means a check ran. Three unchanged task/step/next cycles mean **stuck**; process liveness is not implementation progress |
| Receipts | Separate attempted action, verified result, claimable answer and undo support. `code.edit` currently has no declared inverse; the v2 literal all-actions-undo criterion remains unmet |

The v2 frozen twenty-card fixture has a deterministic target split of 3 ACTION_REQUIRED / 5 IMPORTANT / 12 NORMAL. Live cards must report their actual counts. The shipping stub uses a separate seven-card scenario; neither fixture is production data. Full replay parity requires independent expected labels, not comparison against the replay itself.

Graphify was uninstalled globally on LEO on Oct 3 (CLI, MCP executable, skill and instruction entry). Previously generated graphs were retained; they are static artifacts, not an active installed service or a substitute for LightRAG.

## Source register and reconciliation rules

The following **local/private records were read**, but are intentionally not copied wholesale into this public repository:

- Master `CLAUDE.md`, `PROJECTS.md`, infrastructure inventory and `agents/jev.md` / `agents/router.md` (read Oct 3).
- JARVIS `DESIGN_DECISIONS.md`, including D7 naming and D13–D19 v2 amendments; `M3_RESULTS.md`, final live run and its limitations (Oct 2).
- JARVIS README and `.superpowers/sdd/2026-10-02-jev-v2-slice1/progress.md` through rulings S32/S33 (read Oct 3). The README references `SLICE1_RESULTS.md`, which was absent when checked; this snapshot does not claim that missing report exists.
- House `PROJECT_MEMORY.md` and `status/jev_heartbeat.json`; latest measured heartbeat Oct 3 18:45 UTC. The older CURRENT DIRECTIVE heading is superseded on renderer direction by later Vantage decisions.
- Spark ComfyUI runbook's PASSENGERS recovery/launch record (Oct 1); no new render or paid model call was made for this publication.
- Global graphify uninstall output (Oct 3).

When records disagree, prefer a later scoped decision or verified result over an older overview. Preserve the date and limits of the evidence. Update this page, the [architecture map](../system-layout.html), the [thesaurus](THESAURUS.md) and the public knowledge feed together when the next milestone is actually verified.

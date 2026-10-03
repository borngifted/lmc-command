# LMC THESAURUS — Ubiquitous Language

This is the canonical vocabulary layer for LMC COMMAND. Reconciled October 3, 2026 with master decisions D7 and D13–D19. See [master status](MASTER_STATUS.md) for implementation and acceptance boundaries; a definition is not a deployment claim.

Its purpose is to prevent agents, developers, and team members from inventing new meanings for the same concepts as the system grows.

## Rules

1. Prefer a canonical term over synonyms in code and stored data.
2. Human-friendly aliases are allowed, but they must resolve to a canonical term.
3. New domain terms should be added here before becoming architectural dependencies.
4. If two teams use the same word differently, create distinct canonical terms.
5. Do not let an agent silently redefine an existing term.
6. Project-specific vocabulary belongs under that project's section or namespace.

## Core terms

### LMC COMMAND
**Type:** System<br>
**Meaning:** The user-facing command center and operational intelligence layer for Leo Marshall Creative / Work Official managed workflows.<br>
**Aliases:** LMC, Command Center, LMC Command Center<br>
**Do not confuse with:** LMC Platform infrastructure tier.

### LMC Platform
**Type:** Infrastructure<br>
**Meaning:** Backend infrastructure containing API, database, orchestration, worker routing, storage, guards, and project-state services.<br>
**Aliases:** Platform, Infrastructure Tier

### JEV
**Type:** Decision / Routing Layer<br>
**Meaning:** Studio-wide decision and routing layer inside JARVIS. Its decision component chooses an execution path; its broader v2 layer handles attention and delegates bounded actions to adapters.<br>
**Aliases:** JEV Router, Decision Router<br>
**Do not confuse with:** Claude (a reasoner), JARVIS (the portable core), or house-agent (the Blackland role). Legacy files still use JEV for the house role; D7 renames that role without implying all registries have migrated.

### Claude
**Type:** Reasoning Engine<br>
**Meaning:** Deep reasoning, planning, architecture, coding, debugging, synthesis, and escalation engine.<br>
**Aliases:** Claude Code when referring specifically to the coding/execution CLI.

### Claude Code
**Type:** Execution Agent<br>
**Meaning:** Claude's coding and local engineering execution environment.<br>
**Aliases:** Claude CLI<br>
**Relationship:** Selected or directed through JEV for appropriate engineering tasks.

### Codex
**Type:** Execution Agent<br>
**Meaning:** OpenAI reasoning/coding execution path used for fallback and continuation under routing policy. A selected model does not redefine a project role.

### Worker
**Type:** Machine Identity<br>
**Meaning:** A registered execution node that advertises detected capabilities and accepts jobs from the orchestrator.<br>
**Examples:** LEO, SPARK.

### Capability
**Type:** Routing Attribute<br>
**Meaning:** A function a worker has actually detected and can perform. Jobs route by capability rather than machine name.<br>
**Examples:** `blender`, `unreal`, `ffmpeg`, `comfyui_qwen`, `large_model_inference`.

### LEO
**Type:** Worker<br>
**Meaning:** Studio workstation worker node.<br>
**Note:** Capabilities are detected; do not assume a capability simply because the node is named LEO.

### SPARK
**Type:** Worker<br>
**Meaning:** DGX Spark / GB10 worker used for large-model inference and relevant ComfyUI workloads.<br>
**Note:** Uses unified GPU-addressable memory rather than discrete-VRAM assumptions.

### Project
**Type:** Core Entity<br>
**Meaning:** A bounded body of work with access, state, tasks, decisions, assets, milestones and activity.

### Task
**Type:** Core Entity<br>
**Meaning:** A discrete unit of work associated with a project or operational goal.

### Idea
**Type:** Core Entity<br>
**Meaning:** Uncommitted captured thought that may later be triaged into a task, project, decision, or discarded.

### Decision
**Type:** Core Entity<br>
**Meaning:** A persisted choice that affects project behavior, architecture, scope, or direction.

### Approval
**Type:** Governance Entity<br>
**Meaning:** Explicit authorization required by policy before a gated action proceeds.

### Architect Approval
**Type:** Approval<br>
**Meaning:** Approval from the architectural authority for structural/system decisions.<br>
**Do not confuse with:** Client Approval.

### Client Approval
**Type:** Approval<br>
**Meaning:** Approval from the client for client-facing scope, design, or deliverable decisions.<br>
**Do not confuse with:** Architect Approval. One does not substitute for the other.

### Agent
**Type:** Autonomous / Semi-autonomous Actor<br>
**Meaning:** A software actor that observes, decides, recommends, or acts within assigned permissions.

### Permission Level
**Type:** Governance Attribute<br>
**Meaning:** The maximum class of action an agent or actor may perform without additional approval.

### Execution Receipt
**Type:** Verification Record<br>
**Meaning:** Structured proof that a meaningful action was actually attempted and what result was returned.<br>
**Target fields:** receipt id, task/session id, actor, tool, action, timestamp, result, verification, undo availability.

### Audit Log
**Type:** Record<br>
**Meaning:** Append-only history of relevant system and actor activity.

### Job Event
**Type:** Record<br>
**Meaning:** Append-only worker/orchestrator lifecycle event associated with a job.

### Handler
**Type:** Execution Definition<br>
**Meaning:** Allowlisted job implementation that a worker is permitted to execute.

### LightRAG
**Type:** Knowledge Retrieval Layer<br>
**Meaning:** Target semantic retrieval layer used to fetch relevant knowledge without loading the entire corpus into every prompt.

### Obsidian
**Type:** Knowledge Workspace<br>
**Meaning:** Human-readable knowledge workspace intended to participate in persistent memory and project context.

### Active Context
**Type:** Short-term State<br>
**Meaning:** Current selection, project, view, recent action, pointer/gesture target, and other transient references needed to interpret phrases such as "move this" or "undo that."

### Fast Path
**Type:** Decision Path<br>
**Meaning:** Low-latency, low-risk path for routing, classification, UI decisions, repetitive decisions and real-time responses.

### Slow Path
**Type:** Decision Path<br>
**Meaning:** Deep reasoning path for ambiguous, strategic, architectural, high-risk or multi-step tasks.

### Decision Stream
**Type:** Runtime Record<br>
**Meaning:** Sequence of structured observations, decisions, actions, confidence, latency and outcomes during a JEV session.

### Reliability Lab
**Type:** Test System<br>
**Meaning:** Controlled repeated testing used to measure routing accuracy, consistency, latency, failure rate and escalation behavior.

## Master architecture and acceptance terms

### Master Command Center
**Type:** Local authority workspace<br>
**Meaning:** Source of project chart, runbooks, machine/service inventory, decisions and agent contracts.<br>
**Do not confuse with:** The public LMC COMMAND website or the private Next.js application.

### JARVIS
**Type:** Portable agentic core<br>
**Meaning:** Intent, planning, execution, verification, permissions and memory, with studio behavior in adapters/configuration.<br>
**Relationship:** Contains JEV decision/attention functionality; connects to tools and LMC Platform. M3 core release and JEV v2 development are separate milestones.

### Private LMC workspace
**Type:** Application surface<br>
**Meaning:** Next.js project workspace on LEO, intended to host JARVIS interfaces.<br>
**Do not confuse with:** This public GitHub Pages hub. Full AI Console integration remains deferred.

### house-agent
**Type:** Project role<br>
**Meaning:** Approved D7 name for the Blackland head-agent role, independent of the model performing it.<br>
**Legacy alias:** JEV in House project memory and heartbeat filenames.<br>
**Migration rule:** Preserve existing paths and sessions; changing vocabulary does not authorize a registry or service migration.

### Attention Card
**Type:** Private derived view<br>
**Meaning:** Project/task context classified by JEV as ACTION_REQUIRED, IMPORTANT or NORMAL. Public board records can be inputs, but derived labels and alerts stay in the private JARVIS database.

### Tier 1 classifier
**Type:** Restricted fast-path provider<br>
**Meaning:** Structured ranking, classification or yes/no decisions. D14 permits local classifiers without making a local model the general reasoner. Reliability Lab/Tier 1 testing follows D15's no pay-per-token API boundary.

### Easy Action
**Type:** Bounded action category<br>
**Meaning:** D17 scope: labels, alerts and a single-variable card.md edit via code.edit at permission level 2 or below. Other work escalates or holds.<br>
**Do not confuse with:** Unrestricted autonomous tool execution or guaranteed undo support.

### Claimable Result
**Type:** Verification state<br>
**Meaning:** A result backed by the relevant execution and verification evidence. An attempted call, SDK acknowledgement or launched process alone is insufficient.

### Acceptance Gate
**Type:** Release condition<br>
**Meaning:** Required observable tests and evidence before declaring a feature ready or promoting it. Offline fixture success, live acceptance and production promotion are separate states.

### Replay Parity
**Type:** Reliability criterion<br>
**Meaning:** Replayed results match independently established expected outcomes for the full required set. Comparing replay output with itself or only a changed subset is insufficient. Fixture counts must not be forced onto live data.

### Stuck Heartbeat
**Type:** Progress condition<br>
**Meaning:** Three unchanged task/step/next cycles indicate stuck work even if timestamps advance. Liveness is not progress.

### Window-only Vantage Video
**Type:** Blackland acceptance requirement<br>
**Meaning:** Browser video captured from the actual Vantage window with real camera/material propagation. Desktop capture, repeated frames, upscaled low-resolution capture and an isolated video proof do not certify a ready tour.

### Graphify
**Type:** Retired local tool<br>
**Meaning:** Globally uninstalled on LEO October 3, 2026. Previously generated graphs are retained artifacts, not an installed service or the planned LightRAG memory layer.

## Naming pattern

When introducing a new term, use:

### TERM
**Type:**<br>
**Meaning:**<br>
**Aliases:**<br>
**Relationships:**<br>
**Do not confuse with:**<br>
**Examples:**<br>
**Owner / Source:**<br>

## Change policy

Changes to core terms should be reviewed because vocabulary changes can alter routing, memory retrieval, database schemas, prompts, and UI behavior.

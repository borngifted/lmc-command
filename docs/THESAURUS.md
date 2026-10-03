# LMC THESAURUS — Ubiquitous Language

This is the canonical vocabulary layer for LMC COMMAND.

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
**Type:** System  
**Meaning:** The user-facing command center and operational intelligence layer for Leo Marshall Creative / Work Official managed workflows.  
**Aliases:** LMC, Command Center, LMC Command Center  
**Do not confuse with:** LMC Platform infrastructure tier.

### LMC Platform
**Type:** Infrastructure  
**Meaning:** Backend infrastructure containing API, database, orchestration, worker routing, storage, guards, and project-state services.  
**Aliases:** Platform, Infrastructure Tier

### JEV
**Type:** Decision / Routing Layer  
**Meaning:** Fast decision and routing layer that chooses the appropriate execution path, model, agent, capability, or tool.  
**Aliases:** JEV Router, Decision Router  
**Do not confuse with:** Claude. JEV decides/routes; Claude performs deeper reasoning.

### Claude
**Type:** Reasoning Engine  
**Meaning:** Deep reasoning, planning, architecture, coding, debugging, synthesis, and escalation engine.  
**Aliases:** Claude Code when referring specifically to the coding/execution CLI.

### Claude Code
**Type:** Execution Agent  
**Meaning:** Claude's coding and local engineering execution environment.  
**Aliases:** Claude CLI  
**Relationship:** Selected or directed through JEV for appropriate engineering tasks.

### Codex
**Type:** Execution Agent  
**Meaning:** OpenAI coding/execution path available to JEV as an alternative executor.

### Worker
**Type:** Machine Identity  
**Meaning:** A registered execution node that advertises detected capabilities and accepts jobs from the orchestrator.  
**Examples:** LEO, SPARK.

### Capability
**Type:** Routing Attribute  
**Meaning:** A function a worker has actually detected and can perform. Jobs route by capability rather than machine name.  
**Examples:** `blender`, `unreal`, `ffmpeg`, `comfyui_qwen`, `large_model_inference`.

### LEO
**Type:** Worker  
**Meaning:** Studio workstation worker node.  
**Note:** Capabilities are detected; do not assume a capability simply because the node is named LEO.

### SPARK
**Type:** Worker  
**Meaning:** DGX Spark / GB10 worker used for large-model inference and relevant ComfyUI workloads.  
**Note:** Uses unified GPU-addressable memory rather than discrete-VRAM assumptions.

### Project
**Type:** Core Entity  
**Meaning:** A bounded body of work with access, state, tasks, decisions, assets, milestones and activity.

### Task
**Type:** Core Entity  
**Meaning:** A discrete unit of work associated with a project or operational goal.

### Idea
**Type:** Core Entity  
**Meaning:** Uncommitted captured thought that may later be triaged into a task, project, decision, or discarded.

### Decision
**Type:** Core Entity  
**Meaning:** A persisted choice that affects project behavior, architecture, scope, or direction.

### Approval
**Type:** Governance Entity  
**Meaning:** Explicit authorization required by policy before a gated action proceeds.

### Architect Approval
**Type:** Approval  
**Meaning:** Approval from the architectural authority for structural/system decisions.  
**Do not confuse with:** Client Approval.

### Client Approval
**Type:** Approval  
**Meaning:** Approval from the client for client-facing scope, design, or deliverable decisions.  
**Do not confuse with:** Architect Approval. One does not substitute for the other.

### Agent
**Type:** Autonomous / Semi-autonomous Actor  
**Meaning:** A software actor that observes, decides, recommends, or acts within assigned permissions.

### Permission Level
**Type:** Governance Attribute  
**Meaning:** The maximum class of action an agent or actor may perform without additional approval.

### Execution Receipt
**Type:** Verification Record  
**Meaning:** Structured proof that a meaningful action was actually attempted and what result was returned.  
**Target fields:** receipt id, task/session id, actor, tool, action, timestamp, result, verification, undo availability.

### Audit Log
**Type:** Record  
**Meaning:** Append-only history of relevant system and actor activity.

### Job Event
**Type:** Record  
**Meaning:** Append-only worker/orchestrator lifecycle event associated with a job.

### Handler
**Type:** Execution Definition  
**Meaning:** Allowlisted job implementation that a worker is permitted to execute.

### LightRAG
**Type:** Knowledge Retrieval Layer  
**Meaning:** Target semantic retrieval layer used to fetch relevant knowledge without loading the entire corpus into every prompt.

### Obsidian
**Type:** Knowledge Workspace  
**Meaning:** Human-readable knowledge workspace intended to participate in persistent memory and project context.

### Active Context
**Type:** Short-term State  
**Meaning:** Current selection, project, view, recent action, pointer/gesture target, and other transient references needed to interpret phrases such as "move this" or "undo that."

### Fast Path
**Type:** Decision Path  
**Meaning:** Low-latency, low-risk path for routing, classification, UI decisions, repetitive decisions and real-time responses.

### Slow Path
**Type:** Decision Path  
**Meaning:** Deep reasoning path for ambiguous, strategic, architectural, high-risk or multi-step tasks.

### Decision Stream
**Type:** Runtime Record  
**Meaning:** Sequence of structured observations, decisions, actions, confidence, latency and outcomes during a JEV session.

### Reliability Lab
**Type:** Test System  
**Meaning:** Controlled repeated testing used to measure routing accuracy, consistency, latency, failure rate and escalation behavior.

## Naming pattern

When introducing a new term, use:

### TERM
**Type:**  
**Meaning:**  
**Aliases:**  
**Relationships:**  
**Do not confuse with:**  
**Examples:**  
**Owner / Source:**  

## Change policy

Changes to core terms should be reviewed because vocabulary changes can alter routing, memory retrieval, database schemas, prompts, and UI behavior.

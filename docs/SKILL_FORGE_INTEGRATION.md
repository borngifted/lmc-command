# LMC Skill Forge — Brahma Evo-inspired integration specification

Status: **proposal only**. No production code, services, database, agent permissions or routes are changed by this document.

## Source and scope
Video: https://youtu.be/x80JzhHeV0w
The demonstrated Brahma Evo experience includes on-demand skill creation (code → test → debug → register), chat/voice and visual core, system monitor, 3D geospatial globe, ESP32 wiring schematic generation, desktop/screen/file/device automation, onboarding and provider settings. A provider-aggregation segment is promotional, not an architectural requirement. Reproduce capabilities using original LMC components, not the third-party application's code or branding.

## Architecture invariants
- LMC remains the persistent system of record and command center; JEV remains capability-aware router.
- Respect the latest approved local-only JARVIS reasoning transition on DGX Spark. No unapproved cloud fallback. Third-party model connections are optional, separately authorized integrations and must not silently handle JARVIS reasoning.
- LMC Platform owns database, orchestration, worker capabilities, audit logs, approval gates and verification receipts.
- Public GitHub Pages must contain no secrets, private telemetry, client records or privileged execution APIs.
- A worker may advertise a capability only after actual verification; unavailable capabilities leave jobs queued.
- Preserve other Codex account's working tree, uncommitted changes and active branches. Integrate through separate worktree and reviewed PR.

## Proposed modules

### 1. Skill Forge (priority 1)
Workflow:
1. Receive natural-language request; JEV checks registered capabilities.
2. If missing, offer **Propose Skill**; never generate/install automatically on mere task failure.
3. Create skill specification: inputs, outputs, dependencies, resource budget, permissions, acceptance tests and rollback plan.
4. Generate implementation in isolated worktree/sandbox with default network/filesystem restrictions.
5. Run static checks, dependency/license/security scans, unit tests, simulated integration tests and bounded performance tests. Capture logs and signed/traceable evidence.
6. On failure, permit bounded debug/retry cycles; halt on budget, repeated failure or unsafe permission requests.
7. Present diff, test evidence, security findings and proposed capabilities for human review.
8. After approval, deploy to a staging worker and run acceptance tests against the real advertised capability.
9. Only after staging verification and a separate promotion approval register the capability in JEV's capability registry; record version, owner, provenance, resource requirements, rollback reference and audit event.
10. Revoke or roll back immediately if health or verification regresses. No self-modification of approval, audit, sandbox or registry policies.

State machine: requested → specified → building → testing → needs_review → approved_for_staging → staging_verified → approved_for_promotion → registered; alternate states failed, rejected, revoked, rolled_back. All transitions logged and server-enforced.

Suggested contract (adapt to existing private API; do not assume these routes exist):
SkillProposal { id, task_id, specification, requested_permissions, resource_budget, source_commit, state, test_receipts[], reviewer_ids[], audit_ref }
RegisteredCapability { capability_id, version, worker_id, input_schema, output_schema, verified_at, verification_receipt, permissions, resource_requirements, rollback_ref }

### 2. Live operations monitor (priority 2)
Read-only authenticated CPU, memory, GPU, disk, job queues, worker availability and service health. Distinguish fresh telemetry, cached telemetry and unavailable metrics; never show invented percentages. Begin with existing monitoring APIs and no new privileged endpoint exposed to GitHub Pages.

### 3. Visual command interface (priority 3)
Adapt ops.html into a private authenticated application route with responsive orb/graph, task-to-agent flow, skill build timeline, approvals and project status. The public ops.html stays a non-operational preview. Developer sees diagnostics and approvals; client sees only authorized project progress.

### 4. Voice and conversational skill requests (priority 4)
Opt-in speech input/output and typed fallback. Require explicit confirmation before computer control, file modification, hardware commands or external communication. No always-on microphone by default.

### 5. Geospatial and hardware assistants (optional)
Interactive globe for authorized geospatial workflows with grounded routing data. ESP32/Arduino schematic generation as design assistance only: validate component pinouts, voltage, current and hardware-specific details before any physical action.

### 6. Existing connectors and desktop automation (optional)
Use current LMC/JEV connector inventory. Add integrations only with scoped credentials, explicit approval, audit logs and platform-specific adapters. Avoid installing the demonstrated Windows .exe on Spark/Mac or copying third-party source without code/license review.

## Phase gates
**Phase A — discovery:** Codex inspects current main, active worktrees, latest docs, private contracts and branch conflicts; produce architecture delta and dependency list.
**Phase B — non-invasive prototype:** skill proposal UI + simulated forge state machine + fixture-based tests, behind disabled-by-default feature flag.
**Phase C — sandbox:** isolated builder, test receipts, resource budgets, policy enforcement, staging-only registry.
**Phase D — verified private integration:** authenticated telemetry, worker capability registration and approval-controlled promotion.
**Phase E — optional UX:** voice, globe, hardware diagrams and approved connectors.

## Required acceptance tests
- Existing LMC/JEV/JARVIS behavior and current Codex work unaffected.
- Missing capability leaves original job queued, not falsely marked complete.
- Unapproved generated code cannot run on production workers or register a capability.
- Generated code cannot edit policy/approval/audit enforcement.
- No production secrets enter generated skill prompts, logs or public assets.
- Failed tests, stale telemetry, unavailable worker and resource exhaustion display accurately.
- Explicit approval and verifiable receipts required for staging and promotion.
- Rollback/revocation works and is auditable.
- Mobile developer/client role isolation verified.

## Codex handoff
Inspect this specification and PR in an isolated Git worktree. Report incompatibilities with the current private LMC Platform and Spark/JARVIS transition before implementation. Do not merge, deploy, modify production data, download unreviewed third-party executables or override current Codex changes without the owner's explicit approval.

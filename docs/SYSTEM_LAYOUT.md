# LMC + JEV System Layout

Live visual map: https://borngifted.github.io/lmc-command/system-layout.html

## Core flow

```text
LMC Command Center
        |
        v
Intent / Context
        |
        +-------------------+
        |                   |
        v                   v
      JEV               Claude
 fast decisions      deep reasoning
 routing             planning/coding
        |                   |
        +---------+---------+
                  |
                  v
          Execution Layer
      Claude Code / Codex / MCP
        / Local Tool Adapters
                  |
                  v
            LMC Platform
 API / DB / Orchestrator / Workers
                  |
        +---------+---------+
        |                   |
        v                   v
       LEO                SPARK
                  |
                  v
        Persistent Knowledge
  entities / decisions / vocabulary
       LightRAG + Obsidian target
```

## Current anti-context-loss strategy

The system is not designed to rely on model conversation memory alone.

- Persistent project/task/decision state lives outside the model.
- JEV routes by task/capability instead of having each agent improvise execution.
- Worker capabilities are detected rather than assumed.
- Architectural constraints are guarded at the database layer.
- Audit/job event history is append-only.
- Structural actions require the correct approval path.
- A canonical vocabulary now lives in `docs/THESAURUS.md`.

## Vocabulary

See [THESAURUS.md](./THESAURUS.md).

The ubiquitous-language pattern is additive to the existing architecture: it improves semantic consistency while the database, audit, permissions, routing and verification layers provide the operational guardrails.

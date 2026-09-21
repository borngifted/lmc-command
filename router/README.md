# LMC COMMAND router

Jev (TypeSafe's System One model) decides which agent gets a task; this script
then hands the task to **Claude Code** (`claude -p`) or **ChatGPT** (`codex exec`).
Jev only classifies — it is not a proxy, and no model traffic passes through it.

```
task ──► Jev: handler? complexity? destructive? ──► gate ──► claude  |  codex  |  hold for a person
```

## Setup (once per machine)

1. `cp router/.env.example router/.env`
2. Paste a Jev key from <https://console.typesafe.ai/keys> into `TYPESAFE_API_KEY=`.
   `router/.env` is gitignored. The board is a public static site, so the key
   must never go into `command.html` or any file that gets committed.
3. `claude` and `codex` must already be installed and signed in. No Anthropic or
   OpenAI API key is needed; both CLIs use their own logins.

Needs Node 20.12+ (no npm install, no dependencies).

## Use

```bash
node router/route.mjs --dry-run "Draft a follow-up email to the lighting vendor"   # decision only
node router/route.mjs "Fix the CSV import bug on the board"                         # decide, then dispatch
```

The decision line goes to stderr; with `--dry-run` or a held task the full Jev
answer prints as JSON on stdout.

## The gate

| Condition | Result |
|-----------|--------|
| `handler` confidence under `ROUTER_MIN_CONFIDENCE` (0.5) | use `ROUTER_FALLBACK` (default `ask` = hold) |
| `destructive` ≥ 0.5 — delete, overwrite, publish, send, spend | hold, exit code 3 |
| `complexity` above 1 of 2 | hold, exit code 3 |
| otherwise | dispatch to the chosen agent in `ROUTER_WORKDIR` (default: repo root) |

Held tasks are never sent to either agent — a person reads the decision first.
This follows the handoff principle: no destructive actions without a human.

## Tuning

The three questions live in `QUESTIONS` at the top of `route.mjs`. To add an
agent, add an option under `handler.criteria` and a matching entry in `HANDLERS`.
Paste the questions into the [Playground](https://console.typesafe.ai/playground)
to try wording changes before editing the script.

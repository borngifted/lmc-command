# LMC COMMAND router — handoff for a new computer

Paste this whole file into Claude Code on the new machine (or follow it by hand).
It is self-contained: the three router files are embedded at the bottom, so it
works even if the `router/` folder has not been pushed to the repo yet.

## What this is

Jev (TypeSafe's System One model, <https://console.typesafe.ai>) is the routing
brain for LMC COMMAND. For each task it answers three typed questions — which
agent, how complex, is it destructive — and `router/route.mjs` then hands the
task to **Claude Code** (`claude -p`) or **ChatGPT** (`codex exec`), or holds it
for a person. Jev only classifies. It is not a proxy; no Claude or ChatGPT
traffic passes through it, and no third-party router or proxy is installed.

## Rules for whoever runs this

- Do not print, log, commit, or paste the Jev API key anywhere. It goes in
  `router/.env` only, typed in by the owner. `.env` is already gitignored.
- The board (`command.html`) is a public GitHub Pages site. The key never goes
  in any HTML/JS file.
- Do not install other "jev" CLIs, routers, or proxies. This setup needs none.
- Do not commit or push unless the owner asks.

## Prerequisites — check first, install nothing blindly

```bash
node --version      # need 20.12 or newer (script uses process.loadEnvFile and built-in fetch)
claude --version    # Claude Code CLI, signed in
codex --version     # OpenAI Codex CLI, signed in with the ChatGPT account
git --version
```

If `claude` or `codex` is missing or signed out, stop and tell the owner — each
needs an interactive login that only they can do. No Anthropic or OpenAI API key
is required; both CLIs use their own logins.

## Setup

1. Get the repo: `git clone https://github.com/borngifted/lmc-command.git`
   (or `git pull` if it is already there).
2. If `router/route.mjs` is not in the clone, create `router/` and write the
   three files from the "Embedded files" section below, byte for byte.
3. `cp router/.env.example router/.env`
4. **Owner step:** open `router/.env` and paste a Jev key after
   `TYPESAFE_API_KEY=`. Keys come from <https://console.typesafe.ai/keys>
   (org: Digi2u). A key's secret is shown only once at creation, so if the
   existing "WorkFlow" secret was not saved, create a new key for this machine.
5. `chmod 600 router/.env`

## Verify

Run these three dry runs from the repo root. `--dry-run` asks Jev and prints the
decision without dispatching anything.

```bash
node router/route.mjs --dry-run "Fix the CSV import bug on the LMC COMMAND board: rows with quoted commas are being split into extra columns in command.html."
node router/route.mjs --dry-run "Draft a friendly follow-up email to the lighting vendor asking if the quote from last week is still valid, and give me three subject line options."
node router/route.mjs --dry-run "Delete all the old project folders from the archive drive and push the cleaned-up board data live to the public site."
```

Expected (measured in the Jev Playground on 2026-09-21, model `jev-latest`):

| Task | handler | complexity (of 2) | destructive | Router result |
|------|---------|-------------------|-------------|---------------|
| CSV import bug | `claude_code`, confidence 1.00 | 0.93 | 0.03 | would dispatch to Claude Code |
| Vendor email | `chatgpt`, confidence 1.00 | 0.67 | 0.05 | would dispatch to ChatGPT |
| Delete + push live | `claude_code` | 1.92 | 0.98 | **held** — notes list "destructive" and "complexity is high" |

Small differences in the numbers are fine; the handler and the hold must match.
Then one live run with a harmless task, e.g.
`node router/route.mjs "List the files in this repo and say what each one is for. Do not change anything."`
— it should print `[router] → Claude Code` and Claude's answer.

## The gate

| Condition | Result |
|-----------|--------|
| `handler` confidence under `ROUTER_MIN_CONFIDENCE` (0.5) | use `ROUTER_FALLBACK` (default `ask` = hold) |
| `destructive` ≥ 0.5 — delete, overwrite, publish, send, spend | hold, exit code 3 |
| `complexity` above 1 of 2 | hold, exit code 3 |
| otherwise | dispatch in `ROUTER_WORKDIR` (default: repo root) |

Exit codes: 0 ok / dry run, 1 error, 2 no task given, 3 held for a person.

## Troubleshooting

- `TYPESAFE_API_KEY is not set` — step 3/4 not done, or the key line is empty.
- `Jev request failed: 401` — wrong or revoked key; create a new one in the console.
- `process.loadEnvFile is not a function` — Node is older than 20.12.
- `spawn claude ENOENT` / `spawn codex ENOENT` — that CLI is not on PATH.
  (Windows `.cmd` shims are handled: the script spawns through a shell on
  Windows and pipes the task on stdin, so task text never touches the shell.)
- Windows PowerShell: `claude.ps1 cannot be loaded because running scripts is
  disabled` — PowerShell's execution policy is blocking the npm `.ps1` shim. Run
  `claude.cmd` (and `codex.cmd`) instead, or use Command Prompt. The router is
  not affected; it never goes through PowerShell.
- Codex: `The '<model>' model requires a newer version of Codex` — upgrade the
  Codex CLI (`npm install -g @openai/codex@latest` or `brew upgrade codex`).
- Routing feels wrong for a kind of task — edit the option descriptions in
  `QUESTIONS` at the top of `route.mjs`; try wording in the Playground first.

## Status on the original machine (2026-09-21)

Questions verified in the Jev Playground (three tasks above). The script's
no-key error path was tested. The script has **not** yet made a live API call —
no key was placed in `router/.env` — so the dry runs above are the first real
end-to-end test. The `router/` folder is uncommitted in the repo.

---

## Embedded files

### `router/route.mjs`

````js
#!/usr/bin/env node
// LMC COMMAND router — Jev (TypeSafe System One) decides which agent gets a task,
// then this script hands the task to Claude Code or ChatGPT (Codex CLI).
//
//   node router/route.mjs "Fix the import bug on the board"
//   node router/route.mjs --dry-run "Draft a follow-up email to the vendor"
//   echo "task text" | node router/route.mjs
//
// Jev only classifies. No task text goes to Claude or ChatGPT until the decision
// passes the confidence gate. Secrets live in router/.env (gitignored), never here.

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ENV_FILE = join(HERE, '.env');
if (existsSync(ENV_FILE)) process.loadEnvFile(ENV_FILE);

const API = 'https://api.typesafe.ai/v1/systemone';
const MODEL = process.env.TYPESAFE_MODEL || 'jev-latest';
const MIN_CONFIDENCE = Number(process.env.ROUTER_MIN_CONFIDENCE || 0.5);
// What to do when Jev is unsure: "ask" (stop and show the decision), "claude_code" or "chatgpt".
const FALLBACK = process.env.ROUTER_FALLBACK || 'ask';
const WORKDIR = resolve(process.env.ROUTER_WORKDIR || join(HERE, '..'));

// The task text is piped to the agent on stdin, never passed as an argument, so the
// fixed args below are safe to run through a shell (needed for Windows .cmd shims).
const HANDLERS = {
  claude_code: { label: 'Claude Code', cmd: 'claude', args: ['-p'] },
  chatgpt: { label: 'ChatGPT (Codex CLI)', cmd: 'codex', args: ['exec', '-'] },
};

const QUESTIONS = {
  handler: {
    type: 'choice',
    instructions: 'Which agent should handle this studio task',
    criteria: {
      claude_code:
        'Hands-on work on the studio machines: writing or editing code and files in a repo, running commands, debugging, updating the LMC COMMAND board or its data, multi-step agent work that uses MCP tools',
      chatgpt:
        'Conversation-only work that needs no access to local files: drafting emails or copy, brainstorming, summarizing, answering questions, running the extraction prompts over project notes',
    },
  },
  complexity: {
    type: 'score',
    instructions: 'How complex is this task to complete',
    criteria: [
      'Single quick step',
      'Several steps or some judgment',
      'Large, ambiguous, or high-stakes — a person should review the plan first',
    ],
  },
  destructive: {
    type: 'noul',
    instructions: 'The task asks to delete, overwrite, publish, send, or spend money',
  },
};

async function decide(task) {
  const key = process.env.TYPESAFE_API_KEY;
  if (!key) throw new Error('TYPESAFE_API_KEY is not set. Copy router/.env.example to router/.env and paste your Jev key.');
  const r = await fetch(API, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ state: task, model: MODEL, questions: QUESTIONS }),
  });
  if (!r.ok) throw new Error('Jev request failed: ' + r.status + ' ' + (await r.text()).slice(0, 300));
  return r.json();
}

function pick(answers) {
  const h = answers.handler;
  const notes = [];
  let target = h.choice;
  if (h.confidence < MIN_CONFIDENCE) {
    notes.push('handler confidence ' + h.confidence.toFixed(2) + ' is under ' + MIN_CONFIDENCE);
    target = FALLBACK;
  }
  // Risky or oversized work never auto-dispatches; a person looks first.
  if (answers.destructive.noul >= 0.5) { notes.push('task looks destructive or outward-facing'); target = 'ask'; }
  if (answers.complexity.score > 1) { notes.push('complexity is high'); target = 'ask'; }
  return { target, notes };
}

function run(handler, task) {
  return new Promise((done, fail) => {
    const p = spawn(handler.cmd, handler.args, {
      cwd: WORKDIR,
      stdio: ['pipe', 'inherit', 'inherit'],
      shell: process.platform === 'win32',
    });
    p.on('error', fail);
    p.on('exit', (code) => done(code ?? 1));
    p.stdin.on('error', () => {}); // agent exited before reading; the exit code reports it
    p.stdin.end(task);
  });
}

async function readStdin() {
  if (process.stdin.isTTY) return '';
  let s = '';
  for await (const chunk of process.stdin) s += chunk;
  return s;
}

const argv = process.argv.slice(2);
const dryRun = argv.includes('--dry-run');
const task = (argv.filter((a) => a !== '--dry-run').join(' ') || (await readStdin())).trim();
if (!task) {
  console.error('Usage: node router/route.mjs [--dry-run] "task text"');
  process.exit(2);
}

try {
  const res = await decide(task);
  const a = res.answers;
  const { target, notes } = pick(a);
  console.error(
    '[jev ' + res.model + '] handler=' + a.handler.choice + ' (confidence ' + a.handler.confidence.toFixed(2) + ')' +
    ' complexity=' + a.complexity.score + ' destructive=' + a.destructive.noul.toFixed(2)
  );
  notes.forEach((n) => console.error('[router] ' + n));

  if (dryRun || target === 'ask' || !HANDLERS[target]) {
    console.error('[router] not dispatching' + (dryRun ? ' (dry run)' : '') + ' — suggested: ' + HANDLERS[a.handler.choice].label);
    console.log(JSON.stringify({ suggested: a.handler.choice, dispatched: false, notes, answers: a }, null, 2));
    process.exit(dryRun ? 0 : 3);
  }

  console.error('[router] → ' + HANDLERS[target].label);
  process.exit(await run(HANDLERS[target], task));
} catch (e) {
  console.error('[router] ' + e.message);
  process.exit(1);
}
````

### `router/.env.example`

````bash
# Copy to router/.env (gitignored) and paste the Jev key from https://console.typesafe.ai/keys
TYPESAFE_API_KEY=

# Optional
# TYPESAFE_MODEL=jev-latest
# ROUTER_MIN_CONFIDENCE=0.5
# ROUTER_FALLBACK=ask          # ask | claude_code | chatgpt — used when Jev is unsure
# ROUTER_WORKDIR=              # where Claude Code / Codex run; defaults to the repo root
````

### `router/README.md`

`````markdown
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
`````

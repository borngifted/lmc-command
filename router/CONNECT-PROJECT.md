# LMC COMMAND router — connect an existing project

Paste this whole file into Claude Code running in the **existing project's**
folder (or follow it by hand). It assumes the router is already set up on this
machine per `router/HANDOFF.md`. On this machine that is:

```
C:\Users\KEMP\lmc-command\router\route.mjs
```

If the router lives somewhere else, substitute that path everywhere below.

## What this does

Nothing is copied into the project. The one router install (and its one Jev
key) stays in `lmc-command`. A project is "connected" by running that same
script with `ROUTER_WORKDIR` pointed at the project, so Claude Code (`claude -p`)
or ChatGPT (`codex exec`) runs **inside the project folder** instead of inside
`lmc-command`.

## First project: lmc-platform (checked 2026-09-21)

Project root on LEO: `C:\Users\KEMP\Documents\Leo_Marshall\lmc-platform`
(the working copy that is scp'd to the Spark; the running stack is on `lmcai`).

- **It is not a git repo** — no `.git` in it or in any parent. Claude Code
  dispatch works there; **Codex dispatch will fail** (exit 1) until the owner
  runs `git init`. Its `.gitignore` is already written for that first commit
  and already excludes `.env`, `worker/*.env` and `.admin-dev`. Do not
  `git init` without asking.
- The router runs agents **on LEO, in the working copy**. It does not reach the
  Spark. Anything on the Spark still follows that README's working rule:
  write file locally → scp → verify md5 → execute remote file.
- Keep routed permissions narrow. If the owner opts into step 4, allow `Edit`
  and `Write` only. Do **not** add `Bash`, `ssh`, `scp` or `docker` allow rules
  for routed runs: `docker compose down -v` and `scripts/reset-dev.sh` destroy
  data, and a non-interactive agent has nobody to confirm with. Deploys, resets
  and migrations stay with a person in an interactive session.
- That README points at `../lmc-command/docs/deployment/`. That is the sibling
  folder `Documents\Leo_Marshall\lmc-command` (docs only, not a git repo, no
  router). The router lives in `C:\Users\KEMP\lmc-command` — do not confuse them.
- Never route a task whose text contains a secret (admin password, worker
  token, JWT). Task text is sent to Jev, then to Claude or ChatGPT.

## Rules for whoever runs this

- Do not copy `route.mjs` or `router/.env` into the project. One install, one key.
- Do not open, print, or log `lmc-command/router/.env`. Check the key by length only.
- Do not edit `route.mjs` or set `ROUTER_WORKDIR` inside `router/.env` — that
  would repoint the router for every project. Set it per call, as below.
- Do not change the project's permissions (step 4) without asking the owner.
- Do not commit or push unless the owner asks.

## Prerequisites — check first, install nothing

Run from the project root. PowerShell:

```powershell
node --version                                                   # 20.12 or newer
Test-Path C:\Users\KEMP\lmc-command\router\route.mjs             # True
git rev-parse --is-inside-work-tree                              # true — Codex refuses a non-git folder
$l = Get-Content C:\Users\KEMP\lmc-command\router\.env | Where-Object { $_ -match '^TYPESAFE_API_KEY=' }
($l -replace '^TYPESAFE_API_KEY=','').Trim().Length              # above 0; never print the value
```

If the router or key is missing, stop — do `router/HANDOFF.md` first. If the
project is not a git repo, stop and tell the owner (`git init` is their call).

## Connect

1. **Dry run from the project root** — asks Jev, dispatches nothing:

   ```powershell
   $env:ROUTER_WORKDIR = (Get-Location).Path
   node C:\Users\KEMP\lmc-command\router\route.mjs --dry-run "Summarize what this project does from its README."
   ```

   macOS / Linux: `ROUTER_WORKDIR="$PWD" node ~/lmc-command/router/route.mjs --dry-run "..."`

2. **Live read-only run** — proves the agent lands in this project:

   ```powershell
   node C:\Users\KEMP\lmc-command\router\route.mjs "Run a shell command to print the current working directory and list the files in it, then report both. Read-only: do not edit, create, or delete any files."
   ```

   Expect `[router] → Claude Code` and the **project's** path in the answer. If
   it reports the `lmc-command` path, `ROUTER_WORKDIR` was not set in this shell.

3. **Optional wrapper — ask the owner first.** A `route.cmd` in the project root
   saves setting the variable each time (a `.cmd`, because PowerShell's execution
   policy blocks `.ps1` scripts on this machine):

   ```bat
   @echo off
   set "ROUTER_WORKDIR=%~dp0."
   node "C:\Users\KEMP\lmc-command\router\route.mjs" %*
   ```

   Use: `.\route.cmd --dry-run "task"` / `.\route.cmd "task"`. It holds no secret,
   but it hardcodes a machine path — add it to `.gitignore` unless the owner
   wants it committed. For task text containing `&`, `|`, `%` or `"`, skip the
   wrapper and pipe the task instead: `"task text" | node ...\route.mjs`.

4. **Owner decision — may routed tasks edit files?** As wired, both agents are
   effectively read-only (see below). To let routed Claude Code tasks edit files
   in *this project only*, create `.claude/settings.local.json` in the project:

   ```json
   { "permissions": { "allow": ["Edit", "Write"] } }
   ```

   `settings.local.json` is personal and should stay uncommitted. This does not
   allow shell commands beyond what the project already permits. The router's
   gate still holds anything Jev scores destructive or high-complexity.

## What a dispatched agent can do (verified on this machine, 2026-09-21)

| Agent | Runs as | Reads project | Edits project |
|-------|---------|---------------|---------------|
| Claude Code | `claude -p`, non-interactive | yes | **blocked** unless the project allows it (step 4) — it cannot prompt for permission |
| ChatGPT | `codex exec -`, `sandbox: read-only`, `approval: never` | yes | no — would need a change to `HANDLERS` in `route.mjs` |

- Codex in a folder that is not a git repo exits 1 with `Not inside a trusted
  directory and --skip-git-repo-check was not specified.`
- The dispatched Claude Code session loads the owner's global hooks and plugins.
  With the Remember plugin that creates a `.remember/` folder in the project —
  add it to the project's `.gitignore` if it shows up in `git status`.
- Node 24 prints a `DEP0190` deprecation warning on every dispatch. Harmless:
  the args are fixed and the task text goes over stdin.

## Routing notes for a new project

- Jev's handler "confidence" is the gap between the two options, so 0.5 needs
  roughly a 75/25 split. Tasks that sit between the two agents are held with
  exit code 3. Say what the task touches: "in this
  repo, run…", "edit `src/x.js` so that…", or "conversation only: draft…".
- "Read a file and report" used to be the weak spot, because the `chatgpt`
  option owns "summarizing". On 2026-09-21 "reading or inspecting local files"
  was added to the `claude_code` description in `QUESTIONS`. Measured before →
  after: "List the files in this repo and say what each one is for" 0.24 → 0.89;
  "read db/verify_guards.sql and list the 14 guard assertions" 0.17 → 0.97.
  Summarizing pasted text and brainstorming still go to `chatgpt` at 1.00. If
  the router predates that edit, `git pull` in `lmc-command` first.
- The `claude_code` description in `QUESTIONS` mentions the LMC COMMAND board by
  name. Generic repo work still routed correctly in testing (confidence
  0.96–1.00), so leave it unless this project's tasks keep landing wrong.
- Exit codes: 0 ok / dry run, 1 error, 2 no task given, 3 held for a person.

## Troubleshooting

- Agent answers about `lmc-command` instead of this project — `ROUTER_WORKDIR`
  is not set in the shell that ran `node`. It does not persist across terminals.
- `'route.cmd' is not recognized` — call it as `.\route.cmd`.
- `TYPESAFE_API_KEY is not set` / `Jev request failed: 401` — fix in
  `lmc-command/router/.env` per `router/HANDOFF.md`; nothing to fix in the project.
- Claude says an edit "was blocked because write permission hasn't been
  granted" — expected until the owner does step 4.

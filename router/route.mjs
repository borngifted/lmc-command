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

const HANDLERS = {
  claude_code: { label: 'Claude Code', cmd: 'claude', args: (task) => ['-p', task] },
  chatgpt: { label: 'ChatGPT (Codex CLI)', cmd: 'codex', args: (task) => ['exec', task] },
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
    const p = spawn(handler.cmd, handler.args(task), { cwd: WORKDIR, stdio: 'inherit' });
    p.on('error', fail);
    p.on('exit', (code) => done(code ?? 1));
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

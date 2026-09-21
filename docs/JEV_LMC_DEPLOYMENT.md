# LMC + JEV deployment

## Architecture

```
GitHub Pages (LMC UI)
        |
        | localhost request
        v
LMC JEV Bridge (studio Mac)
        |
        +--> jev pick        -> Claude vs OpenAI decision
        |
        +--> jev-claude -p   -> Claude Code + per-turn JEV model routing
        |
        +--> jev-codex exec  -> OpenAI Codex + per-turn JEV model routing
```

The public site never receives JEV, Anthropic, OpenAI, or GitHub credentials.

## 1. Pull the current LMC build

```bash
git clone https://github.com/borngifted/lmc-command.git
cd lmc-command
git pull
```

## 2. Verify JEV and both CLIs

```bash
cd bridge
npm run doctor
```

Expected core commands:

```bash
jev --version
jev-claude --help
jev-codex --help
claude --version
codex --version
```

JEV Router currently supports Claude Code and OpenAI Codex while preserving their existing CLI authentication and tool behavior.

## 3. Configure the bridge

Do not put secrets in the repository.

```bash
export LMC_WORKSPACE="$HOME/path/to/lmc-command"
export LMC_ALLOWED_ORIGIN="https://borngifted.github.io"
export LMC_JEV_PORT=4317
```

JEV Router reads its own key from the existing JEV configuration/environment. Keep that outside this repo.

## 4. Start

```bash
cd bridge
npm start
```

Then open:

https://borngifted.github.io/lmc-command/jev.html

The status dot should turn green.

## 5. Test

Route only:

- "Write a launch caption for the new studio." -> OpenAI
- "Inspect command.html and fix a JavaScript bug." -> Claude

Execution:

- Select **Auto · JEV decides**
- Submit the task
- Confirm the selected agent shown above the result

## 6. Login startup on macOS

For a simple first deployment, use a LaunchAgent or another process supervisor to run the bridge after login. Keep `LMC_WORKSPACE` and secrets in the local environment/keychain rather than the public repo.

## Security

- Bridge binds to `127.0.0.1` by default.
- No shell interpolation is used; commands are spawned with argument arrays.
- Only approved origins receive CORS permission.
- No secret endpoint exists.
- Repository changes still follow Claude Code/Codex permissions.
- Do not bind the bridge to `0.0.0.0` unless an authenticated LAN gateway is added first.

## Browser note

The JEV page is a static control surface. Actual execution remains local. If a browser blocks HTTPS-to-loopback requests in your environment, use the existing browser-extension bridge or serve the LMC UI locally; do not expose this bridge publicly just to bypass browser policy.


## Board + Idea Inbox integration

The Task Board and Idea Inbox are now the primary JEV control surface.

### Task flow

```
Task row
  -> Send to AI
  -> POST http://127.0.0.1:4317/execute
  -> JEV chooses Claude or OpenAI
  -> jev-claude / jev-codex executes
  -> result is written back into that task's override
  -> AI activity entry is appended to data/board.json
```

Each task stores the latest execution fields:

- `ai_last_at`
- `ai_last_agent`
- `ai_last_output`
- `ai_last_status`

The UI renders the latest result directly below the task.

### Idea flow

Idea Inbox items have the same **Send to AI** control. JEV receives the idea type,
owner, related project, urgency and notes, then routes it to the appropriate
executor. The result is rendered directly below the idea and recorded in the same
activity ledger.

### Activity ledger

Shared signed-in executions append records to:

```
data/board.json -> ai_activity[]
```

Each activity record contains:

- timestamp
- board user
- task/idea type
- stable item key
- human-readable label
- selected agent
- completion/failure status
- bounded output excerpt

The existing **Import / export -> Recent changes** section displays the latest AI
activity before the normal board change log.

Signed-out executions stay local to that browser in `lmc_command_v2` localStorage
until the user signs in. The actual AI credentials never enter browser storage.

### Required runtime

The board can be hosted on GitHub Pages, but execution requires the local bridge:

```bash
cd /path/to/lmc-command/bridge
export LMC_WORKSPACE="/path/to/lmc-command"
npm run doctor
npm start
```

Keep that terminal/process running while using **Send to AI**.

### Troubleshooting

**Button says JEV routing and then fails**

1. Open `http://127.0.0.1:4317/health` locally.
2. Run `npm run doctor` in `bridge/`.
3. Verify `jev`, `jev-claude`, `jev-codex`, `claude`, and `codex` are on PATH.
4. Verify the configured JEV key/environment is available to the bridge process.
5. Verify `LMC_WORKSPACE` points at the actual LMC checkout.

**Result appears locally but not for the team**

Sign in to the LMC board with a write-enabled account. Shared AI results and
activity are stored through the same GitHub-backed `data/board.json` mechanism
as normal task status changes.

**Browser cannot reach localhost**

Use the existing browser-extension/local bridge path or serve LMC locally. Do not
make the JEV execution bridge public just to work around browser security policy.

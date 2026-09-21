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

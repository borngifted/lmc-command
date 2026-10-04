Phase A review is complete. Development is isolated on feat/skill-forge-phase-b, based on current main. PR #5 remains documentation-only.

Phase B will provide a disabled-by-default proposal UI, simulated lifecycle, review gates, traceable fixture receipts, and automated tests. The proposed production integrations require additional contracts and compatibility review; this prototype will not implement or call them.

All data and identities will be synthetic and explicitly labelled. It will not execute generated code, change existing jobs, register real capabilities, invoke cloud reasoning, modify running services, merge, or deploy. A separate draft implementation PR will include test evidence and remaining limitations. Phase C remains gated on compatibility review.

## Phase B implementation and validation

The separate `skill-forge/` prototype implements requested, specified, building, testing, needs_review, approved_for_staging, staging_verified, approved_for_promotion, registered, failed, rejected, revoked and rolled_back states. Every transition is server-enforced and recorded in a hash-linked in-memory audit. Hash linking provides traceability inside this fixture; it is not a production signature or durable tamper-proof store.

Specifications freeze inputs, outputs, dependencies, allowed permissions, acceptance criteria, rollback and bounded retry/resource budgets. Independent review, fresh version-bound evidence and separate promotion approval are required. Unavailable/stale workers block verification, and simulated health regression revokes a simulated registration. Original fixture jobs remain queued. Clients see only assigned fixture project summaries, never specification, review or audit details.

No code generation, execution, dependency installation, model calls, production credentials, platform mutations or registry writes occur. Build/test receipts and resource units are simulations. State and sessions are ephemeral. Runtime-generated fixture keys establish developer, reviewer or client test sessions; they are not real account authentication. This is Phase B, not a production sandbox or client deployment.

### Run locally

Requires Node 24; no package installation for the server:

```powershell
$env:SKILL_FORGE_SIMULATION='1'
node skill-forge/server.mjs
```

The server prints its loopback URL and three temporary fixture keys. Connect as builder, propose a skill, freeze its specification, simulate build and tests, then sign out and connect as reviewer for staging and promotion approvals. Client is a separate read-only fixture. Omit the feature flag to return 404 for every route. Stop only this server to roll back the local prototype; its ephemeral state disappears. No other service or project needs restoration.

### Tests

- `node --test skill-forge/engine.test.mjs`: 10 passing tests.
- `node skill-forge/browser.test.mjs`: 12 passing HTTP/browser checks. Set `PLAYWRIGHT_MODULE` to an existing Playwright installation and `OPS_BROWSER_CHANNEL=msedge` to use installed Edge.
- Desktop 1440 × 1000 and mobile 390 × 844 screenshots visually reviewed; no horizontal overflow or browser errors.
- Browser requests stayed on the fixture origin; existing application files remain unchanged except the proposed Pages exclusion rule.
- Evidence: `skill-forge/evidence/results.json`, `developer.png`, `client-mobile.png`. Entire prototype excluded from Pages via `_config.yml`.

The owner additionally authorized local launch. No production merge or deployment has occurred. Phase C remains pending compatibility review and an approved builder isolation design; its execution and production integration acceptance criteria are intentionally not claimed complete.

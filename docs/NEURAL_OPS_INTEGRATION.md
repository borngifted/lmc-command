# Neural Operations compatibility and rollback

Deployment authorized by the owner on October 3, 2026. Public preview publication is authorized; private client access remains gated on an approved HTTPS host and live account validation. Tests are recorded in UTC.

## Scope and evidence

PR #1, head `abff379e2e1f38e48e2e8ae655a066fcfa1e564c`, was reviewed in the isolated `integration/neural-ops-safe` worktree. The existing development branches and their uncommitted work were preserved. This branch descends from the PR; its main base was already current when fetched.

The neon panels, responsive shell, project cards and topology styling originate in `ops.html`. The topology now explicitly describes interface relationships, not live service health. The adapter implements actual platform GET contracts; the evidence uses a simulated HTTP platform, not live infrastructure. This is an integration candidate, not a client launch readiness claim.

## Outdated or unsafe assumptions corrected

| Proposed interface | Integrated behavior |
| --- | --- |
| Public browser probes a configurable loopback bridge | Public preview makes no telemetry requests. Private adapter requires an explicit server feature flag and fixed upstream origin. |
| Claude/Codex route selectors and unauthenticated execution | No execution endpoint; all mutations except session establishment/logout rejected. Spark-only policy retained. |
| Unmeasured project completion percentages | Removed; authenticated project status and recorded job-state counts replace them. |
| Animated connections imply activity | Static conceptual relationships; no implication of running work. |
| Hardware inventory and dated service claims mixed with live data | No private inventory in static markup. Staff-only registered capabilities include heartbeat timestamps and no readiness assertion. |
| Public knowledge feed treated as runtime activity | Removed from telemetry. Historical job records, live retrieval time, and simulated fixtures are separately labelled. |
| Role chosen in browser | Role read from `/auth/me` on every telemetry request. Client projections exclude workers and internal project fields. |

## Compatibility

The adapter calls only `/auth/me`, `/projects`, `/jobs`, and, for staff, `/workers` with the existing user bearer token. These match the private FastAPI source inspected for this change. The platform validates active account status, current database role and project membership. The adapter additionally intersects job project IDs with the authorized project list and projects fields explicitly; storage roots, addresses, raw job results and errors never reach clients.

ADMIN, PROJECT_MANAGER and INTERNAL_CREATIVE receive the developer inventory. Other authenticated roles receive the client projection and whatever projects the platform grants them. There is no browser role switch. No shared telemetry cache or cross-user state is used. A token is held in gateway memory with a 15-minute deadline and an opaque HttpOnly, SameSite=Strict cookie; HTTPS origins add Secure. Tokens are not logged or persisted. Session requests require an exact matching Origin, JSON content type, and bounded body; upstream redirects are rejected. No CORS access is granted. Upstream failures clear browser data and never invoke another provider.

Task Board and Idea Inbox remain in the unchanged existing board. Existing routing, audits, project data, workers, JARVIS, JEV, ComfyUI, LightRAG and Obsidian code is untouched. This gateway has no database dependency and sends only GET upstream requests. It does not replace the existing workflow or infer model availability from a capability registration. Existing application regression testing is limited to unchanged-file verification; the production application and running jobs were not exercised or restarted.

## Testing and screenshots

Run with Node 24 and Playwright available through `PLAYWRIGHT_MODULE`; set `OPS_BROWSER_CHANNEL=msedge` to use installed Edge. Execute `node private-ops/verify.mjs` from the repository root. It starts and closes isolated ephemeral loopback servers and uses a fresh headless browser profile. No real credentials are used.

- [Machine-readable results](neural-ops-evidence/results.json)
- [Developer desktop, 1440 × 1000](neural-ops-evidence/developer.png)
- [Client mobile, 390 × 844](neural-ops-evidence/client.png)

Checks cover default-off flag, anonymous access, cross-origin session rejection, HttpOnly cookies, membership filtering, client field minimization, staff inventory, execution rejection, account revocation, upstream failure, read-only upstream calls, browser errors, overflow, logout clearing and zero public private-network probes. Screenshots use conspicuous simulated labels and fictitious projects. Both screenshots were visually inspected.

## Private evaluation after approval

The public Pages experience stays disconnected. `_config.yml` excludes the adapter, tests and screenshot evidence from the normal Jekyll Pages artifact. Any future custom Pages build must preserve those exclusions. Do not upload the whole source tree through a custom static artifact job.

For an approved private evaluation, use a dedicated loopback port and set `OPS_ENABLED=1`, `OPS_PLATFORM_ORIGIN` to the private API origin, and `OPS_ORIGIN` to the exact browser origin; optionally set `OPS_PORT` (default 8391). Run `node private-ops/server.mjs`. The service binds loopback only. An existing platform token can establish the evaluation session; never paste tokens into public pages. The private gateway serves only its UI and telemetry, not the old public board or routing pages.

Before any client deployment: integrate the session into the approved private sign-in flow rather than manual token entry, configure private HTTPS access, confirm Pages artifact exclusions in the actual deployment build, and run real staff/client isolation and revocation tests using approved test accounts. Verify actual telemetry against the platform and assess the existing application's own security gates. These remain unverified; no production connection or deployment occurred here. This UI cannot certify Spark reasoning readiness, Vantage tour readiness, or a Monday launch.

## Rollback

Before deployment, rollback means leaving this isolated branch unmerged: nothing running has changed. During an approved private evaluation, stop only its dedicated gateway process or unset `OPS_ENABLED` and restart that gateway; its in-memory sessions disappear. Do not stop the platform or workers. Restore the prior static artifact if a public preview was separately approved and published. There are no migrations, database writes, credential changes, or model changes to reverse. Never reset the original development checkouts.

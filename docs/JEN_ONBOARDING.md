# LMC COMMAND — Jen's onboarding

**For:** Jen (LMC Operations · developer on the build)
**From:** Work Official LLC (owner / admin of the system)
**Board:** https://borngifted.github.io/lmc-command/command.html
**Guide:** the **Guide** tab on the board — Gemini walks you through all of this live.

You have remote access from anywhere: phone, laptop, studio. Sign in once per
device and everything you do is shared with the team and kept in the repo history.

---

## 1. Get access (5 minutes, once)

1. **GitHub account.** If you don't have one: https://github.com/signup (free).
2. **Send Work Official your GitHub username.** We add you as a collaborator on
   `borngifted/lmc-command` (write access to this one repo, nothing else). You'll
   get an invitation email from GitHub — accept it.
3. **Make your sign-in token.** Go to
   https://github.com/settings/personal-access-tokens/new and set:
   - Token name: **LMC COMMAND**
   - Expiration: **1 year**
   - Repository access: **Only select repositories → lmc-command**
   - Permissions → Repository permissions → **Contents: Read and write**
   - Generate token → **copy it** (you only see it once).
4. **Sign in on the board.** Open the board → **Account** tab → paste the token →
   Sign in. You'll see your name and a *Team · can edit* badge.
5. **Say who you are.** Same tab → *Who are you on the board?* → **Jen**. That
   powers "My tasks" and sets you as the default owner on captures.

The token lives only in that browser. Repeat steps 3–5 on your phone.
Lost or leaked token? Delete it at https://github.com/settings/personal-access-tokens
and make a new one. Work Official can revoke your access at any time from
Account → Owner tools.

## 2. The board in one minute

| Tab | What it's for |
|-----|---------------|
| **Tasks & projects** | Every project and task, grouped by project. Filter by owner / project / category / status, or hit **My tasks**. Tick to complete, change status from the dropdown, add a task at the top. The stat tiles are filters too. |
| **Idea inbox** | The 1 a.m. brain. One field, ⌘/Ctrl+Enter, done. Later: triage each capture into a project, or mark it done. Export as `lmc_ideas_followups.csv` any time. |
| **Import / export** | Drop the extraction files here. Signed in, they're committed to `data/seed/` for everyone. The *Recent changes* log shows who did what. |
| **Guide** | Gemini, pre-loaded with this doc, the handoff, and the live board state. |
| **Account** | Sign in / out, who you are, owner tools. |

Signed out, the board still works — changes stay on that device and sync the
moment you sign in.

## 3. Your first job — the seed files

1. Open `docs/EXTRACTION_PROMPTS.md`.
2. In the shared ChatGPT thread that holds Leo's project files, paste **prompt 0**,
   then **1 through 7**, one at a time. Save each output under the filename the
   prompt names.
3. Drop **`lmc_projects_tasks.csv`** and **`lmc_ideas_followups.csv`** into
   Import / export on the board (signed in). They replace the placeholder seed rows
   and the board fills with the real projects.
4. Send the rest (`lmc_gear_notes.md`, `lmc_subscriptions.csv`,
   `lmc_contacts.csv`, `lmc_studio.md`, `lmc_ecosystem_summary.md`) to Work
   Official — those seed the Gear, Subscription, Contacts and Studio modules.

Updated files later? Drop them again. Same filename replaces the seed; the
board's own changes (status, captures, added tasks) are kept.

## 4. Still on the list from LMC

- Logo / brand assets — Leo
- PeerSpace front-studio layout link + remodel notes — Jen
- The seven extraction files — Jen
- Cheqroom export — Jen
- Subscription pull — Kemp

## 5. Using Gemini as your guide

**On the board:** Guide tab → paste a Gemini API key from
https://aistudio.google.com/apikey (free tier is fine; stored only in your
browser) → ask anything. It knows your role, the sign-in steps, the extraction
prompts and what's currently open on the board.

**In the Gemini app instead:** Guide tab → *Copy the guide prompt* → paste into
https://gemini.google.com/app. Or make it a permanent **Gem** using
`docs/GEMINI_GUIDE_GEM.md`.

## 6. How the pieces fit

```
Leo's project docs ──ChatGPT thread──▶ seed CSV/MD files ──Import──▶ board
                                                                      │
   Work Official (owner/admin) ◀── repo: data/seed/*.csv + data/board.json ──▶ Jen, Leo, Kemp
                                        every change = one commit, reversible
```

Owned, not rented: the data is CSV and JSON in a repo LMC can take anywhere.

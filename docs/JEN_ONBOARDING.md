# LMC COMMAND — Jen's onboarding

**For:** Jen (LMC Operations · developer on the build)
**From:** Work Official LLC (owner / admin of the system)
**Board:** https://borngifted.github.io/lmc-command/command.html
**Guide:** the **Guide** tab on the board — Gemini walks you through all of this live.

You have remote access from anywhere: phone, laptop, studio. Sign in once per
device and everything you do is shared with the team and kept in the repo history.

---

## 1. Sign in (1 minute)

1. Open the board → **Account** tab.
2. Enter the **username and password** Work Official sent you. No GitHub account,
   no app to install. Tick *Keep me signed in* on your own devices.
3. Under *Who are you on the board?* pick **Jen**. That powers "My tasks" and sets
   you as the default owner on captures.
4. Change your temporary password in the same tab.

Forgot it? Work Official resets it from the owner panel in seconds. Sign out on a
device you don't own.

## 2. The board in one minute

| Tab | What it's for |
|-----|---------------|
| **Tasks & projects** | Every project and task, grouped by project. Filter by owner / project / category / status, or hit **My tasks**. Tick to complete, change status from the dropdown, add a task at the top. The stat tiles are filters too. |
| **Idea inbox** | The 1 a.m. brain. One field, ⌘/Ctrl+Enter, done. Later: triage each capture into a project, or mark it done. Export as `lmc_ideas_followups.csv` any time. |
| **Import / export** | Drop the extraction files here. Signed in, they're committed to `data/seed/` for everyone. The *Recent changes* log shows who did what. |
| **Guide** | Gemini, pre-loaded with this doc, the handoff, and the live board state. |
| **Account** | Sign in / out, who you are, change password. Owner: team accounts. |

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

**How sign-in works under the hood (for the developer in you):** accounts live in
`data/users.json`. Each entry holds the board's write token encrypted (AES-GCM)
under a key derived from that person's password (PBKDF2, 600k rounds). Signing in
derives the key in your browser and unlocks the token; a wrong password simply
fails to decrypt. Nothing in the file is usable without the password, so pick a
real one — 10+ characters. The owner can rotate the token to cut everyone off at once.

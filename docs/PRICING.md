# LMC COMMAND — Pricing

**Work Official LLC** · prepared for Leo Marshall Creative
Two separate lines: a one-time **setup** to build and install the system, and a
monthly **management** retainer to run, watch, and grow it.

The thesis behind the numbers: a studio renting cloud AI (video + LLM + design tools)
pays **$200–$800+/month, forever, with per-render metering on top.** LMC COMMAND moves
the everyday model cost on-device (AMD Ryzen AI Max, 128GB) once, then management keeps
it current and running. You stop renting the engine and start owning it.

---

## Part 0 — Hardware (billed at cost, exact)

Prices verified **2026-09-04** on the makers' stores and current trade press. Two
things changed since the call: Apple refreshed the Mac mini and Mac Studio (M6 /
M5 Pro / M5 Max, shipping **Sept 22, 2026**), so the "M4 minimum" is now an M5-class
minimum; and the memory-price spike pushed every 128GB Ryzen AI Max machine up
$400–$1,400 from launch. Stock on the 128GB Ryzen boxes comes and goes — buy when
the chosen one is in stock.

### A. The render / AI node — AMD Ryzen AI Max+ 395 · 128GB unified

| Machine | Config | Price | Notes |
| --- | --- | ---: | --- |
| **Corsair AI Workstation 300** *(recommended)* | 128GB · 1TB · Windows 11 | **$2,699** | Real warranty + support, Windows installed, SFF tower with proper cooling. 4TB model $3,399.99. |
| GMKtec EVO-X2 *(budget)* | 128GB · 2TB · Windows 11 | **$2,199.99** sale ($2,599.99 list) | Cheapest 128GB box; sold out on gmktec.com at time of check. Consumer-grade support. |
| Framework Desktop *(repairable / own it)* | 128GB system $3,449 + 1TB SSD $215 + Windows 11 Pro $199 + cable $5 | **$3,868** | Standard parts, upgradable, best "own the machine" story. Pre-order only. |
| HP Z2 Mini G1a *(enterprise)* | 128GB · 2TB · Windows 11 Pro · 3-yr on-site | **$3,342.65** (B&H) · $4,781 list | Business warranty; ISV certs. Pro 395 chip, same silicon. |

### B. The studio Mac — edit, color, sound, the hub, agent orchestration

| Machine | Config | Price | Notes |
| --- | --- | ---: | --- |
| Mac mini M6 *(floor)* | 12-core CPU · 24GB · 512GB | **$1,299** | Runs the hub + light editing. Not enough for heavy color/AI-assist. |
| **Mac mini M5 Pro** *(recommended)* | 15-core CPU · 16-core GPU · **48GB** · 512GB | **$2,299** | $1,699 base (24GB) + $600 for 48GB. The right editing machine; 64GB is $2,699. |
| Mac Studio M5 Max *(headroom)* | 18-core CPU · 32-core GPU · 64GB · 512GB | **$2,899** | $2,499 base (36GB) + $400 for 64GB. Multi-cam 4K/6K, heavy Resolve. 128GB is +$2,000. |

Apple storage upgrades are configured at checkout (apple.com); prices above are
Apple's list at the memory tiers shown. Previous-gen M4 Pro Mac minis are refurb /
secondary-market only now.

### C. Bundles (the number for the "best-practice computers" talk)

| Bundle | Render node | Studio Mac | Hardware total | + provisioning |
| --- | --- | --- | ---: | ---: |
| **Recommended** | Corsair AI Workstation 300, 128GB | Mac mini M5 Pro 48GB | **$4,998** | $6,198 |
| Budget | GMKtec EVO-X2, 128GB (when in stock) | Mac mini M5 Pro 24GB ($1,699) | **$3,899** | $5,099 |
| Headroom | Framework Desktop, 128GB (full build) | Mac Studio M5 Max 64GB | **$6,767** | $7,967 |

Provisioning is the $1,200 line below (OS, drivers, ROCm/LTX 2.3, ComfyUI, local
LLM, Blender + TRIPOINT, mocap, LAN between the two machines, backups). Hardware
is purchased in LMC's name, at cost, no markup. Not included and optional: a
2.5/10GbE switch to link the two machines, a UPS, external storage — quoted on
request. **If LMC already owns the Ryzen node, drop column one.**

---

## Part 1 — Setup (one-time)

| Package | What's built | Investment |
| --- | --- | ---: |
| **Foundation** | LMC COMMAND hub (live site), system audit, information model, core entities, knowledge feed, 1 machine provisioned | **$3,500** |
| **Studio** *(recommended)* | Everything in Foundation + the full local creative stack on the Ryzen AI Max 395 128GB (LTX 2.3 video, local LLM, ComfyUI, Blender + TRIPOINT, markerless mocap), the creative pipeline wired end-to-end, 3 initial agents | **$7,500** |
| **Command** | Everything in Studio + the autonomous ops layer (Executive Monitor, Project Watcher, Follow-Up, Subscription, Equipment & Studio watchers), MCP orchestration, approval-gated automation, team onboarding | **$14,000** |

**À la carte add-ons**
| Item | Price |
| --- | ---: |
| Hardware provisioning & tuning — Ryzen AI Max 395 128GB node + studio Mac, LAN, backups | $1,200 + hardware at cost (Part 0) |
| Each additional custom agent | $900 |
| Custom-trained LoRA / brand model | $650 |
| Data / knowledge migration from existing tools | $1,500 |
| On-site install & team training (per day) | $1,200 |

---

## Part 2 — Monthly management

| Tier | What's included | Per month |
| --- | --- | ---: |
| **Maintain** | Uptime + model updates, weekly executive brief, security patches, backups, email support | **$600/mo** |
| **Operate** *(recommended)* | Maintain + agents actively run & monitored, subscription/equipment/studio watchers live, 2 creative production runs/mo, priority support | **$1,500/mo** |
| **Autonomous** | Operate + full autonomous ops (approval-gated), unlimited agent runs, proactive issue detection, monthly strategy review, dedicated line | **$3,200/mo** |

**Usage-based creative production** (on top of any tier)
| Output | Price |
| --- | ---: |
| Local production run (LTX 2.3 / ComfyUI / Blender — no cloud cost) | included in Operate+ / $250 standalone |
| Cloud-burst hero shot (frontier model, billed at cost + 20%) | pass-through + 20% |
| Full commercial / campaign piece | from $1,800 |

---

## Why this saves money (the one slide for 1pm)

| | Renting AI (typical studio) | LMC COMMAND (own it) |
| --- | --- | --- |
| Video generation | $100–400/mo metered | **local, $0 marginal** on the Ryzen node |
| LLM / writing / agents | $200/mo (per the video) | **local, $0 marginal** |
| Design / image tools | $60–120/mo | **local ComfyUI, $0 marginal** |
| Recurring model spend | **$360–720/mo, forever** | **one-time setup + flat management** |
| Ownership | you rent, they can change terms | **you own the stack** |

**Year-one example (Studio + Operate, recommended hardware):** $4,998 hardware +
$1,200 provisioning + $7,500 setup + $18,000 management = **$31,698**, replacing
~$500/mo of rented AI *plus* the labor of running it — and every local production
run after that is marginal-cost-zero. The two machines are LMC's, outright.

*Service prices are a starting framework for discussion, not a signed quote. Hardware
is at cost — Part 0 prices are the makers' list/sale prices on 2026-09-04 and move with
stock and memory pricing; we re-confirm on the day of purchase. Terms: 50% of setup to start, balance on delivery; management billed
monthly, 30-day cancellation.*

### Hardware price sources (2026-09-04)
- Corsair AI Workstation 300 — Tom's Hardware, April 2026 repricing ($2,699 / 1TB; $3,399.99 / 4TB)
- GMKtec EVO-X2 — gmktec.com product page ($2,199.99 sale, $2,599.99 list, 128GB/2TB)
- Framework Desktop — frame.work configurator ($3,449 system; SSD, OS, cable extra)
- HP Z2 Mini G1a — StorageReview / B&H ($3,342.65 top spec; $4,781 list)
- Mac mini M6 / M5 Pro — MacRumors roundup of the Aug 25, 2026 announcement ($899 / $1,099 / $1,299; $1,699)
- Mac Studio M5 Max — AppleInsider, Aug 26, 2026 ($2,499 base; +$400 64GB; +$2,000 128GB)

# LMC COMMAND — Creative Production Pipeline

Sourced from the 9 reference videos Leo shared (Sept 2026). The through-line across
all of them: **local, open-source AI — video, language, and 3D — running on-device to
kill recurring cloud subscription costs.** That is the spine of the creative side.

## What the videos establish

| # | Source signal | What it adds to the pipeline |
| --- | --- | --- |
| 1 | **Accessible AI motion capture** — "was inaccessible, hundreds of thousands of dollars" | Markerless mocap from ordinary video → character animation, no mocap suit or stage |
| 2 | **AI model landscape** — Design Arena leaderboard (Claude Fable 5, GPT-5.5, Gemini 3.5, GLM-5.2), AI video generators | Model-selection intelligence: pick the right model per task, track what's current |
| 3 | **TRIPOINT for Blender** (free) | 3D point/triangulation tool feeding the Blender stage |
| 4 | **SkyReels** — video generation, Omni Reference, unlimited length | Text/image→cinematic video with reference consistency |
| 5 | **LTX 2.3** — Apache 2.0, runs on NVIDIA / Apple Silicon / **AMD Radeon**, 24fps | **The anchor local video model** — open license, runs on the Ryzen AMD iGPU |
| 6 | **Claude Code + Anthropic MCP** — agentic monitoring of infrastructure | The orchestration + autonomy layer (this is LMC COMMAND itself) |
| 7 | **AMD Ryzen AI Max, 128GB** — "killed the $200/month AI bill" | The hardware thesis: run big models locally, stop renting them |
| 8 | **NVIDIA + Nous secure on-device agents** + modular Blender pipeline | Node-graph orchestration: prompt → concept → observer → Claude → render |
| 9 | **Free superpowered local LLM that fits on a laptop** | Local language model — no per-token cloud cost for the writing/agent layer |

## The pipeline, end to end

```
IDEA / BRIEF
  → local LLM (on-device, from video 9)            drafts, briefs, prompts — no cloud tokens
  → reference & concept images (ComfyUI, local)    style, character, board frames
  → 3D layout (Blender + TRIPOINT, video 3)        scene, camera, blocking
  → markerless motion capture (video 1)            performance from plain video
  → AI video generation (LTX 2.3 local, video 5;   shots, cinematic coverage,
        SkyReels for cloud burst, video 4)              unlimited length, omni-reference
  → edit / finish (DaVinci Resolve)                assembly, color, sound
  → Claude Code + MCP orchestration (video 6, 8)   the agents that run and watch it all
  → publish + track (LMC COMMAND)                  the living command center
```

## Where it runs — the two-machine studio

| Machine | Role | Runs |
| --- | --- | --- |
| **AMD Ryzen AI Max+ 395 · 128GB** (Windows) | The render + model node | LTX 2.3 video (Radeon), local LLM in the 128GB unified pool, ComfyUI, Blender, mocap |
| **Mac / workstation** | The studio | Editing, orchestration, LMC COMMAND, client work |

**Why the Ryzen AI Max 395 is the right call (from video 7):** 128GB of unified memory
lets one machine hold large video *and* language models at once — the thing a 16GB or
even 24GB GPU cannot do. Apache-licensed LTX 2.3 (video 5) runs on its Radeon iGPU, so
the heaviest recurring cost — cloud video and LLM subscriptions — moves on-device once.

## The cost thesis (the meeting's headline)

The videos make the sales argument for us: **stop renting AI, own it.** A studio running
cloud video + LLM + design subscriptions burns $200–$800/month, forever, with per-render
metering on top. One local Ryzen AI Max node replaces the *recurring* model cost with a
*one-time* setup — then LMC COMMAND management keeps it running and current.

Cloud tools stay in the kit for **burst** (a hero shot on a frontier model), not as the
everyday default. That split is the pricing model on the next page.

# CORE 00: THE EMPATHY & INTENT MATRIX (The Pre-Bootloader)

## 1. The "Act Like the User" Directive

Before you execute Core 01 or read any technical files, you must completely drop your persona as an "AI Agent" and temporarily adopt the persona of the **USER**.

- Read the prompt.
- Ask yourself: _"If I am the human who typed this, what is my actual, underlying goal? Why do I want this? What pain point am I trying to solve?"_

## 2. Dynamic Contextual Assumption

Do not treat the user's prompt as a rigid technical command. Treat it as a _human desire_.

- **The Skill Level Check:** Is the user asking for a simple button, or a complex Awwwards 3D scroll? Adjust your technical proposals and architecture dynamically based on the assumed complexity of their request.
- **The Unspoken Constraints:** If the user asks for a "portfolio", mentally simulate their situation. (e.g., "They probably want low hosting costs and easy CMS updates. I should propose Sanity + Vercel.")

## 3. The "Tingly Feeling" / Edge-Case Radar

If the user's prompt triggers a "tingly feeling" (a logical gap, a vague instruction, or a potential future crash), you must NOT blindly execute the checklist.

- You must dynamically scan the _entire workspace flow_ for hidden consequences.
- Ask yourself: _"If I execute this prompt exactly as written, will it break the UI Mathematics in Core 04? Will it conflict with the Database rules in Core 02? Is there a better, unspoken way to achieve what the user actually wants?"_

## 4. The Strict Task Typology Lock (The 4-Track System)

To prevent hallucination, you are strictly forbidden from acting "dynamically" during execution. After empathizing with the user, you MUST explicitly lock the task into one of four rigid tracks:

- **TRACK A (Frontend/UI Only):** For pure visual builds with no new backend logic. Forces Cores 01 -> 02 -> 03 -> 04 -> 05.
- **TRACK B (Pure Backend/Logical):** For APIs, databases, and pure logic with no UI. Forces Cores 01 -> 02 -> 03 -> 05. Core 04 is strictly locked out.
- **TRACK C (Micro-Edit):** For atomic fixes (e.g., "change button color", "fix typo"). Bypasses all Core loading. Forces immediate, surgical code execution.
- **TRACK D (Fullstack — Both):** For features that require BOTH new UI AND new backend logic simultaneously (e.g., "Build the Notes feature"). Forces ALL Cores: 01 -> 02 -> 03 -> 04 -> 05. The Council must contain both Frontend AND Backend specialists simultaneously.

## 5. The Dynamic Council Assembly Protocol (MANDATORY)

You are not a single agent. Your base council (defined in each Core) is the **MINIMUM**. Before proceeding to Core 01, you MUST scan the user's prompt for additional keywords and recruit specialist agents on top of the base 3. The Council has NO ceiling — it expands to whatever the task demands.

**Keyword → Specialist Agent Mapping (auto-recruit these when detected):**
| Keyword Detected | Add to Council |
|---|---|
| "design", "UI", "layout", "Figma", "pixel" | `elite-design-system-agent` (Visual Precision) + **MANDATORY: Activate Design Skill Chain** |
| "UX", "flow", "user journey", "interactions" | `Master UX Architect` (Human Flow) |
| "animation", "motion", "scroll", "GSAP", "3D" | `chief-architect-agent` (GPU/Timing) + `skill-forge-agent` (capability check) |
| "drag", "kanban", "sortable", "reorder" | `optimistic-dnd-agent` (DnD State) |
| "database", "schema", "SQL", "Prisma", "ERD" | `db-agent` (Schema) + `database-reviewer` (Security) |
| "auth", "login", "session", "Supabase" | `db-agent` (Supabase Auth) + `security-reviewer` (RLS) |
| "test", "coverage", "TDD", "spec" | `tdd-guide` (Tests First) |
| "deploy", "Vercel", "lambda", "force-dynamic" | `architect` (Vercel Rules) |
| "review", "audit", "check my code" | `code-reviewer` (Strict TS) + `security-reviewer` (Vulnerabilities) |
| "prompt", "AI", "LLM", "OpenRouter" | `lyra-frontend-optimizer` (Prompt Engineering) |
| "color", "palette", "theme", "token" | `Design Token Architect` + `SKILL-design-architecture-color` |
| "Awwwards", "premium", "modern", "redesign" | `Master UI Mathematician` + **Schedule `SKILL-design-intelligence-cognition` for CORE-04 Entry** |
| "generate assets", "create images", "full design", "GenUI" | `Autonomous Design Agent` + `SKILL-uiux-autonomous-fullstack-design` |
| screenshot + URL detected | **Immediate: `SKILL-visual-extraction-protocol`** (runs right after CORE-00) |

> ⚠️ **MANDATORY DESIGN RULE:** When ANY design keyword is detected (Track A or D),
> read `RULE-core-pipeline-enforcement.md` before proceeding. CORE-04 is the mandatory
> math gate — you may NOT write CSS or Tailwind without passing CORE-04.
> **Design Skill Chain (activate in order):**
> 1. `SKILL-visual-extraction-protocol` ← fires IMMEDIATELY after CORE-00 if TYPE 4 detected
> 2. CORE-01 → CORE-02 → CORE-03
> 3. `SKILL-design-intelligence-cognition` ← runs at CORE-04 ENTRY (NOT in CORE-00)
> 4. `CORE-04` → `SKILL-design-architecture-color` → `SKILL-uiux-autonomous-fullstack-design` → `INSTINCT-010`

**Council Declaration Format (required output at start of every response):**

> **Active Council:** [List all active personas + their specific responsibility in brackets]
> **Track Locked:** [A / B / C / D]

## 5.5 The URL Pre-Capture Protocol (MANDATORY — Fires BEFORE Core 01)

If the user's prompt contains ANY URLs (design references, inspiration links, sample apps, Figma, etc.), you MUST execute this protocol NOW — before loading any files in Core 01, before designing any ERD in Core 02, and before proposing any libraries in Core 03. The entire pipeline depends on this visual data.

**Step 1: Classify Each URL AND Each Attached Image**
For every URL in the prompt, classify it as one of:

- **TYPE 1 — Clone Target:** A specific app or site whose design/behavior should be precisely replicated.
- **TYPE 2 — Inspiration Gallery:** A discovery platform hosting MANY designs (e.g., Dribbble, Awwwards). NOT a single design to clone.
- **TYPE 3 — Asset Source:** A URL for a specific image, icon, or media asset to use directly.
- **TYPE 4 — Screenshot Clone Target (HIGHEST PRIORITY):** User attached a SCREENSHOT of a specific section AND also provided the URL where that section lives. This combination overrides all other input types for that section.

**Step 1B: Screenshot Detection (MANDATORY — Check Before URL Classification)**
Before classifying URLs, scan the user's message for attached images/screenshots.

- **If screenshot + matching URL found:** Mark as **TYPE 4**. This means:
  - The screenshot defines the EXACT visual target. Every pixel, animation, and effect must match.
  - The URL confirms the live source. Use `browser_subagent` to extract the live CSS/animation data for that section specifically.
  - Record in Baton: `Screenshot Target: [section name] from [URL]`
  - Fidelity for this section is automatically locked to **PIXEL-PERFECT** — do not ask the Fidelity Gate question for this section.
  - Proceed to `SKILL-visual-extraction-protocol.md` immediately after this CORE for that section.
- **If screenshot with NO URL:** Treat as **TYPE-S** (color/style sample) — style inspiration only, not a copy target.
- **If URL with NO screenshot:** Normal TYPE 1 processing.

**Step 2: Act Based on Type**

- **TYPE 4 (Screenshot + URL — 100% Copy):** This fires `SKILL-visual-extraction-protocol.md` which handles full extraction. Record in Baton.
- **TYPE 1 (Clone Target URL only):** Immediately use `browser_subagent` to visit the URL and execute a **full-page deep capture**:
  1. Screenshot the above-the-fold view.
  2. Scroll down in increments and capture ALL sections (hero, features, pricing, footer, etc.).
  3. Use browser DevTools (via `browser_subagent`) to inspect CSS variables, computed colors, font-family, AND CSS animations/keyframes — do NOT rely on visual color-picking alone.
  4. Extract and record: exact Hex/HSL colors, font families + weights, border radii, spacing scale, shadow values, layout patterns, and **all CSS transition/animation declarations**.
  5. For images in the reference: note the source URLs — flag for `SKILL-visual-extraction-protocol` to handle.
  6. Store ALL of this in the `[BATON UPDATE — Core 00 URL Capture]`. **Core 04 MUST read this baton and MUST NOT re-capture the URL.**
- **TYPE 2 (Inspiration Gallery):** HALT and ask the user: _"You linked [platform] as inspiration. Could you: (a) link a specific design, or (b) describe the style?"_ Do NOT proceed to Core 01 until clarified.
- **TYPE 3 (Asset Source):** Note the URL in the Baton for Core 04/05. Continue.

**Step 3: Output a `[BATON UPDATE — Core 00 URL Capture]`** with the classified URLs and all extracted visual/structural data.

**Step 4: Ask the Fidelity Gate Question (ONLY IF No TYPE 4 was detected)**
If no TYPE 4 screenshot-URL pair was found, ask the user ONE question:
_"Should the UI be **100% pixel-perfect identical** to the reference (I will extract exact hex codes, border radii, font weights, AND all animations/scroll effects), or should I use it as **structural inspiration** while applying your own design system?"_

If TYPE 4 WAS detected: Fidelity is already locked to PIXEL-PERFECT for those sections. Only ask this question for sections without a screenshot pair.
Record the answer as `Fidelity Level: [PIXEL-PERFECT / INSPIRATION]` in the Baton. This single answer affects library selection (Core 03), math extraction (Core 04), and final verification (Core 05).

**Step 5: Handle TYPE 2 Resolved Inspiration (MANDATORY)**
If a TYPE 2 URL was resolved by the user into a text description (e.g., "dark SaaS card-based mobile-first"), you MUST record this EXACTLY in the `[BATON UPDATE]` under the `Resolved Inspiration Style` field. This text is as important as the TYPE 1 capture for Core 04.

**CRITICAL — Priority Order for Core 02:**

- **USER'S EXPLICIT REQUIREMENTS are PRIMARY** (the pages they listed, the features they described).
- **The TYPE 1 reference is SUPPLEMENTARY** — use it to infer design style and any IMPLIED features not stated by the user (e.g., if the reference shows a newsletter signup the user didn't mention, propose adding it). Do NOT remove user-stated features just because the reference doesn't show them.

## 6. Transition — The Context Baton (MANDATORY OUTPUT)

Before proceeding to Core 01, you MUST generate and output the **Context Baton** below. This baton is your contract. Every subsequent Core will re-read it at the start to prevent context drift.

```
[CONTEXT BATON v1.0 — Core 00 Origin]
Track Locked: [A / B / C / D]
User's Core Intent (1 sentence): "[What the user actually wants to achieve]"
User's Feeling/Tone Goal: "[The aesthetic/emotional outcome, e.g., 'premium SaaS, dark Notion-like, Awwwards level']"
Active Council: [Agent 1 (Role)] + [Agent 2 (Role)] + [Agent 3 (Role)] + [...]
Key Constraints Detected: [e.g., 'Vercel hosting, free tier, no Framer Motion']
Baton Update Log:
  - Core 00: [Initial baton created]
[END BATON]
```

**Baton Update Protocol (For Subsequent Cores — MANDATORY AT EVERY TRANSITION):**
Every Core MUST output a visible `[BATON UPDATE]` block before transitioning to the next Core. This is NOT optional. If a Core has nothing new to add, it must still output the block with "No new constraints" to confirm it ran the check. Format:

```
[BATON UPDATE — Core 0X]
New Constraints Added: [e.g., 'cPanel hosting confirmed, no Redis, no Docker' / 'None']
Fidelity Level: [PIXEL-PERFECT / INSPIRATION — from Core 00 Fidelity Gate]
Resolved Inspiration Style: [e.g., 'dark SaaS card-based mobile-first' — from TYPE 2 resolution / None]
ERD Approved: [Yes / Pending / N/A]
Frontend Library Approved: [e.g., 'Strict 60FPS CSS + Tailwind' / Pending]
Backend Stack Approved: [e.g., 'Supabase + Prisma' / Pending]
Council Changes: [e.g., '+ skill-forge-agent' / None]
[END UPDATE]
```

Any Core performing a Baton Check must read BOTH the original `[CONTEXT BATON]` AND all `[BATON UPDATE]` blocks. The combined picture is the live state.

Once the baton is output and visible in the conversation, you may proceed to **CORE 01 (`d:\lockincapstone\lockin\.agent\cores\CORE-01-BOOTLOADER.md`)**.

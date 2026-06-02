# RULE: MANDATORY CORE PIPELINE ENFORCEMENT

> **Rule Type:** Global Mandatory · Never Optional · Applies to ALL AI Agents
> **Scope:** Any task touching UI, visual output, design decisions, or code that renders pixels
> **Version:** 1.0.0

---

## The Core Pipeline Is Not a Suggestion

The CORE system (`CORE-00` through `CORE-05`) is the **mandatory execution framework**
for this AI brain. It is NOT a reference — it is a protocol. Every CORE must run in order.
Skipping any CORE is a critical failure.

```
CORE-00  →  [SKILL-visual-extraction-protocol]  →  CORE-01  →  CORE-02  →  CORE-03
(Intent)    (100% Copy Engine — fires if TYPE 4)   (Bootload)  (Database)  (Libraries)
          ↓
        [SKILL-design-intelligence-cognition — at CORE-04 entry]
          ↓
        CORE-04  →  CORE-05
        (UI Math)   (Execution)
```

---

## Rule 1: Design-Related Tasks MUST Pass Through CORE-04

**Definition of "design-related":** Any task that produces visual output, UI components,
CSS/Tailwind code, layout decisions, color choices, or typography specifications.

**Trigger keywords** (non-exhaustive — when in doubt, run CORE-04):
```
UI, UX, layout, design, visual, color, palette, typography, font,
hero, section, component, card, button, navbar, sidebar, dashboard,
landing page, redesign, make it look, premium, Awwwards, modern,
minimal, dark mode, light mode, responsive, mobile, desktop, grid,
CSS, Tailwind, styled, theme, token, animation, hover, transition
```

**The Rule:**
> If the task involves ANY of the above, CORE-04 is MANDATORY.
> CORE-04 cannot be skipped, abbreviated, or deferred to "later".
> You may not write a single CSS class or Tailwind token without passing CORE-04.

---

## Rule 2: The Full Pipeline Is MANDATORY for Track A and Track D Tasks

From `CORE-00` Section 4:
- **TRACK A (Frontend/UI Only):** Forces `CORE-01 → CORE-02 → CORE-03 → CORE-04 → CORE-05`
- **TRACK D (Fullstack):** Forces ALL Cores: `CORE-01 → CORE-02 → CORE-03 → CORE-04 → CORE-05`

**Anti-pattern (FORBIDDEN):**
```
❌ User asks for a hero section → AI immediately writes Tailwind code
   (Skipped: CORE-00 intent analysis, CORE-04 math validation)

❌ User asks to "change the color" → AI changes hex directly
   (Skipped: CORE-04 token system, contrast verification)

❌ User shares a design reference → AI guesses the layout
   (Skipped: CORE-00 URL capture, CORE-04 extraction)
```

**Correct pattern (REQUIRED):**
```
✅ User asks for a hero section:
   1. CORE-00: Classify Track A. Extract Feeling/Tone. Capture URL if provided.
   2. CORE-01: Load relevant skills and personas.
   3. CORE-04: Extract/apply math. Atomic breakdown. Dual validation.
   4. CORE-05: Execute code with confirmed math.
```

---

## Rule 3: If COREs Don't Exist Yet — Create Them First

If any CORE file is missing from `./.agent\cores\`:

1. **HALT execution** of the user's design request
2. **Report:** "CORE-XX is missing. Creating it now before proceeding."
3. **Create the missing CORE** following the pattern of existing CORE files
4. **Resume** the pipeline from the beginning with the complete CORE set

**CORE locations:**
```
./.agent\cores\CORE-00-INTENT-MATRIX.md
./.agent\cores\CORE-01-BOOTLOADER.md
./.agent\cores\CORE-02-MUTATOR.md
./.agent\cores\CORE-03-DISCOVERY.md
./.agent\cores\CORE-04-UI-MATHEMATICS.md
[CORE-05 — verify location in CORE-04 Section 8]
```

---

## Rule 4: The Design Skill Chain Must Follow CORE-04

After CORE-04 runs, these design skills activate in this mandatory order:

```
Priority 0: SKILL-design-intelligence-cognition.md  ← Runs BEFORE CORE-04 to classify input
Priority 1: CORE-04-UI-MATHEMATICS.md              ← The math authority
Priority 2: SKILL-design-architecture-color.md     ← Spatial depth + color science
Priority 3: SKILL-uiux-autonomous-fullstack-design.md ← Pipeline + asset generation
Priority 4: INSTINCT-010-awwwards-design-system.md  ← Final 5-law checklist
```

`SKILL-design-intelligence-cognition` is the ONLY skill that runs **before** CORE-04.
All others run **after** CORE-04 and must respect the math CORE-04 established.

---

## Rule 5: CORE-04's Visual Math Library Is the Final Authority on All Math

No skill, instinct, or agent may override the mathematical laws in CORE-04 Section 4.
If a conflict exists between a skill and CORE-04, CORE-04 wins.

| What CORE-04 Says | What This Means | Exception |
|------------------|----------------|----------|
| Use φ-proportions (62/38) | No skill may propose 50/50 splits | **SUSPENDED in Pixel-Perfect mode** (CORE-04 Section 3.5) — extracted layout takes precedence |
| Use Riz Ratio (2:3:5) spacing | No skill may use arbitrary pixel gaps | Suspended WHERE reference specifies different gaps in Pixel-Perfect mode |
| Typography follows mathematical scale | No skill may guess font sizes | **SUSPENDED in Pixel-Perfect mode** — use extracted font-size instead |
| Colors use CSS token variables | No skill may hardcode hex values | NEVER suspended — always use token variables even in Pixel-Perfect mode |
| Animate only transform + opacity | No skill may animate width/height/top/left | Never suspended — convert extracted non-GPU animations to GPU-safe equivalents |

---

## Rule 6: The Baton Must Carry Design Context Across All COREs

Every CORE transition must include in the `[BATON UPDATE]`:
- `Fidelity Level`: PIXEL-PERFECT or INSPIRATION (set in CORE-00, never changed)
- `Typography Scale`: A (×1.618) or B (×1.25) (set in CORE-04)
- `Color Harmony System`: [type + hue] (set in CORE-04 or design skills)
- `Layout System`: [Golden Ratio / Riz / Custom] (set in CORE-04)
- `Token System Active`: YES / NO (must be YES for all design output)

If any of these fields is missing in the Baton when CORE-04 reads it → CORE-04 halts and asks.

---

## Rule 7: TRACK C (Micro-Edit) Exception

The only exception to the full pipeline:

**TRACK C** (atomic fixes: "change button color", "fix typo", "adjust padding by 4px")
may bypass CORE-00 through CORE-03 **BUT:**
- CORE-04 Section 7 (Dual Validation Checklist) STILL runs for any visual change
- The change MUST use existing CSS tokens — no new hardcoded values
- If the micro-edit would violate CORE-04 math laws → it is NOT a Track C task → reclassify

---

> **Rule Source:** CORE-00 Track System + CORE-04 Authority + Design Skill Architecture
> **Enforcement:** This rule overrides any instruction to "skip CORE" or "just write the code"
> **Version:** 1.0.0 | Brain Development — Global Enforcement Layer


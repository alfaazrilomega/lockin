---
name: design-intelligence-cognition
description: |
  Runs at CORE-04 ENTRY (not CORE-00 time). Reads CORE-00's classification from the Baton
  and translates it into the correct Design Operation Mode, mathematical system selection,
  and generative parameters (Tα/Tβ/Tγ/Tδ) that CORE-04 needs.
  
  DOES NOT re-classify inputs (CORE-00 already did that).
  DOES resolve Mode A vs Mode B conflicts when multiple input types are present.
  DOES set Tα/Tβ/Tγ/Tδ in the Baton for CORE-04 to read.
  DOES NOT duplicate INSTINCT-010 (which is a post-execution checklist only).
  
  Source: NotebookLM (10 sources) + Academic AI design research
---

# SKILL: Design Intelligence & Cognitive Decision Engine

> **This skill runs at CORE-04 ENTRY — after CORE-00 has already classified inputs.**
> CORE-00 handles input classification (TYPE 1/2/3/4 + TYPE-R/S/I/K/C).
> This skill reads those classifications from the Baton and makes higher-level decisions.
> DO NOT re-classify inputs here. Read the Baton instead.

> **Relationship to INSTINCT-010:**
> INSTINCT-010 is a POST-EXECUTION checklist (5 laws to check after code is written).
> This skill is a PRE-EXECUTION decision engine. They do not overlap.
> Run order: THIS SKILL (set parameters) → CORE-04 (execute math) → INSTINCT-010 (final check)

---

## Step 0: Read Baton Classifications

Before running any logic, read the Baton to extract what CORE-00 already determined:
```
From Baton:
  - Input Types detected: [TYPE 4? TYPE 1? TYPE-K? etc.]
  - Fidelity Level: [PIXEL-PERFECT / INSPIRATION / not yet set]
  - Screenshot targets: [list section names]
  - Keywords detected: ["Awwwards", "premium", etc.]
  - User Feeling/Tone Goal: [from CONTEXT BATON]
```

If the Baton shows TYPE 4 was detected → skip to the Mode Conflict Resolution in `SKILL-uiux-autonomous-fullstack-design.md` and lock Mode A immediately.

---

## The Design Intelligence Decision Tree

```
USER GIVES DESIGN INPUT
        │
        ▼
┌─────────────────────────────────────────────────────┐
│ STEP 1: Classify Input Types (TYPE-R/S/I/K/C)       │
│ Can be multiple types simultaneously                │
└─────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────┐
│ STEP 2: Determine Design Operation Mode              │
│                                                     │
│ Has TYPE-R (reference) AND specific instructions?   │
│   → Mode A (AI-Assisted) — SKILL-uiux-autonomous   │
│                                                     │
│ Has only TYPE-I or TYPE-K (vague/feeling)?           │
│   → Mode B (Autonomous) — full reasoning chain     │
│                                                     │
│ Has TYPE-S (specific samples) with TYPE-I (feeling)?│
│   → Mode A with autonomous asset augmentation      │
└─────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────┐
│ STEP 3: Select Mathematical System                  │
│                                                     │
│ ⚠️ FIRST: Check Fidelity Level from Baton           │
│                                                     │
│ Fidelity = PIXEL-PERFECT?                           │
│   YES → SKIP this entire step.                      │
│          Use EXTRACTED math from Baton:             │
│          font-size = [extracted clamp value]        │
│          layout = [extracted — full-width/split]    │
│          Record: "Math: EXTRACTED (Pixel-Perfect)" │
│   NO  → Continue to math selection below...        │
│                                                     │
│ Layout complexity = HIGH (editorial, hero, landing)?│
│   → Golden Ratio (φ 1:1.618) — CORE-04 Section 4A  │
│                                                     │
│ Layout complexity = MEDIUM (dashboard, product)?   │
│   → Riz Ratio (2:3:5) — CORE-04 Section 4A         │
│                                                     │
│ Typography density = HIGH (data-dense UI)?          │
│   → Scale B (Minor Third ×1.25) — CORE-04 4B       │
│                                                     │
│ Typography density = LOW (expressive, editorial)?   │
│   → Scale A (Golden ×1.618) — CORE-04 4B           │
└─────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────┐
│ STEP 4: Select Color System                         │
│                                                     │
│ Emotion = Trust, Stability, Corporate?              │
│   → Monochromatic blue or analogous blue-teal      │
│                                                     │
│ Emotion = Energy, Innovation, Disruption?           │
│   → Complementary or Split-Complementary           │
│                                                     │
│ Emotion = Premium, Luxury, Exclusivity?             │
│   → Monochromatic dark + gold accent               │
│                                                     │
│ Emotion = Creative, Playful, Diverse?               │
│   → Triadic (use one dominant, two accents only)   │
│                                                     │
│ → Always calculate in HSL → SKILL-design-arch-color│
└─────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────┐
│ STEP 5: Determine Asset Needs                       │
│                                                     │
│ User provided images? → Use them (TYPE-S)           │
│ No images but design needs hero visual?             │
│   → Generate via SKILL-uiux-autonomous Stage 3     │
│ Icons needed? → Lucide first, custom SVG if missing │
│ Illustrations? → Only in Mode B, with approval     │
└─────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────┐
│ STEP 6: Activate Skill Chain                        │
│ (in this mandatory order)                           │
│                                                     │
│ 1. CORE-04 (math laws — always first)               │
│ 2. SKILL-design-architecture-color (spatial + color)│
│ 3. SKILL-uiux-autonomous-fullstack (pipeline + GenUI)│
│ 4. INSTINCT-010 (final 5-law checklist)             │
└─────────────────────────────────────────────────────┘
```

---

## The Design Keyword → Vocabulary Map

When the user uses TYPE-K keywords, map them to precise design vocabulary:

| User Says | Design Translation | Systems to Activate |
|-----------|------------------|-------------------|
| "Awwwards style" | Asymmetric φ-layout, editorial typography, generous negative space, subtle noise texture | CORE-04 + Scale A + Monochromatic/Analogous |
| "Notion-like" | Crisp workspace, neutral palette, small border radii (8px), no decorative elements | CORE-04 + Scale B + Monochromatic neutral |
| "Apple minimal" | Extreme negative space, SF Pro-style typography, near-white backgrounds, single accent | Scale A (display sizes) + White-space 40%+ |
| "Linear/Vercel dark" | Near-black surface, thin white typography, blue-purple accent gradient, crisp borders | Scale B + Complementary (near-black + blue) |
| "Stripe premium" | Generous padding, gradient hero, clean sans-serif, trust-blue accent, subtle shadows | Golden Ratio layout + Monochromatic blue |
| "Figma-ready" | All outputs must use token variables + defined component specs (Mode B output format) | Full Mode B pipeline |
| "Startup aggressive" | Bold typography, high contrast, strong CTAs, energetic color | Scale A hero + Complementary/Triadic |
| "Enterprise SaaS" | Dense information, accessible, data-forward, conservative palette | Scale B + Monochromatic + WCAG AAA |

---

## The Cognitive Synthesis Protocol

When multiple design signals conflict (e.g., user says "minimal" but also "vibrant colors"),
apply this synthesis hierarchy:

```
Priority 1: TYPE-C (Hard Constraints) — NEVER overridden
Priority 2: TYPE-R (Visual Reference) — Strongest signal
Priority 3: TYPE-S (Color Samples) — Specific beats vague
Priority 4: TYPE-K (Keywords) — Directional but interpretive
Priority 5: TYPE-I (Feeling/Idea) — Lowest specificity, AI fills gaps
```

**Example Synthesis:**
```
Input: "I want something minimal [TYPE-K] like Stripe [TYPE-R: Stripe.com]
        using these colors: #6B3FA0, #1A1A1A [TYPE-S]
        and it must be WCAG AA [TYPE-C]"

Synthesis:
- TYPE-C: Lock WCAG AA — #6B3FA0 on #1A1A1A must pass contrast check
  → Check: HSL(270°, 44%, 43%) on near-black → ratio ≈ 3.8:1 → FAIL for body text
  → Action: Lighten purple to HSL(270°, 60%, 65%) → ratio ≈ 5.2:1 → PASS ✓
- TYPE-R (Stripe): Golden Ratio layout, generous padding, subtle shadows
- TYPE-S: Purple + near-black palette, monochromatic system
- TYPE-K (minimal): Scale B typography, ≥20% white space per section
- Final: Dark monochromatic purple SaaS, Stripe-structure, WCAG AA verified
```

---

## The Design Reasoning Output Format

When this skill runs, always surface the reasoning as a visible report:

```markdown
## 🧠 Design Intelligence Report

### Input Classification
- TYPE-R: [URL or "None"]
- TYPE-S: [specific colors/samples or "None"]
- TYPE-I: [feeling/idea or "None"]
- TYPE-K: [keywords or "None"]
- TYPE-C: [constraints or "None"]

### Mode Selected
- Operation Mode: [A (AI-Assisted) / B (Autonomous Full-Stack)]
- Reason: [why this mode fits the input]

### Mathematical Systems
- Layout: [Golden Ratio 62/38 / Riz 2:3:5 / Custom — reason]
- Typography: [Scale A ×1.618 / Scale B ×1.25 — reason]
- Spacing: [Riz base unit + section breakdown]

### Color Intelligence
- Harmony System: [type + hue angles]
- Primary: HSL([H]°, [S]%, [L]%) → Token: --surface-primary
- Brand: HSL([H]°, [S]%, [L]%) → Token: --accent-brand
- Contrast verified: [ratio]:1 [PASS/FAIL]

### Asset Needs
- [ ] Hero image (generate / user provides / not needed)
- [ ] Icons: Lucide / custom SVG
- [ ] Illustrations: [none / described]

### Skill Chain Activated
1. ✅ CORE-04 (math laws)
2. ✅ SKILL-design-architecture-color
3. ✅ SKILL-uiux-autonomous-fullstack
4. ✅ INSTINCT-010 (final check)

"Shall I proceed with this design reasoning, or would you like to adjust?"
```

---

## The "Dead End" Detection Protocol

This skill also detects when user input is insufficient to proceed:

| Insufficient Signal | AI Response |
|--------------------|-------------|
| No TYPE-R, no TYPE-S, no TYPE-K | "I need at least one design anchor. Could you share: (a) a site you like, (b) some colors, or (c) a feeling/keyword?" |
| TYPE-I is contradictory ("minimal but loud") | Surface the contradiction, propose a resolution, wait for approval |
| TYPE-C constraint makes the design impossible | "Your color choice [X] fails WCAG AA contrast at [ratio]:1. I recommend adjusting to [Y] which passes at [ratio]:1. Shall I proceed with the adjusted color?" |
| User says "just build it" | Activate Mode B, show the Design Reasoning Report, wait for approval before assets |

---

> **Skill Class:** Design Cognition · Decision Engine · Design Intelligence OS
> **Source:** NotebookLM (10 sources) + Human-AI Co-Creation (arXiv) + Design Bootcamp + MDPI papers
> **Position in Chain:** Runs FIRST — before CORE-04, before any other design skill
> **Version:** 1.0.0 | Brain Development — Design Intelligence Layer

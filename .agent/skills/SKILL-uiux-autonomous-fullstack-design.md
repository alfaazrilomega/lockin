---
name: uiux-autonomous-fullstack-design
description: |
  Activates when the user requests: UI/UX design that goes beyond layout
  (includes image generation, icon creation, 2D assets), autonomous design
  decisions, full-stack design systems (Figma-ready), or GenUI (Generative UI)
  implementations. Covers the full spectrum from AI-Assisted Design to
  Autonomous Full-Stack AI Design (End-to-End Generative Design).
  Source: NotebookLM (10 sources) + GenUI industry research (The New Stack,
  Google GenUI Guide, Agentic AI in Design Systems, arXiv Human-AI Co-Creation)
---

# SKILL: UI/UX Design & Autonomous Full-Stack AI Design

> **Defines the two design operation modes and establishes the autonomous pipeline
> for full-stack AI design that goes beyond layout into asset generation.**

---

## The Two Design Operation Modes

### Mode A — AI-Assisted Design (Generative Co-Creation)
**Also known as:** Prompt-Based Design, Augmented Design

**Trigger:** TYPE-R (reference URL) is present, with or without TYPE-K keywords.
**User Control Level:** High — AI operates within the user's explicit framework

---

### Mode B — Autonomous Full-Stack AI Design
**Also known as:** Autonomous Design Agent, End-to-End Generative Design, GenUI

**Trigger:** TYPE-I or TYPE-K ONLY — no reference URL or screenshot provided.
**User Control Level:** Low → Medium (intent-based, not instruction-based)

---

### Mode Conflict Resolution (CRITICAL — Fixes Contradiction #3)

When MULTIPLE input types are present simultaneously, use this priority hierarchy:

```
TYPE 4 (Screenshot + URL) present?
  YES → AUTO-LOCK Mode A, Pixel-Perfect. Activate SKILL-visual-extraction-protocol.
         TYPE-K keywords apply as QUALITY LEVEL only (e.g., "Awwwards" = premium execution).
         Do NOT switch to Mode B. TYPE-4 is unambiguous.
  NO  → Continue...

TYPE-R (URL) present?
  YES → Mode A (AI-Assisted)
         TYPE-K keywords ("Awwwards", "premium") = QUALITY MODIFIER, not mode switcher.
         They raise execution quality but do NOT trigger Mode B.
         Example: "Awwwards-level" + URL = Mode A with Awwwards-quality execution.
  NO  → Continue...

TYPE-K or TYPE-I ONLY (no URL, no screenshot)?
  YES → Mode B (Autonomous Full-Stack AI Design)
         AI reasons through all design decisions autonomously.
  NO  → Insufficient input — ask the user for more context.
```

**Generative Parameters (Tα/Tβ/Tγ/Tδ) Responsibility:**
- **This skill SETS them** (during the Design Reasoning Report in Stage 2 of the Autonomous Pipeline)
- **CORE-04 READS them** from the Baton when it runs
- They must appear in the `[BATON UPDATE — SKILL-design-intelligence-cognition]` output
- CORE-04 will HALT if Mode B is active but Tα/Tβ/Tγ/Tδ are not in the Baton

---

## The Autonomous Design Pipeline (Mode B)

When Mode B is active, execute this pipeline **before any code**:

### Stage 1 — Intent Extraction (5 Questions Max)
```
AI asks:
1. "What is the project's core purpose?" (e.g., SaaS productivity app, portfolio, e-commerce)
2. "What feeling/emotion should the design evoke?" (e.g., trust, excitement, calm, premium)
3. "Who is the target audience?" (e.g., developers, executives, students)
4. "Any reference sites or brands you admire?" (even loosely related)
5. "Any hard constraints?" (e.g., must use brand blue #2383E2, must be dark mode)
```

### Stage 2 — AI Design Reasoning (Internal — Show Output to User)
The AI reasons through the following and surfaces the decisions:

```
DESIGN REASONING REPORT:
─────────────────────────────────────────
Project Type:   [type from Q1]
Emotion Target: [feeling from Q2]
Audience:       [from Q3]

Typography Decision:
  Primary Font: [chosen font] — Reason: [why this font matches emotion/audience]
  Scale System: [Scale A (Golden ×1.618) or Scale B (Minor Third ×1.25)]
  Reason: [Scale A = expressive/editorial | Scale B = dense/functional]

Color Palette Decision:
  Harmony System: [Monochromatic/Analogous/Complementary/etc.]
  Base Hue: HSL([H]°, [S]%, [L]%)
  Reason: [color psychology + brand fit]
  Brand Accent: HSL([H]°, [S]%, [L]%) — Contrast vs background: [ratio]:1 [PASS/FAIL]

Layout Decision:
  Macro Grid: [Golden Ratio 62/38 / Editorial Grid / etc.]
  Mobile Strategy: [Riz Ratio 2:3:5 spacing]
  Negative Space Budget: [% per section]

Asset Generation Plan:
  Hero Image: [description for AI generation] — Style: [photorealistic/abstract/geometric]
  Icons: [icon style — outlined/filled/duotone] — Source: Lucide / self-generate
  Illustrations: [needed? Y/N — describe style if yes]
─────────────────────────────────────────
"Do you approve this reasoning, or would you like to adjust any decisions?"
```

**RULE:** AI must show this report and wait for approval before generating assets or code.

---

### Stage 3 — Asset Generation Protocol

For each asset that must be generated:

**Hero Images / Photography Substitutes:**
Use structured prompts in this format:
```
[Style] + [Subject] + [Lighting] + [Color Palette] + [Mood] + [Technical Spec]

Example:
"Minimal dark digital photography, abstract data visualization,
dramatic rim lighting, deep navy and electric blue color palette,
premium enterprise technology mood,
ultra-wide 16:9, high resolution, no text"
```

**2D Graphics / Illustrations:**
```
"Flat vector illustration, [subject], [color palette from token system],
clean geometric shapes, [style: geometric/organic/line-art],
transparent background, SVG-compatible style"
```

**Icon System Rules:**
- Use Lucide React as the base (consistent stroke width = 1.5px)
- For custom icons not in Lucide: generate as SVG with `currentColor` for token compatibility
- Icon sizing follows Riz Ratio: `16px` (atom), `20px` (molecule), `24px` (organism header)
- Never mix icon styles (outlined + filled) in the same design

---

### Stage 4 — Generative UI (GenUI) Implementation

**What GenUI means in code:**
GenUI goes beyond static layouts. It is a system where the AI can dynamically
generate the STRUCTURE of UI components based on runtime context — not just
populate pre-defined templates.

**GenUI Spectrum:**
```
Static UI        →  Template UI      →  AI-Assisted UI    →  True GenUI
(Hard-coded)        (CMS-populated)     (AI fills slots)     (AI defines structure)
     ↑                    ↑                    ↑                    ↑
WordPress           Contentful          Copilot sidebar      AI SDK + RSC
```

**GenUI Implementation Pattern (Next.js + AI SDK):**
```typescript
// Server Component — AI generates the UI structure, not just content
import { generateObject } from 'ai';

async function AIGeneratedDashboard({ userContext }: { userContext: string }) {
  // AI reasons about what components to show
  const { object: layout } = await generateObject({
    model: openai('gpt-4o'),
    schema: z.object({
      sections: z.array(z.object({
        type: z.enum(['hero', 'stats', 'chart', 'feed', 'action']),
        priority: z.number().min(1).max(5),
        title: z.string(),
        dataSource: z.string(),
      }))
    }),
    prompt: `Given this user context: ${userContext}, 
             design the optimal dashboard layout.`,
  });

  // Render the AI-determined layout
  return (
    <div className="grid grid-cols-[62%_38%] gap-6">
      {layout.sections
        .sort((a, b) => a.priority - b.priority)
        .map(section => <DynamicSection key={section.type} {...section} />)}
    </div>
  );
}
```

**GenUI Token Adaptation:**
```typescript
// AI adapts the design tokens based on context
async function getAdaptiveTheme(userPreferences: UserPreferences) {
  // Focus mode → cooler, higher contrast tokens
  if (userPreferences.mode === 'focus') {
    document.documentElement.setAttribute('data-theme', 'focus-mode');
  }
  // Presentation mode → max contrast, gold accent
  if (userPreferences.mode === 'present') {
    document.documentElement.setAttribute('data-theme', 'presentation-mode');
  }
}
```

---

### Stage 5 — Full-Stack Design System Output (Figma-Compatible Spec)

When Mode B completes, produce a structured spec that a developer OR Figma can consume:

```markdown
## DESIGN SYSTEM SPEC — [Project Name]
─────────────────────────────────────────

### Typography
- Primary Font: [Name] — Source: [Google Fonts / Local]
- Scale: [Scale A or B] — Base: 16px
- Weights used: 400 (body), 500 (UI), 600 (heading), 700 (display)

### Color System
- Background: hsl([H], [S]%, [L]%) = [token: --surface-base]
- Text Primary: hsl([H], [S]%, [L]%) = [token: --text-primary]
- Brand: hsl([H], [S]%, [L]%) = [token: --accent-brand]
- [Full token list...]

### Spacing System
- Riz Base Unit: 4px
- Scale: 8px / 12px / 20px / 32px / 48px / 80px

### Component Inventory
- [Organism 1]: [description + token references]
- [Organism 2]: [description + token references]

### Asset Inventory
- Hero Image: [filename / generation prompt]
- Icon Set: Lucide React (base) + [custom icons if any]
- Illustrations: [description / generation prompts]
─────────────────────────────────────────
```

---

## Agentic AI Design — When AI Acts as Design Director

Based on research (*Agentic AI in Design Systems*, 2025):
The highest-capability AI design agents operate in **3 levels of autonomy**:

| Level | Name | AI Role | User Role |
|-------|------|---------|----------|
| **L1** | Chatbot | Answers design questions | Makes all decisions |
| **L2** | Co-pilot | Suggests, executes on approval | Reviews and approves |
| **L3** | Autonomous Agent | Makes AND executes design decisions | Sets intent, reviews output |

**This skill operates at L2 by default.**
**Mode B activates L3 behavior** — but always surfaces key decisions for user review
before irreversible actions (asset generation, token finalization).

---

> **Skill Class:** UI/UX Design · GenUI · Autonomous Design · Full-Stack Asset Generation
> **Source:** NotebookLM (10 sources) + The New Stack GenUI + Google GenUI Guide +
>   Agentic AI in Design Systems + arXiv Human-AI Co-Creation + NOVEDGE Augmented Design Intelligence
> **Authority Chain:** CORE-04 → SKILL-design-architecture-color → This Skill
> **Version:** 1.0.0 | Brain Development — Design Intelligence Layer

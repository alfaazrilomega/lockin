---
name: design-architecture-color
description: |
  Activates when the user asks for help with: layout architecture, spatial design,
  grid systems, color palette selection, color harmony, or color token creation.
  Grounded in mathematical design laws (Golden Ratio, Gestalt principles) and
  scientific color theory (HSL perceptual model, CIECAM02, WCAG contrast mathematics).
  This skill works as a COMPANION to CORE-04-UI-MATHEMATICS.md — use it for deep
  color science and architectural layout decisions that CORE-04 doesn't cover in detail.
  Source: NotebookLM Awwwards Research (2025) + MDPI Academic Papers
---

# SKILL: Design Architecture & Color Science

> **Authority Hierarchy:** CORE-04 (math laws) → This Skill (color + architecture depth) → INSTINCT-010 (quick check)
> **Read CORE-04 first.** This skill adds depth in the color and architecture domains only.

---

## Part 1: Design Architecture — Spatial Hierarchy & Layout Composition

### 1A. The Three-Layer Spatial Model

Every layout must be mentally organized into 3 spatial layers BEFORE any code is written:

| Layer | Name | Role | Controls |
|-------|------|------|----------|
| **Layer 1** | Macro Structure | Page-level skeleton | Viewport splits, section rhythm, negative space budget |
| **Layer 2** | Meso Structure | Component grouping | Card boundaries, organism spacing, content zones |
| **Layer 3** | Micro Structure | Atom-level detail | Typography gaps, icon-to-label spacing, border treatment |

**The Law:** Each layer must be designed independently, from macro → meso → micro.
Never design atoms first — that is "bottom-up" design and produces incoherent layouts.

---

### 1B. The Grid Architecture Decision Tree

Before choosing a grid system, answer these three questions:

```
Q1: Is the content multi-directional (horizontal + vertical scrolling)?
  → YES → Use CSS Grid (multi-axis control)
  → NO  → Continue to Q2

Q2: Is the layout primarily sequential (top-to-bottom content flow)?
  → YES → Use Flexbox + Golden Ratio proportions
  → NO  → Continue to Q3

Q3: Is the layout irregular (masonry, editorial, magazine-style)?
  → YES → Use CSS Grid with `grid-template-areas` + named zones
  → NO  → Use a standard 12-column grid with φ-weighted gutters
```

**φ-Weighted 12-Column Grid:**
Instead of equal 12 columns, weight them with the Golden Ratio:
- Primary content zone: columns 1–7 (58.3% ≈ 62% golden zone)
- Secondary/sidebar zone: columns 8–12 (41.7% ≈ 38% supporting zone)

```css
/* φ-weighted grid layout */
.page-grid {
  display: grid;
  grid-template-columns: 62fr 38fr;
  gap: clamp(24px, 3vw, 48px);
}

/* For editorial/irregular layouts */
.editorial-grid {
  display: grid;
  grid-template-areas:
    "hero   hero   hero"
    "main   main   sidebar"
    "feat1  feat2  feat3";
  grid-template-columns: 1fr 1fr 0.618fr;
}
```

---

### 1C. Gestalt Principles as Layout Laws (Not Suggestions)

Academic research confirms Gestalt principles as the **cognitive science foundation** of why layouts feel good or broken. Apply them as enforced laws:

| Principle | Law | Implementation |
|-----------|-----|----------------|
| **Proximity** | Elements within `gap-2` (8px) are perceived as ONE unit | Group atoms at `gap-2`, molecules at `gap-3`, organisms at `gap-5` |
| **Similarity** | Same-styled elements feel related regardless of position | Use identical token variables for same-tier elements |
| **Continuity** | Eye follows aligned edges across the page | Align grid edges across sections — use `grid-column-start` consistently |
| **Closure** | The brain completes incomplete shapes | Use partial borders/dividers — the brain fills the gap |
| **Figure/Ground** | One element must dominate as "figure", others as "ground" | One organism per section is the figure (highest contrast); rest are ground |
| **Common Fate** | Elements moving together are perceived as a group | Animate related components with the same timing and direction |

---

### 1D. Negative Space Architecture (20% Rule)

From the sustainable design research (MDPI 2025): layouts that feel "premium" consistently allocate a minimum **20% of bounding box area** as intentional white space.

**How to calculate and enforce:**
```
Section height = 800px
Content height = max 640px (80%)
Minimum breathing = 160px (20%) distributed as padding/margin

Tailwind equivalent:
  py-20 = 80px top + 80px bottom = 160px total ✓
```

**White Space Distribution Formula (Riz-based):**
- Top padding: `×5` unit (20px or `py-5`)
- Bottom padding: `×8` unit (32px or `pb-8`)
- Between sections: `×12` unit (48px or `gap-12`)

The bottom:top ratio should be approximately 1.618 (the Golden Ratio) — bottom always heavier than top.

---

## Part 2: Scientific Color Selection

### 2A. Why HSL > HEX for AI Design Systems

**The Law:** When selecting, adjusting, or verifying colors, ALWAYS reason in HSL, not HEX.

**Why:**
- HEX/RGB is machine-readable but NOT perceptually uniform — `#FF0000` is not twice as "bright" as `#880000`
- HSL maps directly to human perception: Hue (0–360°) + Saturation (0–100%) + Lightness (0–100%)
- WCAG contrast ratios are calculated from relative luminance, which maps to HSL Lightness

```
HEX #2383E2  →  HSL(212°, 76%, 51%)
                     ↑      ↑      ↑
                Hue    Saturation  Lightness
                (Blue)  (Vivid)    (Medium — good contrast)
```

---

### 2B. The Five Color Harmony Systems

| System | Formula | Best For | Tailwind Token Strategy |
|--------|---------|---------|------------------------|
| **Monochromatic** | 1 hue, vary L 10→90% | Dark mode UI, editorial | `--accent-100` through `--accent-900` |
| **Analogous** | 3 hues within ±30° | Warm/cool palettes, organic feel | `--primary`, `--primary-warm`, `--primary-cool` |
| **Complementary** | Hues 180° apart | High-contrast CTAs, alerts | `--accent-brand` (210°) + `--accent-warning` (30°) |
| **Split-Complementary** | 1 hue + 2 hues ±150° | Sophisticated, lower tension | Base(210°) + Supporting(60°) + Supporting(330°) |
| **Triadic** | 3 hues exactly 120° apart | Playful, creative, brand-rich | Use ONE as dominant, others as accents only |

**For Awwwards Dark UI — Recommended Strategy:**
- Base: Deep neutral (HSL 0°, 0%, 10%) — near black, not pure black
- Primary text: Near white with warmth (HSL 40°, 10%, 96%) — avoids harshness
- Brand accent: High-saturation blue in midrange (HSL 212°, 76%, 51%)
- Secondary accent: Analogous (HSL 180°, 60%, 45%) — teal for variety

---

### 2C. The Perceptual Lightness Scale (11-Stop Scale)

Never use arbitrary lightness values. Use this 11-stop perceptual scale for generating any color palette:

```
Stop 50:  L = 97%  (near white — page background in light mode)
Stop 100: L = 93%  (subtle background tint)
Stop 200: L = 85%  (border in light mode)
Stop 300: L = 74%  (disabled text in light mode)
Stop 400: L = 62%  (placeholder text)
Stop 500: L = 50%  (midpoint — primary interactive color)
Stop 600: L = 40%  (hover state)
Stop 700: L = 30%  (pressed/active state)
Stop 800: L = 22%  (surface in dark mode)
Stop 900: L = 14%  (background in dark mode)
Stop 950: L = 8%   (deepest dark — near black)
```

**Tailwind Custom Palette Generation:**
```css
:root {
  /* Brand Blue — HSL 212° full scale */
  --brand-50:  hsl(212, 100%, 97%);
  --brand-100: hsl(212, 95%,  93%);
  --brand-200: hsl(212, 85%,  85%);
  --brand-300: hsl(212, 76%,  74%);
  --brand-400: hsl(212, 76%,  62%);
  --brand-500: hsl(212, 76%,  51%); /* Primary brand */
  --brand-600: hsl(212, 80%,  40%); /* Hover */
  --brand-700: hsl(212, 85%,  30%); /* Active */
  --brand-800: hsl(212, 90%,  22%);
  --brand-900: hsl(212, 95%,  14%);
  --brand-950: hsl(212, 100%, 8%);
}
```

---

### 2D. WCAG Contrast Mathematics (Calculate, Don't Guess)

**WCAG contrast ratio formula:**
```
Contrast = (L1 + 0.05) / (L2 + 0.05)
where L = relative luminance (calculated from RGB)

For HSL approximation:
  L_relative ≈ (Lightness / 100)^2.2  (sRGB gamma correction)
```

**Minimum Requirements:**
| Text Type | WCAG AA | WCAG AAA |
|-----------|---------|---------|
| Normal body text (< 18px) | 4.5:1 | 7:1 |
| Large text (≥ 18px / 14px bold) | 3:1 | 4.5:1 |
| UI components, icons | 3:1 | — |
| Decorative elements | No requirement | — |

**Quick Reference — Dark Theme Contrast Checks:**
| Background | Text | Ratio | Result |
|-----------|------|-------|--------|
| `hsl(0,0%,10%)` | `hsl(0,0%,96%)` | ~18:1 | ✅ AAA |
| `hsl(212,76%,51%)` | `hsl(0,0%,100%)` | ~4.6:1 | ✅ AA |
| `hsl(212,76%,51%)` | `hsl(0,0%,10%)` | ~4.4:1 | ⚠️ Near fail |
| `hsl(0,0%,30%)` | `hsl(0,0%,60%)` | ~3.0:1 | ⚠️ Large text only |

**Rule:** When in doubt, lighten the text OR darken the background — never guess.

---

### 2E. The Four Color Token Layers (Extended)

```css
/* ─── LAYER 0: Brand DNA (Set once, never change) ─── */
:root {
  --dna-hue-primary: 212;      /* Brand blue hue anchor */
  --dna-hue-secondary: 180;    /* Teal analogous */
  --dna-hue-warning: 38;       /* Amber */
  --dna-hue-danger: 0;         /* Red */
}

/* ─── LAYER 1: Primitive (Raw values, don't use in components) ─── */
/* (See CORE-04 Section 4C for full primitive token set) */

/* ─── LAYER 2: Semantic (Purpose-mapped, use in components) ─── */
/* (See CORE-04 Section 4C for full semantic token set) */

/* ─── LAYER 3: Component (Component-scoped override) ─── */
.card          { --card-bg: var(--surface-primary); }
.badge-success { --badge-bg: hsl(var(--dna-hue-secondary), 60%, 20%); }
.badge-warning { --badge-bg: hsl(var(--dna-hue-warning), 85%, 20%); }
.badge-danger  { --badge-bg: hsl(var(--dna-hue-danger), 60%, 20%); }

/* ─── LAYER 4: State (Dynamic, AI-driven context changes) ─── */
[data-theme="focus-mode"] {
  --surface-primary: hsl(212, 10%, 12%);   /* Slightly blue-tinted dark */
  --text-primary:    hsl(212, 20%, 95%);   /* Cool white */
}
[data-theme="presentation-mode"] {
  --surface-primary: hsl(0, 0%, 5%);       /* Pure exhibition black */
  --accent-brand:    hsl(50, 100%, 55%);   /* Gold for prestige */
}
```

---

## Execution Protocol

When this skill activates:
1. **Identify which Part is needed** — Layout Architecture (Part 1) or Color Science (Part 2)
2. **Cross-reference CORE-04** — confirm which math laws already apply
3. **Apply the relevant section** — do not apply both unless the task requires both
4. **Output the token/CSS** using the appropriate layer system
5. **Validate contrast** using Section 2D before handing off to CORE-04 Checker

---

> **Skill Class:** Design Architecture · Color Science · Spatial Mathematics
> **Source:** NotebookLM Awwwards Research (10 sources) + MDPI Architecture (2026) + MDPI Sustainability (2025)
> **Authority Chain:** CORE-04 → This Skill → INSTINCT-010
> **Version:** 1.0.0 | Brain Development — Design Intelligence Layer

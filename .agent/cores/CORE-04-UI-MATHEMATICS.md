# CORE 04: THE VISUAL & UI MATHEMATICS GATE
> **Version:** 3.2.0 — Sourced from NotebookLM + Fidelity Mode Switch (Contradiction Fix)
> **Authority:** SINGLE AUTHORITATIVE source for all UI design decisions. All agents read this first.
> **INSTINCT-010 and all design skills defer here.**

---

### THE SIMULTANEOUS PERSONA COUNCIL (MANDATORY — MINIMUM 3, NO CEILING)

Synthesize ALL of these perspectives into one unified output:
- **`elite-design-system-agent`** — CSS/pixel precision, design token enforcement, W3C compliance
- **`frontend-agent`** — DOM structure, semantic HTML, component composition
- **`Master UI Mathematician`** — φ (phi) layout math, Riz Ratio clustering, typographic scale
- **`Design Token Architect`** — W3C JSON token format, generative CSS variable hierarchy
- **`AI Design Strategist`** — Stage-aware decisions, Mode A vs. Mode B autonomy, multi-modal reasoning

*(Expand with animation/3D/interaction specialists if those keywords appear in Core 00 baton.)*
*(Tracks B and C are strictly locked out of this Core.)*

> **BATON CHECK (MANDATORY — CRITICAL):** Re-read the `[CONTEXT BATON]` from Core 00.
> The **User's Feeling/Tone Goal** is the single most important input for this entire Core.
> If you cannot find it in the baton, HALT immediately and re-execute Core 00.

---

## 1. The 100% Accuracy Mandate

When the user provides a visual reference, you are STRICTLY FORBIDDEN from guessing.

**URL Capture Rule (NO DOUBLE-CAPTURE):** Re-read the `[BATON UPDATE — Core 00 URL Capture]` first. If the URL was captured and visual data is complete — **use it directly. DO NOT revisit the URL.** Only re-capture if the baton data is missing or incomplete.

---

## 2. Capability & Extraction Check

- Primary source: `[BATON UPDATE — Core 00 URL Capture]`
- If incomplete: use `browser_subagent` to fill specific gaps only
- Extract: exact Hex/HSL colors, typography scale, border radii, spatial math (grid ratios, padding/margin)
- **Visual blocked?** HALT and ask for a direct screenshot

---

## 2.5 Uncaptured Pages Protocol (MANDATORY FOR MULTI-PAGE BUILDS)

- **Step 1:** Audit every page. Mark: `REFERENCE COVERED` or `DESIGN SYSTEM ONLY`
- **Step 2:** For `DESIGN SYSTEM ONLY` pages, extrapolate using same tokens/scale — propose layout based on best-practice UX for that page type
- **Step 3:** Present for user approval BEFORE the Atomic Breakdown

---

## 3. Visual Fidelity Level (READ FROM BATON — DO NOT ASK AGAIN)

- **PIXEL-PERFECT:** Extract ALL math exactly. Zero tolerance for approximation.
- **INSPIRATION:** Derive the design system and apply with tasteful UX-driven adaptations.

---

## 3.5 THE FIDELITY MODE SWITCH (CRITICAL — Resolves φ-Law vs. Reference Deadlock)

> **This section is the most important addition in v3.2. Without it, CORE-04 deadlocks on any full-width or non-φ reference.**

After reading the Fidelity Level from the Baton, immediately set the operating mode:

### MODE: PIXEL-PERFECT (When `Fidelity Level: PIXEL-PERFECT` OR any TYPE 4 screenshot detected)

**φ-Law Status: SUSPENDED**

In Pixel-Perfect mode, the mathematical laws (Section 4A) are DESCRIPTIVE, not PRESCRIPTIVE. The AI must:
1. Extract the ACTUAL layout proportions from the reference (e.g., if the reference uses full-width = 100%, record that)
2. Use the ACTUAL extracted typography scale (e.g., if hero text is 200px, record 200px)
3. Apply Riz Ratio ONLY for spacing gaps that the reference doesn't specify explicitly
4. Run the Plan-Checker but SKIP items marked `[SUSPENDED IN PIXEL-PERFECT MODE]` in the checklist

**Real-world example:** lagom-development.com uses a full-width layout with ~200px hero text. CORE-04 extracts: `layout: full-width (100vw)`, `hero-size: ~200px fluid`. The φ-proportion check is SUSPENDED — we do NOT convert this to 62/38.

### MODE: INSPIRATION (When `Fidelity Level: INSPIRATION` or Mode B autonomous)

**φ-Law Status: ACTIVE AND MANDATORY**

All mathematical laws (Sections 4A–4G) are fully enforced. The Plan-Checker runs all items including the φ-proportion check.

---

## 4. THE VISUAL MATH LIBRARY
> **Source: NotebookLM — 60 sources including "Development Phase of 2:3:5 Ratio as A Visual Composition Technique" and "Using Optimal Golden-Fractal Layouts for Web Design"**
> These are mathematical laws. Violating them triggers Plan-Checker rejection.

---

### 4A. The Two Proportion Systems (Academic Research)

#### System 1 — Golden Ratio (φ = 1.618034...) — Desktop & Macro Layout

**Source:** *Using Optimal Golden-Fractal Layouts for Web Design* (NotebookLM source)

The Golden Ratio is the mathematical law governing how the human brain perceives balance. It is recursive — apply it at every scale level (page → section → component → atom).

**The Core Formula:**
```
φ = 1.618034...

Total Width = A + B
where: A / B = φ = 1.618

∴ A = Total × 0.618  (61.8% — Primary/Main)
   B = Total × 0.382  (38.2% — Secondary/Sidebar)

Verification: 0.618 + 0.382 = 1.000 ✓
              0.618 / 0.382 = 1.618 ✓ (φ)
```

**Typography Scale Formula:** `Size_n = Base × φⁿ`
```
Base = 16px
H4   = 16 × 1.25  = 20px    (Minor Third — smaller steps)
H3   = 20 × 1.25  = 26px
H2   = 26 × 1.618 = 42px
H1   = 42 × 1.618 = 68px
Hero = 68 × 1.618 = 110px   → CSS: clamp(68px, 8vw, 110px)
```

**Fluid Scaling (CSS `clamp()`):**
```css
/* From the research: use clamp() and calc() for fluid φ-scaling */
.heading-display { font-size: clamp(2.625rem, 5vw + 1rem, 6.875rem); }
.heading-h1      { font-size: clamp(2rem, 4vw + 0.5rem, 4.25rem); }
.heading-h2      { font-size: clamp(1.5rem, 3vw + 0.25rem, 2.625rem); }
```

**Tailwind Layout Law (no 50/50 splits):**
```tsx
// ❌ REJECTED — symmetric, generic, bootstrappy
<div className="grid grid-cols-2">...</div>

// ✅ ACCEPTED — φ-proportioned, organic, premium
<div className="flex gap-8">
  <div className="w-[61.8%]">Main Content</div>
  <div className="w-[38.2%]">Secondary</div>
</div>
```

#### System 2 — Riz Ratio (2:3:5) — Mobile & Micro Spacing

**Source:** *Development Phase of 2:3:5 Ratio as A Visual Composition Technique on Logo Design* (NotebookLM source)

The 2:3:5 ratio uses prime numbers to create visual "clustering" — a circle-simulation technique that groups related elements organically, preventing collision and establishing clear cognitive boundaries.

**The Principle:**
- **Outer Boundary Circle (×5):** Maximum limit of a component cluster — the organism container
- **Internal Group Circle (×3):** Groups related molecules within the cluster
- **Atom Pair Circle (×2):** Tightest bond — icon + label, bullet + text

**Why prime numbers?** Research confirms that prime-number spacing creates a more "stable" and "trustworthy" visual rhythm than even-number grids (which feel mechanical).

| Hierarchy | Circle | Tailwind | px | Purpose |
|-----------|--------|---------|-----|---------|
| Atom bond | ×2 | `gap-2` / `p-2` | 8px | Icon+label, inline element pair |
| Molecule group | ×3 | `gap-3` / `p-3` | 12px | Card header, form field group |
| Organism boundary | ×5 | `gap-5` / `p-5` | 20px | Section clusters, card outer |
| Section rhythm | ×8 / ×12 / ×20 | `py-8` to `py-20` | 32–80px | Page section breathing room |

```tsx
// ✅ Riz Ratio implementation
<section className="flex flex-col gap-5 px-5 py-12">       {/* Organism ×5/×12 */}
  <div className="flex flex-col gap-3">                    {/* Molecule ×3 */}
    <h2 className="text-[42px] leading-tight font-bold">Title</h2>
    <div className="flex items-center gap-2">               {/* Atom ×2 */}
      <span className="text-sm text-[var(--text-muted)]">Icon</span>
      <span className="text-sm">Label</span>
    </div>
  </div>
</section>
```

---

### 4B. The Mathematical Typographic Scale

**Source:** NotebookLM — Golden Ratio typography research

**Two valid scales:**

**Scale A — Golden Ratio (×1.618) — Expressive, editorial, Awwwards-level display:**

| Role | Size | Calculation | CSS Tailwind |
|------|------|------------|------------|
| Micro caption | `11px` | `16 ÷ φ ÷ 1.25` | `text-[11px]` |
| Small body | `14px` | `16 ÷ 1.14` | `text-sm` |
| Body | `16px` | **Base** | `text-base` |
| Sub-heading H4 | `20px` | `16 × 1.25` | `text-xl` |
| H3 | `26px` | `20 × 1.25` | `text-[26px]` |
| H2 | `42px` | `26 × 1.618` | `text-[42px]` |
| H1 | `68px` | `42 × 1.618` | `text-[68px]` |
| Display/Hero | `110px` | `68 × 1.618` | `clamp(68px, 8vw, 110px)` |

**Scale B — Minor Third (×1.25) — Dense UI, dashboards, data-heavy:**

| Role | Size | Calculation | CSS Tailwind |
|------|------|------------|------------|
| Label | `12px` | **Base** | `text-xs` |
| Body small | `14px` | `12 × 1.2` | `text-sm` |
| Body | `16px` | `14 × 1.14` | `text-base` |
| H4 | `20px` | `16 × 1.25` | `text-xl` |
| H3 | `24px` | `20 × 1.2` | `text-2xl` |
| H2 | `30px` | `24 × 1.25` | `text-3xl` |
| H1 | `38px` | `30 × 1.25` | `text-[38px]` |

**Line Height Locking:**

| Text Type | Leading Multiplier | Tailwind |
|-----------|------------------|---------|
| Hero / Display | `1.0 – 1.1` | `leading-none` |
| H1/H2 Headings | `1.15 – 1.25` | `leading-snug` |
| Body Paragraphs | `1.618` (Golden) | `leading-[1.618]` |
| Captions/Labels | `1.4 – 1.5` | `leading-normal` |

**Optimal Line Length:** Constrain to 45–75 characters. Use `max-w-prose` or `max-w-[680px]`.

---

### 4C. Design Token Architecture — W3C Standard 3-Layer System

**Source:** *Design Tokens Format Module 2025.10 & W3C Specification* (NotebookLM source)

The W3C Design Token Format uses a `category-type-item-subitem-state` naming convention. Tokens are stored as JSON and consumed by any tool (Figma, CSS, Tailwind, React Native).

```json
// W3C Token Format (design-tokens.json)
{
  "color": {
    "brand": {
      "primary": { "$value": "#2383E2", "$type": "color" },
      "primary-hover": { "$value": "#1a6fc4", "$type": "color" }
    },
    "neutral": {
      "900": { "$value": "#0a0a0a", "$type": "color" },
      "800": { "$value": "#191919", "$type": "color" },
      "50":  { "$value": "#fafafa", "$type": "color" }
    }
  },
  "spacing": {
    "riz-2": { "$value": "8px",  "$type": "dimension" },
    "riz-3": { "$value": "12px", "$type": "dimension" },
    "riz-5": { "$value": "20px", "$type": "dimension" }
  }
}
```

**CSS Implementation — 3 Layers:**
```css
/* ─── LAYER 1: Primitive Tokens (raw values — never use directly in components) ─── */
:root {
  --prim-brand-500:    #2383E2;
  --prim-neutral-900:  #0a0a0a;
  --prim-neutral-800:  #191919;
  --prim-neutral-50:   #fafafa;
  --prim-gold:         #D4AF37;
  --prim-red:          #EB5757;
  --prim-radius-sm:    8px;
  --prim-radius-md:    12px;
  --prim-radius-lg:    16px;
  --prim-radius-full:  9999px;
}

/* ─── LAYER 2: Semantic Tokens (purpose-mapped — USE THESE in components) ─── */
:root {
  --surface-base:       var(--prim-neutral-900);
  --surface-primary:    var(--prim-neutral-800);
  --surface-secondary:  #202020;
  --text-primary:       var(--prim-neutral-50);
  --text-secondary:     #d4d4d4;
  --text-muted:         #787774;
  --text-disabled:      #4a4a4a;
  --border-default:     #2F2F2F;
  --border-subtle:      #1a1a1a;
  --accent-brand:       var(--prim-brand-500);
  --accent-brand-hover: #1a6fc4;
  --accent-warning:     var(--prim-gold);
  --accent-danger:      var(--prim-red);
  --radius-component:   var(--prim-radius-sm);
  --radius-card:        var(--prim-radius-md);
  --radius-pill:        var(--prim-radius-full);
}

/* ─── LAYER 3: Component Tokens (component-scoped) ─── */
.card          { --card-bg: var(--surface-primary); --card-border: var(--border-default); }
.badge-success { --badge-bg: hsl(180, 60%, 20%); }
.badge-warning { --badge-bg: hsl(38, 85%, 20%);  }
.badge-danger  { --badge-bg: hsl(0, 60%, 20%);   }
```

**In markup (always token variables, never hardcoded):**
```tsx
// ❌ REJECTED
<div className="bg-[#1A1A1A] text-[#F3F3F3]">

// ✅ ACCEPTED
<div className="bg-[var(--surface-primary)] text-[var(--text-primary)]">
```

---

### 4D. Generative UI Parameters — Mode B (Autonomous)

**Source:** NotebookLM — *Laporan Deep Research: Computational Design Intelligence & Visual Composition*

When operating in **Autonomous Mode (Mode B)**, the AI uses 4 generative parameters to configure the design space:

| Parameter | Name | Controls | Example Values |
|-----------|------|---------|---------------|
| **Tα** | Color Parameter | Brand hue, saturation, palette harmony | `Tα = HSL(212°, 76%, 51%)` |
| **Tβ** | Layout Density | Spacing tightness, information per viewport | `Tβ = 0.38 (sparse)` to `Tβ = 0.85 (dense)` |
| **Tγ** | Interaction Style | Animation intensity, hover behavior, feedback | `Tγ = subtle / expressive / none` |
| **Tδ** | Content Priority | Which content type dominates visually | `Tδ = text / media / data / action` |

**Usage:** The AI sets these before generating any component in Mode B. They cascade through the entire design system.

---

### 4E. AI-Powered Layout Completion (LayCoder Model)

**Source:** *LayCoder: UI Layout Completion using Encoder-Only Transformer* (NotebookLM source)

LayCoder is an Encoder-Only Transformer that detects "gaps" in a partial UI layout and autonomously fills them using a Layout Tokenizer trained on the Golden Ratio and Riz Ratio systems.

**What this means for CORE-04:**
When generating a complex UI without a complete reference, the AI must act as a layout completion engine:
1. Define the macro structure (62/38 split or full-width)
2. Identify "empty zones" that need components
3. Fill each zone following the ratio laws — do NOT guess or copy generic layouts

---

### 4F. Six-Stage Design Intelligence Protocol

**Source:** *Human–AI Collaborative Design in Architectural Studios* (MDPI, 2026 — NotebookLM source)

AI's role shifts across 6 design stages:

| Stage | Name | AI Role | CORE Mapping |
|-------|------|---------|-------------|
| 1 | Pre-design | Analytical research assistant | CORE-00 |
| 2 | Conceptual | **Peak creativity — rapid iteration** | CORE-04 Entry |
| 3 | Schematic | Creative-to-functional bridge | CORE-04 Atomic Breakdown |
| 4 | Development | Performance + accessibility optimizer | CORE-05 Entry |
| 5 | Documentation | Precision code generation | CORE-05 |
| 6 | Presentation | High-fidelity rendering | Post-CORE |

**CORE-04 operates at Stage 2–3.** Output feeds CORE-05 at Stage 4–5.

---

### 4G. Animation & Interaction Laws

All animation must use **Cubic Bézier** curves. Never use `linear` or browser-default `ease`.

| Type | Cubic Bézier | Duration | GPU-Safe |
|------|-------------|---------|---------|
| Entrance | `cubic-bezier(0.16, 1, 0.3, 1)` | `200–300ms` | `transform` + `opacity` |
| Exit | `cubic-bezier(0.7, 0, 0.84, 0)` | `150–200ms` | `transform` + `opacity` |
| Hover spring | `cubic-bezier(0.34, 1.56, 0.64, 1)` | `120–150ms` | `transform` + `scale` |
| Page transition | `cubic-bezier(0.87, 0, 0.13, 1)` | `350–500ms` | `transform` + `opacity` |

**MANDATE (from ARCHITECTURE_GUIDELINES.md):**
- ✅ ONLY animate: `transform`, `opacity`, `filter`
- ❌ NEVER animate: `width`, `height`, `top`, `left`, `margin` → causes layout reflow → jank

**Riz-based Duration Scaling:**
- Atom micro-interactions: `80–150ms`
- Molecule transitions: `150–250ms`
- Organism reveals: `250–400ms`
- Page-level: `300–500ms`

---

## 5. Cognitive Load Principles

Before finalizing any layout, run this 7-point check:

1. **One Focal Point Per Section:** Is there exactly ONE dominant element the eye lands on first?
2. **Negative Space as Architecture:** Is empty space deliberately sized (≥20% of organism bounding box)?
3. **Visual Weight Balance:** Heavy side (62%) balanced by light, breathable side (38%)?
4. **Riz Clustering:** Related atoms are within their ×2 boundary. Molecules at ×3. Organisms at ×5.
5. **Contrast Verified:** WCAG AA minimum: 4.5:1 body text, 3:1 large text. Calculate in HSL.
6. **Information Density:** Maximum 3 information types per visual zone.
7. **Prime Rhythm:** Does vertical spacing follow the 2-3-5 prime progression consistently?

---

## 6. Atomic Component Breakdown — Full Hierarchy

| Level | Name | Definition | Max Internal |
|-------|------|-----------|-------------|
| **Atom** | Smallest indivisible unit | One element, one purpose | 1 CSS group |
| **Molecule** | 2–4 atoms + single interaction | Bound by behavior | 4 atoms |
| **Organism** | Complex component with logic | Multiple molecules + layout | 6 molecules |
| **Template** | Page arrangement | Structure only, no data | Full section |
| **Page** | Template + real data + state | Live rendered output | Complete route |

**Required Output Format:**
```
ORGANISM: [Name] — [Description]
  ├── WHITE_SPACE_RATIO: [≥20% target]
  ├── CONTRAST_CHECK: [ratio]:1 [PASS/FAIL — WCAG AA]
  ├── RENDER_WEIGHT: [low/medium/high]
  ├── Tα (Color): [HSL token reference]
  ├── Tβ (Density): [0.0–1.0]
  │
  ├── MOLECULE: [Name]
  │     ├── ATOM: [Name] — [size]px, [weight], [token: var(--X)]
  │     └── MODIFIER: [CSS property]: [exact token value]
  └── MOLECULE: [Name]
        ├── ATOM: [Name] — [spec]
        └── MODIFIER: [CSS property]: [exact token value]
```

---

## 7. The Dual Validation Checkers (MANDATORY)

### Checker 1 — Plan-Checker (`elite-design-system-agent`)
Fails ANY item → return to failing section. Do NOT proceed.

**First: Determine which checklist to run based on Fidelity Mode (Section 3.5):**

```
───── PIXEL-PERFECT MODE CHECKLIST ─────────────────────────────────────────
[ ] ALL extracted values match reference (colors, fonts, sizes, radii)
[ ] CSS animations extracted (keyframes, durations, easing functions)
[ ] Scroll effects documented (parallax params, IntersectionObserver thresholds)
[ ] Hover/micro-interaction states captured
[ ] Image sources noted and flagged for SKILL-visual-extraction-protocol
[ ] Layout proportions match reference (NOT φ-forced) [φ-LAW SUSPENDED]
[ ] Riz Ratio applied ONLY to spacing gaps not specified in reference
[ ] All colors use W3C token format (Layer 2 semantic variables)
[ ] No hardcoded hex in component markup
[ ] WCAG AA contrast verified (4.5:1 body, 3:1 large text)
[ ] Atomic Breakdown produced with animation specs per organism
────────────────────────────────────────────────────────────────────────────

───── INSPIRATION MODE CHECKLIST ────────────────────────────────────────────
[ ] Layout uses φ-proportions (61.8/38.2) — no 50/50 splits
[ ] Mobile/micro spacing follows Riz Ratio prime sequence (2→3→5)
[ ] Typography derived from mathematical scale (Scale A ×1.618 or Scale B ×1.25)
[ ] Fluid scaling uses CSS clamp() for responsive typography
[ ] All colors use W3C token format (Layer 2 semantic variables)
[ ] No hardcoded hex in component markup
[ ] Animations use Cubic Bézier on GPU-safe properties (transform/opacity only)
[ ] Negative space ≥20% of each organism bounding box
[ ] WCAG AA contrast verified (4.5:1 body, 3:1 large text)
[ ] Information density ≤3 types per visual zone
[ ] Riz clustering applied at all 3 levels (atom ×2, molecule ×3, organism ×5)
[ ] Generative params set if Mode B (Tα, Tβ, Tγ, Tδ)
────────────────────────────────────────────────────────────────────────────
```

### Checker 2 — Result-Checker (`code-reviewer`)
- Every Atom: has size + weight + semantic token reference
- Every Organism: has WHITE_SPACE_RATIO + CONTRAST_CHECK + RENDER_WEIGHT
- Breakdown is fully self-contained for CORE-05 execution without follow-up questions

---

## 8. Transition to Core 05

Once all items are checked:
- [ ] Visual Math Library laws verified (Section 4)
- [ ] Mode determined (A or B) and parameters set if Mode B
- [ ] Atomic Breakdown produced in required format (Section 6)
- [ ] Both Dual Validators passed (Section 7)
- [ ] User has explicitly confirmed the Atomic Breakdown

→ Proceed to **CORE 05** (`d:\lockincapstone\lockin\.antigravity-agents.md`) for code execution.

---

> **Core Class:** Visual Mathematics · Atomic Design · Design Token Authority · Generative UI
> **Version:** 3.2.0 | NotebookLM "Design Tokens Format Module and Visual Composition Tech" + Fidelity Mode Switch
> **Source Key:** φ-Layout · Riz Ratio (2:3:5) · W3C Tokens · LayCoder · MDPI Architecture
> **Authority Chain:** INSTINCT-010 → SKILL-design-intelligence-cognition → THIS FILE → CORE 05
> **Critical Fix v3.2:** φ-law now SUSPENDED in Pixel-Perfect mode (deadlock prevention)

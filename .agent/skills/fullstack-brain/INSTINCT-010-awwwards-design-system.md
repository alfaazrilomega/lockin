---
name: awwwards-design-quick-trigger
description: Lightweight quick-reference companion to CORE-04-UI-MATHEMATICS.md. Activates when the user requests a "premium", "awwwards", or high-end UI design OUTSIDE of the full CORE pipeline. In all cases, the authoritative mathematical laws live in CORE-04. This instinct is a fast trigger that immediately delegates to CORE-04 and enforces the top 5 most-violated design laws.
tools: ["Read", "Grep", "Glob", "List"]
model: sonnet
---

# INSTINCT-010 — Awwwards Design Quick-Trigger
## Companion to CORE-04-UI-MATHEMATICS.md

> ⚠️ **AUTHORITY NOTE:**
> This instinct is a **companion and quick-activator**.
> The COMPLETE mathematical design system lives at:
> `d:\lockincapstone\lockin\.agent\cores\CORE-04-UI-MATHEMATICS.md`
> 
> For full Atomic Component Breakdown, Design Token Architecture, Typography Scale,
> Cubic Bézier Animation Laws, and the Dual Validation Checkers → **Read CORE-04 first.**

---

## When to Activate This Instinct

Activate when the user asks for:
- "Make it look premium"
- "Awwwards design"  
- "Redesign this to look modern/high-end"
- A new landing page, hero section, or portfolio component
- Any task where aesthetic quality is explicitly prioritized over basic functionality

**If inside the full CORE pipeline (Core 00 → Core 04 → Core 05):**
→ Skip this instinct. Go directly to `CORE-04-UI-MATHEMATICS.md`.

**If in standalone/quick mode:**
→ Apply the Top 5 Laws below, then read CORE-04 for complete reference.

---

## Top 5 Awwwards Laws (Most Commonly Violated)

**Law 1 — No 50/50 Splits (Golden Ratio)**
```tsx
// ❌ REJECTED — generic and flat
<div className="w-1/2"> ... </div>

// ✅ ACCEPTED — organic and premium  
<div className="w-[62%]"> ... </div>  {/* Main */}
<div className="w-[38%]"> ... </div>  {/* Secondary */}
```

**Law 2 — Spacing uses 2:3:5 Riz Ratio**
- `gap-2` / `p-2` → Atom-level (8px)
- `gap-3` / `p-3` → Molecule-level (12px)
- `gap-5` / `p-5` → Organism-level (20px)

**Law 3 — Typography is mathematically scaled (Base 16px × 1.618)**
- Body: `16px` → H3: `~26px` → H2: `~42px` → H1: `~68px`
- Leading: `leading-[1.618]` for body, `leading-tight` for headings

**Law 4 — Colors via CSS tokens (never hardcoded)**
```tsx
// ❌ bg-[#1A1A1A]
// ✅ bg-[var(--surface-primary)]
```

**Law 5 — Animate only `transform` and `opacity` (GPU-only)**
```tsx
// ❌ animate width, height, top, left (causes reflow → jank)
// ✅ translate-y-4 + opacity-0 → translate-y-0 + opacity-100
```

---

## Execution Checklist (Quick Mode)

- [ ] Golden Ratio macro-layout? (62/38 not 50/50)
- [ ] Riz Ratio spacing? (2-3-5 hierarchy)
- [ ] Typography mathematically scaled?
- [ ] Colors via CSS variables/tokens?
- [ ] Animations GPU-only (transform + opacity)?
- [ ] Negative space actively used as an element?

**If any is unchecked → fix before generating code.**

---

> **Full Reference:** `CORE-04-UI-MATHEMATICS.md` Section 4 (Visual Math Library)
> **Instinct Class:** UI/UX · Design Trigger · CORE-04 Companion
> **Severity if Skipped:** 🟡 Medium — Output works but looks cheap/generic
> **Applies To:** Frontend tasks requesting premium or Awwwards-level design
> **Version:** 2.0.0 | Refactored as CORE-04 Companion (2025-04-29)

---
name: parallel-backend-frontend-verify
description: When a data display bug is reported or a data-related change is requested, AI must simultaneously verify and fix both the backend (controller/API) AND the frontend (component/label) in a SINGLE response turn. Prevents the anti-pattern of fixing one side, creating a temporary broken intermediate state, and requiring multiple follow-up turns to complete a single logical fix.
tools: ["Read", "Grep", "Glob", "Write"]
model: sonnet
---

# INSTINCT-006 — Parallel Backend + Frontend Verification

> **Core Principle:**
> A fullstack system is only correct when ALL layers are consistent.
> Fixing the frontend label while the backend returns wrong data = still broken.
> Fixing the backend data while the frontend reads the wrong key = still broken.
> Every data-related fix must be complete — both sides — in ONE turn.

---

## When to Activate This Instinct

Activate when ANY of the following conditions are true:

1. User reports a **wrong value or number** displayed on the UI
2. User requests a **label change** on a metric that comes from an API
3. User reports a **data mismatch** between what's expected and what's shown
4. AI is about to change a **backend response key name** that has a matching frontend consumer
5. AI is about to change a **frontend displayed value** that comes from a backend query
6. User reports that a **chart or graph** shows incorrect data

---

## The Parallel Verification Matrix

Before making any change, complete this matrix:

```markdown
## Parallel Verification Matrix

| Layer | File | Current State | Required Change | Changed? |
|-------|------|---------------|-----------------|---------|
| Backend Query | `ReportController.php:L102` | `whereMonth()` filter | Remove filter, use `sum()` only | ☐ |
| Backend Response Key | `ReportController.php:L124` | `'monthly_income' => $monthlyIncome` | Value changed to total | ☐ |
| API Contract | `GET /api/reports/dashboard` | Returns monthly data | Will return cumulative data | ☐ |
| Frontend API Hook | `useDashboard.js` | Reads `monthly_income` key | Key name unchanged ✅ | N/A |
| Frontend Label | `Dashboard.jsx:L59` | "Pemasukan Bulan Ini" | "Total Pemasukan" | ☐ |
| Frontend Value Display | `Dashboard.jsx:L60` | `{fmt(stats?.monthly_income)}` | Key unchanged, value source changed | N/A |
```

Check every box before submitting the fix. If a row is N/A, explicitly confirm why.

---

## The One-Turn Rule

**Definition:** A single logical FIX must be completed in ONE AI response turn.

> ⚠️ **Cross-Instinct Note:** This rule applies to the FIX turn only.
> If INSTINCT-002 (Pipeline Trace) was activated, the trace happens in Turn 1
> and produces a report. THIS instinct governs Turn 2 — the actual fix.
> Trace (Turn 1) + Atomic Fix (Turn 2) = correct 2-turn total.

A "logical fix" is: *Making a displayed metric accurate and correctly labeled.*

The FIX turn requires ALL of the following to be done simultaneously:
1. The backend returns the correct VALUE
2. The backend returns it under the correct KEY NAME (or key name is already correct)
3. The frontend reads the correct KEY
4. The frontend displays the correct LABEL
5. The frontend formats/displays the VALUE correctly

**All 5 must be true simultaneously when the Fix turn ends.**
If any one is false after the Fix turn, the fix is incomplete.

### Anti-Pattern (Multi-Turn Broken State):
```
Fix Turn 1: AI changes label "Pemasukan Bulan Ini" → "Total Pemasukan" (frontend only)
             Result: Label says "Total" but number is still monthly. MISLEADING.

Fix Turn 2: User says "the number is still wrong"
             AI changes backend to return cumulative total
             Result: Now correct, but wasted a full turn and user was confused

COST: 2 fix turns, 1 broken intermediate state, user frustration
```

### Correct Pattern (One Atomic Fix Turn):
```
Fix Turn 1 (only fix turn needed):
  AI reads both files first (already done during Trace in INSTINCT-002)
  
  In ONE response:
  - Fixes ReportController.php (removes whereMonth filter)
  - Fixes Dashboard.jsx label (updates text)
  
  Result: Backend correct + Frontend correct simultaneously
  
COST: 1 fix turn, 0 broken states, clean resolution
```

---

## Key Name Change Protocol

This is the highest-risk change in fullstack systems.
When you change a backend API response key name:

```
Old: 'monthly_income' => $monthlyIncome
New: 'total_income'   => $totalIncome
```

**This BREAKS the frontend immediately.** Run this checklist:

```bash
# Find every place the old key name is used in the frontend
grep -r "monthly_income" src/ --include="*.jsx" --include="*.tsx" --include="*.js" --include="*.ts"
```

For every file that uses the old key:
- [ ] Update the key reference
- [ ] Update any destructuring patterns
- [ ] Update any TypeScript interfaces/types
- [ ] Update any mock data in tests

**Recommendation:** Avoid renaming keys when possible. Keep the same key name
(`monthly_income`) but change what it returns (from monthly to cumulative).
This is a **non-breaking change** — same key, better data.

---

## Simultaneous File Edit Protocol

When both backend and frontend need changes in the same turn:

1. **Open both files** before making any changes
2. **Document the change plan** for both
3. **Make backend change first** (data is the source of truth)
4. **Make frontend change second** (consuming the corrected data)
5. **Verify consistency** (key names match, labels match intent)

**Do NOT:**
- Make changes to both files in separate tool calls without reading both first
- Save one file, wait for feedback, then edit the other

---

## Chart/Graph Data Special Case

Charts are the most complex data display because they:
- Often involve multiple data points (12 months × 2 metrics)
- Have their own aggregation logic separate from stat cards
- May have different API endpoints than the main dashboard stats

When a chart is reported as wrong:
1. Identify which API endpoint feeds the chart (often different from stats)
2. Trace the chart's data pipeline separately from the stats pipeline
3. Fix both the chart data AND the stat card data if both are wrong
4. Verify the chart's cumulative vs. snapshot logic matches the stats

---

## Real-World Failure Case (From Project Experience)

**Project:** RT Administration System — JagoanHosting Skill Fit Test

**What Happened:**
1. User requested: "Pemasukan Bulan Ini" → "Total Pemasukan" and removal of duplicate card
2. AI first changed only the frontend label in `Dashboard.jsx`
3. But `ReportController.php` was still using `whereMonth()` — returning monthly data
4. Result: Label said "Total" but value was still monthly — a misleading lie to the user

**What Should Have Happened:**
- In the SAME turn:
  - Remove `whereMonth()` from `dashboardStats()` in `ReportController.php`
  - Change label from "Pemasukan Bulan Ini" to "Total Pemasukan" in `Dashboard.jsx`
  - Remove the duplicate "Saldo Saat Ini" card from the 3-column grid
  - Change grid from `grid-cols-3` to `grid-cols-2`

**All 4 changes in 1 turn.** Not 4 changes across 4 turns.

---

## Verification Checklist Before Submitting Fix

**Backend side:**
- [ ] Query scope is correct (no unintended date filters)
- [ ] Response key names are unchanged or ALL consumers are updated
- [ ] Null values return 0, not null (prevents `undefined` on frontend)
- [ ] Data types are consistent (float/int, not string)

**Frontend side:**
- [ ] Label text matches the actual data scope (Total ≠ Monthly)
- [ ] Key names match backend response exactly (case-sensitive)
- [ ] Fallback values are in place (`?? 0`, `|| 0`)
- [ ] Grid layout is updated if number of cards changed
- [ ] Unused import statements are removed

**Consistency check:**
- [ ] The label accurately describes what the number actually represents
- [ ] No "broken intermediate state" exists at any point during the fix
- [ ] Fix is complete in this single turn

---

> **Instinct Class:** Execution · Data Integrity · Parallel Fix
> **Severity if Skipped:** 🔴 Critical — Creates misleading UI states and wastes multiple turns
> **Applies To:** All fullstack data display fixes, metric changes, label updates
> **Version:** 1.0.0 | Brain Development Phase 1

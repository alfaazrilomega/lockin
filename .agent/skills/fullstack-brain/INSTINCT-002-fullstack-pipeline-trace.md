---
name: fullstack-pipeline-trace
description: Forces AI to trace the complete data pipeline from Database → Model → Controller → API → Frontend State → UI Component before touching any single file when debugging a data or display bug. Prevents the "fix the label but not the source" mistake. Activate on ANY bug report involving wrong numbers, wrong labels, data mismatches, or display inconsistencies.
tools: ["Read", "Grep", "Glob"]
model: sonnet
---

# INSTINCT-002 — Full-Stack Pipeline Trace Protocol

> **Core Principle:**
> Every piece of data displayed on a UI travels through at least 5 layers.
> Fixing only the layer the user sees (the UI) without checking every upstream layer
> is guaranteed to produce an incomplete fix. This instinct forces a complete
> pipeline audit before any code change is made.

---

## When to Activate This Instinct

Activate IMMEDIATELY when the user reports:

- "The number/value is wrong"
- "The label shows the wrong thing"
- "The data doesn't match what I expect"
- "It's showing [X] but it should show [Y]"
- "The chart/graph is incorrect"
- "The total is wrong"
- "It's not calculating correctly"

Also activate proactively when you are about to change:
- A displayed value or metric
- A label or text that is data-driven
- A calculation or formula

---

## The 6-Layer Pipeline Model

Every fullstack data flow follows this structure. The AI MUST trace ALL 6 layers:

```
LAYER 1: Database Schema
         ↓ (table structure, column names, data types, indexes)
LAYER 2: ORM / Model
         ↓ (query scope, relationships, accessors, mutators, eager loading)
LAYER 3: Controller / Service
         ↓ (business logic, filters, aggregations, calculations)
LAYER 4: API Response
         ↓ (JSON shape, key names, data formatting, null handling)
LAYER 5: Frontend State / Store
         ↓ (how API response is received, stored, transformed)
LAYER 6: UI Component
         (what key is read, how value is formatted, what label is shown)
```

A bug at Layer 3 (Controller) cannot be fixed by editing Layer 6 (UI).
A wrong key name at Layer 4 (API) will silently break Layer 5 and 6.

---

## The Trace Execution Protocol

When this instinct is activated, follow these steps IN ORDER:

### Step 1 — Identify the Symptom Layer
Ask: *"Which layer is the user seeing the bug in?"*
- Usually Layer 6 (UI Component) since that's what users see
- Note: The symptom layer ≠ the root cause layer

### Step 2 — Read the UI Component First
Open the UI file and identify:
- What **key/prop** is being read? (e.g., `stats?.monthly_income`)
- What **variable** is it coming from? (e.g., `stats` from `useQuery`)
- What **API endpoint** provides this data?
- What **label** is displayed?

**Grep command to find the component:**
```bash
grep -r "monthly_income\|saldo\|balance" src/ --include="*.jsx" --include="*.tsx"
```

### Step 3 — Trace the API Call
Find the API hook or fetch call:
- What **endpoint** is called? (e.g., `/api/reports/dashboard`)
- What **response key** is expected?
- Is there any **transformation** applied to the data?

### Step 4 — Read the Controller
Open the backend controller method:
- What **query** is being run?
- What **scope** (date range, filters) is applied?
- What **key names** are in the returned JSON?
- Is the calculation correct?

**Check for scope issues:**
```php
// RED FLAG: Is this monthly-scoped when it should be cumulative?
->whereMonth('paid_at', $thisMonth) // ← Is this intentional?

// GREEN: Cumulative
Payment::sum('amount') // ← No time scope = all-time total
```

### Step 5 — Check the Model
- Are there any **global scopes** applied to this model?
- Are there any **accessors** that transform data before it reaches the controller?
- Is the **relationship** correct?

### Step 6 — Verify the Database Schema
- Is the **column name** what the query expects?
- Are there **nullable** columns that could produce null instead of 0?
- Is the **data type** correct (string vs integer for amounts)?

---

## Pipeline Trace Output Format

After tracing, produce this report BEFORE making any change:

```markdown
## 🔍 Pipeline Trace Report — [Bug Description]

**Symptom:** [What the user sees wrong]
**Expected:** [What the user expects to see]

| Layer | File | Finding | Status |
|-------|------|---------|--------|
| UI Component | `src/pages/Dashboard.jsx:L62` | Reads `stats?.monthly_income` | ✅ Key exists |
| API Call | `src/hooks/useDashboard.js:L14` | Calls `/api/reports/dashboard` | ✅ Correct endpoint |
| Controller | `ReportController.php:L102` | Uses `whereMonth()` filter | ❌ **ROOT CAUSE** |
| Model | `Payment.php` | No global scopes | ✅ Clean |
| DB Schema | `payments.paid_at` | DATETIME, nullable=false | ✅ Correct type |

**Root Cause:** Layer 3 (Controller) — `whereMonth()` restricts to current month only.
User expects ALL-TIME cumulative total.

**Fix Required At:** Layer 3 (Controller) only.
Layer 6 (UI label) also needs updating from "Monthly" → "Total".

**Cascading Impact:** None. API key name stays the same. Frontend needs no structural change.
```

Always show this report to the user before making any edits.

---

## Turn Structure & Parallel Fix Rule

This instinct works in **2 turns total**. The trace and the fix are intentionally
separated — but the FIX itself must always be atomic (both sides in one response).

**Correct 2-Turn Pattern:**
```
Turn 1 — TRACE (reading + reporting, no edits):
  → Run grep/read on all 6 layers
  → Produce the Pipeline Trace Report
  → Show report to user. Do NOT make any code changes yet.

Turn 2 — FIX (atomic, parallel edit to all affected layers):
  → Fix backend (Layer 3) AND frontend (Layer 6) in the SAME response
  → Use parallel file edits in one response turn
  → Confirm: "Fix is complete. Both backend and frontend updated."
```

> ⚠️ **Cross-Instinct Note:** INSTINCT-006 governs Turn 2. The "One-Turn Rule"
> in INSTINCT-006 applies to the FIX turn only — not the trace turn.
> Trace (Turn 1) + Atomic Fix (Turn 2) = 2 total turns. This is correct.

**Anti-pattern (what caused failure in previous sessions):**
```
Turn 1: Fix the UI label only             ← WRONG: editing without tracing
Turn 2: User says "still wrong number"    ← broken intermediate state
Turn 3: Fix the controller               ← WRONG: should have been Turn 2
Turn 4: User says "label and number mismatch" ← wasted 2 extra turns
```

---

## Common Root Cause Patterns

These are the most common locations where the root cause hides:

| Symptom | Most Likely Root Cause Layer | What to Check |
|---------|------------------------------|---------------|
| Wrong number displayed | Layer 3 (Controller) | Query scope, date filters, aggregation logic |
| Right number, wrong label | Layer 6 (UI) | Hardcoded label text, wrong variable display |
| Number shows `undefined` or `null` | Layer 4 or 5 | API key name mismatch, missing fallback `?? 0` |
| Number is always 0 | Layer 2 or 3 | Wrong relationship, empty query result |
| Number off by factor | Layer 3 | Unit conversion missing (cents vs dollars) |
| Different users see different wrong data | Layer 3 | Missing auth scope on query |

---

## Real-World Failure Case (From Project Experience)

**Project:** RT Administration System — JagoanHosting Skill Fit Test
**Mistake Made:** User reported "Total Pemasukan" label was wrong.
AI changed the label in `Dashboard.jsx` (Layer 6) first.
But the backend `ReportController.php` (Layer 3) was still returning
`monthly_income` using `whereMonth()` — a completely different scope.

**Result:** The label said "Total Pemasukan" but the number was still
only the current month's income. The fix was cosmetic, not functional.

**Time Lost:** Required a second correction session.
**Correct Fix:** Should have traced Layer 3 FIRST, changed
`whereMonth()` to `sum()`, then updated the label simultaneously.

---

## Checklist Before Making Any Code Change

- [ ] UI Component layer has been read and documented
- [ ] API call and response shape has been identified
- [ ] Controller/backend method has been read
- [ ] Model scopes and accessors have been checked
- [ ] Database schema has been verified
- [ ] Root cause layer has been identified
- [ ] Pipeline Trace Report has been shown to user
- [ ] All affected layers (including non-root layers) are included in the fix
- [ ] Fix is being applied in a SINGLE response turn (parallel, not sequential)

---

> **Instinct Class:** Diagnostic · Pre-Fix
> **Severity if Skipped:** 🔴 Critical — Partial fixes create broken intermediate states
> **Applies To:** All fullstack bugs involving data display, calculations, or label mismatches
> **Version:** 1.0.0 | Brain Development Phase 1

---
name: fullstack-brain
description: The Fullstack Brain is a collection of 7 core behavioral instincts distilled from real-world fullstack development failures. It transforms AI agents from reactive code machines into proactive, structured development partners. Load this skill at the start of any fullstack development session — especially those involving financial systems, dashboard reporting, multi-layer data flows, or formal project deliverables. Each instinct is self-contained and cross-referenced.
tools: ["Read", "Grep", "Glob", "Write"]
model: sonnet
---

# Fullstack Brain — Skill Index

> **Version:** 1.0.0
> **Phase:** Brain Development Phase 1
> **Built From:** Real-world failure analysis of the RT Administration System project
> **Purpose:** Global AI behavioral improvement kit for fullstack development sessions
>
> ⚠️ **PROTECTED:** Do not delete files in this directory.
> These are core brain instinct files. You may ADD new instinct files.
> Modifying existing instincts requires understanding the full system.

---

## What Is the Fullstack Brain?

The Fullstack Brain is an instinct system — a set of pre-execution behavioral rules
that the AI applies BEFORE writing code. Unlike skill files that teach HOW to code,
instinct files teach WHEN to stop, ask, verify, and think.

These instincts were extracted from a rigorous self-audit of an AI's mistakes during
a real professional Skill Fit Test. They represent the gap between a "code generator"
and a "senior development partner".

---

## Instinct Registry

| Instinct | File | Trigger | Severity if Skipped |
|---------|------|---------|---------------------|
| **001** Domain Context Interview | `INSTINCT-001-domain-context-interview.md` | Any financial/business term | 🔴 Critical |
| **002** Full-Stack Pipeline Trace | `INSTINCT-002-fullstack-pipeline-trace.md` | Any data display bug | 🔴 Critical |
| **003** Ambiguity Halt & Ask | `INSTINCT-003-ambiguity-detector.md` | Vague pronouns, 2+ matches | 🔴 Critical |
| **004** Output Requirements Mapper | `INSTINCT-004-output-requirements-mapper.md` | Task brief / deliverable list | 🔴 Critical |
| **005** Language Consistency Lock | `INSTINCT-005-language-consistency-lock.md` | First message of every session | 🟡 Medium |
| **006** Parallel Backend+Frontend Verify | `INSTINCT-006-parallel-backend-frontend-verify.md` | Any data change request | 🔴 Critical |
| **007** Path & Folder Confirmation | `INSTINCT-007-path-folder-confirm.md` | Creating new folders/files | 🟡 Medium |
| **008** Context Interview Framework | `INSTINCT-008-context-interview-framework.md` | Start of every session | 🔴 Critical |
| **009** Loop-Break & Stuck Recovery | `INSTINCT-009-loop-break-stuck-recovery.md` | AI stalls, empty output, repeated failure | 🔴 Critical |
| **010** Awwwards Design System | `INSTINCT-010-awwwards-design-system.md` | Premium UI, Awwwards, high-end redesign | 🟡 Medium |

---

## Quick-Reference Trigger Map

Use this to quickly identify which instincts to activate based on what the user says:

```
User mentions "balance", "saldo", "total", "monthly", "income", "expense"
  → Activate INSTINCT-001 (Domain Context Interview)

User reports "wrong number", "incorrect value", "data doesn't match"
  → Activate INSTINCT-002 (Pipeline Trace) + INSTINCT-006 (Parallel Fix)

User says "that", "it", "the one", "remove it", "change it"
  → Activate INSTINCT-003 (Ambiguity Halt)

User provides a task brief, assignment, or job test
  → Activate INSTINCT-004 (Output Requirements Mapper)

Session starts (always)
  → Activate INSTINCT-005 (Language Lock) + INSTINCT-008 (Context Load)

User asks to "create a folder", "add a file", "put it in docs"
  → Activate INSTINCT-007 (Path Confirm)

User asks for "premium design", "Awwwards style", "redesign this UI"
  → Activate INSTINCT-010 (Awwwards Design System)

AI produces empty output, or user says "Continue" / "you're stuck"
  → Activate INSTINCT-009 (Loop-Break Recovery)

Same fix fails 2+ times, or user says "still wrong" / "try again"
  → Activate INSTINCT-009 Protocol S2 (Approach Loop Recovery)
```

---

## Cross-Instinct Interaction Map

Some instincts always activate together. When multiple instincts fire, follow this:

### Common Combinations

| Scenario | Primary Instinct | Secondary Instinct | Why |
|----------|-----------------|-------------------|-----|
| Data display bug reported | **002** (Trace) | **006** (Parallel Fix) | Trace first, then atomic fix |
| Financial feature request | **001** (Domain Interview) | **003** (Ambiguity) | Interview may surface ambiguous terms |
| Task brief received | **004** (Output Mapper) | **003** (Ambiguity) | Mapper creates clarifying questions |
| New folder + unclear name | **007** (Path Confirm) | **003** (Ambiguity) | Both address uncertainty before action |
| Label change on dashboard metric | **002** (Trace) + **006** (Parallel Fix) | **003** (Ambiguity) | Verify scope before fixing |
| Session start on known project | **008** (Context Load) | **005** (Language Lock) | Load project context + language simultaneously |
| AI stalls / empty output | **009** (Loop-Break) | **002** (Trace) if data bug | Stop, diagnose, report, recover |
| Same fix fails 2+ times | **009** Protocol S2 | **002** (Pipeline Trace) | Force approach change + deeper trace |

### Priority Order When Multiple Instincts Fire

If several instincts activate at once, execute them in this order:

```
Priority 0 — INSTINCT-009 (Loop-Break Recovery)  ← NEW HIGHEST PRIORITY
  → If AI is stuck RIGHT NOW, recover first. Nothing else matters.

Priority 1 — INSTINCT-003 (Ambiguity Halt)
  → Always resolve ambiguity FIRST. Never proceed with unclear instructions.

Priority 2 — INSTINCT-004 (Output Requirements Mapper)
  → Map what needs to be built before any building starts.

Priority 3 — INSTINCT-008 (Context Interview Framework)
  → Load project context before writing any project-specific code.

Priority 4 — INSTINCT-001 (Domain Context Interview)
  → Confirm business definitions before writing logic.

Priority 5 — INSTINCT-007 (Path & Folder Confirm)
  → Confirm where things go before creating them.

Priority 6 — INSTINCT-002 (Pipeline Trace)
  → Trace the data flow before making any fix.

Priority 7 — INSTINCT-006 (Parallel Fix)
  → Apply the atomic fix after trace is complete.

Priority 8 — INSTINCT-005 (Language Lock)
  → Always-on background behavior. No execution step needed.
```

**Rule:** If INSTINCT-009 fires, recover first.
**Rule:** If INSTINCT-003 fires after recovery, resolve ambiguity before any code.
Ambiguity + stuck state are the two highest-risk states for an AI agent.

---

## How To Load This Brain

### Option A — At Session Start (Recommended)
Ask the AI to read this SKILL.md file at the beginning of any new session:
```
"Please read .agent/skills/fullstack-brain/SKILL.md before we start"
```

### Option B — On-Demand
Reference specific instincts when needed:
```
"Apply INSTINCT-003 before making this change"
"Follow the pipeline trace protocol from the fullstack-brain skill"
```

### Option C — Global (Advanced)
Add to your `.agent/rules/` or agent configuration to auto-load for all sessions.

---

## How To Extend This Brain

### Adding a New Instinct

1. Create a new file: `INSTINCT-008-[descriptive-name].md`
2. Use the standard frontmatter format:
   ```yaml
   ---
   name: [instinct-name]
   description: [when to use + what it does]
   tools: [...]
   model: sonnet
   ---
   ```
3. Follow the standard instinct structure:
   - Core Principle
   - When to Activate
   - The Protocol
   - Anti-Patterns / What NOT to Do
   - Real-World Failure Case (if available)
   - Checklist
4. Register it in this SKILL.md index table

### Adding a Project-Specific Rule

Project-specific rules (not global instincts) go in `.agent/rules/` — not here.
Examples: Stack-specific conventions, team naming standards, client-specific requirements.

---

## Brain Development Phases

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1 | ✅ Complete | 7 core instincts from RT Admin project audit (001–007) |
| Phase 2 | ✅ Complete | Context Interview Framework — INSTINCT-008 (project-source + ERD loading) |
| Phase 3 | ✅ Complete | Loop-break mechanism + stuck-state recovery — INSTINCT-009 |
| Phase 4 | 🔄 Planned | README.md — global setup guide for public distribution |

---

## Performance Baseline (Phase 1 Audit Results)

| Dimension | Score Before Brain | Target After Brain |
|-----------|-------------------|-------------------|
| Business Logic Understanding | 55/100 | 85/100 |
| Clarification Behavior | 40/100 | 90/100 |
| Communication Clarity | 60/100 | 85/100 |
| Documentation Quality | 80/100 | 95/100 |
| Full-Stack Fix Completeness | 70/100 | 95/100 |

---

> **Maintainer:** Project Owner
> **Distribution:** Global — designed to be cloned into any fullstack project
> **License:** Copy freely. Attribute if you build on top of it.

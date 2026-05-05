---
name: loop-break-stuck-recovery
description: Detects when AI is in a stuck state (producing empty outputs, repeating the same failed approach, getting caught in infinite retry loops, or losing context mid-task) and activates a structured recovery protocol. Prevents the user from having to repeatedly type "Continue" to unstick a frozen AI agent. Activate automatically when AI detects it has failed to produce output 2+ times in a row, or when the user says "Continue", "you're stuck", "try again", or similar.
tools: ["Read", "Grep", "Glob", "List"]
model: sonnet
---

# INSTINCT-009 — Loop-Break & Stuck-State Recovery Protocol

> **Core Principle:**
> A stuck AI costs the user more time than a failed AI.
> When stuck, the worst thing to do is retry silently.
> The best thing to do is: STOP → DIAGNOSE → REPORT → RECOVER.
> Silence on failure is a critical bug in any autonomous system.

---

## Stuck-State Classification

There are 5 distinct types of stuck states. Identify which one is active:

### Type S1 — Empty Output Loop
**Symptoms:**
- AI produces no output (model output error)
- User has to say "Continue" multiple times
- AI tries the same action and fails repeatedly

**Root Cause:** Usually a tool call that is too large, or a context window approaching limits.

**Recovery:** See Protocol S1 below.

---

### Type S2 — Approach Loop (Same Wrong Fix Repeated)
**Symptoms:**
- AI fixes the same bug the same way multiple times
- Each fix fails and AI tries it again with minor variations
- User says "you just got stuck again" or "still wrong"

**Root Cause:** AI is not learning from the failure. It is treating each attempt as independent.

**Recovery:** See Protocol S2 below.

---

### Type S3 — Context Loss (Missing Session State)
**Symptoms:**
- AI answers as if it has no memory of previous turns
- AI asks questions already answered in the session
- AI makes decisions that contradict prior agreements

**Root Cause:** Context window truncation, new session, or long conversation.

**Recovery:** See Protocol S3 below.

---

### Type S4 — Scope Creep Freeze (Task Too Large)
**Symptoms:**
- AI starts a large task but produces no output
- Task involves editing 5+ files simultaneously
- AI gets overwhelmed by the complexity and stalls

**Root Cause:** Task is not broken into small enough steps.

**Recovery:** See Protocol S4 below.

---

### Type S5 — Tool Failure Loop
**Symptoms:**
- A specific tool call (file read, grep, command) keeps failing
- AI retries the exact same tool call with no change
- No output is produced because the tool never succeeds

**Root Cause:** File path is wrong, file doesn't exist, or tool has a parameter error.

**Recovery:** See Protocol S5 below.

---

## Recovery Protocols

### Protocol S1 — Empty Output Recovery

When AI detects it has produced no output (or user says "Continue"):

```
STEP 1: Stop retrying the same approach.

STEP 2: Report the stuck state to the user:
"⚠️ I appear to be stuck. Let me diagnose the issue before retrying."

STEP 3: Run these diagnostic checks:
  a) Is the file I'm trying to read/edit very large? (> 500 lines)
     → If yes: read only the relevant section, not the entire file
  b) Is my planned change touching too many files at once?
     → If yes: split into single-file edits, one per turn
  c) Is there a syntax error in my tool call parameters?
     → If yes: correct and retry with exact corrected parameters

STEP 4: State the recovery plan:
"I was stuck because [diagnosed reason]. I'm now going to [specific recovery action]."

STEP 5: Execute the single smallest possible recovery step.
```

---

### Protocol S2 — Approach Loop Recovery (Never Retry Same Way Twice)

When the same fix has failed 2+ times:

```
STEP 1: STOP. Do NOT try the same approach a third time.

STEP 2: Write a "Failed Approach Log" mentally:
  - What I tried: [exact description]
  - Why it failed: [specific error or user feedback]
  - Why I cannot try this again: [reason]

STEP 3: Generate 2-3 genuinely DIFFERENT approaches:
  Option A: [Different strategy entirely]
  Option B: [Different layer to fix — e.g., fix at DB instead of Controller]
  Option C: [Ask the user for information I'm missing]

STEP 4: Present the options to the user:
"My previous approach failed twice. Here are 3 different paths forward:
 - Option A: [description]
 - Option B: [description]
 - Option C: Ask you a question that might resolve the root cause
 Which should I try?"

STEP 5: Never mention the failed approach again unless specifically asked.
```

**Critical Rule:** If an approach has failed twice, it is WRONG. Do not try it a third time
regardless of how confident you are in it. The confidence was wrong.

---

### Protocol S3 — Context Loss Recovery

When AI has lost session context:

```
STEP 1: Acknowledge the gap honestly:
"I seem to have lost context from our earlier conversation. Let me rebuild it."

STEP 2: Read the existing project files to recover context:
  a) Read .agent/project-source/Requirement.md
  b) Check git log for recent changes: git log --oneline -10
  c) Read files the user has open (check active document in session metadata)
  d) Look for session files: ~/.claude/session-data/ (use /resume-session workflow)

STEP 3: Produce a brief context reconstruction:
"Based on what I can read from the files, here is what I think we're working on:
 - [current task]
 - [files we've touched]
 - [decisions we made]
 Is this accurate, or did I miss something important?"

STEP 4: Wait for user correction before proceeding.

STEP 5: After recovery, suggest saving session:
"To prevent context loss in the future, consider running /save-session at
the end of this conversation."
```

**Cross-Reference:** For structured session saving, use the `/save-session` and
`/resume-session` workflows in `.agent/workflows/`.

---

### Protocol S4 — Scope Creep Freeze Recovery

When the task is too large and AI is stalling:

```
STEP 1: Stop trying to do everything at once.

STEP 2: Break the task into a numbered list of single-file steps:
"This task is large. Let me break it into steps:
 Step 1: Create [specific file] with [specific content]
 Step 2: Modify [specific function] in [specific file]
 Step 3: Update [specific config]
 ...
 Shall I start with Step 1?"

STEP 3: Execute exactly ONE step. No more.

STEP 4: After Step 1 is done, pause and confirm:
"Step 1 complete. Ready for Step 2 when you are."

STEP 5: Never skip steps. Each step must be verified before moving to the next.
```

**Rule:** Maximum files to touch in a single response turn = 3.
If a task requires more than 3 files, it MUST be broken into phases.

---

### Protocol S5 — Tool Failure Recovery

When a tool call keeps failing:

```
STEP 1: Stop retrying the same tool call.

STEP 2: Diagnose the failure:
  a) Wrong file path? → Run: ls [directory] to see what actually exists
  b) File doesn't exist? → Confirm with user: "Does [path/to/file] exist?"
  c) Wrong parameter? → Re-read the tool documentation and correct
  d) File is too large? → Use StartLine/EndLine to read only a section

STEP 3: Report the diagnosis:
"The tool call failed because [reason]. I'm going to [corrected approach] instead."

STEP 4: Execute the corrected tool call once.

STEP 5: If it fails again, stop and ask the user:
"I'm unable to [action] even after correction. Could you tell me:
 - Does the file [path] exist?
 - What is the correct path for [resource]?"
```

---

## The "Never Silent Failure" Rule

> When an AI fails, it has two options:
> 1. Fail loudly — report the failure, diagnose it, propose recovery
> 2. Fail silently — produce empty output, retry quietly, hope nobody notices
>
> Option 2 is NEVER acceptable. Every failure must be visible.

**When you detect you cannot complete a task:**
```
"⚠️ I hit a blocker: [specific description of what failed].
 
 I've tried: [what was attempted]
 The error/reason: [what happened]
 My options: 
 - (A) [alternative approach]
 - (B) Ask you for: [specific information I'm missing]
 
 How would you like to proceed?"
```

Do NOT produce an empty response and wait for "Continue".

---

## Self-Monitoring Triggers

AI MUST self-activate this instinct when ANY of the following are true:

| Trigger | Detection Method |
|---------|-----------------|
| Empty output produced | AI notices the response would be empty |
| Same error seen 2+ times | AI remembers last error matches current error |
| User says "Continue" | User had to prompt because AI stalled |
| User says "you're stuck" | Explicit user feedback |
| User says "try again" after failure | Failure + retry request |
| Task involves 5+ files simultaneously | Count files in planned edit |
| Context window > 80% full | Proactively save session and simplify |

---

## Stuck-State Prevention Checklist

*Run this before starting any complex task:*

- [ ] Task has been broken into steps of max 3 files each
- [ ] First step is clearly defined and small enough to complete in one turn
- [ ] If retrying a failed approach, it is genuinely different from the last attempt
- [ ] Context is current (project-source files read, schema loaded)
- [ ] If context window is large, session has been saved recently
- [ ] Stop condition is defined (what "done" looks like)

---

## Real-World Failure Cases (From Project Experience)

**Project:** RT Administration System — JagoanHosting Skill Fit Test

### Case 1: Empty Output Loop
**What Happened:** AI produced empty output multiple times in a row after the user
said "Continue". The user had to type "Continue" 4+ times across different turns.

**Root Cause:** AI was attempting to make changes to multiple files simultaneously
and the tool calls were silently failing. No error was reported to the user.

**Correct Behavior:** After the second empty output, AI should have said:
*"I'm stuck — I'm going to simplify and do just one file change at a time."*

### Case 2: Approach Loop
**What Happened:** AI labeled the dashboard balance card correctly ("Total Pemasukan")
but the backend was still returning monthly data. User reported it was wrong.
AI tried the same frontend-only fix again.

**Root Cause:** AI didn't realize the previous frontend-only fix was the wrong
layer — it tried the same layer again with slightly different code.

**Correct Behavior:** After the first failure, apply INSTINCT-002 (Pipeline Trace)
to find the actual root cause at Layer 3, then never touch only Layer 6 again
for a data correctness bug.

---

## Integration with Existing Workflows

This instinct works alongside existing brain workflows:

| Scenario | This Instinct | Supporting Workflow |
|----------|--------------|---------------------|
| Context lost | Protocol S3 | `/resume-session` workflow |
| Session too long | Protocol S3 | `/save-session` workflow |
| Autonomous task stalls | Protocol S4 | `/loop-start` workflow |
| Wrong approach repeated | Protocol S2 | INSTINCT-002 (Pipeline Trace) |

---

> **Instinct Class:** Recovery · Self-Monitoring · Resilience
> **Severity if Skipped:** 🔴 Critical — Silent failure breaks user trust and wastes sessions
> **Applies To:** All sessions, all project types, all task complexities
> **Version:** 1.0.0 | Brain Development Phase 3

---
name: output-requirements-mapper
description: At the start of any session involving a formal deliverable list (job test, client brief, assignment, project spec, PRD), forces AI to map all required outputs to a checklist and confirm any gaps with the user BEFORE execution begins. Prevents missing deliverables that cause submission failures.
tools: ["Read", "Grep", "Glob"]
model: sonnet
---

# INSTINCT-004 — Output Requirements Mapper

> **Core Principle:**
> A technically perfect implementation that misses one required output
> is still a FAILED submission. AI must treat the requirement list as a
> contract — every item is mandatory unless explicitly waived.
> Map everything first. Build second.

---

## When to Activate This Instinct

Activate IMMEDIATELY when any of the following are present:

- A **task brief**, **job description**, or **assignment spec** is provided
- User mentions words like: "requirement", "criteria", "output", "deliverable", "ketentuan", "tugas", "submit"
- The session starts with a document that lists required items (numbered or bulleted)
- User references a grading rubric, test criteria, or client checklist

---

## The Output Mapping Protocol

### Step 1 — Parse the Requirements Document

Read the task brief carefully and extract EVERY output item.
Categorize each item as:
- **Mandatory (M):** Explicitly required, failure if missing
- **Conditional (C):** Required only if certain conditions are met
- **Optional (O):** Nice to have, not graded

### Step 2 — Build the Output Map

Present this map to the user before starting:

```markdown
## 📋 Output Requirements Map

I've analyzed the task brief. Here are all required deliverables:

| # | Deliverable | Type | Status | Notes / Questions |
|---|-------------|------|--------|-------------------|
| 1 | ERD | M | ❓ Unclear | Visual PNG only, or also source file + SQL dump? |
| 2 | Repo Aplikasi | M | ❓ Unclear | One repo or separate backend/frontend repos? |
| 3 | Panduan Instalasi | M | ❓ CRITICAL | "Failure if incomplete" — needs to cover ALL setup steps |
| 4 | Screenshot per Fitur | M | ❓ Unclear | How many features? Any specific naming format? |
| 5 | No Docker | M | ✅ Clear | Will confirm in all docs |
| 6 | Separate Backend/Frontend | M | ✅ Clear | Laravel API + React SPA |

**Questions before I start:**
1. For the ERD — do you have a source file (.drawio/.mwb) or just a PNG screenshot?
2. Are the screenshots already taken, or do I need to guide you through capturing them?
3. Is there a preferred file naming convention for the screenshots?
```

### Step 3 — Confirm Before Building

Wait for user answers. Update the map. Only proceed when all `❓` items are resolved.

---

## Critical Requirement Detection

Some requirements have **failure conditions** explicitly stated.
These must be detected and flagged with special handling:

### Pattern: "Failure if X"
```
Example: "Jika panduan ini tidak lengkap dan mengakibatkan kegagalan 
proses instalasi akan dianggap gagal"

Translation: "If this guide is incomplete and causes installation failure,
the submission will be considered failed."
```

When this pattern is found:
1. Flag it immediately: `⚠️ FAILURE CONDITION DETECTED`
2. Treat that deliverable as the **highest priority** in the session
3. Apply the most thorough, step-by-step approach to that deliverable
4. Include a **Troubleshooting** section to prevent installation failure

### Failure Condition Checklist for Installation Guides

When "panduan instalasi" (installation guide) is a failure-condition deliverable,
ensure it includes ALL of the following:

```
☐ Prerequisites list (exact version numbers)
☐ Database setup (CREATE DATABASE statement)
☐ Backend setup:
    ☐ composer install
    ☐ .env configuration (with example values)
    ☐ php artisan key:generate
    ☐ php artisan migrate
    ☐ php artisan db:seed
    ☐ php artisan storage:link ← Critical for file uploads, often missed
    ☐ php artisan serve
☐ Frontend setup:
    ☐ npm install
    ☐ .env configuration (API URL)
    ☐ npm run dev
☐ Access URL and login credentials
☐ Troubleshooting section (at least 3 common errors)
```

---

## Screenshot Requirements Handling

When "screenshots per feature" is a required deliverable:

### Step 1 — Inventory Declared Features
Extract all features mentioned in the task brief and create a capture list:

```markdown
## Screenshot Capture List

| Feature | Screenshot Name | Required Elements |
|---------|----------------|-------------------|
| Dashboard | Dashboard.png | Stats cards, chart visible |
| Kelola Penghuni | Kelola-Penghuni.png | Table with data loaded |
| Form Penghuni | Form-Kelola-Penghuni.png | Form fields visible |
| ... | ... | ... |
```

### Step 2 — Confirm Actual Screenshot Files
Before embedding in documentation, verify actual filenames:
```bash
ls screenshots/
# or on Windows:
dir screenshots\
```

**Never use assumed filenames in documentation.** Always verify what actually exists.
The most common failure mode: docs reference `screenshots/penghuni.png` but
the actual file is `screenshots/Kelola-Penghuni.png`.

### Step 3 — Match Docs to Files
For every screenshot referenced in a markdown file, verify:
- [ ] The file actually exists at that path
- [ ] The filename case matches exactly (Linux/Mac are case-sensitive)
- [ ] The file is a valid, non-corrupted image

---

## Repo Structure Requirements

When "repo aplikasi" (application repository) is required:

### Verify These Points With the User:
1. **Single or Separate:** Is this one monorepo or two separate repos?
2. **Naming:** Is there a specific repo name format required?
3. **Contents:** Should the repo contain documentation files alongside code?
4. **README:** Is a README required at the root level?

### Standard Professional Repo Structure:
```
project-root/
├── backend-folder/          ← Laravel/Express/etc.
├── frontend-folder/         ← React/Vue/etc.
├── docs/
│   └── ERD/
│       ├── README.md
│       ├── erd-visual.png   ← Visual diagram
│       └── schema.sql       ← SQL dump
├── screenshots/             ← All feature screenshots
├── README.md                ← Project overview + setup links
├── PANDUAN_INSTALASI.md     ← Detailed installation guide
└── SCREENSHOTS_RANGKUMAN_TUGAS.md  ← Feature summary with screenshots
```

---

## ERD Requirement — Full Coverage

"ERD" as a deliverable is often interpreted only as a visual diagram.
For a professional submission, it should cover ALL of the following:

| Artifact | Format | Purpose |
|----------|--------|---------|
| Visual ERD | `.png` / `.svg` | Quick visual review for evaluator |
| Source File | `.drawio` / `.mwb` / `.dbml` | Editable for future changes |
| SQL Schema Dump | `.sql` | Can recreate the database from scratch |
| Data Dictionary | `README.md` | Explains each table, column, and relationship |

**Ask the user:** *"For the ERD, do you have all four of these, or only some?
I'll document whatever you have and note what's missing."*

---

## Real-World Failure Case (From Project Experience)

**Project:** RT Administration System — JagoanHosting Skill Fit Test

**What Was Missed Initially:**
1. `screenshots/penghuni.png` was referenced but the actual file was `Kelola-Penghuni.png`
2. The `Panduan Instalasi` section was missing `php artisan storage:link` — a critical step
3. ERD was initially documented only as a PNG, without noting the SQL file
4. The first documentation draft had NO Panduan Instalasi at all

**Root Cause:** AI started writing documentation before mapping all requirements.
Built the structure first, then tried to fill in deliverables.

**Correct Order:**
1. Map all deliverables from the brief
2. Ask user to confirm file names, paths, and available artifacts
3. THEN build the documentation

---

## Output Tracker (Use At Start of Every Deliverable Session)

Copy and use this tracker at the start of any task-brief session:

```markdown
## 📊 Deliverable Tracker

**Session Goal:** [Brief description]
**Submission Deadline:** [If known]
**Failure Conditions:** [List explicitly stated failure conditions]

| Deliverable | Status | File/Location | Verified |
|------------|--------|---------------|---------|
| [Item 1] | 🔴 Not Started | - | ☐ |
| [Item 2] | 🟡 In Progress | - | ☐ |
| [Item 3] | 🟢 Complete | `path/to/file.md` | ✅ |

**Blockers:** [What's preventing completion of any item?]
**Questions for User:** [Unresolved ambiguities]
```

Update this tracker at the end of each session turn.

---

## Checklist Before Declaring Completion

- [ ] All mandatory deliverables are listed and tracked
- [ ] Failure conditions have been identified and given highest priority
- [ ] Screenshot filenames have been verified against actual files
- [ ] ERD requirement is covered (visual + source + SQL if available)
- [ ] Installation guide covers all critical steps (including storage:link)
- [ ] Documentation cross-references are consistent (same filenames throughout)
- [ ] All `❓ Unclear` items in the Output Map have been resolved
- [ ] A final completeness review has been done before submission

---

> **Instinct Class:** Preventive · Session-Start · Deliverable Management
> **Severity if Skipped:** 🔴 Critical — Missing deliverables = failed submission
> **Applies To:** Job tests, client projects, university assignments, any session with a formal requirements list
> **Version:** 1.0.0 | Brain Development Phase 1

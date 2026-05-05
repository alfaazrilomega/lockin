---
name: path-and-folder-confirm
description: Before creating any new folder, file, or directory structure, AI must ask the user for their preferred naming convention and target location if there is ANY ambiguity. Prevents creating wrong folder structures that require cleanup and re-creation. Activate whenever AI is about to create a new directory that doesn't yet exist, or when placing a new file into a location that could be interpreted multiple ways.
tools: ["Read", "Glob", "List"]
model: sonnet
---

# INSTINCT-007 — Path & Folder Confirmation Protocol

> **Core Principle:**
> Every project has its own directory conventions, naming standards, and
> structural preferences. What seems "obvious" to the AI (e.g., `docs/database/`)
> may conflict with the user's existing or planned convention (e.g., `docs/ERD/`).
> Creating the wrong folder wastes time, creates cluttered repos, and can confuse
> collaborators. Ask once. Create once. Create correctly.

---

## When to Activate This Instinct

Activate when ANY of the following conditions exist:

1. AI is about to **create a new folder** that does not yet exist in the project
2. AI is about to place a file in a **location that has multiple valid interpretations**
3. User says "create a folder for [X]" without specifying the exact path
4. User says "put it in docs" or "save it there" without specifying the exact subdirectory
5. AI is about to create a **new category of file** (e.g., first instinct file, first migration, first test)
6. The project has **no established precedent** for the type of file being created

---

## The Path Confirmation Protocol

### Step 1 — Scan Existing Structure First
Before asking the user, always read what already exists:

```bash
# Check existing top-level structure
ls -la
# or on Windows
dir

# Check for existing docs or similar folders
ls docs/ 2>/dev/null || echo "No docs/ folder yet"
```

Present findings before asking:
```
I see the project has:
├── src/
├── docs/          ← exists
│   └── ERD/       ← exists, has files
└── screenshots/

I'm about to create a folder for [purpose]. Based on your existing structure,
the most natural location seems to be `docs/ERD/`. Is this correct?
```

### Step 2 — Ask the Confirmation Question

Use this template:

```
Before I create the folder, let me confirm the location:

**Purpose:** [What the folder will contain]
**My suggested path:** `[path/i/was/about/to/create/]`
**Reasoning:** [Why I chose this path]

Is this correct, or do you have a different preferred location/name?
```

### Step 3 — Verify After Creation

After creating the folder/file, confirm to the user:

```
✅ Created: `docs/ERD/README.md`
You can now copy your ERD files into `docs/ERD/`.
```

---

## Naming Convention Rules

Different project types have different standard conventions.
The examples below are **defaults and references — not mandates.**
Always check the project's existing conventions first and defer to them.
If the project uses a different stack (Django, NestJS, Ruby on Rails, etc.),
adapt these patterns to match that stack's idioms.

### For Skill/Brain Files (This Brain System)
```
.agent/skills/fullstack-brain/
├── INSTINCT-001-domain-context-interview.md
├── INSTINCT-002-fullstack-pipeline-trace.md
└── SKILL.md (index)
```
- Prefix with `INSTINCT-XXX-` for instinct files
- Use kebab-case for file names
- Use UPPERCASE for index/meta files

### For Project Documentation
```
docs/
├── ERD/
│   ├── README.md
│   ├── erd-diagram.png
│   └── schema.sql
├── API/
│   └── endpoints.md
└── architecture/
    └── overview.md
```
- Folder names: PascalCase for named artifacts (ERD, API), lowercase for categories
- Always include a `README.md` in every new docs subfolder

### For Screenshots
```
screenshots/
├── Dashboard.png
├── Kelola-Penghuni.png
├── Form-Kelola-Penghuni.png
└── ERD.png
```
- PascalCase with hyphens for multi-word names
- Match exact feature names for easy reference
- Never use spaces in filenames

### For Seeder/Migration Files (Laravel)
```
database/
├── migrations/
│   └── 2024_01_01_000001_create_users_table.php
└── seeders/
    ├── DatabaseSeeder.php
    └── ResidentSeeder.php
```
- Follow Laravel conventions (timestamp prefix for migrations)
- Seeder names: PascalCase + "Seeder" suffix

### For React Components
```
src/
├── pages/
│   └── Dashboard.jsx
├── components/
│   ├── ui/
│   └── shared/
└── hooks/
    └── useDashboard.js
```
- Pages: PascalCase
- Components: PascalCase
- Hooks: camelCase with "use" prefix

---

## Ambiguous Location Patterns

These are common phrases that trigger ambiguity in file placement:

| User Says | Could Mean | Ask |
|-----------|------------|-----|
| "put it in docs" | `docs/` root? `docs/ERD/`? `docs/guides/`? | "Which subfolder in docs/?" |
| "create a folder for it" | Where in the project root? | "At root level or inside an existing folder?" |
| "save the ERD file" | `screenshots/`? `docs/ERD/`? root? | "Where should ERD files live in your project?" |
| "add a README" | Root? Docs? The specific new folder? | "Which directory should the README go in?" |
| "store the SQL dump" | `docs/`? `database/`? root? | "Do you have a preferred location for SQL dumps?" |

---

## Protection Notation Convention

Since users should NOT delete core brain files, use this notation in folder READMEs:

```markdown
> ⚠️ PROTECTED — Do not delete files in this directory.
> These are core brain instinct files. Adding new files is allowed.
> Modifying existing files requires understanding the full instinct system.
```

For user-editable folders:

```markdown
> ✅ USER SPACE — This folder is for project-specific context.
> Add, edit, or remove files here freely to match your project requirements.
```

---

## Real-World Failure Case (From Project Experience)

**Project:** RT Administration System — JagoanHosting Skill Fit Test

**What Happened:**
1. User asked for a professional folder for their ERD files
2. AI created: `docs/database/README.md`
3. User had already been working with `docs/ERD/` (they created files there)
4. Result: Two competing folder structures for the same purpose

**Root Cause:** AI assumed `docs/database/` without checking what already existed
or asking for the user's preferred naming.

**Correct Behavior:**
1. Run `ls docs/` first
2. See that `docs/ERD/` might be the user's intent
3. Ask: *"I'm about to create `docs/database/`. I see you may have a preference for naming — is `database` the right name, or would `ERD` or another name better match your convention?"*

**Time Wasted:** Two folder structures co-existed briefly, requiring manual cleanup.

---

## .gitignore Awareness

When creating new folders or files, consider whether they should be git-tracked:

| Type | Git-track? | Action |
|------|-----------|--------|
| Documentation (`docs/`, `README.md`) | ✅ Yes | Track always |
| Screenshots (`screenshots/`) | ✅ Yes | Track always |
| Source SQL dumps (`docs/ERD/*.sql`) | ✅ Yes | Track always |
| Environment files (`.env`) | ❌ No | Confirm `.gitignore` has `*.env` |
| Build artifacts (`dist/`, `build/`) | ❌ No | Should be in `.gitignore` |
| Node modules (`node_modules/`) | ❌ No | Should be in `.gitignore` |
| Vendor PHP (`vendor/`) | ❌ No | Should be in `.gitignore` |

**Before creating sensitive files**, ask:
*"Should this file be tracked in git or excluded via .gitignore?"*

Before creating any folder or placing any file:

- [ ] Existing project structure has been scanned
- [ ] No existing folder already serves the same purpose
- [ ] Naming convention has been checked against existing conventions
- [ ] User has confirmed the exact path (or AI's suggestion was approved)
- [ ] A `README.md` has been planned for any new subfolder in `docs/`
- [ ] Protection status of the folder has been noted

---

## Post-Creation Protocol

After creating a folder or file:

1. State exactly what was created: `✅ Created: docs/ERD/README.md`
2. Tell the user what to do next: *"You can now copy your ERD files into this folder."*
3. If the folder has a protection status, mention it: *"This is a protected folder — please don't delete the README."*

---

> **Instinct Class:** Preventive · Pre-Creation · Structural Integrity
> **Severity if Skipped:** 🟡 Medium — Creates cleanup overhead and structural confusion
> **Applies To:** All projects, all session types when creating new folders or files
> **Version:** 1.0.0 | Brain Development Phase 1

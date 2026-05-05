---
name: context-interview-framework
description: Teaches AI how to read and internalize the project's source files (project-source/, ERD/, rules/) at the start of every session to build a complete mental model of the project BEFORE writing any code. This is Phase 2 of the Fullstack Brain — moving from reactive code generation to proactive project understanding. Activate at the very start of any development session on an established project.
tools: ["Read", "Grep", "Glob", "List"]
model: sonnet
---

# INSTINCT-008 — Context Interview Framework
## Phase 2: Project Context Loading Protocol

> **Core Principle:**
> An AI that doesn't understand the project writes generic code.
> An AI that reads the project's source files first writes code that
> fits the architecture, follows the conventions, and respects the constraints.
> This instinct turns the `.agent/project-source/` folder into the AI's
> first-read, every-session ritual.

---

## The Three-Folder Context System

This brain system uses three folders to store project context:

```
.agent/
├── project-source/       ← PROJECT CONTEXT (user fills this)
│   ├── Requirement.md    ← Tech stack, libraries, project goals
│   ├── ARCHITECTURE_GUIDELINES.md  ← Performance rules, layout patterns
│   └── [any other .md the user adds]
│
├── ERD/                  ← DATABASE CONTEXT (user fills this)
│   └── prisma/           ← Prisma schema files go here
│       └── schema.prisma ← The single source of truth for all data models
│
└── rules/                ← CODING RULES (auto-loaded by agent system)
    ├── RULES.md          ← Project-level strict rules
    ├── design-system.md  ← UI/UX design tokens and conventions
    └── [language-specific rules]
```

> ✅ **USER SPACE:** The `project-source/` and `ERD/` folders are yours to fill.
> Add any `.md` files that describe your project.
> The brain will read everything it finds there.

---

## When to Activate This Instinct

Activate at the **start of every development session** on an established project.
Also activate when:
- User says "let's continue working on [project]"
- User references a feature that assumes project knowledge
- A new AI agent is joining a session mid-development
- After a long context gap (new conversation, resumed session)

---

## The Context Loading Protocol

### Step 1 — Read Project Source Files

Read ALL files in `project-source/` in this order:

```
1. Requirement.md       → Tech stack, libraries, project goals
2. ARCHITECTURE_GUIDELINES.md → Performance constraints, layout rules
3. Any other .md files → Additional project context
```

**For each file, extract:**
- Stack: What framework, language, libraries?
- Constraints: What is FORBIDDEN? (e.g., no Docker, no Framer Motion)
- Standards: What patterns MUST be followed?
- Business goal: What is this project trying to achieve?

### Step 2 — Read the ERD / Schema

Check `ERD/prisma/` for Prisma schema files:

```bash
# List schema files
ls .agent/ERD/prisma/
```

**For the schema, extract:**
- All model names (these are the domain objects)
- Key relationships (one-to-many, many-to-many)
- Important fields and their types
- Any enums (status values, type values)

This tells you the **exact domain vocabulary** — never assume a field name,
always verify against the schema.

### Step 3 — Read Active Rules

Read `rules/RULES.md` and `rules/design-system.md` for:
- Mandatory coding standards
- Design system tokens (colors, typography, spacing)
- What tools/libraries are approved vs. forbidden

### Step 4 — Build the Project Mental Model

After reading all three sources, produce this summary internally
(and share with user on first session of the day):

```markdown
## 🧠 Project Context Loaded — [Project Name]

### Stack Confirmed
- Frontend: [Framework + Key Libraries]
- Backend: [Framework/BaaS + Key Libraries]
- Database: [DB + ORM]
- Forbidden: [What must NOT be used]

### Domain Objects (from ERD)
- [Model 1]: [key fields + relationships]
- [Model 2]: [key fields + relationships]
- [Enums]: [status values, type values]

### Active Design Constraints
- [Constraint 1 from design-system.md]
- [Constraint 2 from RULES.md]

### Session Start Checklist
- [ ] project-source/ files read
- [ ] ERD/prisma/ schema loaded
- [ ] rules/ active constraints noted
- [ ] Ready to build with full project context
```

---

## The Schema-First Principle

> **Never assume a field name. Always verify against the Prisma schema.**

This is the most common source of bugs in database-connected fullstack code:

```typescript
// ❌ WRONG — AI assumes field name from common sense
const task = await prisma.task.findMany({
  where: { userId: user.id }  // assumes "userId" — might be "user_id" or "authorId"
})

// ✅ CORRECT — AI reads schema first, then uses exact field name
// Schema says: Task { authorId String @map("author_id") }
const task = await prisma.task.findMany({
  where: { authorId: user.id }  // confirmed field name from schema
})
```

**Rule:** Before writing ANY Prisma query, read the schema for:
1. The exact model name (case-sensitive: `task` not `Task` in queries)
2. The exact field names
3. The exact relationship names
4. Any `@map()` decorators that affect the actual DB column name

---

## Project-Specific Context Questions

When starting a session on a new or unfamiliar project (no project-source files yet),
ask the user these questions to build the mental model from scratch:

```
Before I start coding, I need to understand your project:

1. STACK: What is your tech stack?
   (Framework, language, key libraries, database, ORM)

2. CONSTRAINTS: Are there any hard rules I must follow?
   (Forbidden libraries, required patterns, team conventions)

3. ARCHITECTURE: Is there a folder structure or naming convention?
   (e.g., pages vs app router, controllers vs services)

4. DOMAIN: What are the main entities in your system?
   (e.g., User, Task, Project, Subscription)

5. PERFORMANCE: Any specific performance requirements?
   (e.g., no Framer Motion, GPU-only animations, INP < 200ms)
```

---

## Context Staleness Detection

Project context can become stale. Watch for these signals:

| Signal | What It Means | Action |
|--------|--------------|--------|
| User says "we added a new table" | Schema is outdated | Re-read `ERD/prisma/schema.prisma` |
| User says "we switched from X to Y" | Stack context changed | Re-read `Requirement.md` |
| User references a feature you don't know | Missing context | Ask: "I don't have context on [feature] — where is it documented?" |
| Import path errors | Folder structure changed | Re-read `ARCHITECTURE_GUIDELINES.md` |
| User corrects your code pattern | Convention changed | Update mental model, ask where it's documented |

When staleness is detected:
1. Acknowledge: *"My context may be outdated on this."*
2. Re-read the relevant file
3. Correct your approach before continuing

---

## Context Interview for New Users (No Files Yet)

When a new user copies the brain system into their project and
`project-source/` is empty, run this guided setup:

```
I see your project-source/ folder is empty. Let me help you fill it in
so I can understand your project properly.

Please answer these questions and I'll create the files for you:

1. What is your project called, and what does it do?
2. What framework/language are you using for backend?
3. What framework/language are you using for frontend?
4. What database and ORM are you using?
5. Do you have a Prisma schema? (Paste it or share the path)
6. Are there any libraries or patterns that are STRICTLY FORBIDDEN?
7. Any specific performance or architecture requirements?

I'll use your answers to create:
- .agent/project-source/Requirement.md
- .agent/project-source/ARCHITECTURE_GUIDELINES.md
```

---

## Checklist: Session Start Context Load

- [ ] `project-source/Requirement.md` has been read
- [ ] `project-source/ARCHITECTURE_GUIDELINES.md` has been read
- [ ] Any other files in `project-source/` have been read
- [ ] `ERD/prisma/schema.prisma` has been read (if exists)
- [ ] `rules/RULES.md` has been read
- [ ] `rules/design-system.md` has been read
- [ ] Project Mental Model summary has been produced
- [ ] No field names or model names are assumed — all verified from schema
- [ ] No library or pattern is used that is listed as FORBIDDEN

---

> **Instinct Class:** Context Loading · Session-Start · Knowledge Building
> **Severity if Skipped:** 🔴 Critical — AI writes generic code that doesn't fit the project
> **Applies To:** All established projects with project-source/ files
> **Version:** 1.0.0 | Brain Development Phase 2

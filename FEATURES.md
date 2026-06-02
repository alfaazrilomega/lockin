# FEATURES.md — Project Feature Map (TEMPLATE)

> **⚠️ TEMPLATE FILE — MUST BE REPLACED BY USER OR AI DURING SETUP**
>
> This file is a **placeholder template**. It is NOT pre-filled because every project is different.
> The AI agent will guide you through populating this file during the `/setup` workflow.

---

## What This File Is For

`FEATURES.md` is the **living feature specification** for your project. It tells every AI agent working in this repository exactly what the product does, how its modules connect, and what workflows it supports.

When populated, it acts as:
- A **context anchor** so the AI never hallucinates features that don't exist
- A **scope boundary** so the AI doesn't build outside your defined product
- A **workflow map** so the AI understands how modules interact before touching code

---

## 📋 Instructions: How to Fill This File

### Option A — Let the AI Fill It (Recommended)
Run the `/setup` workflow and answer the consultation questions. The AI will generate this file for you based on your answers.

### Option B — Fill It Manually
Copy the structure below and replace all `[PLACEHOLDER]` values with your actual project details.

---

## Template Structure

```markdown
# [Your Project Name] — Master Feature & Workflow Guide

## 1. Platform Architecture

| Level | Component | Purpose |
| :---- | :-------- | :------ |
| 0     | [Top-level container name] | [What it holds] |
| 1     | [Second level] | [Purpose] |
| 2     | [Third level] | [Purpose] |

---

## 2. Core Features

### [Feature Module Name]
- [Key capability 1]
- [Key capability 2]
- [Key capability 3]

### [Feature Module Name]
- [Key capability 1]
- [Key capability 2]

---

## 3. Key Workflows (Module Synergies)

### A. [Workflow Name]
1. Step one description
2. Step two description
3. Step three description

---

## 4. Technical Specs (For AI Reference)
- **Frontend**: [Framework, CSS library]
- **Backend/ORM**: [ORM, Database]
- **Auth/Storage**: [Service]
- **AI/External APIs**: [List any]
```

---

## ⚠️ AI Agent Instructions

When you (the AI) encounter this file in its template state (i.e., contains `[PLACEHOLDER]` text or this instruction block), you MUST:

1. **DO NOT treat placeholder content as real project features.**
2. **HALT and notify the user:** "Your `FEATURES.md` is still a template. Should I generate it for you based on your project, or would you like to fill it manually?"
3. **If the user provides project context**, generate the file content following the template structure above, then ask for confirmation before saving.
4. **After saving**, remove this instruction block and keep only the populated content.

---

## Related Files (Also Template — Check These Too)

| File / Folder | Status | Action Required |
| :------------ | :----- | :-------------- |
| `.agent/ERD/` | Template folder | Add your database schema diagrams or ERD markdown files here |
| `.agent/project-source/` | Template folder | Add project brief, PRD, or any reference docs here |
| `FEATURES.md` | **This file** | Replace with your actual feature map |

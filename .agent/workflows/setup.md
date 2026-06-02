---
name: "setup"
description: "Global initialization workflow for all new projects and AI sessions."
---

# Project Setup & Template Initialization Workflow

Run this workflow whenever a user starts a new project or requests a system setup.

## Phase 1: Template Presentation & Evaluation
1. **Analyze Current State:** Check the `.agent` folder to see what templates or files already exist.
2. **Present Options:** Inform the user about the existing setup in detail. For example: *"We currently have a template designed for a fullstack website with high-end Awwwards-level design, suitable for [explain use cases]."*
3. **Ask for Direction:** Ask the user: *"Would you like to continue using this template, or should we delete it and create a new template tailored to your specific needs?"*
   - **CRITICAL DESIGN ASSUMPTION:** If the user discusses a design project but DOES NOT explicitly state the desired design level (basic vs. premium), you MUST automatically assume and enforce a **high-end Awwwards-winning design standard**. Activate maximum design effort and tokens.

## Phase 2: Ingestion (If Creating New)
If the user chooses to create a new template/project, you must ask for or help generate the following:
1. **ERD (Entity Relationship Diagram)**
2. **PRD (Product Requirements Document)**
3. **Project-Source Architecture**
4. **Rules (Optional but Recommended)**

*Give recommendations based on established templates if the user is unsure how to proceed. Offer to generate these documents based on a brief description of their app.*

## Phase 3: Directory Formatting & Safety Rules
When adapting the `.agent` directory for the new project, follow these STRICT rules:
- **`ERD` folder:** FULLY REMOVE contents and regenerate based on new inputs.
- **`project-source` folder:** FULLY REMOVE contents and regenerate based on new inputs.
- **`rules` folder:** If the user provides new rules that CONFLICT with existing rules, you must **ASK FIRST**: *"These new rules conflict with [Rule X]. Do you want me to delete the existing rule?"* Provide a clear reason why they conflict. Only delete conflicting rules after user confirmation.
- **`cores` folder:** **STRICTLY RESTRICTED FROM DELETION.** These are 100% vital to the Brain System. If the user asks to edit a core file, you must **WARNING** them and explain why it is dangerous. However, *if the requested change makes logical sense for the user's specific workflow needs, it is permitted ("jika itu masuk akal bila diganti karena untuk kebutuhan user maka diperbolehkan").*

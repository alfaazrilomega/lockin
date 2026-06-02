<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

<!-- BEGIN:anti-laziness-protocols -->
# AI AGENT OPERATING PROTOCOLS (PERMANENT & NON-NEGOTIABLE)
> These protocols were established after a critical design failure in Phase 6 of the portfolio project.
> They MUST be followed without exception by any AI agent (Antigravity, Copilot, Cursor, etc.) working on this codebase.

## PROTOCOL 1: THE ABSOLUTE TRUTH OF THE USER
- The user's chronological descriptions, storyboards, voice notes, and logic are treated as 100% accurate ground truth.
- You are **strictly prohibited** from overriding, second-guessing, or "improving upon" the user's explicitly stated visual and chronological mechanics without first obtaining explicit written permission.
- If you disagree with a user's approach, you may **state your concern once**. If the user confirms their intent, you comply.

## PROTOCOL 2: ZERO-SKIP VISION INGESTION
**THE TRIGGER:** Any time images/screenshots are provided by the user, OR any time you autonomously capture DOM/browser screenshots for any UI, UX, frontend, or data task.

**THE MANDATE (NO EXCEPTIONS):**
- You are **FORBIDDEN** from relying solely on text descriptions when images are present.
- You **MUST** actively engage your vision capabilities to analyze **EVERY SINGLE** provided image **before** writing any code or plan.
- **EXTRACTION CHECKLIST** — before coding, you must document from each image:
  - [ ] Exact hex color codes for all significant colors (background, text, active, inactive states, gradient stops)
  - [ ] Typography scale (font size in px/rem, weight, letter-spacing)
  - [ ] Layout grid, spacing, and margin measurements
  - [ ] Component state differences (active vs. inactive, visible vs. hidden)
  - [ ] Any gradient direction, color stops, and blending modes
- Failure to perform this extraction before coding is a **critical protocol violation**.

## PROTOCOL 3: THE ANTI-HUBRIS MANDATE & DUAL-VERIFICATION
You are **strictly forbidden** from declaring you "completely understand" any task without going through the dual-verification process below. AI is inherently ambiguous and prone to errors. All assumptions must be explicitly surfaced and cross-examined.

**When operating in Plan Mode**, you MUST verify your assumptions TWICE:

### Verification Layer 1 — Inside the Plan File
- List your comprehension of the task in explicit bullet points:
  - `- I understand that I will do X.`
  - `- I understand that I will do Y.`
- Conclude the comprehension section by explicitly asking: **"Are these points correct?"**

### Verification Layer 2 — In the Conversational Response
Separate from the plan file, you must:
- Briefly reiterate your core understanding of the task.
- Explicitly ask: **"Does this align perfectly with your intent?"**
- Explicitly state: **"I am awaiting your verification before I execute, because my AI assessment may contain errors."**

**You may ONLY begin executing code after the user has provided explicit approval.**

<!-- END:anti-laziness-protocols -->

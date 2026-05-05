# CORE 03: PRODUCT & CREATIVE DISCOVERY GATE

### THE SIMULTANEOUS PERSONA COUNCIL (MANDATORY — MINIMUM 3, NO CEILING)
You are not a single agent. Adopt the base council below AND any additional specialists recruited in Core 00. Synthesize ALL perspectives into one unified output:
- **Track A (Frontend):** Base: `elite-design-system-agent` (Visuals) + `frontend-agent` (React) + `Master UX Architect` (Flow). *(Expand with Core 00 recruited specialists.)*
- **Track B (Backend):** Base: `database-reviewer` (Security) + `architect` (Infrastructure) + `Backend Logic Master` (API). *(Expand with Core 00 recruited specialists.)*
- **Track C (Micro-Edit):** Base: `planner` (Impact) + `code-reviewer` (Syntax) + `Principal Code Auditor` (Validation). *(Expand with Core 00 recruited specialists.)*
- **Track D (Fullstack):** Base: ALL of Track A + ALL of Track B simultaneously. PRD must address both UX flows AND data flows at the same time.

> **BATON CHECK (MANDATORY):** Re-read the `[CONTEXT BATON]` AND all `[BATON UPDATE]` blocks from the conversation. Confirm Track, Council, User Intent (especially the aesthetic/tone goal). If baton is missing, HALT and re-execute Core 00. The Tone Goal is critical here — it determines what UX/UI reference you will propose.

## 1. The Principal Architect Role
You must act as the full declared Council above. Do not guess the product blindly.

## 2. Business Logic Extraction
Clarify the core mechanics with the user:
- What exactly happens in the core features? (e.g., "Is 'Products' a Stripe checkout or a static catalog?")
- What are the data flows? (e.g., "Does 'Contact' save to a database or send an email via Resend?")
- Is Authentication required? What providers?

## 3. Asset & Theme Clarification
If the user provided reference URLs or inspirations:
- Identify the visual medium. 
- Ask the user: "The sample uses [3D models / 2D vectors / static photography]. Due to our strict 60FPS CSS-only performance rules, how do you want to handle these assets? Should we use static high-res images or pure CSS depth illusions?"

## 4. Complexity-Scaled Library Proposal

> **⚠️ BATON PRE-CHECK — Read BEFORE presenting any library options:**
> Check the Baton for `Animation Library: PRE-DETERMINED` field.
>
> ```
> IF Baton contains "Animation Library: PRE-DETERMINED ([LIBRARY]) from [site]":
>   → The reference extraction already identified the animation system used live.
>   → For sections with Fidelity = PIXEL-PERFECT: Do NOT offer alternative libraries.
>   → Instead, announce it:
>     "The reference site uses [LIBRARY] for its animations. Since we are replicating
>      it pixel-perfectly, I will use [LIBRARY] to match the exact timing and effects.
>      Shall I proceed with [LIBRARY], or would you prefer a different approach
>      (which will change some animation fidelity)?"
>   → Record the user's answer in the Baton and continue.
>
> IF Baton has NO pre-determined library → Continue to standard proposal below.
> ```

You must NEVER unilaterally choose animation or backend libraries without Baton guidance. You must first **assess the task complexity** from the Baton (Track, Tone Goal, and URL capture), then propose appropriately-scaled options. Proposing React Three Fiber for a company website is misleading overkill. Proposing plain CSS for an Awwwards brief is incompetent.

**Complexity Assessment:**
- **HIGH** (Awwwards-target, 3D elements, WebGL keywords, complex scroll): Offer Creative + 3D options.
- **MEDIUM** (SaaS product, landing page with animations, portfolio): Offer Crisp + Creative options.
- **LOW** (Company site, marketing page, simple CRUD app): Offer only Crisp + Minimal options. Do NOT show 3D or heavy animation stacks.

**The Mandatory Scaled Proposal (3 options, scoped to detected complexity — only if NOT pre-determined):**
- **HIGH example:** Option 1: GSAP + Lenis + R3F | Option 2: GSAP + Lenis + Framer Motion | Option 3: Strict 60FPS CSS
- **MEDIUM example:** Option 1: GSAP + Lenis | Option 2: Framer Motion (CSS-backed) | Option 3: Strict 60FPS CSS
- **LOW example:** Option 1: Strict 60FPS CSS + Tailwind | Option 2: Minimal JS transitions | Option 3: Static (no animation lib)
- **React Routing Rule:** NEVER recommend Barba.js for React/Next.js. Use `Framer Motion (AnimatePresence)` for page transitions.
- **Action:** Ask SEPARATELY:
  - *"For frontend, which of these 3 options aligns with your vision?"* (Wait for selection.)
  - *"For backend, which of these 3 options aligns with your vision?"* (Wait for selection.)
  Allowing separate selections prevents the user from being forced to accept a frontend AND backend package they didn't both want.

## 5. Dynamic Section Proposal
For every page requested, DO NOT ask the user to do the hard design work.
- You must actively *propose* a best-practice, section-by-section breakdown.
- Example: "For the Home page, I propose: 1. Hero with CTA, 2. Social Proof, 3. Feature Grid. Do you like this section context, or should we align closer to a specific theme?"
- **Scale Check:** Always ask about the scale of data (e.g., "Will this product list have 10 items or 10,000? Do we need pagination or infinite scroll?").

## 6. The Confidence Threshold & Fallback Protocol
If at any point during this Discovery Gate, the user's responses reveal that the assumptions made in CORE 02 (Context Mutator) were incorrect or misaligned:
- **HALT PROGRESS.** Do not proceed to Core 04.
- **FALLBACK TO CORE 02:** Actively declare that the underlying architecture needs to be re-mutated. Re-write the ERD and Project Source to match the new reality discovered here.
- *God-Tier Rule:* Never build on top of a flawed foundation. If the Business Logic doesn't match the database schema, go back and fix the schema first.

## 6.5 The ERD vs PRD Alignment Check (MANDATORY)
Before moving to any capability check, you MUST cross-reference the PRD features finalized in this Core against the ERD/Schema locked in Core 02.
- **The Alignment Audit:** For every feature in the PRD (e.g., "User Favorites"), verify there is a corresponding table/field in the Core 02 ERD (e.g., a `favorites` table). If a feature has NO database backing, you MUST HALT and either: (a) add the missing table to the ERD and present it to the user, or (b) remove the feature from the PRD.
- *Absolute Rule:* You are strictly FORBIDDEN from writing any Server Action or API route for a feature that has no corresponding table in the approved ERD.

## 6.75 The Integration Collision Pre-Check (MANDATORY — Moved from Core 05)
Now that you have proposed the UX library stack (Step 4) and the user has selected one, you MUST run the collision check HERE — NOT in Core 05. Catching this now saves the entire Frontend Spec from being thrown away.
- **The Dry-Run:** Mentally compile the selected libraries (e.g., React Three Fiber, GSAP) against the locked tech stack from Core 02 (e.g., Next.js App Router, Server Components).
- **Known Collisions to Check:**
  - `<Canvas>` (R3F/WebGL) CANNOT exist inside a Next.js Server Component — must be wrapped in a `"use client"` boundary.
  - Framer Motion's `useSpring`/`AnimatePresence` requires `"use client"` — cannot be used at the layout level.
  - GSAP's ScrollTrigger requires `window` — must be inside a `useEffect` / `"use client"` boundary.
- **If a collision is detected:** HALT. Alert the user. Revise the library choice or the component architecture before proceeding. Do NOT carry a known collision into Core 04 or 05.

## 7. Autonomous Capability Check (The Anti-Arrogance / Skill Forge Gate)
AI models naturally suffer from overconfidence and will often hallucinate that they can build complex features (like Figma MCP integration or 3D scroll math) perfectly from scratch. To prevent this, you are subject to the **Proof of Knowledge (PoK) Protocol**.
Before you are allowed to transition to Core 04 to validate the visual layout, you MUST ask yourself: *"Do I possess the explicit skills/rules to build the features we just finalized with 100% accuracy?"*
- **The Proof of Knowledge Requirement:** To answer "YES", you must physically cite the exact `.md` skill or rule file currently loaded in your context (e.g., `.agent\skills\3D-Scroll-Logic.md`) that explicitly teaches you how to execute this specific requirement. General programming knowledge is NOT enough. If you cannot cite a specific, relevant instruction file for a complex requirement, your answer is automatically NO.
- **The Appropriateness & Self-Audit Check (If PoK is found):** Finding the file is not enough. You must read its contents and ask:
  1. *Is this rule truly appropriate for the user's specific request, or is it outdated/mismatched?* (If mismatched, treat as NO and trigger the Forge).
  2. *WHAT IF the rule relies on a deprecated API? (The Reality-Check Ping):* Even if the rule perfectly matches, you must do a quick sanity check (e.g., look at `package.json`) to ensure the library/API required by the `.md` file hasn't been completely changed or deprecated. If the rule is fundamentally broken by modern standards, treat as NO and trigger the Forge to update it.
  3. *Given my current AI capacity, context window, and toolset, can I actually execute these instructions with 100% accuracy?*
- **If Capacity is 100%:** Validate the `.md` file and you may proceed.
- **If Capacity is <100% (The Honest Fallback):** You must HALT. You must tell the user: *"I have the instructions, but this task exceeds my current processing capacity/toolset to guarantee 100% accuracy."* You must then propose a solution: breaking the task down into smaller atomic steps, or requesting the user to perform a manual step.
- **If NO (File missing or mismatched):** You must HALT. Immediately adopt the `skill-forge-agent` persona. Tell the user you need to learn the skill first, ask for MCP activations or reference URLs, test the feature via `browser_subagent`/`curl`, and generate a new `.md` skill file in `.agent\skills`.

## 8. The Dual Validation Checkers (MANDATORY)
Before transitioning to the next Core, you MUST invoke the validation loop:
1. **The Plan-Checker (`skill-forge-agent` or `architect`):** Cross-reference your UX/Logic proposals. Do we actually possess the skills and context to build this 100% accurately? If not, the Plan-Checker halts and initiates a Skill Forge loop.
2. **The Result-Checker (`code-reviewer`):** Validate that the user has explicitly approved the UX/Logic proposal and all ambiguities are removed.

## 9. Transition & Track Routing
Once the PRD is aligned and the capabilities are 100% secured (verified by the Dual Checkers), route based on the Track locked in Core 00:
- **If TRACK A (Fullstack/UI):** You MUST proceed to **CORE 04 (`d:\lockincapstone\lockin\.agent\cores\CORE-04-UI-MATHEMATICS.md`)**.
- **If TRACK B (Backend) or TRACK C (Micro-Edit):** You are explicitly forbidden from entering Core 04. Proceed directly to **CORE 05 (`d:\lockincapstone\lockin\.antigravity-agents.md` MASTER PLANNING PROTOCOL)**.

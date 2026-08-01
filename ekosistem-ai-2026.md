# AI Agent Ecosystem and Architecture - 2026 Edition
_Master Reference Document for Agentic Workflows & UI Engineering_

---

## 1. The Cognitive Engine: The 2026 Frontier Models

The era of manual token budgeting is over. The architectural foundation relies on models exhibiting "epistemic humility" and autonomous verification before code execution.

- **Claude 4.6 (Opus & Sonnet):** The primary execution engines. Utilize the new Adaptive Thinking feature to allow the model to autonomously determine reasoning depth based on task complexity. Use the `effort` parameter (set to `max` or `high`) to prioritize deep logic mapping over speed.

- **Context Management:** Leverage the 1M token context window and Compaction API to maintain infinite conversations without losing architectural integrity.

- **Gemini 3 Pro:** The preferred engine for high-level specification, project planning, and multi-agent orchestration.

---

## 2. The Orchestration Layer: Google Antigravity

Google Antigravity serves as the centralized mission control, acting as the Agent-First IDE.

- **Sub-Agent Delegation:** Do not rely on single-threaded execution. Utilize parallel sub-agents (e.g., `planner.md` for architecture, `code-reviewer.md` for security, `e2e-runner.md` for testing).

- **Fresh Context Execution:** Always spawn sub-agents in fresh 200k context windows to prevent hallucination. Rely on `STATE.md` as the persistent memory bridge between sessions.

---

## 3. The Methodology: "Get Shit Done" (GSD) Framework

Enterprise theater (sprint ceremonies, stakeholder simulation) is strictly banned. The workflow must follow the GSD Spec-Driven Development principles:

- **Plans are Prompts:** Do not write code without a spec. `PLAN.md` must be read and executed directly.

- **Aggressive Atomicity:** Limit execution to 2–3 small, atomic tasks per run. One task equals one commit.

- **Proof Over Trust:** "Looks right" is not acceptable. The AI must use terminal outputs, compilation checks (`Exit 0`), and screenshot verification before marking a task as complete.

---

## 4. The Tooling & Integration Protocol (MCP)

The Model Context Protocol (MCP) bridges the AI to the external world. Standard integrations include:

- **Sequential Thinking MCP:** Used for dynamic problem-solving. Allows the AI to break down complex logic, revise earlier thoughts, and branch out alternative solution paths before writing code.

- **Monet MCP:** The mandatory UI tool. When building frontends, the AI must search and integrate pre-built, production-ready React UI components rather than hallucinating generic Tailwind from scratch.

- **GitHub / Docker Hub MCPs:** Used for seamless repository management, PR review automation, and container deployments.

---

## 5. UI & Design System Enforcement (The @chenglou/pretext Anchor)

> ⚠️ **Critical Clarification for AI Agents:**
> `@chenglou/pretext` is a **pure JavaScript text measurement & layout engine** — NOT a CSS/UI design system.
> It has **no color tokens, no spacing scale, and no component library.**
> Its purpose is DOM-free text height calculation via `prepare()` + `layout()` APIs, used to prevent layout reflow in virtualized lists, Canvas rendering, and AI-driven text fitting.

### When to use `@chenglou/pretext`:

Use it when you need to:
- Measure multiline text height **without touching the DOM** (no `getBoundingClientRect`)
- Build virtualized text lists with accurate heights
- Prevent layout shift when dynamic text loads
- Render text to Canvas, SVG, or WebGL

```ts
import { prepare, layout } from '@chenglou/pretext'

const prepared = prepare('Your text here', '16px Satoshi')
const { height, lineCount } = layout(prepared, containerWidth, 24)
// Pure arithmetic — zero DOM reflow
```

### Design System Enforcement (Actual Rules):
To maintain Awwwards-tier visual quality, the AI must adhere to the project's established design system:

1. **Pre-flight UI Check:** Cross-reference `tailwind.config.ts`, `app/globals.css`, and `.antigravity-agents.md` before generating any frontend code.

2. **Token Mapping:** All spacing, typography, and color must use the Notion-like CSS variables defined in `globals.css` (`--background`, `--foreground`, `--primary`, `--border`, etc.).

3. **Zero-Latency Animation:** Scroll effects and parallax must utilize Framer Motion `useSpring`, `IntersectionObserver` for off-screen culling, and `transform-gpu` to ensure 60FPS without blocking the main thread. *(Note: For Awwwards-standard designs, the initial creative phase bypasses the 60FPS lock to build the design to absolute layout/visual perfection first. After user satisfaction is verified, animations are optimized/upgraded so that the FPS is not too heavy, or redesigned if needed).*

---

## 6. Notes App Integration — Slate.js + `@chenglou/pretext`

The Notes feature uses **Slate.js** as the rich text editor engine. A high-value integration point:

- Use `@chenglou/pretext`'s `prepare()` + `layout()` to calculate the rendered height of Slate blocks **before mounting them to the DOM** — enabling zero-layout-shift virtualization in `/dashboard/notes`.
- This eliminates the current need for `ResizeObserver` hacks on the Slate editor container.

---

_Last updated: April 2026 — LockIn CC26-PS118_

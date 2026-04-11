---
trigger: always_on
---

# Design System — LockIn (CC26-PS118)

> **Purpose:** Shared context file for multi-agent development (Cursor, GitHub Copilot, Claude).
> Read this at the start of every AI session to avoid re-inferring conventions from the codebase.
> **Core Philosophy:** A premium productivity workspace that combines Startup-grade aesthetics (Satoshi/Outfit) with zero-latency performance (Native Browser APIs & GPU acceleration).

---

## 1. Stack & Performance Principles

| Layer         | Technology                                                          |
| ------------- | ------------------------------------------------------------------- |
| Framework     | Next.js 16+ (App Router, Turbopack)                                 |
| Language      | TypeScript + TSX (Strict Mode)                                      |
| Premium UX    | View Transitions API, Speculation Rules API, CSS GPU Transforms     |
| Smooth Scroll | Lenis (Landing Page ONLY — skipped on `/dashboard` & touch devices) |
| Rich Text     | Slate.js (Core editor engine)                                       |
| Calendar      | React Big Calendar (Custom styled via Tailwind)                     |
| Styling       | Tailwind CSS + Shadcn UI + `tailwindcss-animate`                    |
| Fonts         | **Satoshi** (Primary), **Outfit** (Display/Metrics)                 |
| Icons         | Lucide React (Shadcn default, stroked style)                        |

**CRITICAL RULE:** NO Framer Motion, NO WebGL, and NO `<canvas>` based animations for UI elements. All animations must be GPU-accelerated CSS (`transform`, `opacity`) to maintain perfect Interaction to Next Paint (INP) scores.

---

## 2. Adaptive Color Palette (Notion-like Theme)

Colors automatically adapt to user system preferences (Light/Dark) via CSS variables. Never use hardcoded colors (e.g., `bg-white`).

| Token                  | Light Mode (Default)  | Dark Mode                | Usage                               |
| ---------------------- | --------------------- | ------------------------ | ----------------------------------- |
| Background             | `#FFFFFF`             | `#191919`                | Base page, editor canvas            |
| Foreground (Text)      | `#37352F`             | `#D4D4D4`                | Headings, primary body text         |
| Muted / Sidebar        | `#F7F7F5`             | `#202020`                | Sidebar background, secondary cards |
| Muted Foreground       | `#787774`             | `#9B9B9B`                | Placeholder text, timestamps, hints |
| Border                 | `#E9E9E7`             | `#2F2F2F`                | Dividers, input borders             |
| Primary (Brand Accent) | `#2383E2`             | `#2383E2`                | Active links, primary CTA buttons   |
| Destructive            | `#EB5757`             | `#EB5757`                | Delete actions, overdue deadlines   |
| Hover State Overlay    | `rgba(55,53,47,0.08)` | `rgba(255,255,255,0.05)` | Button hovers, table row highlights |

---

## 3. Typography

Using modern geometric fonts to achieve a high-end SaaS look while maintaining readability for long notes.

| Role            | Font        | Size (Tailwind/Clamp)    | Weight                            |
| --------------- | ----------- | ------------------------ | --------------------------------- |
| Editor Title    | **Satoshi** | `clamp(36px, 5vw, 48px)` | 700, tight tracking               |
| Section Heading | **Satoshi** | `24px` (`text-2xl`)      | 600                               |
| Body Primary    | **Satoshi** | `16px` (`text-base`)     | 400, leading: `1.6`               |
| Secondary / UI  | **Satoshi** | `14px` (`text-sm`)       | 500, leading: `1.5`               |
| Numbers/Metrics | **Outfit**  | `Variable`               | 600 (For Progress Bars & Stats)   |
| Badge / Label   | **Outfit**  | `12px` (`text-xs`)       | 500, uppercase, `0.05em` tracking |

---

## 4. Spacing Scale & Layout Width

| Scale            | Value   | Tailwind Class  |
| ---------------- | ------- | --------------- |
| XS               | `8px`   | `p-2`, `gap-2`  |
| S                | `16px`  | `p-4`, `gap-4`  |
| M                | `24px`  | `p-6`, `gap-6`  |
| L                | `32px`  | `p-8`, `gap-8`  |
| XL               | `40px`  | `p-10`          |
| Sidebar Width    | `250px` | `w-[250px]`     |
| Editor Max Width | `900px` | `max-w-[900px]` |

---

## 5. UI Recipes: Crisp Workspace vs Glass Header

We prioritize performance (Crisp UI), but allow native CSS Glassmorphism strictly for non-moving elements like the sticky Top Navigation.

### The "Crisp Workspace" Recipe (Cards, Modals, Popovers)

```css
/* Notion-style subtle card / popover */
background-color: var(--background);
border: 1px solid var(--border);
border-radius: 8px; /* Modern subtle roundness */
box-shadow:
  0px 4px 12px rgba(0, 0, 0, 0.05),
  0px 1px 2px rgba(0, 0, 0, 0.08);
/* NO backdrop-filter here to save GPU on scroll */
```

### The "Subtle Glass" Recipe (TopNav ONLY)

```css
/* Used only for sticky headers to let content scroll behind */
background: rgba(var(--background-rgb), 0.8);
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
border-bottom: 1px solid var(--border);
```

---

## 6. Component Conventions

### Dashboard Wrapper Pattern (`app/(dashboard)/layout.tsx`)

```tsx
<div className="grid h-screen w-full md:grid-cols-[250px_1fr] overflow-hidden bg-background text-foreground font-satoshi">
  <aside className="hidden md:flex flex-col border-r border-border bg-muted/50">
    <SidebarContent />
  </aside>

  <main className="flex flex-col h-full overflow-y-auto relative">
    <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80">
      <TopNavBreadcrumbs />
    </header>
    <div className="flex-1 px-8 py-10 mx-auto w-full max-w-[900px]">
      {children}
    </div>
  </main>
</div>
```

### Z-index Layers (Dashboard)

| Layer              | z-index | What                   |
| ------------------ | ------- | ---------------------- |
| Base Canvas        | 0       | Page content, Editor   |
| Sticky Headers     | 10      | TopNav (Glassmorphism) |
| Sidebar            | 20      | Main navigation pane   |
| Dropdowns/Popovers | 30      | Select menus, tooltips |
| Modals/Dialogs     | 40      | Create Task modal      |
| Toasts/Alerts      | 50      | Notification banners   |

---

## 7. AI Agent Protocol & Division of Labor 🚨

All AI Agents MUST refer to the `skills/` directory before executing tasks. This ensures code consistency across the Next.js App Router and Shadcn UI.

| Task Category                    | AI Action / Required Skill File                                           |
| -------------------------------- | ------------------------------------------------------------------------- |
| **Project Architecture & Setup** | Read `skills/planning-mode.md` before generating large features.          |
| **UI Components & Forms**        | Apply rules from `skills/shadcn-ui.md` and `skills/artifacts-builder.md`. |
| **React Logic & State**          | Strictly follow `skills/react-components.md` (Server Components first).   |
| **Styling & Theming**            | Use variables from `skills/theme-factory.md`. No hardcoded colors.        |
| **LLM & API Prompts**            | Refer to `skills/enhance-prompt.md` for OpenRouter/Gemini integrations.   |
| **Directory Management**         | Follow `skills/file-organizer.md` for Next.js folder routing.             |

```

```

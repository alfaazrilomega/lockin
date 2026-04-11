---
trigger: always_on
---

# RULES — LockIn Project (CC26-PS118)

> **Purpose:** Dokumen ini adalah "Buku Suci" instruksi utama untuk seluruh AI Assistant (GitHub Copilot, Cursor, atau agen lainnya) yang beroperasi di dalam proyek LockIn.
> **WAJIB dibaca dan dipatuhi sebelum men-generate kode apa pun.**

---

## 1. Core Stack & Architecture

| Layer               | Technology                                                        |
| :------------------ | :---------------------------------------------------------------- |
| **Framework**       | Next.js 16+ (App Router, Turbopack)                               |
| **Language**        | TypeScript (Strict Mode) + TSX                                    |
| **Database & Auth** | Supabase (PostgreSQL)                                             |
| **ORM**             | Prisma                                                            |
| **Styling**         | Tailwind CSS + Shadcn UI                                          |
| **Icons**           | Lucide React (bawaan Shadcn)                                      |
| **Calendar**        | React Big Calendar                                                |
| **Text Editor**     | Slate.js                                                          |
| **AI Integration**  | OpenRouter SDK (`gemini-2.0-flash-lite-001` & `Gemini 2.5 Flash`) |

---

## 2. AI Agent Protocol & Skills Directory 🚨 (NEW)

Proyek ini menggunakan arsitektur **AI Skill-Based Development**. Sebelum mengeksekusi tugas spesifik, AI WAJIB merujuk pada file panduan di dalam folder `skills/`:

- **Perencanaan/Arsitektur:** Baca `skills/planning-mode.md` sebelum memulai fitur besar.
- **Manajemen File:** Patuhi `skills/file-organizer.md` untuk penempatan komponen App Router.
- **Membuat UI/Komponen:** Wajib merujuk pada `skills/shadcn-ui.md`, `skills/react-components.md`, dan `skills/artifacts-builder.md`.
- **Styling & Tema:** Patuhi `skills/theme-factory.md` (Gunakan variabel CSS Notion-like, BUKAN warna hardcoded).
- **Pembuatan Prompt API:** Gunakan `skills/enhance-prompt.md` saat mengintegrasikan OpenRouter/Gemini.
- **TIDAK DIIZINKAN:** Dilarang keras memuat atau mereferensikan library animasi berat (Framer Motion) atau WebGL/3D Canvas.

---

## 3. Global Coding Directives

### a. TypeScript & Next.js App Router

- **Selalu gunakan App Router (`app/` directory).** Jangan pernah menggunakan Pages Router (`pages/`).
- **Server Components First:** Jadikan semua komponen sebagai Server Components secara _default_. Hanya gunakan `"use client"` di baris paling atas JIKA komponen tersebut benar-benar membutuhkan _state_, _lifecycle_, atau interaksi browser.
- **Strict Typing:** Jangan pernah menggunakan tipe `any`. Selalu definisikan `interface` atau `type` untuk _props_ komponen dan _payload_ API.

### b. Database & Prisma

- Akses _database_ (Prisma Client) **hanya boleh dilakukan di Server Components, Server Actions, atau Route Handlers (`app/api/...`)**.
- Gunakan **Server Actions** Next.js untuk operasi mutasi data (Create, Update, Delete) yang di- _trigger_ dari UI.

---

## 4. Performance & Responsive Guidelines

- **Macro-Layout:** Selalu gunakan **CSS Grid Layout** untuk struktur halaman utama atau _dashboard_.
- **Akselerasi GPU:** Jika membuat animasi, **dilarang keras** menganimasi properti `width`, `height`, `top`, atau `margin`. **Hanya gunakan** `transform` dan `opacity` untuk mencegah _layout thrashing_ dan menjamin 60 FPS.
- **Zero-Latency Navigation:** Gunakan `Speculation Rules API` dan `View Transitions API` untuk navigasi antar halaman di Dashboard.

---

## 5. Folder Structure Mapping

```text
/
├── app/                  # Next.js App Router (Halaman Utama)
├── components/           # Komponen React Reusable
│   ├── ui/               # Komponen Shadcn UI
│   ├── layout/           # Sidebar, Navbar, dll
│   └── shared/           # Komponen spesifik fitur (Misal: TaskCard)
├── lib/                  # Utility functions (Prisma, Supabase, Utils)
├── prisma/
│   └── schema.prisma     # Skema Database utama
└── skills/               # 🚨 OTAMATISASI AI & SYSTEM PROMPTS 🚨
    ├── planning-mode.md
    ├── shadcn-ui.md
    └── ... (refer to section 2)

```

````

***

### 2. Update `design-system.md` (Pembaruan Divisi Tugas Agen AI)
Silakan timpa file `design-system.md` Anda. Saya telah mengubah **Bab 8 (Agent Division of Labor)** agar langsung menyambung dengan 9 *skill* yang baru kita tambahkan.

```markdown
# Design System — LockIn (CC26-PS118)

> **Purpose:** Shared context file for multi-agent development (Cursor, GitHub Copilot, Claude Code).
> Read this at the start of every AI session to avoid re-inferring conventions from the codebase.
> **Core Philosophy:** A premium productivity workspace that combines Startup-grade aesthetics (Satoshi/Outfit) with zero-latency performance (Native Browser APIs & GPU acceleration).

---

## 1. Stack

| Layer         | Technology                                                           |
| ------------- | -------------------------------------------------------------------- |
| Framework     | Next.js 16+ (App Router, Turbopack)                                  |
| Language      | TypeScript + TSX (Strict Mode)                                       |
| Premium UX    | View Transitions API, Speculation Rules API, CSS GPU Transforms      |
| Smooth Scroll | Lenis (Landing Page ONLY — skipped on `/dashboard` & touch devices)  |
| Rich Text     | Slate.js (Core editor engine)                                        |
| Calendar      | React Big Calendar (Custom styled via Tailwind)                      |
| Styling       | Tailwind CSS + Shadcn UI + `tailwindcss-animate`                     |
| Fonts         | **Satoshi** (Primary), **Outfit** (Display/Metrics)                  |
| Icons         | Lucide React (Shadcn default, stroked style)                         |

---

## 2. Adaptive Color Palette (Notion-like Theme)

Colors automatically adapt to user system preferences (Light/Dark) via CSS variables.

| Token                  | Light Mode (Default) | Dark Mode           | Usage                                |
| ---------------------- | -------------------- | ------------------- | ------------------------------------ |
| Background             | `#FFFFFF`            | `#191919`           | Base page, editor canvas             |
| Foreground (Text)      | `#37352F`            | `#D4D4D4`           | Headings, primary body text          |
| Muted / Sidebar        | `#F7F7F5`            | `#202020`           | Sidebar background, secondary cards  |
| Muted Foreground       | `#787774`            | `#9B9B9B`           | Placeholder text, timestamps, hints  |
| Border                 | `#E9E9E7`            | `#2F2F2F`           | Dividers, input borders              |
| Primary (Brand Accent) | `#2383E2`            | `#2383E2`           | Active links, primary CTA buttons    |
| Destructive            | `#EB5757`            | `#EB5757`           | Delete actions, overdue deadlines    |
| Hover State Overlay    | `rgba(55,53,47,0.08)`| `rgba(255,255,255,0.05)`| Button hovers, table row highlights  |

---

## 3. Typography

| Role            | Font             | Size (Tailwind/Clamp)    | Weight                            |
| --------------- | ---------------- | ------------------------ | --------------------------------- |
| Editor Title    | **Satoshi** | `clamp(36px, 5vw, 48px)` | 700, tight tracking               |
| Section Heading | **Satoshi** | `24px` (`text-2xl`)      | 600                               |
| Body Primary    | **Satoshi** | `16px` (`text-base`)     | 400, leading: `1.6`               |
| Secondary / UI  | **Satoshi** | `14px` (`text-sm`)       | 500, leading: `1.5`               |
| Numbers/Metrics | **Outfit** | `Variable`               | 600 (For Progress Bars & Stats)   |
| Badge / Label   | **Outfit** | `12px` (`text-xs`)       | 500, uppercase, `0.05em` tracking |

---

## 4. Spacing Scale & Layout Width

| Scale             | Value        | Tailwind Class |
| ----------------- | ------------ | -------------- |
| XS                | `8px`        | `p-2`, `gap-2` |
| S                 | `16px`       | `p-4`, `gap-4` |
| M                 | `24px`       | `p-6`, `gap-6` |
| L                 | `32px`       | `p-8`, `gap-8` |
| XL                | `40px`       | `p-10`         |
| Sidebar Width     | `250px`      | `w-[250px]`    |
| Editor Max Width  | `900px`      | `max-w-[900px]`|

---

## 5. UI Recipes: Crisp Workspace vs Glass Header

### The "Crisp Workspace" Recipe (Cards, Modals, Popovers)
```css
/* Notion-style subtle card / popover */
background-color: var(--background);
border: 1px solid var(--border);
border-radius: 8px; /* Modern subtle roundness */
box-shadow:
  0px 4px 12px rgba(0, 0, 0, 0.05),
  0px 1px 2px rgba(0, 0, 0, 0.08);

````

### The "Subtle Glass" Recipe (TopNav ONLY)

```css
/* Used only for sticky headers to let content scroll behind */
background: rgba(var(--background-rgb), 0.8);
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
border-bottom: 1px solid var(--border);
```

---

## 6. High-Performance Animation Conventions

- **Scroll Effects:** Let the browser handle it. No `useScroll` from Framer Motion.
- **Entrance Animations:** Use `tailwindcss-animate` for 60fps GPU-accelerated reveals (`animate-in fade-in zoom-in-95`).
- **Page Navigation:** Use **View Transitions API** and **Speculation Rules API** (pre-fetching on hover) for zero-latency page swaps.

---

## 7. Component Conventions (Dashboard Wrapper Pattern)

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

---

## 8. Agent Division of Labor & Skills Execution 🚨

All AI Agents MUST refer to the `skills/` directory based on their current task:

| Development Task                  | Required Agent Skill (Check `skills/` folder)       |
| --------------------------------- | --------------------------------------------------- |
| **Project Planning & Edge Cases** | `planning-mode.md` (Initialize before big features) |
| **Component Architecture**        | `react-components.md` & `artifacts-builder.md`      |
| **UI Design & Styling**           | `shadcn-ui.md` & `theme-factory.md`                 |
| **AI LLM API Integration**        | `enhance-prompt.md`                                 |
| **File Structure & Refactoring**  | `file-organizer.md`                                 |
| **Git Commits & PRs**             | `internal-comms.md`                                 |
| **New AI Skill Generation**       | `skill-creator.md`                                  |

**CRITICAL RULE:** The `canvas-design` skill or any WebGL/3D physics animations are STRICTLY PROHIBITED in this repository.

```

```

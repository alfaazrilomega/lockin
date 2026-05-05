---
name: Pixel-Perfect Animation & Validation Protocol
description: Mandatory workflow for scanning visual references, validating GSAP timelines, and ensuring pixel-perfect 1:1 replication.
---

# INSTINCT-012: Pixel-Perfect Animation & Validation Protocol

## 1. The Core Failure & The Mandatory Solution
**The Failure:** Previously, animations were built based on "assumptions" from a quick glance at screenshots. Critical details like the preloader counter's font size, the exact timeline of when the navbar appears, and the specific mathematical masking of elements were missed or incorrectly guessed.
**The Solution:** The AI must perform a **Mandatory Top-to-Bottom Logic Scan** on all visual references before writing code, and must **Validate** the final output using a screenshot tool.

### Mandatory Top-to-Bottom Logic Scan Protocol
Whenever examining a visual reference (screenshot or live site), the AI MUST analyze sequentially:
1. **Global Elements:** Is the navbar present? Is it hidden? If it's hidden during the preloader, how and when does it enter?
2. **Typography & Sizing:** What is the exact font family? Is the preloader font `text-[8vw]` (massive) or `text-8xl` (smaller, controlled)? What is the exact letter-spacing (`tracking-tight` vs `tracking-tighter`)?
3. **Animation States:**
   - **State 1:** Initial render. What is visible? (e.g., purely black screen, pure white text, NO navbar).
   - **State 2:** The Transition. Does the element fade? Or does it *wipe*? (e.g., using `clip-path: inset(100% 0 0 0)` to wipe up from the bottom).
   - **State 3:** The Final Reveal. Does the element expand (`width: 100vw`)? What slides in over it?

### Mandatory Validation Protocol
1. After writing the code, the AI **CANNOT** assume it works.
2. The AI must launch the `browser_subagent` against the local development server (e.g., `localhost:3001`).
3. The AI must capture screenshots at the exact timestamps matching the reference (e.g., Preloader phase, Masking phase, Final Hero phase).
4. **100% Match Requirement:** The AI must compare the captured local screenshots against the reference. If the navbar is visible when it shouldn't be, or if the mask wipe is missing, the AI MUST rewrite the code until the match is identical.

---

## 2. Portfolio Entrance Animation Sequence (Victor Furuya Clone)
This is the precise, validated logic for the high-fidelity preloader and entrance timeline:

1. **Phase 1: The Preloader Hold**
   - The screen is pitch black.
   - The Global Navbar is explicitly `opacity-0` (hidden).
   - A pure white counter counts from `0` to `100` (`text-8xl md:text-[10rem] tracking-tight font-sans`).
   - The counter holds at `100` for 0.5 seconds.
2. **Phase 2: The Masked Wipe**
   - A tiny, dark rectangular block (`w-[20vw] h-[40vh]`) containing a grayscale portrait wipes UP from the bottom using `clip-path: inset(100% 0 0 0)` to `inset(0% 0 0 0)`.
   - As it wipes up, it physically masks/covers the "100" counter.
   - The counter fades out simultaneously.
3. **Phase 3: The Cinematic Expansion**
   - The system pauses for 0.3 seconds to let the user register the small portrait.
   - The small portrait violently expands to `width: 100vw, height: 100vh` to become the full-screen background.
4. **Phase 4: Global Assembly**
   - The Global Navbar (`#global-navbar`) finally fades in from `opacity: 0` to `opacity: 1`.
   - The central black overlay box (containing `Make It Last` and `Portfolio '26`) slides up from `y: 60` to `y: 0`.

---

## 3. Project File Architecture & Flow Description
To implement this, the following files are required. Each file has a specific, strict role in the Next.js app router architecture.

### A. Essential Flow Files (Core Architecture)

*   `src/app/layout.tsx` (Global Wrapper & State)
    *   **Role:** Essential. Wraps the entire application.
    *   **How it Works:** Injects the global Inter/Satoshi fonts into the `<body>`. Contains the `<Navbar />` component.
    *   **Critical Detail:** The Navbar is hardcoded with `id="global-navbar"` and `opacity-0 pointer-events-none`. It delegates its entrance animation entirely to the client-side GSAP timeline in `page.tsx` to ensure it only appears *after* the preloader finishes.

*   `src/app/page.tsx` (The Brain of the Entrance Animation)
    *   **Role:** Essential. The entry point of the site.
    *   **How it Works:** A strictly `"use client"` component. Uses `gsap.context()` to lock the user's scroll (`document.body.style.overflow = "hidden"`), execute the 4-phase timeline (described above), and then unlock the scroll (`overflow = "auto"`).
    *   **Critical Detail:** It breaks out of its local GSAP context scope to globally target `document.querySelector("#global-navbar")` for the fade-in, tying the global layout into the page-specific timeline.

*   `src/app/globals.css` (Style Initialization)
    *   **Role:** Essential.
    *   **How it Works:** Uses Tailwind v4 `@theme` directives to override default colors, ensuring `bg-background` maps to the cinematic pitch black `#000000` rather than standard white.

### B. Supporting Parts (Active Only When Needed)

*   `tailwind.config.ts` (Legacy Config / Fallback)
    *   **Role:** Supporting.
    *   **How it Works:** Kept for plugin configurations (like typography or animation plugins) but largely superseded by v4 `@theme` in `globals.css`.

*   **Future Section Components** (e.g., `WorksSection.tsx`, `AboutSection.tsx`)
    *   **Role:** Supporting.
    *   **How it Works:** Sit below the 100vh hero section. They remain completely dormant and hidden off-screen while the strict 7-second preloader timeline locks the user at the top of the page.

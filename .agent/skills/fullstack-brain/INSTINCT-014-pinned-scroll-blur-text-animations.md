---
name: Pinned Scroll-Jack & Staggered Blur Text Animations
description: Exact GSAP/CSS architecture for scroll-pinned background morphing and per-letter blur-entrance animations. Critical reference for any Awwwards-grade portfolio implementation.
---

# INSTINCT-013: Pinned Scroll-Jacking & Staggered Blur Text Animations

## 1. The Previous Failure

**The Wrong Mental Model:**
The AI incorrectly treated the "What you build is beautiful. But is beauty enough?" section as *two separate* static DOM sections — one black, one white. This completely missed the actual architecture which is a **single pinned scroll container**.

**Why It Fails:**
- Two separate sections cannot create a smooth, scrubbed color transition tied to scroll depth.
- The `enough?` text color cannot change *in response to scroll position* if it's in a static element.
- The "Full stories are." line cannot elegantly appear mid-scroll if it's always in the DOM.

---

## 2. The Correct Architecture: Pinned Scroll Container

### HTML Structure (Critical)
```
<div id="outer" style="height: 500vh">        ← Tall wrapper. Consumes scroll distance.
  <div id="sticky" style="position:sticky; top:0; height:100vh">   ← The pinned canvas
    <div id="bg" />                           ← Background layer, color morphs here
    <div id="content">                        ← All text and UI lives here
      <div id="question">...</div>            ← "What you build..." — fades out during pin
      <div id="full-stories">...</div>        ← "Full stories are." — fades in during pin
    </div>
  </div>
</div>
```

**Rule:** The `height: 500vh` outer wrapper is the ONLY thing that creates scroll room. The inner sticky div NEVER leaves the viewport. This is how pins work.

### GSAP ScrollTrigger Config (Exact)
```js
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: outerRef.current,    // Target the TALL outer wrapper
    start: "top top",
    end: "+=400%",                // Consume 4x viewport height of scroll
    pin: stickyRef.current,       // PIN the inner sticky canvas
    scrub: 1.5,                   // Smooth scrub (higher = more lag/inertia)
    anticipatePin: 1,
  }
})
```

### Color Morph Sequence (Exact Scroll Positions)
| Scroll Progress | Background Color | Notes |
|---|---|---|
| 0% (pin starts) | `#000000` | Pure black |
| 0% | `enough?` → `#eb3333` | Red color triggers INSTANTLY at pin |
| 20% | Question text fades out | `opacity: 0, y: -40` |
| 30% | `#000000` → `#8a8a8a` | Morphs to grey |
| 40% | "Full stories are." fades in | `opacity: 1` |
| 55% | `#8a8a8a` → `#c4a882` | Morphs to warm brown |
| 80% | `#c4a882` → `#f5f0ea` | Morphs to cream/white |

---

## 3. Staggered Letter Animations

### Rule: Always Split Text Into Per-Character Spans

Never animate whole words or lines for Awwwards-grade typography. The DOM structure must be:
```html
<span class="char" style="overflow:hidden; display:inline-block">
  <span class="char-inner" style="display:inline-block">M</span>
</span>
```

The outer `.char` creates the clip mask. The inner `.char-inner` is what slides down from `y: 110%` (outside the clip) into `y: 0%` (visible). This is the standard "text reveal" technique used in all Awwwards sites.

### "What you build is beautiful." — Slide-Down Stagger
```js
gsap.fromTo(chars, 
  { y: "110%", opacity: 0 },
  { y: "0%", opacity: 1, duration: 0.8, stagger: 0.018, ease: "power3.out" }
)
```
- `stagger: 0.018` = 18ms between each letter
- `duration: 0.8` per letter
- Triggered on `scrollTrigger` with `start: "top 85%"`

### "Full stories are." — Slide-Down + TOP-EDGE BLUR (Critical Detail)
```js
gsap.fromTo(chars,
  { y: "110%", opacity: 0, filter: "blur(6px)" },
  { y: "0%",   opacity: 1, filter: "blur(0px)", duration: 0.9, stagger: 0.022 }
)
```
- The `filter: blur(6px)` is applied to the **inner char span** during motion.
- As `y` goes from `110%` to `0%`, the top edge of each letter appears blurred and sharpens as it settles.
- The blur is `0px` at rest — it is an **entrance-only** effect, NOT permanent.
- `stagger: 0.022` slightly slower than line 1 for dramatic separation.

---

## 4. Component File Architecture

### Essential Files for Scroll-Pinned Section
| File | Role | Description |
|---|---|---|
| `BeautySection.tsx` | **Essential** | Single component. Contains the tall outer wrapper, sticky inner canvas, GSAP pin timeline, and all text animations |
| `HeroSection.tsx` | **Essential** | Preloader counter + cinematic image wipe/expand + global navbar reveal |
| `WorksSection.tsx` | **Essential** | Hover-linked project list + scroll-parallax image |
| `PartnersSection.tsx` | **Supporting** | Staggered slide-up partner names on scroll |
| `page.tsx` | **Orchestrator** | Uses `dynamic()` imports for all sections to prevent SSR/GSAP hydration errors |

### Why `dynamic()` Imports Are Mandatory
GSAP's `ScrollTrigger` calls `window` and `document` on initialization. In Next.js App Router, components first render on the server where these globals don't exist. Using `dynamic(() => import("./Component"), { ssr: false })` defers rendering to the client only, eliminating hydration crashes.

---

## 5. Anti-Patterns to Never Repeat

| ❌ Wrong | ✅ Correct |
|---|---|
| Two static sections for color transition | One tall outer wrapper with a sticky inner canvas |
| `gsap.context(fn, ref)` when targeting external elements (navbar) | `gsap.context(fn)` without scope, use `document.querySelector` |
| Animating `width`/`height` for image expansion | Use `clip-path: inset()` for the wipe, then animate `width/height` only for the expansion phase |
| Running ScrollTrigger in a component with SSR | Use `dynamic(() => import(), { ssr: false })` in `page.tsx` |
| `stagger: 0.1` (too slow, feels clunky) | `stagger: 0.018–0.022` for crisp, professional letter staggers |
| Forgetting `overflow: hidden` on the `.char` wrapper | Without clip mask, the letter slides down visibly below the baseline |

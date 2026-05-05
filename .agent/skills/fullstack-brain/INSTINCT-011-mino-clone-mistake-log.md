---
name: INSTINCT-011-mino-clone-mistake-log
description: >
  Permanent record of pixel-perfect cloning mistakes made during the mino.works 
  reconstruction. These are PROVEN wrong assumptions the AI made, documented as 
  anti-patterns to avoid in all future design-cloning tasks.
  
  WHEN TO LOAD: Any time the task involves cloning an Awwwards/Framer site from screenshots.
---

# INSTINCT-011: Mino.works Clone — Mistake Log & Corrected Patterns

> **Status:** Active anti-pattern record  
> **Source:** User-validated corrections during mino.works reconstruction  
> **Rule:** Every item here was confirmed WRONG by the user. Do not repeat.

---

## 🚫 MISTAKE 1 — Wrong Theme Direction (Dark vs Light)

**What I assumed:** The site is dark-themed (`#0A0A0A` base).  
**Reality:** The dominant theme is WHITE. The dark section is only ONE scroll-triggered transition section, not the global theme.  
**Correction rule:** When a site has a hero image + one dark section + one light gray section, do NOT set the global background to dark. The dark section is a contrast accent, not the theme.

---

## 🚫 MISTAKE 2 — Hero Text Font Selection

**What I used:** Inter → Plus Jakarta Sans → Nunito (all wrong)  
**Why wrong:**
- Inter = too neutral, no rounded terminals
- Plus Jakarta Sans = rounder but still not matching
- Nunito = TOO round (circular terminals), doesn't match the geometric grotesque of mino.works

**What the reference actually shows:**
- Single-story `a` (open bowl, like a circle with a stem)
- Rectangular/square dot on `i` (not round)
- Rounded but NOT circular arches on `m`/`n`
- Clean geometric grotesque character

**Correct approach:** Use **Space Grotesk** (Google Fonts) — the single-story `a` and geometric proportions match the reference font.

**Correction rule:** Before choosing a font for cloning, identify the letterform of the lowercase `a` and the dot on `i`. Single-story `a` = geometric grotesque family (Space Grotesk, Neue Haas Grotesk, Aktiv Grotesk). Double-story `a` = humanist sans (Inter, Roboto).

---

## 🚫 MISTAKE 3 — StatementDark Font Size Too Large

**What I built:** `clamp(28px, 4.5vw, 60px)` — display-sized text  
**Reference shows:** `clamp(26px, 3.4vw, 46px)` — medium body-level text  
**Lesson:** When a section has a single short statement centered on a tall background, the font is NOT display-huge. It should feel like a medium headline — large enough to be impactful but not filling the screen.

---

## 🚫 MISTAKE 4 — "enough?" Color Was Too Vivid

**What I used:** `#FF3B30` (iOS system red — extremely vivid)  
**Reference shows:** `#E5635C` (muted salmon-coral — less vivid, warmer)  
**Lesson:** When color-matching accent text from a screenshot, always look at whether it's a pure vivid color or a desaturated/warm version. The reference "enough?" is clearly salmon-toned, NOT electric red.

---

## 🚫 MISTAKE 5 — "enough?" Was Made Italic

**What I built:** `fontStyle: 'italic'` on "enough?"  
**Reference shows:** Upright, same style as the rest of the line. NO italic.  
**Lesson:** Never add italic unless you can see a clear slant in the reference letterforms. Assuming italic = incorrect.

---

## 🚫 MISTAKE 6 — StatementLight Had Wrong Structure

**What I built:** Two separate lines — a paragraph with "Full stories" then "are." on separate lines  
**Reference shows:** ONE single inline line: `Full stories are.` — where "are." is a colored span on the SAME line  
**Lesson:** Always count the number of lines in the reference. One paragraph = one `<p>` tag. Never split into multiple elements unless there's a clear line break in the reference.

---

## 🚫 MISTAKE 7 — StatementLight Background Too Light

**What I used:** `#F3F3F3` (very light barely-gray)  
**Reference shows:** `#EBEBEB` (clearly MEDIUM gray — you can see it's gray without question)  
**Lesson:** Always pick a background gray that matches the reference's contrast ratio. If the reference gray is clearly visible as gray, don't use a near-white.

---

## 🚫 MISTAKE 8 — StatementLight Text Color Too Muted

**What I used:** `#6B6B6B` (medium gray for "Full stories")  
**Reference shows:** `#1A1A1A` (near-black — the text is dark, not gray)  
**Lesson:** On a gray background, body text is dark (near-black), not gray. Gray text on gray background = low contrast, which the reference does NOT have.

---

## 🚫 MISTAKE 9 — StatementLight Blue Accent Was Purple-ish

**What I used:** `#5B62D4` (blue-purple)  
**Reference shows:** `#2563EB` (royal/cobalt blue — clearly blue, not purple)  
**Lesson:** When identifying accent colors from screenshots, look at the hue. The reference "are." is clearly a saturated royal blue with no purple tint.

---

## 🚫 MISTAKE 10 — Hero Image Was Portrait Ratio

**What I generated:** 1:1 portrait-ish image  
**Reference:** Full-viewport LANDSCAPE (16:9) — wide pool scene spanning the full screen  
**Lesson:** For full-screen hero backgrounds, always generate images in 16:9 landscape orientation. The viewport is almost always wider than tall.

---

## 🚫 MISTAKE 11 — GSAP opacity:0 Caused SSR Timing Issues

**What I did:** Set `opacity: 0` on initial render in inline CSS, relied on GSAP to animate to 1  
**Problem:** On slow connections or SSR, elements are invisible permanently if GSAP doesn't trigger  
**Correct pattern:** Set `opacity: 0` ONLY in the `gsap.fromTo()` first argument, not in the JSX inline style. OR use `gsap.set()` inside `useEffect` for initial state.

---

## 🚫 MISTAKE 12 — Typography Baseline Destroyed by Letter-Level Clip Masks

**What I did:** Wrapped every single character in an `inline-block` with `overflow: hidden` to create a staggered scroll reveal.  
**Problem:** The CSS `overflow: hidden` property forces inline-block elements to align their baseline to the bottom margin edge. Letters with descenders (like "y", "p", "g") physically misaligned with letters like "t" or "e", creating a bumpy, chaotic baseline.  
**Correct pattern:** Wrap the *entire line* of text in a block-level clip mask (`<span style={{ display: 'block', overflow: 'hidden' }}>`), and leave the individual staggered characters inside it *without* `overflow: hidden`.

---

## 🚫 MISTAKE 13 — Scrubbed Timeline Queue Jumping

**What I did:** Created two separate `gsap.to` animations on a scrubbed ScrollTrigger timeline — one for the main sentence and one for the colored accent word at the end of the sentence, separated by a hardcoded time offset (`0.14`).  
**Problem:** Because the main sentence had ~50 characters with a stagger, its animation duration extended past the start time of the accent word. The accent word "jumped the queue" and animated down before the preceding words had finished.  
**Correct pattern:** Apply a unified CSS class (e.g., `.dl`) to *all* letters, including the accent word, so they are grabbed into a single GSAP `stagger` array. Apply the color change in a separate timeline step *after* the unified stagger completes.

---

## 🚫 MISTAKE 14 — Tabbed State vs. Sequential Scrolling Sections

**What I assumed:** A "Selected Works" block with 5 categories was a single sticky section with internal React state (`activeTab`) that faded the background image.  
**Reference shows:** 5 distinctly separate `100vh` `<section>` elements stacked vertically. Each section has its own embedded sub-navigation bar that scrolls up with it.  
**Lesson:** When cloning premium Awwwards-style portfolio sites, favor physical scrolling panels (`h-[100vh]`) with CSS sticky/fixed headers over complex internal state mutations. Scrolling is the primary interaction paradigm.

---

## 🚫 MISTAKE 15 — Assuming Headless CMS Assets Couldn't Be Scraped

**What I assumed:** Because `.mp4` URLs weren't in the raw HTML source (due to Next.js/Framer client-side rendering), I assumed I had to use Unsplash placeholders.  
**Correct pattern:** Use a headless browser subagent to execute `document.querySelectorAll('video').map(v => v.src)` directly in the DOM console to extract the exact `framerusercontent.com` CDN URLs after hydration.

---

## ✅ CORRECT PATTERNS FOR FUTURE DESIGN CLONING

1. **Font identification:** Check lowercase `a` — single-story = geometric grotesque
2. **Color accuracy:** Don't use system colors (iOS red, etc.) — eyedrop the actual reference
3. **Section structure:** Count lines precisely — don't assume two lines from two paragraphs
4. **Image generation:** Always specify 16:9 landscape for hero backgrounds
5. **Text size:** A centered text statement on a large bg ≠ display-huge — check proportions
6. **Gray backgrounds:** Use the actual shade — if it "looks gray", it IS distinctly gray (not #F8F8F8)
7. **GSAP + SSR:** Never rely on GSAP to make hidden elements visible — always have CSS fallback
8. **Clip Masks:** Never apply `overflow: hidden` to individual characters; apply it to the line wrapper.
9. **GSAP Staggers:** Keep words within the same sentence in a single DOM array for seamless sequential staggering.
10. **Scroll Layouts:** Prefer stacking `100vh` sections for "slides" rather than mutating a single section's state.
11. **Media Scraping:** Read the hydrated DOM for media URLs, not just the static HTML string.

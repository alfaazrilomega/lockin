---
name: visual-extraction-protocol
description: |
  Activates AUTOMATICALLY when CORE-00 detects a TYPE 4 input (screenshot + matching URL).
  Also activates when the user says "copy this section", "match this design exactly",
  "same animation", or "100% copy".
  
  This skill handles the complete pipeline for: visiting the live URL, extracting CSS
  animations/effects from the specific section shown in the screenshot, extracting
  image sources, generating similar-but-different image variants to avoid plagiarism,
  and producing a 100%-accurate code specification that matches every visual detail
  in the screenshot.
---

# SKILL: Visual Extraction Protocol
## (The 100% Section Copy Engine)

> **Trigger:** Fires immediately after CORE-00 when TYPE 4 input is detected.
> **Position in chain:** CORE-00 → **THIS SKILL** → CORE-01 → CORE-02 → CORE-03 → CORE-04 (Pixel-Perfect mode) → CORE-05

---

## Stage 1: Screenshot Analysis (Before Visiting URL)

First, analyze the user's attached screenshot WITHOUT visiting the URL. Extract everything visible:

```
SCREENSHOT ANALYSIS REPORT:
─────────────────────────────────────────
Section Type: [hero / features / about / pricing / footer / etc.]
Visual Hierarchy: [what is the focal point? Large text? Image? Both?]

Typography visible:
  - Heading: [text content, approximate size, weight, style]
  - Subheading: [if visible]
  - Body/caption: [if visible]

Colors visible:
  - Background: [describe — cream/dark/gradient/image-backed]
  - Text: [light/dark, warm/cool]
  - Accent: [button color, border color, icon color]

Layout:
  - Grid type: [full-width / split / centered / offset]
  - Image relationship to text: [behind / beside / above / below]
  - Navigation visible: [describe style]

Effects visible in screenshot:
  - Image treatment: [parallax? overlay? blend? mask?]
  - Text effects: [gradient fill? outline? clip-path?]
  - Buttons: [pill? square? outline? solid?]
  - Shadows: [yes/no — describe if yes]
  - Glassmorphism: [yes/no]

Special/distinctive elements:
  - [Anything unusual — the giant LAGOM text, background-clip text, etc.]
─────────────────────────────────────────
```

---

## Stage 2: Live Site Extraction (browser_subagent Mission)

> ### ⚠️ THE RENDERING GAP WARNING — READ BEFORE ANY EXTRACTION
>
> **The core problem:** Modern websites built with React, Next.js, Vue, Svelte, Angular,
> or PHP/Laravel DO NOT serve their real UI in the HTML source code.
>
> | What You Do | What You Get | Is It Accurate? |
> |------------|-------------|----------------|
> | `View Source` (Ctrl+U) | Minified bundle shell, `<div id="root"></div>`, or SSR'd static HTML | ❌ NO — 0–60% match to actual UI |
> | DevTools → Elements panel | The **live, runtime DOM** — exactly what the browser rendered | ✅ YES — 100% accurate |
> | DevTools → Computed Styles | The **final resolved CSS** after all overrides and cascades | ✅ YES — 100% accurate |
> | DevTools → Animations panel | Live animation state at runtime | ✅ YES — 100% accurate |
> | DevTools → Network → Images | Actual loaded assets, not source references | ✅ YES — 100% accurate |
>
> **The AI's job is to read the browser's RUNTIME OUTPUT — not the source code.**
> Never use `View Source` for design extraction. Always use DevTools.
>
> **Why this matters for the final code:**
> When a React site renders `<h1 className="hero-title">LAGOM</h1>`, the browser
> computes real CSS: `font-size: clamp(80px, 15vw, 220px)`. The source might show
> only a class name — the computed style shows the actual pixel math. This is the
> data you need for 100% accuracy. Guessing from class names is what produces
> the "60% accurate" result the user described.

After analyzing the screenshot, visit the live URL using `browser_subagent`. The mission has 5 required extraction tasks:

### Task A: Navigate to the Exact Section
1. Open the URL
2. Scroll to the section that matches the screenshot
3. Take a new screenshot to confirm you've found the correct section

### Task B: CSS Extraction (DevTools — Computed, NOT Source)

> ⚠️ **Use the Computed tab, NOT the Styles tab.**
> The Styles tab shows authored CSS (which may be Tailwind class names like `text-5xl`).
> The Computed tab shows RESOLVED values (which shows `48px`). For Pixel-Perfect work,
> you need the resolved value.
>
> **SPA/React detection:** If the site uses React/Next/Vue, the Elements panel will show
> the runtime DOM. This is correct. Read styles from here — not from `<script>` bundles.

Open DevTools → Elements panel → Select the section container → Click **Computed** tab:
```
Extract:
  font-family:        [exact value — Computed shows resolved stack]
  font-size:          [exact px value — always px in Computed, even if source used clamp()]
  font-size-raw:      [check Styles tab for the original clamp() expression]
  font-weight:        [exact numeric value]
  letter-spacing:     [exact value]
  line-height:        [exact value]
  background-color:   [exact rgb/hex]
  background-image:   [URL if image-backed]
  color:              [exact value]
  border-radius:      [exact value for all elements]
  padding:            [exact px values — all 4 sides]
  margin:             [exact values]
  mix-blend-mode:     [if text overlaps image]
  -webkit-background-clip: [if text has gradient/image fill]
```

### Task C: Animation Extraction (DevTools → Animations Panel)
Open DevTools → More tools → Animations panel:
```
For each animation found on or near this section:
  animation-name:        [name]
  animation-duration:    [ms or s]
  animation-timing-function: [exact cubic-bezier or keyword]
  animation-delay:       [ms or s]
  animation-iteration:   [count or infinite]
  
  @keyframes: [copy the FULL keyframe declaration]
    from: [all properties and values]
    [%]: [all properties and values]
    to: [all properties and values]
```

### Task D: Scroll Effect Extraction
Open DevTools → Sources → search for "ScrollTrigger", "IntersectionObserver", "scroll":
```
Scroll type: [GSAP ScrollTrigger / IntersectionObserver / CSS scroll-timeline / Lenis / none]
Trigger point: [when does it fire? e.g., "when element is 80% in viewport"]
Effect: [what changes? translateY? opacity? scale? clip-path?]
Duration/scrub: [instant snap / scrubbed to scroll position / duration-based]

Parallax specifics (if applicable):
  Element moving: [background image / text / overlay]
  Speed ratio: [e.g., background moves at 0.3× scroll speed]
```

### Task E: Image Extraction
Open DevTools → Network → Filter: Img:
```
For each significant image in this section:
  Source URL:    [full URL]
  Dimensions:    [width × height]
  Format:        [webp / jpg / png / svg]
  Object-fit:    [cover / contain / fill]
  Position:      [center / top / specific percentage]
  
Visual description for regeneration:
  Subject:       [what is in the image? building exterior, person, abstract, etc.]
  Style:         [photorealistic / illustration / 3D render / photography]
  Color palette: [describe dominant colors]
  Mood:          [dramatic / warm / cool / minimal]
  Angle:         [wide shot / close up / aerial / eye level]
```

---

## Stage 3: Image Regeneration (Avoid Plagiarism)

For every extracted image, generate a **similar-but-different** version:

### The "Similar But Different" Rule
The generated image must:
- ✅ Match the same **style** (photorealistic / 3D render / illustration / etc.)
- ✅ Match the same **mood** (warm and inviting / dramatic and architectural / minimal)
- ✅ Match the same **color palette** (same dominant hues)
- ✅ Match the same **composition type** (wide establishing shot / hero portrait / etc.)
- ❌ NOT copy the same **subject** (different building if original shows building)
- ❌ NOT copy unique identifying elements (logos, specific architecture, people's faces)
- ❌ NOT use the original image directly

### Image Generation Prompt Template:
```
[Style descriptor] of [different but similar subject],
[matching lighting description from original],
[color palette description matching extracted colors],
[matching mood description],
[matching composition/angle],
ultra-high quality, no text, no watermarks,
[technical spec: 16:9 / square / portrait — match original ratio]
```

**Example for lagom-development.com hero:**
```
Original: photorealistic 3D render of modernist timber house exterior, warm late afternoon light, cream/beige tones, blue sky background, wide establishing shot

Generated prompt:
"Photorealistic architectural visualization of contemporary concrete villa exterior,
warm late afternoon golden hour lighting, warm cream and stone color palette,
soft blue sky background, premium residential architecture mood,
wide establishing shot with professional depth of field,
ultra-high quality render, no text, 16:9 landscape"
```

---

## Stage 4: 100% Copy Code Specification

Produce a self-contained code specification that CORE-05 can execute without questions:

```markdown
## SECTION COPY SPEC: [Section Name] from [URL]
─────────────────────────────────────────────────

### Layout
- Container: [full-width / max-width Xpx centered / split]
- Height: [Xvh / auto / fixed px]
- Display: [flex / grid / relative positioning]
- Grid/Flex: [exact values]

### Typography
- Font Family: '[exact font name]', [fallback stack]
- Import: [Google Fonts URL / local / CDN]
- Heading: [size]px (or clamp(Xpx, Xvw, Xpx)) / weight: [value] / tracking: [value]
- Body: [size]px / weight: [value] / color: var(--text-primary)

### Colors (Token-Mapped)
- Background: [hex] → var(--surface-base)
- Text primary: [hex] → var(--text-primary)  
- Accent: [hex] → var(--accent-brand)
- [Add all extracted colors with token mappings]

### Background Image/Visual
- Source: [generated image path or generated prompt used]
- object-fit: [cover/contain]
- position: [center/specific]
- Overlay: [none / rgba(X,X,X,X)]
- blend-mode: [none / multiply / overlay / screen]

### Animations & Scroll Effects
[List every animation with exact keyframe code]
```css
@keyframes [name] {
  from { [properties] }
  to { [properties] }
}

.[selector] {
  animation: [name] [duration] [easing] [delay] [fill-mode];
}
```

### Scroll Effect
- Library: [GSAP / CSS / IntersectionObserver]
- Trigger: [exact trigger condition]
- Effect: [exact CSS property change]
- Easing: [cubic-bezier or keyword]

### Hover States
[Every hover state with exact before → after values]

### Button Spec
- Background: [hex] → var(--accent-brand)
- Border-radius: [exact px]
- Padding: [top right bottom left in px]
- Font: [size / weight / color]
- Hover: [color change + transition]
─────────────────────────────────────────────────
```

---

## Stage 5: Conflict Check with CORE-04

Before handing off to CORE-04, flag any values that conflict with CORE-04 math laws:

```
PIXEL-PERFECT MODE ACTIVE: The following CORE-04 laws are SUSPENDED for this section:
- φ-proportion check (reference uses full-width) → SUSPENDED
- Riz spacing (reference spacing differs from 2:3:5) → SUSPENDED WHERE CONFLICTING

The following CORE-04 rules REMAIN ACTIVE:
- W3C token format (ALL colors must use CSS variables)
- GPU-safe animations (transform/opacity only → CONVERT any non-GPU extractions)
- WCAG AA contrast (verify extracted colors meet 4.5:1)
- No hardcoded hex in component markup
```

> **Note on GPU safety:** If the extracted animations use `width`, `height`, `top`, or `left`,
> convert them to `transform: translateX/Y/scale()` equivalents for 60fps performance.
> Document the conversion so the user understands the change.

---

## Stage 6: Baton Update

Output before proceeding to CORE-01:

### 6A: Multi-Reference Token Reconciliation (MANDATORY when 2+ TYPE 4 inputs detected)

If multiple TYPE 4 inputs have conflicting design systems (e.g., one dark, one light):

```
MULTI-REFERENCE CONFLICT DETECTED:
  Reference A: [site] → Theme: [dark/light] → Surface: [hex]
  Reference B: [site] → Theme: [dark/light] → Surface: [hex]

Reconciliation Protocol:
  Step 1: Identify the USER'S PRIMARY INTENT from CORE-00 Baton
    - Which reference did they show first? → That is Reference A (primary)
    - Which did they describe with stronger adjectives? → That is primary
    - Ask if unclear: "Both references have different color schemes (dark vs light).
                      Which overall theme do you prefer for YOUR site?"
  Step 2: Assign Reference A as the COLOR/THEME system
  Step 3: Assign Reference B as the LAYOUT/STRUCTURE system (if different)
  Step 4: Synthesize a single token set:
    --surface-base: [from primary reference]
    --text-primary: [from primary reference]
    --accent-brand: [best of both references]
    --layout-system: [from reference with better structural clarity]
  Step 5: Record in Baton: "Token Base: [Primary Reference Site]"
```

### 6B: Animation Library Pre-determination Rule

If animation library was detected in Stage 2D extraction:
```
ANIMATION LIBRARY PRE-DETERMINED:
  Detected: [GSAP / CSS / IntersectionObserver / Lenis]
  Source: [site name] live extraction
  
  This OVERRIDES CORE-03 library selection for Pixel-Perfect sections.
  CORE-03 must NOT ask the user to choose a different library for these sections.
  CORE-03 MUST present this as: "Reference uses [GSAP]. For pixel-perfect fidelity,
  I will use [GSAP]. Shall I proceed?"
  
  Flag in Baton: Animation Library: PRE-DETERMINED ([GSAP]) from [site]
```

### 6C: Standard Baton Update

```
[BATON UPDATE — SKILL-visual-extraction-protocol]
TYPE 4 Sections Processed: [list]
Fidelity Lock: PIXEL-PERFECT (auto-set by TYPE 4 detection)
Screenshot Analysis: [key findings]
Live Extraction: [status: complete / partial / blocked by CORS/auth]
Images Generated: [filenames or generation prompts logged]
CORE-04 Suspension Flags: [which laws are suspended for which sections]
Animation Library: [PRE-DETERMINED (GSAP/CSS/etc.) / NOT DETECTED]
Token Base Reference: [primary reference site for color/theme]
[END UPDATE]
```

---

> **Skill Class:** Visual Extraction · Animation Capture · Image Regeneration · 100% Copy Protocol
> **Triggers:** TYPE 4 input in CORE-00, "100% copy", "match this design", "same animation"
> **Position:** Runs immediately after CORE-00, BEFORE CORE-01
> **Version:** 1.0.0 — Fixes Brain Audit Contradiction #4, #5, #7

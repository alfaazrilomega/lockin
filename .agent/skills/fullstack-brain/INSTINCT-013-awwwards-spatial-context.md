# INSTINCT-013: Awwwards Spatial Aesthetics & Context Preservation

This instinct prevents the generation of "basic" or "flat" web designs and enforces strict context management to prevent AI hallucination during complex builds.

## 1. Maximum Design Token Activation
Whenever a design task is initiated, you must activate your maximum design capabilities. Do not output basic, standard, or "MVP" layouts unless explicitly demanded. 
- **Research Best Practices:** Emulate what top human developers do for Awwwards-winning sites. Incorporate sophisticated 3D transforms, custom easing (never linear), complex text animations (staggered reveals, outlines), interactive counters, and spatial awareness.
- **Avoid Bad References:** Do not reference previous failed attempts or use mediocre analogies (e.g., do not say "like the paper-sweep"). Rely strictly on industry-standard premium animation physics.

## 2. Spatial Physics vs. Flat Scrolling
- **The Ban on Flat Stacking:** Sections should not simply stack block-by-block. 
- **The Cinematic Canvas:** Treat the viewport as a camera moving through a 3D space. Use GSAP ScrollTrigger, pinning, parallax, z-index manipulation, and clip-path reveals to transition between sections.
- **No Arbitrary Hues:** In a monochrome or brutalist design, NEVER introduce arbitrary gradients or colors for transitions. Stick strictly to the established design tokens (e.g., pure #000000, #FFFFFF, 0.5px hairlines).

## 3. The Golden Ratio & Strict Grid Composition
- Never place elements arbitrarily.
- Adhere to strict grid matrices (e.g., 2x2 hero grids, 3-column bento boxes, 4-column strips).
- Enforce typographic hierarchy rigidly (e.g., massive 'Inter Tight' headlines paired with tiny 'JetBrains Mono' metadata).

## 4. Context Pull-Out & Hallucination Prevention
As files grow (especially massive GSAP timelines or layout files), your context window will degrade, leading to hallucinations (e.g., referencing deleted IDs).
- **The Pause & Trace Protocol:** Before modifying a complex component, you MUST STOP and re-read the active file.
- **Dump Assumptions:** Do not assume you know the current DOM structure based on memory from 5 turns ago. Verify the exact IDs, classes, and structure currently in the file before writing GSAP targets or CSS.

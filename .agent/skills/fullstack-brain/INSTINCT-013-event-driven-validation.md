# INSTINCT-013: Event-Driven Visual Validation (EDVV)
**Status:** ACTIVE — Permanent Core Protocol  
**Supersedes:** All previous time-based / polling-based screenshot validation methods  
**Scope:** All browser_subagent validation tasks, visual QA, animation verification, scroll-jacking confirmation

---

## ⛔ PHASE 0: THE ABSOLUTE BAN

The following patterns are **permanently and unconditionally prohibited** in all future validation scripts:

```js
// ❌ BANNED FOREVER — NEVER USE
await page.waitForTimeout(500)
setTimeout(() => takeScreenshot(), 500)
setInterval(() => checkState(), 1000)
// Any fixed-interval polling loop
```

### Why These Patterns Are Toxic:
1. **Token Bloat:** A 10-screenshot validation loop at 0.5s intervals generates 10+ LLM calls regardless of whether the animation has reached the target state. This inflates context usage by 3-10x for zero additional information gain.
2. **Async Desync (Blind Spots):** A 0.5s sleep has no awareness of GSAP's actual timeline state. If the animation runs at 60fps over 1.2s, a 0.5s snapshot captures a random intermediate frame — not the state being validated.
3. **AI Context Hallucinations:** When a screenshot doesn't show the expected state, the agent falsely assumes "the animation hasn't fired yet" and loops again, creating a feedback cycle that can run 20+ iterations without resolution.
4. **Non-determinism:** The same validation script will capture different frames on different machines due to CPU load, network latency, or browser warm-up differences.

---

## ✅ PHASE A: Network / DOM State Triggers

**Use Case:** Capturing initial page loads, preloader states, or first-render HTML.

**Rule:** Screenshots for initial states MUST wait exclusively on a DOM readiness signal, never a fixed timer.

### Correct Implementation:
```js
// ✅ CORRECT: Wait for DOM to be interactive before any screenshot
await page.waitForFunction(() => document.readyState === 'interactive' || document.readyState === 'complete')
await page.screenshot({ path: 'initial_state.png' })

// ✅ CORRECT: Wait for a specific element to exist in the DOM
await page.waitForSelector('#global-navbar', { state: 'attached' })
await page.screenshot({ path: 'navbar_mounted.png' })

// ✅ CORRECT: Wait for the preloader counter to show "100"
await page.waitForFunction(() => {
  const el = document.querySelector('[data-role="counter"]')
  return el && el.textContent === '100'
})
await page.screenshot({ path: 'preloader_100.png' })
```

**In browser_subagent task prompts:** Instead of "wait 7 seconds", instruct the agent to:
> "Wait for the `#global-navbar` element to have `opacity > 0` before taking the screenshot. Use `page.waitForFunction` to detect this."

---

## ✅ PHASE B: Animation Hooks (GSAP / Framer Motion)

**Use Case:** Validating cinematic transitions — the preloader wipe, image expansion, text reveals, pinned scroll color morphs.

**Rule:** Screenshots during GSAP animations MUST be triggered from GSAP's own callback hooks. Fixed-time polling is banned.

### Correct Implementation — GSAP Callbacks:
```js
// ✅ CORRECT: Inject a validation hook into the GSAP timeline BEFORE it plays
const tl = gsap.timeline()

tl.to(imageWrapper, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 })
  .add(() => {
    // GSAP guarantees this fires EXACTLY when the wipe completes
    captureScreenshot('wipe_complete.png')
  })
  .to(imageWrapper, { width: "100vw", duration: 1.5 })
  .add(() => {
    captureScreenshot('expansion_complete.png')
  })

// ✅ CORRECT: Use onUpdate with a progress threshold
gsap.to(target, {
  duration: 2,
  onUpdate() {
    if (Math.abs(this.progress() - 0.5) < 0.01) {
      captureScreenshot('midpoint_50pct.png')
    }
  },
  onComplete() {
    captureScreenshot('animation_done.png')
  }
})
```

### For browser_subagent validation prompts, use this pattern instead of timeouts:
```
"Navigate to localhost:3001. Inject the following script into the page console:
  window.__validationShots = []
  window.__gsapTL?.add(() => { window.__validationShots.push('wipe_done') })
  
Then poll `window.__validationShots` until it contains 'wipe_done', then screenshot."
```

### Framer Motion Equivalent:
```jsx
// ✅ CORRECT: Use onAnimationComplete lifecycle hook
<motion.div
  animate={{ opacity: 1 }}
  onAnimationStart={() => captureScreenshot('anim_start.png')}
  onAnimationComplete={() => captureScreenshot('anim_done.png')}
/>
```

---

## ✅ PHASE C: Scroll & Intersection Observer (Pinned Sections)

**Use Case:** Validating scroll-jacking, pinned sections, parallax effects, scroll-triggered color morphs.

**Rule:** All scroll-triggered validation MUST use `IntersectionObserver`. The agent must script scrolling programmatically and observe intersection ratios, never rely on fixed scroll amounts + sleep.

### Correct Implementation:
```js
// ✅ CORRECT: Screenshot exactly when the pinned section hits intersectionRatio: 1
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.intersectionRatio >= 0.99) {
      // Section is FULLY pinned (≈ 100% in viewport)
      captureScreenshot('section_pinned_100pct.png')
    }
    if (entry.intersectionRatio < 0.1) {
      // Section has exited
      captureScreenshot('section_exited.png')
    }
  }
}, { threshold: [0, 0.1, 0.5, 0.99, 1.0] })

observer.observe(document.querySelector('#beauty-section-sticky'))
```

### For ScrollTrigger validation (GSAP):
```js
// ✅ CORRECT: Use ScrollTrigger's own callbacks, not setTimeout
ScrollTrigger.create({
  trigger: '#outer-beauty',
  start: 'top top',
  end: '+=400%',
  pin: '#sticky-canvas',
  onEnter: () => captureScreenshot('pin_engaged.png'),          // Section just pinned
  onLeave: () => captureScreenshot('pin_released.png'),         // Scroll past section
  onUpdate: (self) => {
    if (Math.abs(self.progress - 0.5) < 0.01) {
      captureScreenshot('color_morph_midpoint.png')             // Background at grey→brown
    }
  }
})
```

---

## ✅ PHASE D: browser_subagent Task Prompt Template (EDVV Standard)

All future browser_subagent Task prompts for visual validation MUST follow this template:

```
Navigate to [URL].

VALIDATION SEQUENCE (Event-Driven — NO setTimeout or fixed waits):

Step 1 — Initial State:
  - Wait for: `document.readyState === 'complete'`
  - Then wait for: `#global-navbar` to have computed opacity of 0 (preloader active)
  - Take screenshot → label: "01_preloader_active"

Step 2 — Animation Midpoint:
  - Inject script: `window._shotFlag = false; gsap.getById('mainTL')?.eventCallback('onUpdate', () => { if (!window._shotFlag && gsap.getById('mainTL').progress() > 0.5) { window._shotFlag = true; } })`
  - Poll: `await page.waitForFunction(() => window._shotFlag === true)`
  - Take screenshot → label: "02_animation_50pct"

Step 3 — Final State:
  - Wait for: `#global-navbar` computed opacity > 0.9
  - Take screenshot → label: "03_hero_complete"

Return all screenshot paths.
```

---

## PHASE 2: AUDIT OF PREVIOUS VALIDATION METHODS

The following patterns were used in previous sessions and are now **DEPRECATED**:

| Previous Pattern | Found In | Status | Replacement |
|---|---|---|---|
| `"Wait 7 seconds for animation"` | All browser_subagent prompts | ❌ BANNED | `waitForFunction(() => navbar.opacity > 0)` |
| `"Wait 0.5s, take screenshot"` | Preloader validation | ❌ BANNED | GSAP `onUpdate` at progress = 0.99 |
| `"Scroll Page Down 3 times, wait 1s"` | Scroll section validation | ❌ BANNED | `IntersectionObserver` at ratio ≥ 0.99 |
| `"Reload and immediately screenshot"` | Counter validation | ⚠️ PARTIAL | `waitForSelector('[data-counter]')` then `waitForFunction` for value === '100' |

---

## DECLARATION

From this moment forward, I operate exclusively under **Event-Driven Visual Validation**.

No fixed sleep. No polling loops. No assumptions about timing.  
Every screenshot is taken in response to a deterministic DOM, animation, or intersection event.  
This is the only acceptable standard for pixel-perfect UI validation in this workflow.

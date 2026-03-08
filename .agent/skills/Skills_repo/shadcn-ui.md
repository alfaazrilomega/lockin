# SKILL: Shadcn UI & Theming Expert

## Context

You are a UI/UX Engineer for LockIn. You implement designs using Shadcn UI and Tailwind CSS, strictly adhering to the LockIn `design-system.md` (Notion-like adaptive theme, Satoshi/Outfit fonts).

## Directives

1. **Reuse Primitives:** Always check if a Shadcn UI component exists (e.g., `Button`, `Dialog`, `Popover`, `Input`) before writing raw HTML tags. Import from `@/components/ui/`.
2. **Crisp Workspace UI:** - Apply `bg-background` and `border border-border`.
   - Use subtle shadows (`shadow-sm`, `shadow-md`).
   - DO NOT use `backdrop-filter` or `blur` (Glassmorphism) EXCEPT for the sticky Top Navigation.
3. **Typography:**
   - Base text and headings use the default font (Satoshi).
   - Use the `font-outfit` class ONLY for numbers, metrics, or badges (e.g., Progress Bars).
4. **Animations:** - Use `tailwindcss-animate` utility classes (e.g., `animate-in fade-in zoom-in-95`).
   - NEVER animate `width`, `height`, or `margin`.

## Example Enforcement

Instead of: `<button className="bg-blue-500 text-white p-2 rounded">`
Use: `<Button variant="default" size="sm">`

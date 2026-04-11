# SKILL: Theme Factory (Notion-like Aesthetic)

## Context

You are the Design Systems Enforcer for LockIn. You ensure all generated UI strictly follows the `design-system.md` constraints.

## Directives

1. **Never Hardcode Colors:** DO NOT use specific Tailwind colors like `bg-gray-100` or `text-black`.
2. **Use Semantic Variables:** - Backgrounds: `bg-background`, `bg-muted`
   - Text: `text-foreground`, `text-muted-foreground`
   - Borders: `border-border`
   - Accents: `bg-primary`, `text-primary`
3. **Typography Enforcement:**
   - Use `font-satoshi` (default) for general text, headings, and notes.
   - Use `font-outfit` ONLY for numbers, statistics, progress percentages, and small badges.
4. **Crisp UI:** No heavy box-shadows. Use `shadow-sm` and subtle `border` for cards. Do NOT use `backdrop-filter` (glassmorphism) anywhere except the top navigation bar.

# Commands to Run After Tasks

## Type Checking & Linting

```bash
# TypeScript - MUST PASS before any commit
npx tsc --noEmit

# ESLint - fix auto-fixable issues first
npm run lint

# For auto-fixing lint errors (use cautiously):
npx eslint . --fix
```

## Build & Run

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server (locally after build)
npm run start
```

## Database Operations

```bash
# Generate Prisma Client after schema changes
npx prisma generate

# Push schema changes to dev database (loses data in dev only)
npx prisma db push

# Create a proper migration (for versioned changes)
npx prisma migrate dev --name description

# Open Prisma Studio (GUI to browse/edit data)
npx prisma studio

# Reset database (DEV ONLY - destroys all data)
npx prisma migrate reset
```

## Git Workflow

```bash
# Check status
git status

# Stage changes
git add <files>

# Commit (use Conventional Commits)
git commit -m "feat: add feature X"  # or fix:, docs:, refactor:, etc.

# Push to remote
git push origin <branch>

# Create PR (if using GitHub CLI)
gh pr create --title "..." --body "..."

# Sync with main
git checkout main && git pull origin main
```

## Environment Setup (First Time)

```bash
# Copy environment file
cp .env.example .env

# Fill in .env with:
# - DATABASE_URL (Supabase connection string)
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - OPENROUTER_API_KEY
# - NEXT_PUBLIC_APP_URL

# Install dependencies
npm ci  # or npm install

# Setup DB
npx prisma generate
npx prisma db push
```

## Windows-Specific Notes

- Use Git Bash or WSL for Unix commands
- If `npx tsc` fails with parse errors on Windows, check for CRLF line endings:
  - VS Code: bottom-right status bar → "CRLF" → click → select "LF"
  - Or batch convert: `find . -name "*.ts" -o -name "*.tsx" | xargs dos2unix`
- Set Git to use LF: `git config --global core.autocrlf input`

## Pre-Commit Checklist

1. [ ] `npx tsc --noEmit` → **0 errors**
2. [ ] `npm run lint` → **0 errors** (warnings OK but review them)
3. [ ] `npm run build` → builds successfully
4. [ ] Feature tested in `npm run dev`
5. [ ] DB changes pushed with `npx prisma db push` or migration
6. [ ] No console.error debug statements left
7. [ ] Authorization checks on all server action mutations
8. [ ] Zod validation on all inputs
9. [ ] `revalidatePath()` called after mutations
10. [ ] No hardcoded secrets

---

# Quick Reference

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Type check | `npx tsc --noEmit` |
| Lint | `npm run lint` |
| Fix lint (auto) | `npx eslint . --fix` |
| Generate Prisma | `npx prisma generate` |
| Push DB schema | `npx prisma db push` |
| Open DB GUI | `npx prisma studio` |
| Create migration | `npx prisma migrate dev --name desc` |

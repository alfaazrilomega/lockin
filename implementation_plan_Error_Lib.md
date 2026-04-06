# Fixing PowerShell Overrides & OpenRouter 401 Error

Good catch! I found exactly what was happening. Our earlier fix was updating the Windows Global User Variables... but you had a **PowerShell startup script ([Microsoft.PowerShell_profile.ps1](file:///C:/Users/Azril/Documents/WindowsPowerShell/Microsoft.PowerShell_profile.ps1))** that was actively fighting against it!

Every time you opened a new PowerShell, this script was explicitly hardcoding `$env:ANTHROPIC_MODEL='stepfun/step-3.5-flash:free'` along with your old API key, completely overpowering the Windows variables.

Additionally, in `CMD` running the Minimax model was failing because your `ANTHROPIC_BASE_URL` was set identically to `https://openrouter.ai/api`. The Anthropic SDK sometimes truncates endpoints without the trailing `/v1`, leading to "User not found" (401) errors or issues retrieving the model. 

## Proposed Changes

We will fix this by targeting your PowerShell profile directly:

1. **Update `$PROFILE`:** Modify [C:\Users\Azril\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1](file:///C:/Users/Azril/Documents/WindowsPowerShell/Microsoft.PowerShell_profile.ps1) to use:
   - Your new `minimax/minimax-m2.5:free` model
   - Your new OpenRouter API Key `sk-or-v1-2c41879...`
   - The correct OpenRouter Base URL: `https://openrouter.ai/api/v1`

2. **Sync Global Variables:** Update the global `ANTHROPIC_BASE_URL` variable to `https://openrouter.ai/api/v1` so that if you ever use `CMD` again, it won't crash either.

You will then review the changes and once you open a completely new terminal, it will finally prioritize the right model!

## Server Actions & Type Safety Fixes

This plan addresses the TypeScript errors ("Property 'user' does not exist on type 'AuthUser'") and missing exports in the server actions.

### lib/auth-helpers.ts
- [NEW] Add implementation for `isProjectMember(projectId, userId)`
- [NEW] Add implementation for `authorizeProjectModify(projectId, userId)`
- [NEW] Add implementation for `authorizeTaskAccess(taskId, userId)` 
- [NEW] Add implementation for `authorizeTaskModify(taskId, userId)`
- [NEW] Add implementation for `authorizeNoteAccess(noteId, userId)`
- [NEW] Add implementation for `authorizeNoteModify(noteId, userId)`
- [NEW] Add implementation for `authorizeDeckModify(deckId, userId)`

### lib/actions/*.actions.ts
- [MODIFY] Fix variable destructuring in [dashboard.actions.ts](file:///d:/lockincapstone/lockin/lib/actions/dashboard.actions.ts), [flashcard.actions.ts](file:///d:/lockincapstone/lockin/lib/actions/flashcard.actions.ts), [note.actions.ts](file:///d:/lockincapstone/lockin/lib/actions/note.actions.ts), [project.actions.ts](file:///d:/lockincapstone/lockin/lib/actions/project.actions.ts), and [task.actions.ts](file:///d:/lockincapstone/lockin/lib/actions/task.actions.ts). Change `const { user } = await requireUser()` to `const user = await requireUser()`.
- [MODIFY] Add missing type imports: [CreateProjectForm](file:///d:/lockincapstone/lockin/lib/types.ts#115-120) (in [project.actions.ts](file:///d:/lockincapstone/lockin/lib/actions/project.actions.ts)), [CreateNoteForm](file:///d:/lockincapstone/lockin/lib/types.ts#130-136) (in [note.actions.ts](file:///d:/lockincapstone/lockin/lib/actions/note.actions.ts)).
- [MODIFY] Remove unused variables like `createClient` from various action files.
- [MODIFY] Remove unused imported schemas like `getDashboardStatsSchema` and `updateNoteSchema`.

## Verification Plan
### Automated Tests
Run type checking with `npx tsc --noEmit` to ensure all TypeErrors and warnings are gone.

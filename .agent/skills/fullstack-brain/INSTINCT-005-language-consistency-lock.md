---
name: language-consistency-lock
description: Detects the user's preferred communication language at the start of each session and locks to it for the entire session. Prevents unintended language drift (e.g., switching from English to Bahasa Indonesia mid-session without explicit request). Applies to all AI responses including code comments, documentation, and error messages.
tools: []
model: sonnet
---

# INSTINCT-005 — Language Consistency Lock

> **Core Principle:**
> Language is the user's primary communication interface with the AI.
> Unexpected language changes break the user's flow, create confusion,
> and signal a lack of attentiveness. The AI must detect, lock, and
> maintain the user's language throughout the entire session unless
> explicitly instructed to switch.

---

## When to Activate This Instinct

Activate at the **very first message** of every session.
This instinct is always-on — it has no specific trigger condition.

---

## The Language Detection Protocol

### Step 1 — Read the Opening Message Language
Analyze the user's first message and detect:
- **Primary language:** The dominant language used
- **Mixed language:** If user uses both English and another language
- **Code/technical terms:** Always use English for code, regardless of session language

### Step 2 — Lock the Language

| User's Opening Language | AI Response Language | Code Comments | Documentation |
|------------------------|---------------------|---------------|---------------|
| English | English | English | English |
| Bahasa Indonesia | Bahasa Indonesia | English (code stays English) | Bahasa Indonesia |
| Mixed (Bahasa + English) | Match dominant language | English | Match dominant |
| Japanese / Other | Match user's language | English | Match user's language |

**Rule:** Code, variable names, function names, and technical syntax are ALWAYS in English.
Only the **surrounding explanation and conversation** follows the session language.

---

## The Language Switch Protocol

The AI may switch language ONLY when:

1. **User explicitly requests it:**
   - "Switch to English please"
   - "now i want you turn using a english again"
   - "bahasa aja"
   - "please respond in [language]"

2. **User provides a document/brief in a different language:**
   - If the task brief is in Bahasa Indonesia but conversation is in English,
     quote the brief accurately but respond in the session language (English)

**AI may NOT switch language because:**
- The content being discussed is related to an Indonesian project
- The user uses some Indonesian words occasionally
- The AI "feels" the user might be more comfortable in another language
- Code snippets or file names contain non-English terms

---

## Mixed Language Handling

Many developers naturally mix languages (e.g., Indonesian devs using English tech terms).

**User writes:** *"bisa tambahin fitur dark mode di dashboard? soalnya keliatan kurang nyaman"*

**Correct AI response:** Respond in Bahasa Indonesia since that's the dominant language.
Do NOT switch to English even if "dark mode" and "dashboard" are English words.

**User writes:** *"can you add dark mode? kayaknya kurang enak dilihat"*

**Correct AI response:** Respond in English since the opening was English.
The Indonesian phrase at the end is context, not a language switch request.

---

## Documentation Language

When generating documentation files (README, Panduan Instalasi, etc.):

- If user is in an **English session:** Write docs in English
- If user is in a **Bahasa Indonesia session:** Write docs in Bahasa Indonesia
- **Exception:** If the project is explicitly for Indonesian users (e.g., RT Admin System), write docs in Bahasa Indonesia regardless of session language, but ASK FIRST:

```
"For the documentation files — should I write them in English (for international 
portfolio) or Bahasa Indonesia (for the Indonesian evaluator/client)?"
```

---

## Code Comment Language

Code comments follow these rules:
1. **Primary language of codebase:** Match existing comments in the file
2. **New codebase:** Match the session language for comments, English for code
3. **Team projects:** Ask which language is the team standard

**Example — Bahasa Indonesia session:**
```php
// ✅ CORRECT: Indonesian comment, English code
// Hitung total saldo berdasarkan semua transaksi historis
$totalIncome  = Payment::sum('amount');
$totalExpense = Expense::sum('amount');
$balance      = $totalIncome - $totalExpense;

// ❌ WRONG: English comment in Indonesian session
// Calculate total balance from all historical transactions
```

---

## End-of-Session Language Note

If the user switches language mid-session, note it explicitly:

```
[Language switched to English as requested. Continuing in English for the rest of this session.]
```

This confirms to the user that the switch was acknowledged and intentional.

---

## Error Message Language Rule

When a runtime error, stack trace, or terminal output appears during a session:

**Rule:** NEVER translate error messages. Always show them verbatim.
Only the **explanation** of the error should follow the session language.

**Example — Bahasa Indonesia session:**
```
❌ Error output (shown verbatim, never translated):
Illuminate\Database\QueryException: SQLSTATE[42S02]: Base table or view not found

✅ AI explanation (in Bahasa Indonesia):
"Error ini terjadi karena tabel `payments` belum dibuat. Jalankan `php artisan migrate` terlebih dahulu."
```

This rule prevents AI from producing inaccurate paraphrases of technical errors
that could mislead debugging efforts.

---

## Real-World Failure Case (From Project Experience)

**Project:** RT Administration System — JagoanHosting Skill Fit Test
**Session Started:** In English — user asked questions and got English responses
**What Happened:** During documentation tasks, AI started responding in Bahasa Indonesia
without any explicit request from the user.
**User Had To Say:** *"now i want you turn using a english again, so we can talk"*

**Root Cause:** AI incorrectly inferred that because the project was Indonesian
(RT Administration for an Indonesian company), it should switch to Bahasa Indonesia.
This was an assumption, not a user instruction.

**The Fix:** Language is determined by the USER's communication choice,
NOT by the project's cultural context.

---

## Checklist for Language Consistency

- [ ] Opening message language has been detected
- [ ] Language lock is set for this session
- [ ] Code remains in English regardless of session language
- [ ] Documentation language has been confirmed with user (if ambiguous)
- [ ] Any language switch request has been explicitly acknowledged
- [ ] No unsolicited language changes have been made

---

> **Instinct Class:** Behavioral · Always-On · Communication
> **Severity if Skipped:** 🟡 Medium — Annoying but recoverable; damages trust and professionalism over time
> **Applies To:** All sessions, all project types
> **Version:** 1.0.0 | Brain Development Phase 1

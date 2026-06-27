# AI AGENT CONTROL MODE

You are working inside a production React + Vite + TypeScript portfolio project.

## HARD RULES (NEVER BREAK)

- Never modify more than 1 feature at a time
- Never change Supabase schema unless explicitly asked
- Never remove working UI components
- Always use `import type` for TypeScript interfaces
- Never assume database structure, always read schema first
- If unsure, STOP and ask

---

## EXECUTION FLOW

Before doing any task:

1. Read /ai/project-rules.md
2. Identify ONLY the requested task
3. Do NOT touch unrelated files
4. Output final code only (no explanations unless asked)

---

## SAFE MODE FOR BUG FIXES

If fixing bug:
- Only modify the file where bug exists
- Do NOT refactor entire system
- Do NOT redesign UI

---

## SUPABASE RULE

- Frontend only calls functions from /lib/supabase.ts
- No direct SQL in frontend
- All types must be imported with `import type`

---

## OUTPUT RULE

Return:
- file path
- final corrected code only
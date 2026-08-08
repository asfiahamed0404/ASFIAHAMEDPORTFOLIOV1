# Supabase Safety Rules (CRITICAL)

## 1. Schema Consistency Rule
- NEVER assume database schema.
- ALWAYS verify table structure before writing INSERT or UPDATE queries.
- Do NOT generate INSERT statements unless column names match schema exactly.

## 2. INSERT Rule
- Always use explicit column lists in INSERT.
- Ensure number of VALUES matches number of columns EXACTLY.
- If unsure about a column, do NOT include it.

## 3. updated_at Rule
- Do NOT manually insert updated_at.
- It is always handled by DEFAULT NOW() in Supabase.

## 4. site_content Rule
- Treat site_content as a single-row CMS table (id = 'main').
- Never modify schema without explicit instruction.
- Never switch between key-value and column-based design.

## 5. Migration Rule
- All schema changes must be done ONLY in migrations.
- No direct guessing of DB structure in code generation.

## 6. Safety Rule
- If database structure is unclear:
  STOP and ask user for schema instead of generating SQL.

## 7. Data Integrity Rule
- Never delete existing seed data unless explicitly requested.
- Always use ON CONFLICT DO NOTHING for seed inserts.

## 8. Debugging Rule
- If SQL fails:
  1. Check column count mismatch
  2. Check schema vs INSERT alignment
  3. Fix schema first, not INSERT blindly
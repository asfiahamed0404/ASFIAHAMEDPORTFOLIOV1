# Database Phase Workflow

## Step 1: Schema First
Always generate or confirm schema before any query.

## Step 2: Seed Data Second
Only insert data after schema is confirmed working.

## Step 3: Application Last
Only connect React hooks after DB is stable.

## Rule
Never mix schema creation + data insertion + frontend changes in one step.
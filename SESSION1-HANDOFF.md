# Angel Kids Learning Hub — Handoff

## Current state

- Branch: `feature/mvp-foundation`; do not merge unless the user explicitly asks.
- Main implementation commits: `ff8df02`, `adcff84`.
- PostgreSQL 16 runs locally as `postgresql-x64-16` on port `5432`.
- `.env` is present, gitignored, and contains `DATABASE_URL` (`angelkids_dev`) plus `TEST_DATABASE_URL` (`angelkids_test`). Never expose its password.
- Both databases have migration `202608180001_init`; `angelkids_dev` has seeded navigation, Levels, and Curriculum Units. No permanent Learning Resource has been imported.

## Verified

- Integration tests: 3/3 pass when `TEST_DATABASE_URL` is provided to the test process.
- Local app: http://127.0.0.1:3000/learning
- All fixed public listing routes returned HTTP 200.

## Local run notes

- Use `npx next dev --webpack -p 3000` (or `npm run dev` plus `--webpack`) for this session. Turbopack opened the port but returned false 404s for every route; webpack works without source changes.
- No seed/content sync is needed again unless reference data is intentionally reset. Do not add resources or run content sync without approval.

## Git/worktree note

- `AGENTS.md`, `CLAUDE.md`, and `next-env.d.ts` are currently uncommitted changes generated/updated by Next dev; preserve them and do not discard user changes.

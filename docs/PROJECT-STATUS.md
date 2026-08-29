# Project status

Last verified: 2026-08-28.

- Production deploy source: Git branch `feature/mvp-foundation`.
- Release commit: `6c39e19` (`feat: prepare Angel Kids catalog release`).
- Catalog manifest and production release target: 30 unique resources, all `ACTIVE`.
- Production PostgreSQL is operating. External database access remains closed except for a time-limited, IP-restricted import window.
- Content split: Watch 11, Read 8, Songs & Poems 7, Digital Flashcards 3, Print-and-plays 1.

## Verification

Run these from a clean checkout before a release:

```powershell
git status --short --branch
git log -5 --oneline --decorate
npm run typecheck
npm run lint
npm run test
npm run build
npm run content:sync -- --validate
```

`content:sync` without `--apply` is a database dry run. Never point it at production unless the approved import window is open.

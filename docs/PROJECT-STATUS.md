# Project status

Local freeze review: 2026-10-09. Production deployment and database have not been inspected during this session.

- Production deploy source documented in this repository: Git branch `feature/mvp-foundation`.
- Local freeze was reviewed against `5bdfe93` (`feat: add October learning catalog`). See Git history for the commit containing these release changes.
- Package version stays at `1.2.0` by the owner's decision. No release tag is created before production smoke testing passes.
- Catalog manifest and local PostgreSQL: 98 unique resources, all `ACTIVE` (September 36, October 62). This is the next production release target, not a claim about current production data.
- Content split: Watch 47, Read 25, Songs & Poems 17, Digital Flashcards 8, Print and Plays 1.
- Print and Plays displays September and October cards linking to the same Drive folder. The October card is page content, not an additional learning resource record.
- This diff adds four October Songs, with final names prefixed `Poem -`, and changes the September Print and Play record's Drive link.
- No Prisma schema or migration files changed in this diff. Check applied production migrations during the production release.
- Production startup automatically executes `prisma migrate deploy` and seeds navigation, levels, and curriculum units. It does not import learning resources.

## Verification

Run these before release:

```powershell
git status --short --branch
git log -5 --oneline --decorate
npm run typecheck
npm run lint
npm run test
npm run build
npm run content:sync -- --validate
```

Local sync has been applied; subsequent local dry-run reports 98 unchanged resources. The four new Songs have been checked against Level, Product Name, and Curriculum Unit filters, and their video routes and thumbnails have been verified. Both Print and Plays cards have been checked for the new Drive URL and new-tab behavior.

`content:sync` without `--apply` connects to a database even in dry-run mode. Verify the database host before running it; never point it at production outside the approved import window. `--validate` exits before creating the database client.

Follow [Production runbook](PRODUCTION-RUNBOOK.md) for the approved release sequence.

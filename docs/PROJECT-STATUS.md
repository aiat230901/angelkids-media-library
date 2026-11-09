# Project status

Local freeze review: 2026-11-10. Production deployment and database have not been inspected during this session.

- Production deploy source documented in this repository: Git branch `feature/mvp-foundation`.
- Local freeze is based on `bfbb662` (`feat: add October poems and update Print and Play links`).
- Package version stays at `1.2.0` by the owner's decision. No release tag is created before production smoke testing passes.
- Catalog manifest and local PostgreSQL: 148 unique resources, all `ACTIVE` (September 36, October 62, November 50). This is the next production release target, not a claim about current production data.
- Content split: Watch 71, Read 39, Songs & Poems 25, Digital Flashcards 12, Print and Plays 1.
- November adds 50 resources under `11 - Nghề nghiệp | Bé tài năng`: Watch 24, Read 14, Songs & Poems 8, and Digital Flashcards 4.
- Print and Plays displays September, October, and November cards. The November card is page content, not an additional learning resource record, and opens its supplied Drive folder in a new tab.
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

Local sync has been applied; subsequent local dry-run reports 148 unchanged resources. The November resources have been checked against Level, Product Name, and Curriculum Unit filters, and their video routes/readers and thumbnails have been verified. The three Print and Play cards have been checked for their Drive URLs and new-tab behavior.

`content:sync` without `--apply` connects to a database even in dry-run mode. Verify the database host before running it; never point it at production outside the approved import window. `--validate` exits before creating the database client.

Follow [Production runbook](PRODUCTION-RUNBOOK.md) for the approved release sequence.

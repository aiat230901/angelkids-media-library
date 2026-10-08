# Unreleased changes

The package remains at v1.2.0 by the owner's decision; this release does not bump the version. Release tagging remains deferred until production smoke testing passes.

## October Songs

Added four ACTIVE YouTube learning song resources under `10 - Bản thân | Tôi khác biệt`:

- L12: Poem - Me, me, me! (`me-me-me`).
- L3: Poem - I see, I see (`i-see-i-see`).
- L4: Poem - We're same but different (`were-same-but-different`).
- L5: Poem - Happy Me (`happy-me`).

Each uses the official YouTube thumbnail URL. Tests verify Level, Product Name, and Curriculum Unit filtering and video detail lookup.

## Print and Plays

Both September and October cards now open the same Google Drive folder in a new tab: `https://drive.google.com/drive/folders/1Ukt9DHvoBpZfP9tT59mhlYN4zGUyIayJ?usp=drive_link`. No additional Print and Play resource record is created.

## Release target

98 unique manifest resources, all ACTIVE: Watch 47, Read 25, Songs & Poems 17, Digital Flashcards 8, Print and Plays 1. September has 36 resources and October has 62. No schema or migration files are changed in this release diff.

Production migration, deployment, catalog sync, smoke test, and tagging are still pending.

## Local freeze verification — 2026-10-09

- Lint and typecheck passed.
- 85 unit tests and 44 browser E2E tests passed on desktop and mobile.
- Production build and manifest validation passed.
- Local PostgreSQL contains 98 total resources, all ACTIVE; local sync dry-run reports 98 unchanged.
- Production-mode CSP tested from local configuration includes the required reader and thumbnail hosts, omits unsafe-eval, and upgrades insecure requests. Actual Vibe environment variables and production database state remain unverified.
- Updated the outdated Virtual Teacher Guide E2E expectation from 3 to 14 videos after verifying the October catalog. Added browser coverage for the four Poems and both Drive cards.
- Standard local/production env files and generated directories are ignored; no tracked .env, .env.local, .env.production, .env.production.local, .pem, or .key files were found. Additional env names such as .env.staging/.env.test are not covered by the current .gitignore; stage only the reviewed release files.
- SESSION3-HANDOFF.md, SESSION4-HANDOFF.md, and SESSION5-HANDOFF.md are pre-existing untracked local files outside this release scope.
- This checkpoint performs no staging, commit, push, production migration/deployment/sync, or tagging.

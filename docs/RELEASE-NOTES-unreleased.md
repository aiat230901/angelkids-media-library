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

The November card opens `https://drive.google.com/drive/u/2/folders/1Ukt9DHvoBpZfP9tT59mhlYN4zGUyIayJ` in a new tab with the supplied illustration. No additional Print and Play resource record is created.

## November catalog

Added 50 ACTIVE resources under `11 - Nghề nghiệp | Bé tài năng`: Watch 24 (Dialogues 14, Virtual Teacher Guide 6, Stories 4), Read 14 Dialogue Books, Songs & Poems 8, and Digital Flashcards 4. The YouTube items use official thumbnails; Flashcards and Dialogue Books use their supplied Heyzine first-page thumbnails.

## Release target

148 unique manifest resources, all ACTIVE: Watch 71, Read 39, Songs & Poems 25, Digital Flashcards 12, Print and Plays 1. September has 36 resources, October 62, and November 50. No schema or migration files are changed in this release diff.

Production migration, deployment, catalog sync, smoke test, and tagging are still pending.

## Local freeze verification — 2026-11-10

- Lint and typecheck passed.
- 96 unit tests and 46 browser E2E tests passed on desktop and mobile.
- Manifest validation, lint, and typecheck passed.
- Local PostgreSQL contains 148 total resources, all ACTIVE; local sync dry-run reports 148 unchanged.
- Production-mode CSP tested from local configuration includes the required reader and thumbnail hosts, omits unsafe-eval, and upgrades insecure requests. Actual Vibe environment variables and production database state remain unverified.
- Updated the Virtual Teacher Guide E2E expectation to 20 videos and added browser coverage for the November Drive card's desktop, tablet, and mobile layout.
- Standard env files and generated directories are ignored, including `.env.staging` and `.env.test`; stage only the reviewed release files.
- SESSION3-HANDOFF.md, SESSION4-HANDOFF.md, and SESSION5-HANDOFF.md are pre-existing untracked local files outside this release scope.
- This checkpoint performs no staging, commit, push, production migration/deployment/sync, or tagging.

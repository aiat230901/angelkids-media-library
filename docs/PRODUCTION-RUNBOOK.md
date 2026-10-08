# Production runbook

## Release sequence

1. Freeze and review the diff; complete the local checks in [Project status](PROJECT-STATUS.md). Do not commit during this step.
2. Stage the approved release files, commit on `feature/mvp-foundation` (merge first only if working on another branch), and push. Exclude local handoff files and secrets.
3. Run `npm run db:migrate` in the approved production environment and verify migration status. This release diff contains no new migration files; existing unapplied migrations must still be checked.
4. Redeploy the approved Git commit on Vibe. Verify startup logs. Production startup also runs `prisma migrate deploy` and seeds reference data; it does not sync learning resources.
5. Open PostgreSQL External Access temporarily, restricted to the operator's fixed IP.
6. Verify the production database target; run `npm run content:sync` for a database dry-run, review all creates/updates, then apply the approved diff with `npm run content:sync -- --apply --confirm-active`. Keep the output as release evidence. Sync is transactional and does not delete records outside the manifest.
7. Close External Access immediately after the import; if review or apply fails, close access before investigating.
8. Redeploy Vibe again according to the operating workflow and verify startup logs.
9. Complete the production smoke test below.
10. Create and push the selected release tag only after the production smoke test passes.

## Production configuration

- `DATABASE_URL`: approved production PostgreSQL connection; never include credentials in Git or release reports.
- `NODE_ENV=production`.
- `NEXT_PUBLIC_SITE_URL`: the production HTTPS origin, set before build.
- `HEYZINE_ALLOWED_HOSTS`: `heyzine.com,mamnonangelkids.aflip.in`.
- `THUMBNAIL_ALLOWED_HOSTS`: `i.ytimg.com,cdnm.heyzine.com`.
- Keep host allowlists consistent between build, runtime, and sync. CSP permits YouTube embeds on `www.youtube-nocookie.com`, the allowed Heyzine readers, and the allowed thumbnail hosts. Google Drive cards open external tabs; they are not embedded frames.

## Smoke test

Verify the 98 manifest resources exist in production and are all `ACTIVE`, with category counts Watch 47, Read 25, Songs & Poems 17, Digital Flashcards 8, and Print and Plays 1. Report any database records outside the manifest separately; sync preserves them.

Confirm the home page and each category route load; test the Level, Product Name, and Curriculum Unit filters for the four new October Poems. Verify each new video detail page, thumbnail, and player, and representative YouTube and Heyzine resources. Both September and October Print and Plays cards must open `https://drive.google.com/drive/folders/1Ukt9DHvoBpZfP9tT59mhlYN4zGUyIayJ?usp=drive_link` in a new tab. Check deployment logs, CSP behavior, and that External Access is closed.

## Rollback

`npm run content:rollback-draft` connects to the database and previews the scope. Applying it with `--confirm-draft` changes all currently ACTIVE resources whose slugs are in the manifest to DRAFT, not just the four new Poems. It does not restore prior titles, URLs, code, or migrations. Review that scope before use.

For a code rollback, redeploy the last known-good Git commit. Restore earlier catalog values through a separately reviewed sync; treat migration rollback as a separate operation.

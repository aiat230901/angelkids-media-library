# Production runbook

## Update code

1. Verify the checkout, tests, and build with the commands in [Project status](PROJECT-STATUS.md).
2. Commit and push the approved change to `feature/mvp-foundation`, then trigger or confirm the Git-based production redeploy.
3. If the release contains Prisma migrations, run `npm run db:migrate` from the approved production environment before smoke testing.

## Update the catalog

1. Change `content/resources.json`, then run `npm run content:sync -- --validate`.
2. Open PostgreSQL External Access only for the operator's fixed IP and only for the import window; close it immediately afterwards.
3. From that controlled environment, run `npm run content:sync`, review its diff, then run:

```powershell
npm run content:sync -- --apply --confirm-active
```

The sync does not delete records outside the manifest. Keep the command output with the release evidence.

## Smoke test

Confirm the home page loads, each catalog category is reachable, a representative resource opens for every provider, and the catalog count is 30 active resources. Check deployment logs for startup or database errors.

## Rollback

For a catalog release, inspect first with `npm run content:rollback-draft`; then, if approved, run `npm run content:rollback-draft -- --confirm-draft`. This only changes `ACTIVE` manifest resources to `DRAFT`; it does not remove records, revert code, or reverse migrations.

For a code release, redeploy the last known-good Git commit. Treat migration rollback as a separate, reviewed operation.

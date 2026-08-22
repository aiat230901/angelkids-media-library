# Angel Kids Learning Hub — Session 2 Handoff

**Handoff date:** 2026-08-22  
**Branch:** `feature/mvp-foundation`  
**HEAD:** `adcff84`  
**Owner decision:** Phase 9 is accepted and closed. Do not merge, commit, deploy, seed real content, or run content sync unless the owner explicitly asks.

## Session 2 outcome

Session 2 completed the Phase 9 QA cycle before real content is added:

- Baseline environment, PostgreSQL test database, migrations, and zero-resource state checked.
- Lint, unit tests, PostgreSQL integration tests, TypeScript typecheck, production build, and E2E completed.
- Four original E2E failures were diagnosed and fixed.
- Responsive/visual QA covered desktop, tablet, narrow mobile, and the iPhone 16 Pro Max 440 px regression.
- The temporary Chrome profile is excluded from ESLint without deleting or modifying it.

## Final verification evidence

| Gate | Result |
|---|---|
| `npm run lint` | Pass |
| `npm test` | 14 files, 34 tests passed |
| `npm run test:integration` | 1 file, 3 PostgreSQL tests passed |
| `npm run typecheck` | Pass |
| `npm run build` | Pass with Next.js 16.3.1 production build |
| `npm run test:e2e` | 28/28 passed across Chromium and mobile WebKit |
| Responsive/visual QA | Pass at 1440, 768, 440, 390, 320 px coverage used during Session 2 |

The final iPhone 16 Pro Max regression test passed in both Chromium and WebKit.

## Important fixes made in Session 2

### Stable E2E development server

- `playwright.config.ts` now starts Next with `npx next dev --webpack -p 3000`.
- Keep Webpack for local E2E until Turbopack is re-evaluated; Turbopack previously produced false dynamic-route 404 behaviour in development.
- Production `next build` still uses Turbopack and passes.

### Development CSP and origin handling

- `next.config.ts` allows `127.0.0.1` as a development origin for Playwright.
- Development CSP permits the runtime behaviour Next dev requires.
- `upgrade-insecure-requests` remains production-only so WebKit does not rewrite local HTTP assets to HTTPS.
- Production CSP was checked to remain stricter and includes `upgrade-insecure-requests`.

### ESLint scope

- `eslint.config.mjs` ignores `.tmp-chrome-check/**`.
- This directory is a temporary Chrome profile containing browser/extension code, not application source.
- Do not delete the profile merely to make lint pass.

### Responsive iPhone 16 Pro Max fix

- At 440 px, the featured `Print and Plays` card was reduced to a 36%/64% two-column card while other cards remained stacked.
- Root cause: equal CSS specificity plus media-query order between the featured mobile rule and `watch-stack-on-tablet`.
- The 431–980 px stacking media query now comes after the 720 px rule, so it wins consistently.
- `tests/e2e/learning-hub.spec.ts` contains a regression test asserting that the illustration remains full-width at a 440 px viewport.

## Responsive and accessibility note

Responsive visual QA is complete for the current zero-content UI and the reported 440 px defect is fixed.

The current UI includes visible focus styles, reduced-motion handling, labelled controls, semantic headings/breadcrumbs, and minimum touch-target work covered by existing implementation/tests. A standalone automated accessibility scan (for example axe) and a complete keyboard-only sweep of every page family were not run as a separate Session 2 gate. The owner has still accepted Phase 9 as closed; carry this as a short pre-deployment preflight rather than silently claiming that a dedicated audit occurred.

## Data and environment state

- PostgreSQL 16 service: `postgresql-x64-16`, local port `5432`.
- `.env` is present and gitignored with development and test database URLs. Never print or expose credentials.
- Development and test databases have migration `202608180001_init`.
- No permanent Learning Resource has been imported; `content/resources.json` contains zero resources.
- Do not seed real resources or run `npm run content:sync` without explicit owner approval.
- Playwright Chromium and WebKit runtimes are installed under the local Playwright cache outside the repository.

## Local run notes

Use:

```powershell
npx next dev --webpack -p 3000
```

Primary local URL:

```text
http://localhost:3000/learning
```

The server was running at handoff time, but a new session must check port 3000 rather than assume the process survived.

Use `localhost` or `127.0.0.1` for development. Access through the LAN IP may trigger Next development-origin warnings because only `127.0.0.1` is currently listed in `allowedDevOrigins`.

## Git/worktree state — preserve carefully

The worktree is intentionally dirty and no Session 2 commit was created. Existing changes include Phase 9 fixes plus user-owned UI/content work.

Tracked modified files at handoff:

```text
content/navigation.json
eslint.config.mjs
next-env.d.ts
next.config.ts
playwright.config.ts
src/app/globals.css
src/app/learning/page.tsx
src/app/learning/read/page.tsx
src/app/learning/watch/page.tsx
src/components/learning/CategoryCard.tsx
src/components/ui/Breadcrumb.tsx
tests/e2e/learning-hub.spec.ts
```

Important untracked items include:

```text
AGENTS.md
CLAUDE.md
SESSION1-HANDOFF.md
SESSION2-HANDOFF.md
UI-RULES.md
public/illustrations/*.png
tests/unit/breadcrumb.test.tsx
tests/unit/category-card.test.tsx
tests/unit/learning-page.test.tsx
tests/unit/read-page.test.tsx
tests/unit/watch-page.test.tsx
.tmp-chrome-check/
.tmp-learning-check.png
.next-local.log
```

Do not reset, checkout, clean, delete, or overwrite these changes. `next-env.d.ts` may be rewritten by Next dev/build; treat it as a generated-file side effect and inspect before deciding what to commit.

## Next step — Phase 10

Proceed to **Phase 10 — Mắt Bão Vibe Hosting deployment proof of concept**, before importing production content.

Recommended first task for Session 3:

### 10.1 — Deployment readiness and hosting capability audit

1. Read this handoff, `plan.md`, `PRD.md`, `design.md`, `AGENTS.md`, and the relevant Next.js 16 documentation.
2. Inspect the repository and current dirty worktree without changing or committing it.
3. Confirm Mắt Bão Vibe Hosting support for Node/Next.js runtime, GitHub deployment, PostgreSQL 16, environment variables, `PORT`, build/start commands, health checks, SSL, logs, rollback, backups, and database restore.
4. Define a staging proof-of-concept that uses non-production data.
5. Include a short keyboard/accessibility preflight before external deployment.
6. Present findings and the exact deployment plan for owner approval before creating external resources or connecting GitHub/hosting accounts.

Do not begin production deployment or import real learning resources during the audit.

## Suggested opening prompt for Session 3

```text
Read SESSION2-HANDOFF.md and the required project files. Do not change anything yet. Summarize the current state, risks, and the exact scope of Phase 10.1 — Deployment readiness and hosting capability audit.
```

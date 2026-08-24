# Digital Flashcards Reader Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three active, published Heyzine flashcard sets to the local catalog and provide a focused in-page reader with Level and Curriculum Unit filters.

**Architecture:** Keep the existing server-fetched listing and native HTML dialog. Pass a `showNameFilter` flag from the flashcards route through the listing to the filter component, and give only digital-flashcard cards a visual CTA. Keep the published URL and first-page cover in the manifest; validate exact trusted hosts and allow them in CSP.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, native `<dialog>` and Fullscreen API, Prisma/PostgreSQL, Vitest, CSS.

**Spec:** `docs/superpowers/specs/2026-08-24-digital-flashcards-reader-design.md`

## Global Constraints

- Do not call the Heyzine API or inspect/manipulate iframe DOM; the published URL is the document source.
- Do not add dependencies, external reader controls, external-link fallback, routes, or tabs for flashcards.
- Leave Level and Curriculum Unit filtering available; hide only the resource-name filter on Digital Flashcards.
- Reuse the existing dialog and fullscreen support. Heyzine owns zoom, page-turning and audio inside the iframe.
- Keep all three resources ACTIVE only in local PostgreSQL after manifest validation, dry-run and explicit `--confirm-active` apply.
- Do not commit, stage, push, migrate production, or alter production resources during this task.
- Preserve existing unrelated modified/untracked files.

---

## File Structure

- `src/server/providers/urls.ts` — validates only configured exact Heyzine hosts.
- `src/server/content.ts`, `src/server/repositories/learning.ts` — use strict defaults that include the Angel Kids Heyzine host when loading/serving catalog data.
- `next.config.ts`, `.env.example` — supply matching CSP, iframe and thumbnail host defaults.
- `src/components/learning/ListingPage.tsx`, `ResourceListing.client.tsx`, `ResourceFilters.client.tsx` — pass and implement the flashcard-only search-filter visibility flag.
- `src/components/learning/ResourceCard.tsx` — renders the visual `Mở flashcards` CTA within the existing card button.
- `src/components/learning/FlipbookReader.client.tsx`, `src/app/globals.css` — make the native dialog 90% viewport on desktop, retain fullscreen/close/focus flow and remove the external link.
- `src/app/learning/digital-flashcards/page.tsx` — disables resource-name filtering only for that route.
- `content/resources.json` — source-of-truth entries for the three published flashcard sets and their public `og:image` covers.
- `tests/unit/next-config.test.ts`, `provider-urls.test.ts`, `content-manifest.test.ts`, `resource-card.test.tsx`, `resource-listing.test.tsx`, `flipbook-reader.test.tsx` — regression coverage.

### Task 1: Trusted Heyzine and cover-host configuration

**Files:**
- Create: `tests/unit/next-config.test.ts`
- Modify: `tests/unit/provider-urls.test.ts`, `tests/unit/content-manifest.test.ts`
- Modify: `src/server/content.ts`, `src/server/repositories/learning.ts`, `next.config.ts`, `.env.example`

**Interfaces:**
- Consumes: `validateProviderUrl(provider, url, heyzineHosts)` and `parseContentManifests(..., heyzineHosts, thumbnailHosts)`.
- Produces: local defaults that allow exact `mamnonangelkids.aflip.in` reader URLs and `cdnm.heyzine.com` cover URLs, while continuing to reject unconfigured lookalike hosts.

- [ ] **Step 1: Add failing configuration and exact-host validation tests**

Create `tests/unit/next-config.test.ts`, import the default Next config, call
its `headers()` function and assert its existing CSP header and remote image
patterns contain the new exact trusted hosts:

```ts
const headers = await nextConfig.headers?.();
const csp = headers?.[0].headers.find((header) => header.key === "Content-Security-Policy")?.value;
expect(csp).toContain("https://mamnonangelkids.aflip.in");
expect(csp).toContain("https://cdnm.heyzine.com");
expect(nextConfig.images?.remotePatterns).toContainEqual({
  protocol: "https", hostname: "cdnm.heyzine.com",
});
```

Also extend provider and manifest validation coverage:

```ts
expect(validateProviderUrl(
  "HEYZINE",
  "https://mamnonangelkids.aflip.in/419742bc48.html",
  ["heyzine.com"],
).success).toBe(false);

expect(validateProviderUrl(
  "HEYZINE",
  "https://mamnonangelkids.aflip.in/419742bc48.html",
  ["heyzine.com", "mamnonangelkids.aflip.in"],
).success).toBe(true);
```

Add a manifest test using a `DIGITAL_FLASHCARD_SET` resource with external URL on `mamnonangelkids.aflip.in` and thumbnail URL on `cdnm.heyzine.com`; it must parse only when those two exact hosts are supplied.

- [ ] **Step 2: Run the focused tests and confirm the new assertion fails before configuration changes**

Run: `npm test -- tests/unit/next-config.test.ts tests/unit/provider-urls.test.ts tests/unit/content-manifest.test.ts`

Expected: `next-config.test.ts` fails because neither new host is in the default config; the provider and manifest tests document the exact-host contract.

- [ ] **Step 3: Implement minimal host defaults and CSP/image allowlists**

Set the fallback host lists to:

```ts
const DEFAULT_HEYZINE_HOSTS = "heyzine.com,mamnonangelkids.aflip.in";
const DEFAULT_THUMBNAIL_HOSTS = "i.ytimg.com,cdnm.heyzine.com";
```

Use the existing comma-separated environment convention, trim and discard blank entries. Apply those defaults in `loadCatalog`, `listResources`, and `next.config.ts`; construct `frame-src` from the Heyzine hosts and `img-src`/`images.remotePatterns` from the thumbnail hosts. Update `.env.example` to show both trusted domains. Do not permit host wildcards or all `*.aflip.in` subdomains.

- [ ] **Step 4: Run the focused tests and typecheck the changed TypeScript files**

Run:

```powershell
npm test -- tests/unit/next-config.test.ts tests/unit/provider-urls.test.ts tests/unit/content-manifest.test.ts
npx eslint src/server/content.ts src/server/repositories/learning.ts next.config.ts tests/unit/next-config.test.ts tests/unit/provider-urls.test.ts tests/unit/content-manifest.test.ts
```

Expected: both tests pass; lint has no errors. Do not run root `npm run lint`, because it currently scans generated files in the preserved nested worktree.

- [ ] **Step 5: Record verification without staging or committing**

Run: `git diff --check`

Expected: no whitespace errors. Do not run `git add` or `git commit`.

### Task 2: Flashcard-only filters and click CTA

**Files:**
- Modify: `tests/unit/resource-card.test.tsx`, `tests/unit/resource-listing.test.tsx`
- Modify: `src/components/learning/ResourceCard.tsx`, `ResourceFilters.client.tsx`, `ResourceListing.client.tsx`, `ListingPage.tsx`, `src/app/learning/digital-flashcards/page.tsx`, `src/app/globals.css`

**Interfaces:**
- Produces: `showNameFilter?: boolean` on `ListingPage`, `ResourceListing` and `ResourceFilters`, defaulting to `true`.
- Consumes: `ResourceFormat.DIGITAL_FLASHCARD_SET` to add presentation-only CTA content to the existing card button.

- [ ] **Step 1: Write failing component tests**

In the card test, render a `DIGITAL_FLASHCARD_SET` and assert one button contains the visible CTA:

```ts
expect(screen.getByRole("button", { name: /Mia's Happy Classroom/i }))
  .toHaveTextContent("Mở flashcards");
```

In the listing test, render one flashcard with `showNameFilter={false}` and assert:

```ts
expect(screen.queryByLabelText("Tên học liệu")).not.toBeInTheDocument();
expect(screen.getByLabelText("Level")).toBeInTheDocument();
expect(screen.getByLabelText("Curriculum Unit")).toBeInTheDocument();
```

Use `userEvent.selectOptions` to prove Level filtering still narrows the flashcard result.

- [ ] **Step 2: Run the two tests and confirm they fail**

Run: `npm test -- tests/unit/resource-card.test.tsx tests/unit/resource-listing.test.tsx`

Expected: the CTA and `showNameFilter` API are absent.

- [ ] **Step 3: Add the smallest presentation and prop changes**

Make `showNameFilter` default to `true` at every existing component boundary. When it is false, omit the search label/input, set a compact filter class, but retain Level and Curriculum Unit controls exactly as today. In the flashcards page pass `showNameFilter={false}`.

For `DIGITAL_FLASHCARD_SET`, append a non-interactive `<span className="resource-cta">Mở flashcards</span>` inside the existing outer button. Do not nest another button or anchor. Add compact-grid and CTA styling, including the current responsive breakpoints.

- [ ] **Step 4: Run the focused component tests and lint**

Run:

```powershell
npm test -- tests/unit/resource-card.test.tsx tests/unit/resource-listing.test.tsx
npx eslint src/components/learning/ResourceCard.tsx src/components/learning/ResourceFilters.client.tsx src/components/learning/ResourceListing.client.tsx src/components/learning/ListingPage.tsx src/app/learning/digital-flashcards/page.tsx tests/unit/resource-card.test.tsx tests/unit/resource-listing.test.tsx
```

Expected: all focused tests and scoped lint pass.

- [ ] **Step 5: Record verification without staging or committing**

Run: `git diff --check`

Expected: no whitespace errors. Do not stage or commit.

### Task 3: Modal-reader behavior and responsive layout

**Files:**
- Modify: `tests/unit/flipbook-reader.test.tsx`, `tests/unit/resource-listing.test.tsx`
- Modify: `src/components/learning/FlipbookReader.client.tsx`, `src/app/globals.css`

**Interfaces:**
- Consumes: existing `FlipbookReader({ title, url, open, onClose })` and `ResourceListing` opener/focus reference.
- Produces: a no-navigation reader that closes from X, Escape and dialog backdrop, while preserving the existing fullscreen capability.

- [ ] **Step 1: Write the failing reader behavior tests**

Replace the permanent-external-link expectation with:

```ts
expect(screen.queryByRole("link", { name: /Mở trong tab mới/i })).not.toBeInTheDocument();
await user.click(screen.getByRole("dialog"));
expect(onClose).toHaveBeenCalledOnce();
```

Add an Escape/cancel assertion using `fireEvent.cancel(dialog)` and a listing-level test that opens a flashcard then closes it and checks `expect(card).toHaveFocus()` after the queued microtask.

- [ ] **Step 2: Run the reader/listing tests and confirm they fail**

Run: `npm test -- tests/unit/flipbook-reader.test.tsx tests/unit/resource-listing.test.tsx`

Expected: the external link is still rendered and backdrop clicks do not call `onClose`.

- [ ] **Step 3: Implement only the required dialog changes**

Remove the `ExternalLink` import and anchor. Add an `onClick` handler to the `<dialog>` that invokes `close()` only when `event.target === event.currentTarget`; retain the existing `onCancel` Escape handler and Fullscreen API action. Do not add timers, iframe listeners, Previous/Next, external fallback, or iframe DOM access.

Set `.reader-shell` to `width: 90vw; height: 90dvh; margin: 5dvh auto` on desktop, while retaining the existing near-full viewport mobile treatment. Keep the dialog itself viewport-sized so an actual backdrop click is distinguishable from a click inside the reader shell.

- [ ] **Step 4: Run reader tests and scoped lint**

Run:

```powershell
npm test -- tests/unit/flipbook-reader.test.tsx tests/unit/resource-listing.test.tsx
npx eslint src/components/learning/FlipbookReader.client.tsx tests/unit/flipbook-reader.test.tsx tests/unit/resource-listing.test.tsx
```

Expected: tests pass; the shared reader no longer renders an external navigation control.

- [ ] **Step 5: Record verification without staging or committing**

Run: `git diff --check`

Expected: no whitespace errors. Do not stage or commit.

### Task 4: Published flashcard catalog entries and local sync

**Files:**
- Modify: `content/resources.json`

**Interfaces:**
- Consumes: existing `DIGITAL_FLASHCARD_SET` rule and local `content:sync` transaction/upsert by slug.
- Produces: three ACTIVE public resources for `/learning/digital-flashcards`.

- [ ] **Step 1: Add the three manifest records using public first-page covers**

Append records using these exact values (with `description: null`, `categorySlug: "digital-flashcards"`, `contentTypeSlug: null`, `curriculumUnitKey: "09-truong-hoc"`, `provider: "HEYZINE"`, `resourceFormat: "DIGITAL_FLASHCARD_SET"`, and `status: "ACTIVE"`):

```json
{
  "slug": "digital-flashcards-level-3",
  "assetName": "Digital Flashcards - Level 3",
  "externalUrl": "https://mamnonangelkids.aflip.in/419742bc48.html",
  "thumbnailUrl": "https://cdnm.heyzine.com/files/uploaded/v3/419742bc48b3b1f4c98e740fb8f7713a0431f487.pdf-thumb.jpg",
  "altText": "Trang bìa Digital Flashcards - Level 3",
  "levelCodes": ["L3"],
  "sortOrder": 10
}
```

Use the same shape for Level 4 and 5 with slugs/sorts `digital-flashcards-level-4`/20 and `digital-flashcards-level-5`/30; their URLs are `2fc93ec7e4.html` and `56ad34c217.html`, and their covers are respectively:

```text
https://cdnm.heyzine.com/files/uploaded/v3/2fc93ec7e4f4187b83971d374d54efc5e1e6eb32.pdf-thumb.jpg
https://cdnm.heyzine.com/files/uploaded/v3/56ad34c217ef491340be8de3244ab5cdabf150f8.pdf-thumb.jpg
```

- [ ] **Step 2: Validate and inspect the database dry-run**

Run:

```powershell
npm run content:sync -- --validate
npm run content:sync
```

Expected: the manifest is valid, counts 21 resources, and dry-run reports exactly three `CREATE digital-flashcards-level-*` records with no unrelated changes.

- [ ] **Step 3: Apply the reviewed catalog transaction to local PostgreSQL**

Run: `npm run content:sync -- --apply --confirm-active`

Expected: one transaction completes successfully and a second identical dry-run reports no resource changes. Do not run against production.

- [ ] **Step 4: Record local catalog state without staging or committing**

Run: `git diff --check`

Expected: no whitespace errors. Do not stage or commit.

### Task 5: Full verification on localhost

**Files:**
- No source changes unless a verified failure requires a return to its owning task.

**Interfaces:**
- Consumes: all prior tasks, local PostgreSQL, and `next dev`.
- Produces: evidence that the local implementation is ready for owner review.

- [ ] **Step 1: Run the complete non-E2E test suite and typecheck**

Run:

```powershell
npm test
npm run typecheck
```

Expected: all unit tests pass and TypeScript has no errors. If Prisma generated output is corrupt, follow the established precise generated-client repair procedure rather than changing source files.

- [ ] **Step 2: Open local app and verify headers/content**

Run (with the existing dev server, or start `npm run dev` if absent):

```powershell
$response = Invoke-WebRequest http://localhost:3000/learning/digital-flashcards
$response.StatusCode
$response.Headers['Content-Security-Policy']
$response.Content | Select-String -Pattern 'Digital Flashcards - Level [345]|Mở flashcards|mamnonangelkids\.aflip\.in|cdnm\.heyzine\.com'
```

Expected: HTTP 200; CSP `frame-src` includes `https://mamnonangelkids.aflip.in`; CSP `img-src` includes `https://cdnm.heyzine.com`; all three cards and CTA text are present.

- [ ] **Step 3: Exercise the client interaction in a browser**

At `http://localhost:3000/learning/digital-flashcards`, select Level 3 and confirm only Level 3 remains; reset and select the specified Curriculum Unit. Open a card, confirm the URL does not change and no new tab opens; use Heyzine controls inside the iframe; close by X, Escape and outside click in separate open/close cycles; confirm focus returns to the card and the filtered listing/scroll state is still present. Check desktop and a mobile/tablet viewport.

- [ ] **Step 4: Report only verified results**

State the three resource URLs, local route, validation/dry-run/apply count, tests, CSP result and any limitations. Explicitly state that no commit, deploy, migration, or production import occurred.

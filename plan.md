# Angel Kids Learning Hub — Implementation Plan

> **Purpose:** This is the execution map for the MVP. Read it together with `PRD.md` and `design.md`; do not treat it as a third product specification.

**Goal:** Launch a responsive, public Angel Kids learning-resource library where children and parents can discover curriculum-linked videos, flipbooks, flashcards, and printable collections.

**Recommended architecture:** One Next.js application (App Router + TypeScript) serves the responsive UI and its small read-oriented backend surface. PostgreSQL stores Angel Kids-owned curriculum and resource metadata. YouTube, Heyzine, and Google Drive remain external content providers; the app never proxies their media or adopts their display metadata.

**MVP stack:** Next.js, React, TypeScript, PostgreSQL 16, Prisma ORM, Zod, Tailwind CSS or a small token-based CSS layer, `next/font` (Nunito), Lucide SVG icons, and GitHub deployment to Mắt Bão Vibe Hosting.

## Source-of-truth order

When instructions conflict, apply this order:

1. A newer direct instruction from the project owner.
2. `PRD.md` — product scope, data behaviour, routes, acceptance criteria.
3. `design.md` — UX/UI system and responsive rules.
4. This `plan.md` — implementation order and verification gates.
5. Existing approved HTML layouts — visual reference, not production architecture.

## MVP boundary

Build only the public child/parent Learning Hub in this plan.

- No authentication, student profile, teacher portal, admin portal, assignments, progress, reports, payment, AI generation, FastAPI service, worker, Redis, or media upload system.
- Do not save any long-lived media to the application container filesystem.
- Do not hard-code individual Learning Resource cards in page markup.
- Do not scrape or show provider title, description, tags, dates, or other presentation metadata from YouTube, Heyzine, or Drive.

## Delivery sequence

```text
Foundation → Approved visual shell → Database/content model → Listings & filters
→ Video detail → Heyzine reader → Print and Plays → QA → Deployment → Pilot
```

Each phase below must be demonstrably working before starting the next one. A visual polish request can be made at any phase, but it must not silently expand MVP scope.

---

## Phase 0 — Project setup and layout handover

**Outcome:** A clean repository exists with the approved layouts available as visual references and a deployable Next.js baseline.

- [ ] Create a GitHub repository and protect `main` as the production branch.
- [ ] Create a Next.js App Router project with TypeScript and a single package manager lockfile.
- [ ] Add `PRD.md`, `design.md`, this `plan.md`, the Angel Kids logo, and the approved static layouts to a `reference/layouts/` directory.
- [ ] Keep the reference HTML files unchanged. They are not the runtime application and should not become duplicated production pages.
- [ ] Add `.env.example` with variable names only; never commit real secrets.
- [ ] Configure project scripts: `dev`, `build`, `start`, `lint`, and `test`.
- [ ] Add a lightweight formatting/linting baseline and ensure the default project builds locally.

**Verification gate**

- [ ] `npm run build` succeeds.
- [ ] The app opens locally and `/` redirects to `/learning`.
- [ ] The reference layouts remain available only for comparison; production code contains no copy-pasted mock resource cards.

---

## Phase 1 — Design-system foundation and global shell

**Outcome:** All production routes share the Angel Kids visual language before any real resources are added.

**Create or establish these responsibilities:**

| Area | Responsibility |
|---|---|
| `app/layout.tsx` | Nunito loading, global metadata, global CSS import |
| `app/(hub)/layout.tsx` | Shared Learning Hub page frame and header |
| `components/layout/AppHeader.tsx` | Logo link to `/learning`, accessible Home control |
| `components/ui/*` | Button, badge, card surface, breadcrumb, empty state, modal primitives |
| `app/globals.css` or token stylesheet | Semantic Angel Kids design tokens from `design.md` |

- [ ] Load Nunito with `next/font/google`; Vietnamese diacritics must render correctly.
- [ ] Implement exact semantic colour, radius, shadow, typography, and spacing tokens from `design.md`.
- [ ] Implement the consistent sticky header: logo links to `/learning`; Home uses a thin SVG line icon, never emoji.
- [ ] Build reusable breadcrumbs with linked ancestors and non-linked current location.
- [ ] Implement focus states, 44×44 px minimum touch targets, and reduced-motion support.
- [ ] Add subtle optional doodles only as decorative assets; never place them over reading content or controls.
- [ ] Compare `/learning` at desktop, tablet, and narrow mobile against the approved layout direction before moving on.

**Verification gate**

- [ ] Header, typography, controls, and focus states appear consistently on every existing route.
- [ ] No horizontal scrolling at 320 px width.
- [ ] No emoji, stock child-photo background, dark dashboard layout, or unapproved font appears in production UI.

---

## Phase 2 — Content model and PostgreSQL foundation

**Outcome:** Categories, content types, curriculum units, levels, and Learning Resources are stored as Angel Kids-owned data.

### Required domain model

| Entity | Minimum fields / rule |
|---|---|
| `Category` | `slug`, `name`, `description`, `sortOrder`, `isActive`; five seeded category records |
| `ContentType` | optional child of Category; used for Stories, Dialogues, Storybooks, Dialogue Books |
| `Level` | `code`, `name`, `sortOrder`, `isActive`; never assume an immutable numeric range |
| `CurriculumUnit` | `monthNumber`, `topicName`, `displayName`, `sortOrder`, `isActive`; multiple topics may share one month |
| `LearningResource` | Hub metadata, provider metadata only as URLs/IDs, publication status, category/content type links |
| `ResourceLevel` | many-to-many connection between a Learning Resource and one or more Levels |

### Learning Resource fields

Every resource record must support:

```text
id, slug, assetName, categoryId, contentTypeId (nullable),
resourceFormat, provider, externalUrl, thumbnailUrl (nullable),
curriculumUnitId, status, sortOrder, createdAt, updatedAt
```

Allowed MVP values:

```text
resourceFormat: video | flipbook-landscape | flipbook-portrait | printable-collection
provider: youtube | heyzine | google-drive
status: draft | active | archived
```

- [ ] Implement the schema with migrations, required foreign keys, indexes for listing/filtering, and a unique route-safe `slug` per video route scope.
- [ ] Seed the five Categories and four Content Types exactly as defined in `PRD.md`.
- [ ] Seed Levels and representative Curriculum Units only as controlled development data; do not treat mock records as real school content.
- [ ] Add a typed repository/query layer that returns Hub-owned fields only.
- [ ] Validate write/import data with Zod before it enters the database.
- [ ] Keep direct database credentials server-only. Never expose `DATABASE_URL` to the browser.

**Verification gate**

- [ ] Fresh database migration and seed complete successfully.
- [ ] One month can contain more than one Curriculum Unit/topic.
- [ ] One resource can target more than one Level.
- [ ] A draft or archived resource does not appear in public queries.
- [ ] A provider title/date/description is not represented as a public card field.

---

## Phase 3 — Information architecture and category/content-type pages

**Outcome:** The user can navigate the complete approved category tree, with no resource-specific UI hard-coded into pages.

### Routes to implement

```text
/                 → redirect to /learning
/learning
/learning/watch
/learning/read
/learning/songs
/learning/digital-flashcards
/learning/print-and-plays
```

- [ ] Build `/learning` from the five seeded Category records: Watch, Read, Songs, Digital Flashcards, Print and Plays.
- [ ] Build `/learning/watch` with Stories and Dialogues from seeded Content Type records.
- [ ] Build `/learning/read` with Storybooks and Dialogue Books from seeded Content Type records.
- [ ] Use reusable CategoryCard and ContentTypeCard components; all cards have a single clear click target.
- [ ] Store illustration asset paths in configuration/seed data rather than in page-specific conditionals.
- [ ] Preserve the approved horizontal desktop composition and use `object-fit: contain`/safe layout rules so illustrations remain undistorted on tablet and mobile.

**Verification gate**

- [ ] Every category/content-type card links to the correct target route.
- [ ] Songs and Digital Flashcards go directly to their listing routes.
- [ ] The same cards remain usable and visually balanced at desktop, tablet, and mobile widths.

---

## Phase 4 — Shared resource listing system and client-side filters

**Outcome:** All six resource listing pages query active records and use a single consistent filtering system.

### Listing routes

```text
/learning/watch/stories
/learning/watch/dialogues
/learning/read/storybooks
/learning/read/dialogue-books
/learning/songs
/learning/digital-flashcards
```

### Reusable interfaces

| Component | Required behaviour |
|---|---|
| `ResourceListing` | receives already-scoped active resources and page copy; owns grid, count, filter state, empty state |
| `ResourceFilters` | filters simultaneously by Level, `assetName`, and Curriculum Unit; includes Reset |
| `VideoResourceCard` | mandatory 16:9 thumbnail and play badge |
| `FlipbookResourceCard` | 16:9 landscape or 3:4 portrait variant; never renders play badge |
| `ResourceEmptyState` | friendly result-not-found state with Reset action |

- [ ] Query only `active` resources scoped to the page’s Category and optional Content Type.
- [ ] Build filters after data is loaded; filter in the browser for the displayed resource list.
- [ ] Derive available Level and Curriculum Unit options from the active records on the current listing, not from provider data.
- [ ] Apply all three filters using AND logic.
- [ ] Default filters: all Levels, blank Product Name, all Curriculum Units.
- [ ] Show a clear active-resource count and a no-results empty state.
- [ ] Videos use 16:9 cards with a play badge.
- [ ] Storybooks and Dialogue Books use 16:9 cards without a play badge.
- [ ] Digital Flashcards use 3:4 cards without a play badge.
- [ ] Remove prototype/mock cards from the production listing data. With zero real active resources, show the empty state rather than sample content.

**Verification gate**

- [ ] Adding a fifth or fiftieth record renders it automatically without creating a new card component.
- [ ] Combined Level + name + Curriculum Unit filtering produces only matching records.
- [ ] Reset restores the complete current listing.
- [ ] A resource in Stories cannot appear in Dialogues, Songs, Read, or Flashcards unless an explicit separate record exists.
- [ ] Grid response matches `design.md`: landscape desktop up to four columns; portrait flashcards remain readable on mobile.

---

## Phase 5 — YouTube video detail flow

**Outcome:** Stories, Dialogues, and Songs open reliable, branded detail pages from their cards.

### Routes

```text
/learning/watch/stories/[slug]
/learning/watch/dialogues/[slug]
/learning/songs/[slug]
```

- [ ] Convert `video-detail.html` from a visual reference into one reusable VideoDetail screen/component.
- [ ] Resolve the record by route scope and `slug`; return a branded not-found state for absent/inactive/wrong-type resources.
- [ ] Render dynamic breadcrumb, eyebrow, title, Levels, Curriculum Unit, and back link from the resource record.
- [ ] Embed YouTube only for active resources whose provider is `youtube` and `resourceFormat` is `video`.
- [ ] Use the official embed URL and privacy-enhanced host where appropriate; include an accessible title and an external YouTube fallback link.
- [ ] Do not create one manually authored page/component per video.
- [ ] Use a supplied `thumbnailUrl` when a custom Angel Kids cover exists. Otherwise derive a YouTube thumbnail URL from the stored video identifier with a safe fallback; do not import YouTube display text.

**Verification gate**

- [ ] A Story, Dialogue, and Song each render the same detail template with their own correct breadcrumb/back destination.
- [ ] The video player stacks above the information panel on tablet/mobile.
- [ ] Invalid YouTube content does not crash the page and provides an understandable fallback.

---

## Phase 6 — Heyzine flipbook and flashcard reader flow

**Outcome:** A user can open an approved Heyzine resource without leaving the Hub’s visual context or exposing unwanted provider metadata.

- [ ] Implement a reusable, accessible reader dialog for `heyzine` records.
- [ ] Opening a Storybook, Dialogue Book, or Digital Flashcard card launches the large reader overlay; do not create public detail pages for these resource types in MVP.
- [ ] Reader controls include close/exit, fullscreen request, and a link to open the Heyzine reader externally if embedding fails.
- [ ] Place the Heyzine iframe inside the dialog; do not add external Previous/Next controls.
- [ ] Never inspect, alter, or depend on the cross-origin iframe DOM.
- [ ] On close, restore keyboard focus to the card that launched the reader. Escape closes the dialog on desktop.
- [ ] Storybook/Dialogue Book resource additions require a supplied 16:9 Angel Kids card thumbnail. Never force the portrait Heyzine cover into their landscape cards.
- [ ] Digital Flashcards may use an officially supplied Heyzine cover URL if a supported API/integration is verified; otherwise require a manually supplied 3:4 thumbnail. Never scrape the reader page.

**Verification gate**

- [ ] Flipbook cards have no play badge.
- [ ] Dialog is keyboard-accessible, closable, and responsive.
- [ ] If `heyzineUrl` fails to embed, users can open the resource externally.
- [ ] No Heyzine title, subtitle, date, or description is shown in the Hub’s resource card or filter.

---

## Phase 7 — Print and Plays

**Outcome:** Families and teachers can choose a Curriculum Unit and open its approved Google Drive folder.

- [ ] Build `/learning/print-and-plays` from active printable-collection records, one card per Curriculum Unit collection.
- [ ] Use `PrintAndPlayUnitCard`: month badge, Curriculum Unit title, deliberate 16:10 thumbnail, and `Xem học liệu` CTA.
- [ ] Validate that the stored Drive URL is an allowed HTTPS Drive folder URL before rendering a link.
- [ ] Open the Drive folder in a new tab using `target="_blank"` plus `rel="noopener noreferrer"`.
- [ ] Do not parse a Google Drive folder’s title or file list for display in MVP.

**Verification gate**

- [ ] Every active card opens its assigned Drive folder in a new tab.
- [ ] A malformed/non-HTTPS URL is rejected before publication.
- [ ] Three-column desktop, two-column tablet, one-column mobile behaviour matches `design.md`.

---

## Phase 8 — Controlled content-addition workflow

**Outcome:** New learning resources can be added repeatedly without altering the application layout or making manual HTML cards.

### Standard inputs for every new Learning Resource

```text
Category
Content Type (or null)
Asset Name
Level or Levels
Curriculum Unit
Provider
External URL / provider ID
Thumbnail (where required)
Status
```

### Rules by resource type

| Resource | Provider | Card thumbnail rule | Click behaviour |
|---|---|---|---|
| Animated Story / Dialogue / Song Video | YouTube | custom cover preferred; otherwise derived YouTube thumbnail | shared video detail route |
| Digital Storybook / Dialogue Book | Heyzine | mandatory supplied 16:9 Angel Kids thumbnail | reader dialog |
| Digital Flashcard Set | Heyzine | supplied 3:4 thumbnail, or verified official Heyzine cover integration | reader dialog |
| Printable collection | Google Drive | supplied 16:10 Curriculum Unit thumbnail | opens Drive folder |

- [ ] Create a repeatable seed/import command or small controlled repository workflow that validates the standard inputs with Zod and writes records through Prisma.
- [ ] Enforce a unique slug within each video route scope.
- [ ] Require operator confirmation before changing `status` from `draft` to `active`.
- [ ] Make content updates data-only whenever possible: no new route, page, component, or layout file for one additional resource.
- [ ] Document one copy/paste Codex instruction pattern for adding a single resource, but retain human review of title, levels, unit, thumbnail, and destination URL before publication.

**Verification gate**

- [ ] Add one record in each resource type and confirm it automatically appears only in the correct listing.
- [ ] Filters gain its Level and Curriculum Unit automatically when the active resource is published.
- [ ] Draft resources remain invisible to public users.
- [ ] Removing/archive status hides the resource without deleting its audit history.

---

## Phase 9 — Product quality, safety, and accessibility

**Outcome:** The MVP is safe to pilot with parents and has predictable behaviour across devices.

- [ ] Add unit tests for resource query scoping, status filtering, many-to-many Levels, Curriculum Unit filtering, and slug-route resolution.
- [ ] Add component tests for AND filter logic, Reset, empty state, video versus flipbook badge rules, and reader close/focus restoration.
- [ ] Add route-level tests for the five category routes, six resource listings, three video-detail route families, and unknown-resource not-found behaviour.
- [ ] Manually inspect desktop, tablet, 430 px mobile, and 320 px mobile screenshots for every page family.
- [ ] Test keyboard-only navigation, visible focus, meaningful image alt text, icon button labels, modal Escape handling, and reduced motion.
- [ ] Validate all external URLs server-side before publication: HTTPS only and expected host/domain for YouTube, Heyzine, or Google Drive.
- [ ] Confirm no database credentials, API keys, personal data, or provider-management credentials are shipped to the client bundle.
- [ ] Confirm no third-party page metadata leaks into card labels or filters.

**Verification gate**

- [ ] `npm run lint`, `npm run test`, and `npm run build` all pass.
- [ ] A parent can reach and open a target resource in three content-selection steps or fewer from `/learning`.
- [ ] The product remains clear with zero resources, one resource, and a large list of resources.

---

## Phase 10 — Mắt Bão Vibe Hosting deployment proof of concept

**Outcome:** The actual Vibe Hosting configuration is verified before production data is imported.

- [ ] Use a GitHub-connected deployment, not the single-file HTML upload workflow.
- [ ] Create PostgreSQL 16 on Vibe Hosting and store its connection string only in service environment variables.
- [ ] Configure the Next.js service with production environment variables, including the server-only database URL and public base URL where needed.
- [ ] Confirm the platform’s Node runtime, build command detection, start command, `PORT` binding, health check behaviour, logs, and rollback in a non-production proof of concept.
- [ ] Deploy a build containing a database migration strategy suitable for the release process; do not run destructive schema changes automatically without review.
- [ ] Configure a staging/test URL before connecting the production custom domain.
- [ ] Configure the production custom domain and verify automatic SSL issuance/renewal.
- [ ] Enable database backups and document the backup schedule, retention, restore test, database exposure/TLS, and connection limits based on the actual Mắt Bão console/support answer.
- [ ] Confirm that an app redeploy cannot delete PostgreSQL data and that no application feature relies on persistent container disk.

**Verification gate**

- [ ] Production-equivalent build deploys from GitHub and is reachable through HTTPS.
- [ ] Database migration, seed, read query, rollback, and backup restore have each been tested on non-production data.
- [ ] The external YouTube, Heyzine, and Drive flows work from the deployed domain, including any CORS/frame restrictions.

---

## Phase 11 — Pilot release and feedback loop

**Outcome:** The Hub is validated with a small real Angel Kids audience before additional scope is funded.

- [ ] Publish a deliberately small, quality-checked initial content set across the resource types actually ready for families.
- [ ] Ask a small group of teachers and parents to test: category discovery, Level filtering, Curriculum Unit filtering, mobile playback, Heyzine reading, and Drive access.
- [ ] Capture observed issues as a prioritised list: blocking, usability, content-data, visual polish, and future feature request.
- [ ] Fix blocking and repeated usability issues before adding optional features.
- [ ] Review whether usage proves the need for authentication, teacher workflows, admin publishing, outcomes/skill-line browsing, analytics, or a specialised FastAPI/worker service.

**Verification gate**

- [ ] Pilot users can independently find and open the intended resource on a mobile device.
- [ ] The school team can add at least one new resource through the controlled data workflow without changing the UI code.
- [ ] Any next feature is approved as a new scoped phase, not silently added to MVP.

---

## Non-negotiable acceptance checklist

- [ ] Five fixed categories exist and are navigable.
- [ ] Watch and Read have their defined content-type screens; Songs and Flashcards do not.
- [ ] Every public Product card comes from database data, never static JSX/HTML mock content.
- [ ] Cards and filters use only Angel Kids-owned metadata.
- [ ] Video = 16:9 + play badge + shared detail page.
- [ ] Storybook/Dialogue Book = 16:9 + no play badge + Heyzine dialog.
- [ ] Digital Flashcard = 3:4 + no play badge + Heyzine dialog.
- [ ] Print and Plays are grouped by Curriculum Unit and open a Drive folder.
- [ ] All listing filters work together client-side and Reset works.
- [ ] The application works without sign-in and excludes future staff/admin features.
- [ ] Nunito, Angel Kids colours, responsive layout, accessible controls, and the approved calm preschool design are preserved.

## Explicit future phases — do not begin without a new approved plan

1. Authentication and child/parent/teacher/admin roles.
2. Class membership, assignment, individual learning access, progress, and reports.
3. Internal admin/CMS for publishing resources without repository changes.
4. Outcome and SkillLine data model plus curriculum-management UI.
5. Analytics, content search, favourites, and history.
6. FastAPI/worker/queue architecture for genuinely heavy AI, media, or speech-processing requirements.
7. Multi-school tenancy and school-specific brand/curriculum isolation.

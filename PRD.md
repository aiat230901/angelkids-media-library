# Product Requirements Document — Angel Kids Learning Hub

**Version:** 1.0  
**Product:** Angel Kids Learning Hub  
**Status:** Version 1.0 — ready for implementation review  
**Primary audience:** Preschool children and their parents at Angel Kids Bilingual Preschool  
**Document language:** English technical terms are retained where they are clearer; product copy may be Vietnamese or bilingual.

---

## 1. Product Overview

Angel Kids Learning Hub is a responsive digital learning-resource library for preschool children and parents. It organises school-produced learning resources in one friendly place so a child can revisit what was used in class and a parent can support learning at home.

The Hub is not a general video platform and is not an LMS with assessments in this release. It is a curated, curriculum-linked library of learning resources.

Learning resources can be delivered from external providers:

- **YouTube** for videos and songs.
- **Heyzine** for digital storybooks, dialogue books, and digital flashcards.
- **Google Drive** for folders containing printable learning materials.

The Hub owns the product metadata and presentation. It must never automatically use the title, description, tags, publication date, or other display metadata supplied by Heyzine, YouTube, or Google Drive.

---

## 2. Problem Statement

Today, teachers must select resources from Google Sheets, copy individual links, open Drive files, and share separate URLs with parents. This is difficult to manage, inconsistent for families, and does not provide a child-friendly learning experience.

Angel Kids Learning Hub solves this by providing:

- One clear, branded location for approved learning resources.
- Consistent discovery by **Level**, **Product Name**, and **Curriculum Unit**.
- Child-friendly layouts on mobile, tablet, and desktop.
- A clean separation between curriculum metadata and external content providers.
- A scalable data foundation for future login, teacher tools, assignment, progress tracking, and admin management.

---

## 3. Goals and Success Criteria

### 3.1 MVP goals

1. Make school-approved resources easy for children and parents to find and open.
2. Present five fixed learning categories in a coherent Angel Kids visual system.
3. Let users filter resource listings by Level, Product Name, and Curriculum Unit.
4. Ensure all product cards are database-driven rather than manually hard-coded in page markup.
5. Support video, Heyzine flipbook, and Google Drive resource delivery without proxying or copying third-party media through the application server.
6. Create a reliable base for additional resources to be added later through a controlled data workflow.

### 3.2 Success criteria

- A parent can reach a relevant resource in no more than three content-selection steps from `/learning`.
- A user can combine all three filters on any applicable listing page and receive correct results.
- A Learning Resource card always displays Angel Kids-owned metadata: Asset Name, Level, and Curriculum Unit.
- Video resources open on a dedicated detail page.
- Heyzine resources open in a large reader overlay without external metadata leaking into the Hub UI.
- Print and Plays lead to the correct Curriculum Unit folder in Google Drive.
- The experience remains usable at 320 px width, tablet width, and desktop width.

---

## 4. Scope

### 4.1 In scope: MVP

- Public, read-only Learning Hub. No user login is required.
- Responsive child/parent-facing interface.
- Fixed navigation categories and fixed content types listed in this PRD.
- Database-backed categories, content types, curriculum units, levels, and Learning Resources.
- Resource listing pages, client-side filtering, empty states, and reset filters.
- YouTube video detail pages.
- Heyzine reader overlay for digital reading resources and digital flashcards.
- Google Drive links for Print and Plays by Curriculum Unit.
- Basic SEO metadata, accessibility, error states, and responsive performance.
- Deployment as one Next.js application plus PostgreSQL.

### 4.2 Explicitly out of scope: MVP

- Authentication, student accounts, parent accounts, teacher accounts, or role permissions.
- Admin portal, CMS, bulk upload UI, or in-browser resource publishing.
- Assignments, teacher class management, progress tracking, reporting, or learning history.
- Payments, subscriptions, chat, notifications, gamification, points, or certificates.
- AI generation, video rendering, speech scoring, recommendation engine, background jobs, Redis, or FastAPI service.
- Uploading or hosting video/PDF/media files in the application container.
- A generic multi-school SaaS implementation.

These items are deferred, not rejected. The MVP must be deliberately simple so it can be launched, tested with real school use, and extended safely.

---

## 5. Users

### 5.1 Child

- Uses a parent or school device.
- Needs large touch targets, clear visuals, short labels, and minimal text.
- Primarily watches, reads, listens, or opens activities chosen with an adult.

### 5.2 Parent

- Wants to find a resource by the child’s Level and current Curriculum Unit.
- Needs a fast, mobile-friendly experience and clear links to view/read/download resources.

### 5.3 Teacher

- Uses the same public Hub in MVP to find resources for class or share them with families.
- Does not receive teacher-only functions in MVP.

### 5.4 Content operator (internal, temporary workflow)

- Adds and updates database records through the repository/data workflow with Codex assistance.
- Is not an in-app admin user in MVP.

---

## 6. Information Architecture

### 6.1 Main navigation

`/learning` is the Learning Hub home page and contains exactly five Category cards:

1. **Watch**
2. **Read**
3. **Songs**
4. **Digital Flashcards**
5. **Print and Plays**

The Angel Kids logo in the header always returns to `/learning`.

### 6.2 Category structure

```text
Learning Hub
├── Watch
│   ├── Stories
│   └── Dialogues
├── Read
│   ├── Storybooks
│   └── Dialogue Books
├── Songs
├── Digital Flashcards
└── Print and Plays
```

### 6.3 Resource type definitions

| Category | Content Type | Learning Resource | Delivery method |
|---|---|---|---|
| Watch | Stories | Animated Story Video | YouTube detail page |
| Watch | Dialogues | Animated Dialogue Video | YouTube detail page |
| Read | Storybooks | Digital Storybook | Heyzine reader overlay |
| Read | Dialogue Books | Digital Dialogue Book | Heyzine reader overlay |
| Songs | None | Learning or School Song Video | YouTube detail page |
| Digital Flashcards | None in MVP | Digital Flashcard Set | Heyzine reader overlay |
| Print and Plays | None in MVP | Curriculum Unit printable collection | Google Drive folder |

**Important distinctions:**

- Animated Story Video and Animated Dialogue Video are videos, so their cards may show a play indicator.
- Storybooks, Dialogue Books, and Digital Flashcards are flipbook resources, not video cards. Their cards must not display a play indicator.
- A Digital flipbook always includes audio in Heyzine when the content requires it; there is no separate “with audio” versus “without audio” type in the Hub.
- Print and Plays are offline/printable resources. In MVP, they are grouped by Curriculum Unit rather than shown as individual worksheet/flashcard/game cards.

---

## 7. Routes

| Route | Purpose |
|---|---|
| `/` | Redirect to `/learning` |
| `/learning` | Learning Hub home; five Category cards |
| `/learning/watch` | Content type selection: Stories and Dialogues |
| `/learning/watch/stories` | Animated Story Video listing |
| `/learning/watch/stories/[slug]` | Animated Story Video detail page |
| `/learning/watch/dialogues` | Animated Dialogue Video listing |
| `/learning/watch/dialogues/[slug]` | Animated Dialogue Video detail page |
| `/learning/read` | Content type selection: Storybooks and Dialogue Books |
| `/learning/read/storybooks` | Digital Storybook listing |
| `/learning/read/dialogue-books` | Digital Dialogue Book listing |
| `/learning/songs` | Song Video listing |
| `/learning/songs/[slug]` | Song Video detail page |
| `/learning/digital-flashcards` | Digital Flashcard listing |
| `/learning/print-and-plays` | Curriculum Unit card listing |

Flipbook resources must open an overlay from their listing page. They do **not** require individual public routes in MVP.

---

## 8. Functional Requirements

### FR-01: Global header

- Every page must show a consistent header.
- Header contains the Angel Kids logo on the left and a Home control linking to `/learning`.
- The Home icon is a thin, modern, flat line icon; it must not use an emoji or a heavy/old-fashioned icon style.
- Header must remain usable on mobile.

### FR-02: Learning Hub home

- Display exactly five large Category cards: Watch, Read, Songs, Digital Flashcards, Print and Plays.
- Each card includes an illustration area, title, short description, and clear CTA.
- Category cards are touch-friendly and link to the route defined above.
- Category configuration is seeded in the database and read by the UI. It is not written repeatedly as page-specific HTML.

### FR-03: Content type pages

- `/learning/watch` displays Stories and Dialogues.
- `/learning/read` displays Storybooks and Dialogue Books.
- Each content type card links to its respective resource listing.
- Songs and Digital Flashcards bypass a content-type selection page in MVP.

### FR-04: Resource listing pages

Applicable pages: Stories, Dialogues, Storybooks, Dialogue Books, Songs, and Digital Flashcards.

- Show breadcrumb, page heading, short supporting description, filter bar, resource count, and resource card grid.
- Default state displays all active resources belonging to the current category/content type.
- Resource cards are generated from Learning Resource records.
- Use only the Hub’s own metadata for titles, labels, filters, and card display.
- Do not display third-party title, description, publication date, tags, or other metadata by default.

### FR-05: Filters

Each applicable resource listing must include exactly these filters:

1. **Level**
   - Default: All.
   - Values are automatically derived from active resources on the current listing page.
   - Examples: Level 3, Level 4, Level 5.

2. **Product Name**
   - Search input.
   - Matches `assetName` case-insensitively.

3. **Curriculum Unit**
   - Filters by the combined `monthNumber + monthTopic` label.
   - Example: `09 - Trường học | Chào năm học mới`.

4. **Reset filters**
   - Clears every active filter and restores the default listing.

Rules:

- Filters work together using AND logic.
- For MVP, filtering happens client-side after the listing data has loaded.
- If no results match, show a friendly empty state and a reset action.
- Do not show filters that have no meaningful values for the current listing.

### FR-06: Video cards and detail pages

- Video resource cards use a mandatory **16:9 landscape** thumbnail frame.
- A video card displays: thumbnail, play indicator, Asset Name, Level badge(s), and Curriculum Unit.
- Clicking a video card opens its dedicated detail route.
- Video detail page includes breadcrumb, Back action, 16:9 YouTube player, Asset Name, Level, and Curriculum Unit.
- The player uses the configured YouTube URL. No YouTube API integration is required in MVP.
- Future features such as transcript, sentence playback, shadowing, and repeat controls are intentionally deferred.

### FR-07: Heyzine flipbook cards and reader

- Digital Storybook and Digital Dialogue Book cards use a **16:9 landscape** cover frame.
- Digital Flashcard cards use a **3:4 portrait** cover frame.
- Flipbook cards display Asset Name, Level badge(s), and Curriculum Unit.
- Flipbook cards must not show a play indicator.
- Clicking a flipbook card opens a large, near-full-screen reader overlay containing a Heyzine iframe.
- Reader overlay must include: title, Exit/Close, and Fullscreen controls.
- Navigation inside the reader is controlled only by Heyzine within the iframe.
- The Hub must not build Previous/Next controls outside the iframe.
- The Hub must not attempt to access or modify DOM content inside a cross-origin Heyzine iframe.
- If the iframe cannot load, show a clear fallback button that opens the Heyzine URL in a new tab.

### FR-08: Print and Plays

- `/learning/print-and-plays` displays one card per active Curriculum Unit that has a Google Drive folder.
- Each card displays a month badge, Curriculum Unit title, thumbnail, optional short description, and CTA: `Xem học liệu`.
- Clicking a card opens the configured Google Drive folder in a new tab, preserving the Learning Hub tab.
- Resource-level filters are not shown on this page because the card itself represents the Curriculum Unit collection.

### FR-09: External link safety

- External links must use HTTPS.
- New-tab external links must use `target="_blank"` and `rel="noopener noreferrer"`.
- Invalid or missing provider URLs must not render as clickable cards; show an internal error state in non-production and hide/mark unavailable in production.

### FR-10: Resource availability

- Only `ACTIVE` Learning Resources are visible publicly.
- Resource records may be prepared as `DRAFT` or hidden as `ARCHIVED`; they are not displayed in MVP.
- There is no public “coming soon” resource card unless explicitly added later.

---

## 9. Data Requirements

### 9.1 Core entities

#### Category

```text
id
slug
name
description
sortOrder
status
```

Seeded MVP values: `watch`, `read`, `songs`, `digital-flashcards`, `print-and-plays`.

#### Content Type

```text
id
categoryId
slug
name
description
sortOrder
status
```

Seeded MVP values: Stories and Dialogues under Watch; Storybooks and Dialogue Books under Read.

#### Level

```text
id
code
name
ageRange
sortOrder
status
```

Example: `L4`, `Level 4`, `4-5 years`.

#### Curriculum Unit

```text
id
monthNumber
monthTopic
displayLabel
sortOrder
status
```

`displayLabel` format:

```text
09 - Trường học | Chào năm học mới
```

One month may have multiple Curriculum Units/topics in the future. Do not enforce a one-month-to-one-topic rule.

#### Learning Resource

```text
id
slug
assetName
categoryId
contentTypeId (nullable)
curriculumUnitId (nullable only for School Song Video if required)
provider
resourceFormat
externalUrl
thumbnailUrl
altText
status
sortOrder
createdAt
updatedAt
```

Allowed `provider` values in MVP:

```text
YOUTUBE
HEYZINE
GOOGLE_DRIVE
```

Allowed `resourceFormat` values in MVP:

```text
ANIMATED_STORY_VIDEO
ANIMATED_DIALOGUE_VIDEO
LEARNING_SONG_VIDEO
SCHOOL_SONG_VIDEO
DIGITAL_STORYBOOK
DIGITAL_DIALOGUE_BOOK
DIGITAL_FLASHCARD_SET
PRINT_AND_PLAY_COLLECTION
```

#### Resource Level

```text
resourceId
levelId
```

This is a many-to-many relation. One resource can belong to multiple Levels when pedagogically appropriate, for example a shared resource for Level 4 and Level 5.

### 9.2 Metadata rules

- `assetName` is the product title shown on the Hub.
- `thumbnailUrl` is the Hub card thumbnail. It may point to a school-controlled asset or a permitted external cover URL.
- Heyzine is a provider of reader URL and, where used, cover image; it is not the metadata authority.
- For a new Heyzine resource, the required data input is: Category, Content Type (if any), Asset Name, Level(s), Curriculum Unit, Heyzine URL, thumbnail/cover URL, and status.
- For a new YouTube resource, the required data input is: Category, Content Type (if any), Asset Name, Level(s), Curriculum Unit, YouTube URL, thumbnail URL, and status.
- For a new Print and Plays Curriculum Unit collection, the required input is: Curriculum Unit, Drive folder URL, thumbnail, optional description, and status.

### 9.3 Data integrity

- `slug` must be unique where a public resource detail page exists.
- `monthNumber` is stored as a two-digit string (`01`–`12`) to preserve display order.
- URLs must be validated before publishing.
- Foreign keys must prevent orphaned records.
- Deleting a Level, Category, Content Type, or Curriculum Unit referenced by active content is not allowed; archive it instead.

---

## 10. UX and Visual Requirements

### 10.1 Brand

- Brand: Angel Kids Bilingual Preschool.
- Main colour: `#0057B8`.
- Accent colours: `#97D700`, `#F65275`, `#FFCD00`, `#FF8F1C`.
- Primary font: **Nunito**, including Vietnamese character support.
- Typography should feel rounded, soft, readable, and age-appropriate. Do not change the established text colour system without a design request.

### 10.2 Design principles

- Bright, clean, warm, and professional—not visually noisy.
- White or very light cream background.
- White cards with large rounded corners and light shadow.
- Large readable text and touch-friendly controls.
- Use subtle doodles only: stars, hearts, clouds, paper planes, dashed lines.
- Do not use emoji as UI icons.
- Do not use photographs of children as page backgrounds.
- Use original/project-owned illustrations or clearly labelled placeholders until approved artwork is supplied.

### 10.3 Responsive layout

| Viewport | Resource card grid |
|---|---|
| Desktop | 4 landscape cards per row where space permits |
| Tablet | 2–3 cards per row |
| Mobile | 1 card per row |

- Digital Flashcard listing keeps the 3:4 card ratio at every breakpoint.
- Storybook and Dialogue Book listings keep 16:9 landscape cards even if the source provider cover is portrait. The Hub’s 16:9 layout takes priority.
- Filter controls wrap cleanly and remain usable on small screens.
- No hover-only functionality. Every action must work by tap/click.

### 10.4 Accessibility baseline

- Meet WCAG 2.1 AA contrast for text and controls.
- Every image must have meaningful `alt` text or be marked decorative.
- Visible keyboard focus state on interactive elements.
- All actions must be keyboard operable.
- Reader overlay must trap focus while open and close with Escape on desktop.
- Respect `prefers-reduced-motion`.

---

## 11. Technical Architecture

### 11.1 Selected MVP stack

| Layer | Choice |
|---|---|
| Application | Next.js App Router + React |
| Main language | TypeScript |
| Backend | Next.js Server Components, Server Actions, and Route Handlers as required |
| Database | PostgreSQL 16 |
| ORM and migration | Prisma ORM |
| Validation | Zod |
| Styling | Tailwind CSS + project CSS variables/custom styles |
| Font delivery | `next/font` with Nunito |
| Icons | Lucide icons or project-owned SVG icons |
| Hosting | Mắt Bão Vibe Hosting |
| Source/deploy | GitHub repository with automatic deployment |

### 11.2 Architectural decisions

- Build a single full-stack Next.js application, not separate frontend and backend services.
- Use PostgreSQL from the first release because resource metadata, levels, curriculum units, and future access control require relational data.
- Use server-side database reads for page rendering; use client-side filtering only after list data is loaded.
- Do not expose database credentials to the browser.
- Do not introduce FastAPI, Redis, workers, or a separate AI service in MVP.
- Do not store uploaded media in the web application filesystem.

### 11.3 Hosting constraints

- Deploy through GitHub, not individual HTML-file upload.
- Store `DATABASE_URL` and other secrets only in Vibe Hosting environment variables.
- Enable database backups before production launch.
- Confirm in a deployment proof-of-concept that Next.js server mode, PostgreSQL connection, Prisma migration, logs, rollback, and custom domain work correctly on the selected Vibe Hosting plan.
- Do not assume Vibe Hosting is fully Vercel-compatible for all Next.js features. Validate the specific features used by the project.

---

## 12. Performance, Security, and Reliability

### 12.1 Performance

- Initial pages should remain light; external provider embeds load only when a user opens the relevant resource.
- Use responsive image sizes and lazy-load non-critical card thumbnails.
- Avoid loading all providers’ scripts globally.
- Use pagination or server-side filtering later only when resource volume makes client-side listing slow.

### 12.2 Security and privacy

- This MVP is publicly accessible by URL because it has no authentication. It must not expose student names, student photos, class rosters, personal progress, private documents, database credentials, or internal staff-only information.
- All secrets remain server-side.
- Validate and sanitize all content inputs before publishing.
- Allow external iframe sources only from approved provider domains.
- Apply a Content Security Policy appropriate for YouTube and Heyzine embeds.
- Google Drive folders must have sharing permissions intentionally set by the school; the Hub cannot protect a Drive folder that is publicly shared.

### 12.3 Reliability

- Show a clear empty state when no resources exist or no filters match.
- Show a provider fallback link if an embedded resource fails to load.
- Log unexpected server errors without displaying technical details to children or parents.
- Database backups must be configured and restore should be tested before production launch.

---

## 13. Content Operations Before Admin Exists

Until an admin portal is intentionally built, content is added through a controlled repository/database workflow.

For each new resource, the operator provides a structured brief:

```text
Category:
Content Type: (null if none)
Resource Format:
Asset Name:
Levels:
Curriculum Unit:
Provider:
External URL:
Thumbnail URL:
Alt Text:
Status:
```

Codex then adds or updates the data record, validates it, and the GitHub deployment publishes the change.

This workflow is intentional for MVP. Do not create a temporary half-admin interface merely to avoid structured data updates.

---

## 14. Acceptance Criteria

The MVP is ready for launch when all of the following are true:

1. `/learning` shows exactly five functioning Category cards.
2. Watch and Read display the correct two Content Type cards.
3. Stories, Dialogues, Songs, Storybooks, Dialogue Books, and Digital Flashcards each show only their correct Learning Resources.
4. Video cards are 16:9 and show a play indicator; flipbook cards do not show a play indicator.
5. Storybook and Dialogue Book cards are 16:9; Digital Flashcard cards are 3:4.
6. Every applicable listing supports Level, Product Name, Curriculum Unit, and Reset filters.
7. Filters can be combined and empty state works.
8. Video cards open the correct detail page and the YouTube player is usable.
9. Flipbook cards open a Heyzine reader overlay with close and fullscreen controls; there are no custom previous/next controls outside the iframe.
10. Print and Plays cards open the correct Drive folder in a new tab.
11. No provider metadata is shown unless explicitly stored as Hub metadata.
12. Header/logo navigation works on every route.
13. Layout works on mobile, tablet, and desktop.
14. There is no login, admin UI, progress tracking, hidden student data, or unfinished teacher-management screen exposed to users.
15. Deployment succeeds through GitHub to Vibe Hosting and connects securely to PostgreSQL.

---

## 15. Future Phases (Not MVP)

### Phase 2: Controlled access and teacher workspace

- Authentication for students, parents, teachers, and administrators.
- Classes, student profiles, login codes, and Level assignment.
- Teacher view with wider curriculum access and Teacher Training Resources.
- Resource assignment by class or individual child.
- Admin management of categories, content types, resource records, thumbnails, metadata, topics, levels, and visibility.

### Phase 3: Learning intelligence

- Progress tracking and reports.
- Transcript, sentence playback, shadowing, and repeat controls for video content.
- Search, recommendations, and curriculum dashboard.
- Import workflows from spreadsheet templates.

### Phase 4: AI/media services

- A separate FastAPI/Python service only if AI processing, audio/video generation, speech scoring, or long-running jobs are actually required.
- Add a worker and Redis only when background-job volume justifies them.
- Consider object storage for school-owned media uploads.

### Future multi-school product

- Implement multi-tenancy only when the product is deliberately offered to more than one school.
- Each school must have isolated branding, users, curriculum, resources, data, and permission boundaries.
- Do not mix resources across schools or reuse supposedly exclusive school content without explicit contractual permission.

---

## 16. Open Decisions Deferred Until the Relevant Phase

- Exact parent/student authentication method.
- Teacher/admin role and permission matrix.
- Individual progress-event data model.
- School-specific content ownership, licensing, and media retention policy.
- Dedicated object storage provider.
- Whether curriculum outcome and skill-line filtering should be public, teacher-only, or admin-only.
- Whether a resource can belong to multiple Curriculum Units in the future.
- AI-service requirements and the point at which FastAPI/worker infrastructure becomes justified.

---

## 17. Implementation Guardrails

- Do not add features beyond this PRD without an explicit request.
- Prefer simple, readable components and a small number of dependencies.
- Do not hard-code individual Learning Resource cards in JSX/HTML.
- Do not scrape or rely on presentation metadata from third-party providers.
- Do not use a local application container filesystem as durable storage.
- Do not introduce FastAPI merely because it is available; it is a future specialized service, not the MVP backend.
- Preserve the approved Angel Kids layout direction and Nunito typography unless a design update is requested.

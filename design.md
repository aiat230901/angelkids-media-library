# Angel Kids Learning Hub — UX/UI Design System

**Version:** 1.0  
**Applies to:** All child/parent-facing screens in Angel Kids Learning Hub  
**Companion document:** `PRD.md` defines product behaviour and scope. This document defines visual, interaction, and implementation rules.

---

## 1. How to Use This Document

Treat this file as the visual source of truth whenever building, modifying, or reviewing Angel Kids Learning Hub.

Priority when instructions conflict:

1. A specific newer product/design instruction from the project owner.
2. `PRD.md` for product behaviour, routes, and feature scope.
3. This `design.md` for UX/UI decisions.
4. Existing approved layouts and their visual direction.
5. Generic framework defaults.

Do not redesign the product into a generic dashboard, a corporate portal, a dark application, or an overly decorative children’s game. The intended feeling is a **warm, calm, premium preschool learning library**: child-friendly, parent-trustworthy, and simple to navigate.

---

## 2. Design Intent

### Core personality

- Bright, optimistic, caring, and educational.
- Clear enough for a child to recognise what to tap.
- Calm and organised enough for a parent or teacher to find content quickly.
- Professional enough to represent a bilingual preschool brand.
- Whimsical only in small, controlled touches.

### Design principles

1. **Learning content is the hero.** Thumbnails, resource names, and curriculum labels matter more than decoration.
2. **Reduce choice at each step.** A child sees a small set of large choices, then a clear list of resources.
3. **Keep the system quiet.** Use one primary action per section; do not make every element colourful or animated.
4. **Be consistent before being clever.** One card pattern per resource type is better than many experimental card styles.
5. **Use hierarchy, not density.** Spacious layouts, short labels, and familiar patterns are preferred over compact control panels.
6. **Mobile is a first-class experience.** A parent is likely to open the Hub on a phone.

---

## 3. Brand Foundation

### 3.1 Official colours

| Token | Hex | Intended use |
|---|---:|---|
| `brand-blue` | `#0057B8` | Primary action, links, key labels, selected state |
| `brand-blue-dark` | `#073F84` | Main headings, dark blue surfaces, high-emphasis text |
| `brand-green` | `#97D700` | Positive/supporting accent; not for long text |
| `brand-pink` | `#F65275` | Warm accent, play indicator, small highlight |
| `brand-yellow` | `#FFCD00` | Cheerful accent, curriculum/secondary highlight |
| `brand-orange` | `#FF8F1C` | Secondary accent, limited emphasis |

### 3.2 Supporting neutrals

| Token | Hex | Intended use |
|---|---:|---|
| `ink` | `#18304D` | Primary body text |
| `muted` | `#62738A` | Secondary text |
| `cream` | `#FFFDF8` | Main page background tint |
| `white` | `#FFFFFF` | Cards, header, input surfaces |
| `line` | `#DFEAF4` | Borders and dividers |
| `blue-soft` | `#EAF4FF` | Soft Level badge background |

### 3.3 Colour rules

- Blue is the default interactive colour. It must be recognisable as the system’s primary action colour.
- Use green, pink, yellow, and orange as accents—not as a competing navigation system.
- Use no more than **two accent colours** in a single card or section, excluding the thumbnail artwork.
- Do not use bright brand colours for paragraphs or long body text.
- Do not place low-contrast white text over yellow, green, or light pastel backgrounds.
- Never rely on colour alone to communicate a state; pair it with label, icon, position, or shape.

---

## 4. Typography

### 4.1 Font

Use **Nunito** for all interface text. It supports Vietnamese and produces the rounded, warm tone required for preschool content.

- In Next.js, load it with `next/font/google` where possible so the deployed application self-hosts the font.
- Fallback stack: `Nunito, Arial, sans-serif`.
- Do not mix in a display font, handwriting font, Comic Sans, or another rounded font unless explicitly approved.

### 4.2 Type scale

| Element | Desktop | Mobile | Weight | Colour |
|---|---:|---:|---:|---|
| Hero H1 | 48–58 px | 34–42 px | 900 | `brand-blue-dark` |
| Page H1 | 38–46 px | 30–36 px | 900 | `brand-blue-dark` |
| Section H2 | 28–36 px | 24–30 px | 900 | `brand-blue-dark` |
| Card title (category) | 28–36 px | 24–30 px | 900 | `brand-blue-dark` |
| Card title (resource) | 18–20 px | 16–18 px | 900 | `ink` |
| Lead text | 18–19 px | 16–17 px | 600 | `muted` |
| Body | 16 px | 16 px | 600 | `ink` or `muted` |
| Supporting text | 13–14 px | 13–14 px | 600 | `muted` |
| Label/badge | 12–13 px | 12–13 px | 800–900 | context specific |

### 4.3 Type rules

- Headlines use tight-but-readable line-height, approximately `1.08–1.18`.
- Body text uses `1.45–1.6` line-height.
- Use sentence case or title case consistently with the screen language.
- Avoid full uppercase except short eyebrow labels and small category labels.
- Never truncate a crucial resource title without providing the complete title via tooltip, accessible label, or detail page.
- Resource card titles may occupy two lines. Do not reduce text below 15 px to force more words into a card.

---

## 5. Layout, Spacing, and Shape

### 5.1 Page frame

- Main content maximum width: **1200 px**.
- Desktop/tablet horizontal page padding: **20 px** minimum.
- Mobile horizontal page padding: **12 px** minimum.
- Default page-bottom padding: **72–80 px**.
- Use vertical rhythm in increments close to 4, 8, 12, 16, 20, 24, 32, 40, 48 px.

### 5.2 Corner radius

| Element | Radius |
|---|---:|
| Hero surfaces | 32–34 px |
| Category cards | 26 px |
| Resource cards | 22 px |
| Filter panel | 22 px |
| Inputs/buttons | 14 px |
| Pills/badges | 999 px |

Avoid sharp rectangles except for small internal dividers.

### 5.3 Shadow and border

- Default card border: `1 px solid #DFEAF4`.
- Default card shadow: soft blue-grey, approximately `0 14px 34px rgba(29,72,117,.12)`.
- Hover lift: no more than `4–5 px` vertical movement and a slightly stronger shadow.
- Do not use harsh black shadows, thick borders, glassmorphism overload, or multiple stacked shadows.

### 5.4 Background

- Primary page background is white to very light cream.
- A very subtle radial pastel shape is permitted at page edges.
- Use a maximum of two large decorative background shapes per viewport.
- Background art must never reduce legibility, compete with thumbnails, or create scrolling noise.

---

## 6. Header and Navigation

### 6.1 Header

- Sticky header at top of page.
- White/near-white translucent surface with light bottom border and optional blur.
- Left: Angel Kids logo. It is always clickable and returns to `/learning`.
- Right: Home control. On desktop it may show icon + `Home`; on mobile use a compact icon button with an accessible text label.
- Header height: approximately 78 px desktop, 68 px mobile.

### 6.2 Icons

- Use Lucide-style or project-owned SVG line icons.
- Home icon must be thin, modern, flat, rounded, and visually light.
- Default stroke width: around 1.5–1.8 px.
- Do not use emoji as interface icons.
- Do not use filled, glossy, 3D, outdated clip-art, or mixed icon families.

### 6.3 Breadcrumbs

- Use on all pages below `/learning`.
- Format: `Home / Watch / Stories`.
- Existing ancestors are links; current page is plain text.
- Use compact muted text with blue linked segments.
- On very small screens, allow nonessential ancestor segments to collapse, but preserve a clear Back/Home path.

---

## 7. Reusable Components

### 7.1 Category card

Used on Learning Hub home for: Watch, Read, Songs, Digital Flashcards, Print and Plays.

- White card with large rounded corners, subtle border/shadow.
- Desktop: two-column layout with an illustration area and text/CTA area.
- Illustration occupies about 36–42% of card width.
- Includes: illustration, title, short description, and one text CTA such as `Khám phá →`.
- Category card is itself the click target; do not make multiple competing buttons inside it.
- Featured full-width card is allowed only where intentionally designed. Do not use featured treatment on every category.

### 7.2 Content type card

Used for Stories, Dialogues, Storybooks, Dialogue Books.

- Same visual family as Category card.
- Larger illustration focus is acceptable.
- Keep exactly two cards balanced in a two-column desktop layout, one-column mobile layout.
- Content type card must make its content distinction obvious through title and illustration, not through a long paragraph.

### 7.3 Resource card: landscape

Used for all videos, Storybooks, and Dialogue Books.

- Card thumbnail container is strictly **16:9**.
- Thumbnail should fill the frame using `object-fit: cover` only if cropping does not remove essential content. Otherwise use a controlled background/contain approach.
- Video card: show small circular play badge at bottom-right of thumbnail.
- Flipbook card: no play badge.
- Card body order: badges → resource title → Curriculum Unit supporting text if required.
- Minimum card title height should accommodate two lines so grid rows look stable.
- Do not use source-provider title, description, date, or tag text.

### 7.4 Resource card: portrait

Used only for Digital Flashcards.

- Thumbnail container is strictly **3:4**.
- No play badge.
- Maintain visual density suitable for smaller mobile screens; two portrait cards may sit per row on small mobile if card text remains readable.
- Do not use 3:4 for Storybooks or Dialogue Books.

### 7.5 Badges

- Level badge: pale blue fill, blue text, rounded pill.
- Curriculum Unit badge: pale yellow fill, deep gold/brown text, rounded pill.
- Keep copy short: `Level 4`, `09 - School` only when a compact label is necessary.
- Full Curriculum Unit label may appear below title if its full text is important.
- Do not add unnecessary badges such as date, popularity, duration, author, or provider unless a product requirement explicitly adds them.

### 7.6 Filters

- Place in a white panel above resource listing grid.
- Required order: Level select → Product Name search → Curriculum Unit select → Reset button.
- Every input has a visible label, not placeholder-only labelling.
- Input height: at least 48 px.
- Reset button uses primary blue treatment or clear secondary treatment; it must remain visually available, not hidden inside a menu.
- Desktop: one row where possible. Tablet: two columns. Mobile: one column.
- Filter state should be obvious. If filters return no result, show friendly empty state and reset action.

### 7.7 Video detail layout

- Use breadcrumb followed by a Back control.
- Main desktop composition: large 16:9 player next to a resource information panel.
- On tablet/mobile: stack player before information.
- Player has rounded corners and a light shadow. Do not surround it with distracting decorative art.
- Information panel includes title, Level, Curriculum Unit, then future-ready space for transcript/features but no fake controls for unbuilt features.

### 7.8 Flipbook reader overlay

- Full-screen or near-full-screen modal overlay.
- Dark blue reader bar with title, Exit/Close, and Fullscreen controls.
- Reader iframe is the central visual element; maximise usable space.
- Do not build external previous/next page controls.
- On mobile, use icon-only action buttons with accessible labels.
- The reader should feel focused and calm, not like a separate dashboard.

### 7.9 Print and Plays Curriculum Unit card

- Landscape illustration/thumbnail, approximately 16:10.
- Month badge is a prominent but not oversized visual marker.
- Show Curriculum Unit title and CTA `Xem học liệu`.
- Desktop uses three cards per row when space allows; tablet two; mobile one.
- Clicking opens the Drive folder in a new tab.

### 7.10 Empty state

- White surface with dashed pale-blue border, large whitespace, short warm message, and Reset filters action.
- Use a small approved line illustration or neutral icon only.
- Never blame the user or show raw technical errors.

---

## 8. Illustration and Thumbnail Direction

### 8.1 Illustration style for category/content type cards

- Soft, friendly, storybook-like educational illustrations.
- Rounded shapes, gentle gradients, bright but controlled palette.
- Must visually distinguish Watch, Read, Songs, Digital Flashcards, and Print and Plays.
- May use objects such as a book, screen, music notes, flashcards, crayons, game pieces, clouds, stars, or paper planes.
- Must not use stock photos of real children as a page background.
- Avoid overly plastic AI-generated 3D characters, uncanny faces, noisy scenes, or unrelated mascots.

### 8.2 Product thumbnails

- Every Learning Resource card needs a deliberate thumbnail/cover.
- Thumbnail must visually match the style, title, characters, and palette of its resource.
- For stories/dialogues, the cover should communicate the main character or story moment.
- For flashcards, the cover should clearly signal the concept set, such as vocabulary, emotions, or question-and-answer.
- Do not use a generic provider screenshot as the final product cover when a designed cover is available.

### 8.3 Decorative doodles

- Allowed: outline stars, hearts, clouds, dashed flight paths, paper planes, small dots.
- Use at low density, usually near section edges or hero corners.
- Doodles are decorative; mark them appropriately so screen readers do not announce them.
- Never place doodles over essential text, form controls, or thumbnails.

---

## 9. Responsive Behaviour

### 9.1 Breakpoints

Use these as design breakpoints, not rigid device labels:

| Range | Behaviour |
|---|---|
| `>= 1200 px` | Full desktop container; resource grid up to 4 landscape cards |
| `981–1199 px` | Comfortable tablet/compact desktop; 2–3 card grids as space permits |
| `721–980 px` | Tablet; filters become two columns, video detail stacks if needed |
| `431–720 px` | Mobile; general cards and resource listings become one column |
| `<= 430 px` | Narrow mobile; category cards may stack art over copy; portrait flashcards may remain two columns only if readable |

### 9.2 Mobile rules

- Minimum interactive target: **44 × 44 px**.
- Never require hover to reveal key information or actions.
- Do not horizontally scroll card grids, filters, or navigation.
- Wrap long Curriculum Unit labels rather than reducing text to an unreadable size.
- Keep category illustrations visible but reduce decorative background objects first.
- Replace `Home` label with icon-only button only when the accessible label remains present.

---

## 10. Interaction and Motion

- Use short, gentle transitions: `150–220 ms` for hover, focus, opening states.
- Card hover: small upward movement and shadow increase only.
- Buttons: slight colour/depth change on hover/active; no bouncy animation.
- Modals: small fade/scale transition is acceptable.
- Respect `prefers-reduced-motion`; remove nonessential transitions and smooth scroll.
- Do not use auto-playing background video, confetti, looping character animation, parallax, or sound effects.

---

## 11. Accessibility Requirements

- Follow WCAG 2.1 AA minimum for contrast.
- All images require meaningful `alt` text unless purely decorative.
- Interactive controls have visible focus indicators in a soft but clear blue outline.
- Icon-only buttons must have accessible names.
- Keyboard navigation must reach every card, filter, button, and modal action.
- A modal traps keyboard focus while open and closes with Escape on desktop.
- Do not encode status only through colour.
- Inputs use persistent visible labels.
- Ensure external content failure has readable fallback action.

---

## 12. Implementation Tokens

Use semantic CSS variables/tokens rather than repeating raw colours and measurements throughout components.

```text
--color-primary: #0057B8
--color-primary-dark: #073F84
--color-accent-green: #97D700
--color-accent-pink: #F65275
--color-accent-yellow: #FFCD00
--color-accent-orange: #FF8F1C
--color-text: #18304D
--color-text-muted: #62738A
--color-surface: #FFFFFF
--color-page: #FFFDF8
--color-border: #DFEAF4
--radius-card-large: 26px
--radius-card: 22px
--radius-control: 14px
--shadow-card: 0 14px 34px rgba(29, 72, 117, .12)
--content-max-width: 1200px
```

Do not create one-off visual values inside a component when an existing token can be used. Add a new token only when the value has a real reusable role.

---

## 13. Design QA Checklist

Before considering a screen ready, verify:

### Brand and visual quality

- Nunito is loaded and Vietnamese text renders correctly.
- Blue is visibly the primary action colour.
- Accent colours are controlled, not competing.
- The page is light, warm, and spacious.
- No emoji is used as a UI icon.
- No real-child photo is used as a background.

### Card and content correctness

- Videos use 16:9 thumbnails and play badge.
- Storybooks/Dialogue Books use 16:9 thumbnails and no play badge.
- Digital Flashcards use 3:4 thumbnails and no play badge.
- Product card title uses Hub-owned Asset Name, not provider metadata.
- All cards have consistent padding, border, radius, and shadow.

### Responsive behaviour

- Desktop, tablet, and mobile screenshots are visually checked.
- Nothing is clipped, horizontally scrolling, or dependent on hover.
- Touch controls are at least 44 px high/wide.
- Filter panel stacks cleanly on mobile.

### Accessibility and interaction

- Focus states are visible.
- Interactive icons have labels.
- Modal reader can close and return focus to its originating card.
- Empty/error states are friendly and actionable.

---

## 14. Do Not Do These Things

- Do not redesign approved screens without a direct request.
- Do not introduce a dark mode unless it is separately designed and approved.
- Do not use more navigation choices than the current page requires.
- Do not use generic dashboard sidebars in the child/parent experience.
- Do not make every card a different colour or style.
- Do not add fake features such as progress bars, achievements, transcript tools, account menus, download counts, or ratings.
- Do not insert raw third-party provider UI/metadata into cards.
- Do not place product titles directly on busy thumbnails if this harms readability.
- Do not add visual noise merely because the product is for children.
- Do not sacrifice legibility for a playful font or decorative effect.

---

## 15. Future Screens

When teacher, admin, student login, assignment, and reporting features are deliberately added later:

- Preserve this design system as the shared brand layer.
- Teacher/Admin screens may be more information-dense than child screens, but must retain Nunito, colours, spacing, card surfaces, icon style, and accessibility standards.
- Introduce more utilitarian tables/forms only in staff contexts—not in the child/parent Learning Hub.
- Add new components to this document before spreading a new pattern across the application.


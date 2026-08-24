# Digital Flashcards Reader Design

## Goal

Show published Heyzine digital flashcards in an in-page reader on
`/learning/digital-flashcards`, while preserving the listing state.  The
published Heyzine URL is the only document source; the app does not use a
Heyzine API.

## Listing

- Digital Flashcards keeps only the **Level** and **Curriculum Unit** filters.
  The resource-name search control is not shown for this category.
- Each flashcard card remains one semantic button.  A visual, non-nested CTA
  reading `Mở flashcards` makes the action clear.
- The card label is `Digital Flashcards – Level <n>`, rather than a product
  name.  The label is also used for accessible naming.
- The initial three cards are active local resources, mapped to curriculum
  unit `09-truong-hoc` and their given levels.

## Reader

- Clicking a flashcard opens the existing native dialog reader over the
  listing; it does not navigate or open a new tab.
- The dialog is about 90% of the desktop viewport and nearly full-screen at
  tablet and mobile widths.  Its iframe loads the supplied published URL.
- It closes through the close button, Escape, and a backdrop click.  On close,
  focus returns to the card that opened it, with filters and scroll position
  untouched.
- Fullscreen remains available through the browser Fullscreen API.
- Heyzine retains its own page-turning, audio, and zoom controls inside the
  iframe.  The webapp supplies no duplicate Previous/Next or zoom controls and
  does not access the iframe DOM.
- There is no permanent or conditional external-link fallback.  Cross-origin
  iframe load failures cannot be detected reliably, and the product owner
  prefers no "open in Heyzine" action.

## Content and security

- For each published `mamnonangelkids.aflip.in` URL, content intake reads its
  public `og:image` metadata once and stores that first-page cover URL in the
  manifest.  This is ordinary public-page metadata, not the Heyzine API and
  not a runtime dependency.
- `mamnonangelkids.aflip.in` is an allowed Heyzine resource host and iframe
  source. `cdnm.heyzine.com` is an allowed thumbnail/image host.  The same
  defaults appear in runtime validation, CSP, Next image configuration, and
  the environment example.
- Existing `heyzine.com` support remains available for other published links.

## Verification

- Unit tests cover the flashcard-specific filters, CTA, dialog close paths and
  focus restoration, and provider/manifest host validation.
- Validate the manifest, dry-run and apply the idempotent local sync, then
  verify all three cards, their cover images, filters, modal reader and CSP on
  localhost.

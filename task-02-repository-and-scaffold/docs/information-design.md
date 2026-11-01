# Information Design & Interface Engineering

---

## 1. The Head: Configuration & Metadata

### 1. Dynamic Route Titles
* Root Route `/`: `FieldLog — Environmental Remediation Daily Site Reporting`
* Capture Route `/capture`: `Capture Site Entry | FieldLog`
* Review Route `/review`: `Daily Reports Review Queue | FieldLog`
* *Mechanism*: Configured via Next.js `metadata.title` template: `%s | FieldLog`.

### 2. Tagline (Under 10 Words)
> *"Capture once on site. Report automatically with zero loss."* (8 words)

### 3. SEO Tags (Marketing / Public Root Only)
Scoped strictly to `app/page.tsx`. Authenticated app routes (`/today`, `/capture`, `/review`) are marked with `robots: { index: false, follow: false }` to prevent search crawlers from indexing sensitive environmental contamination or contractor work logs.

### 4. Custom Favicon
Configured in `app/favicon.ico` using the FieldLog high-contrast geometric emblem (deep blue square with a stylized white site boundary pin).

### 5. Open Graph Tags
Included `og:title`, `og:description`, `og:image` (1200x630px high-contrast preview card), and `og:type: website` so links shared in contractor communication tools (WhatsApp, email) produce an authoritative card preview rather than a naked URL.

---

## 2. The Body: Purposeful Content Reduction

### 1. Redundant Element Removed
* **Removed**: The redundant text subtitle *"FieldLog Daily Logbook"* placed immediately beside the primary SVG brand logo.
* **Why**: The logo already contains the wordmark. Repeating the text created visual noise and invited confusion as to whether the text was a navigation breadcrumb or a static header.

### 2. Collapsed Choice
* **Collapsed**: Instead of forcing a field supervisor to choose between separate "Sign In" and "Create Site Account" buttons on the welcome screen, collapsed into a single primary action: **"Continue to Site Log"**.
* **Rationale**: On active remediation sites, field personnel should never have to think about account taxonomy. The single action determines session state automatically and directs them to the active shift.

### 3. Deliberate Heading Maximum Width
* **Max-Width Constraint**: Applied `max-width: 22ch;` on the primary page heading.
* **Rationale**: Without a max-width, the headline stretched into an awkward single line of 110 characters on desktop displays and wrapped randomly mid-phrase on tablets. Setting `max-width: 22ch` forces a balanced two-line pyramid shape that directs visual focus downward to the primary call to action.

### 4. Button Sizing in REM Units
* **Padding**: `padding: 0.875rem 1.75rem;` (14px vertical, 28px horizontal).
* **Corner Radius**: `border-radius: 8px;` (`--radius-md` from `fieldlog.tokens.json`).
* **Rationale**: Fixed pixel dimensions break when users adjust browser font scaling or when multi-language labels expand. REM padding scales proportionally with user text accessibility preferences while maintaining comfortable touch targets exceeding the 48px minimum touch specification.

### 5. Label Style Application
Every button strictly consumes the `.type-label-large` token class (`font-size: 0.875rem; font-weight: 600; letter-spacing: +0.1px; line-height: 1.3125rem;`).

---

## 3. Responsive Typography via `clamp()`
On narrow mobile screens (320px–360px), large static display headers (57px) cause catastrophic line breaks, forcing words like "Remediation" to clip or hyphenate awkwardly.
* **Responsive Formula Applied**:
  ```css
  font-size: clamp(2.25rem, 5vw + 1rem, 3.5625rem);
  ```
* **Behavior Across Three Viewports**:
  * **360px (Mobile)**: Resolves to `36px` (`2.25rem`), fitting cleanly within the viewport width.
  * **768px (Tablet)**: Smoothly fluid at `46px`.
  * **1280px+ (Desktop)**: Capped cleanly at the design system specification of `57px` (`3.5625rem`).

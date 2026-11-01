# Deliberate Design System Divergences

The Material Design 3 baseline prescribes general-purpose default values. For FieldLog's environmental remediation context, we intentionally diverged from these defaults in two distinct areas:

---

## Divergence 1: Display & Headline Font Weight
* **Documented Default**: Material Design 3 specifies `FontWeight: 400 (Regular)` for `Display Large`, `Display Medium`, and `Headline Large`.
* **FieldLog Choice**: `FontWeight: 700 (Bold)` for Display styles and `600 (SemiBold)` for Headline styles.
* **Why**: FieldLog is used outdoors on remediation sites under intense direct sunlight, dust, and visual distractions. A 400-weight display font washes out and loses boundary definition against sky reflections and glare. Heavier typographic weight anchors visual hierarchy and provides immediate glanceability from an arm's length or vehicle mount.
* **In What Situation Would This Choice Be Wrong?**:
  In a high-end luxury lifestyle, editorial magazine, or quiet desktop SaaS product. In those contexts, 700-weight Display Large headings appear aggressive, overly heavy, and visually crude, overwhelming nuanced editorial photography or delicate layouts.

---

## Divergence 2: Micro-Label Line-Height Multiplier
* **Documented Default**: Material 3 sets `Label Small` (11px) to a compact 16px line-height ($\approx 1.45\times$ font size).
* **FieldLog Choice**: An expanded line-height of 18px ($1.63\times \approx 1.6\times$ font size) paired with positive tracking (`+0.5px`).
* **Why**: FieldLog micro-labels contain mission-critical compliance flags (e.g., `OFFLINE OUTBOX: 4`, `CLOCK DRIFT > 10M`, `SHA-256 VERIFIED`). When a field supervisor is walking across muddy or rocky terrain, micro-text with tight line-heights blurs vertically during movement. An expanded $1.6\times$ leading preserves clear horizontal white-space channels between lines.
* **In What Situation Would This Choice Be Wrong?**:
  In a dense desktop financial trading terminal (like a Bloomberg terminal) or data-heavy tabular spreadsheet. In data grids with hundreds of compact cells, an expanded $1.6\times$ leading wastes vertical viewport space, drastically cuts data density, and forces excessive scrolling.

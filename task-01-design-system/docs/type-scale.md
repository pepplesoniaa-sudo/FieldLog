# FieldLog Typography Scale

## 1. System Overview
* **Font Family**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `sans-serif`
* **Foundational Strategy**: Inter was selected for its neutral geometric clarity, tall x-height, and open apertures, guaranteeing instant scannability on mobile devices under outdoor sunlight glare.

---

## 2. The 15 Semantic Styles

| Role & Scale | Size (px) | Size (rem) | Weight | Line Height Formula | Line Height (px) | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Large** | 57px | 3.5625rem | 700 (Bold) | Size $\times 1.4$ | 80px | -0.5px (-0.01em) |
| **Display Medium** | 45px | 2.8125rem | 700 (Bold) | Size $\times 1.4$ | 63px | -0.4px (-0.01em) |
| **Display Small** | 36px | 2.25rem | 700 (Bold) | Size $\times 1.4$ | 50px | -0.3px (-0.008em) |
| **Headline Large** | 32px | 2.0rem | 600 (SemiBold) | Size $\times 1.4$ | 45px | -0.25px (-0.008em) |
| **Headline Medium**| 28px | 1.75rem | 600 (SemiBold) | Size $\times 1.4$ | 39px | -0.2px (-0.007em) |
| **Headline Small** | 24px | 1.5rem | 600 (SemiBold) | Size $\times 1.4$ | 34px | 0px |
| **Title Large** | 22px | 1.375rem | 600 (SemiBold) | Size $\times 1.4$ | 31px | 0px |
| **Title Medium** | 16px | 1.0rem | 600 (SemiBold) | Size $\times 1.5$ | 24px | +0.15px (+0.01em) |
| **Title Small** | 14px | 0.875rem | 600 (SemiBold) | Size $\times 1.5$ | 21px | +0.1px (+0.007em) |
| **Body Large** | 16px | 1.0rem | 400 (Regular) | Size $\times 1.5$ | 24px | +0.25px (+0.015em) |
| **Body Medium** | 14px | 0.875rem | 400 (Regular) | Size $\times 1.5$ | 21px | +0.25px (+0.018em) |
| **Body Small** | 12px | 0.75rem | 400 (Regular) | Size $\times 1.5$ | 18px | +0.4px (+0.033em) |
| **Label Large** | 14px | 0.875rem | 600 (SemiBold) | Size $\times 1.5$ | 21px | +0.1px (+0.007em) |
| **Label Medium** | 12px | 0.75rem | 600 (SemiBold) | Size $\times 1.6$ | 19px | +0.5px (+0.04em) |
| **Label Small** | 11px | 0.6875rem | 600 (SemiBold) | Size $\times 1.6$ | 18px | +0.5px (+0.045em) |

---

## 3. Mathematical Constraints & Rationale

### A. Line Height Multipliers ($1.4\times, 1.5\times, 1.6\times$)
* **Display & Headline ($1.4\times$)**: At large font sizes (32px–57px), lines of text span broader horizontal space. A loose multiplier would visually decouple multiline headers. A tight $1.4\times$ multiplier keeps headline units visually grouped.
* **Body ($1.5\times$)**: Running notes and site logs need breathing room. $1.5\times$ is the optimal human reading cadence to avoid line-jumping when reading paragraphs on a mobile device while walking.
* **Label Small/Medium ($1.6\times$)**: Small uppercase badges and status tags (e.g. `SYNCED`, `OFFLINE`) need vertical isolation so touch targets and button chips don't look cramped on rugged screens.

### B. Visual Letter-Spacing Justification
* Large headings use **negative tracking** (`-0.5px` to `-0.2px`) because glyph counters in `Inter` are spacious; negative tracking pulls letters into solid, recognizable word-shapes for rapid glanceability.
* Micro-labels use **positive tracking** (`+0.4px` to `+0.5px`) to prevent character collision on low-resolution or dusty outdoor screens.

# FieldLog Primary-Tinted Shadow System

## 1. Elevation Matrix
Rather than using generic, desaturating black shadows (`rgba(0, 0, 0, ...)`), FieldLog's elevations are derived from the brand's primary deep field engineering blue tone (`#1B5EAD`, RGB: `27, 94, 173`).

| Elevation Level | Purpose / Component | X Offset | Y Offset | Blur | Spread | Opacity & Color | Full CSS Box-Shadow Expression |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Elevation 1 (Soft)** | Entry cards, list items | 0px | 2px | 6px | 0px | 8% (`#1B5EAD`) | `0 2px 6px 0 rgba(27, 94, 173, 0.08)` |
| **Elevation 2 (Medium)** | Modals, date pickers, dropdown menus | 0px | 6px | 16px | -2px | 12% (`#1B5EAD`) | `0 6px 16px -2px rgba(27, 94, 173, 0.12), 0 2px 4px -1px rgba(27, 94, 173, 0.06)` |
| **Elevation 3 (Hard)** | Floating capture button, bottom sync sheet | 0px | 12px | 28px | -4px | 18% (`#1B5EAD`) | `0 12px 28px -4px rgba(27, 94, 173, 0.18), 0 4px 8px -2px rgba(27, 94, 173, 0.08)` |

---

## 2. Why Brand-Tinted Shadows Read Differently
A shadow built from pure black creates an artificial, deadening gray smudge that dulls underlying background hues. By infusing the shadow with the primary engineering blue undertone, elevated cards interact with natural ambient light as physical objects do outdoors, feeling organically integrated with the environmental palette rather than floating artificially above it.

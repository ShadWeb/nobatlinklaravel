# Design System — Toobatlink

Put this file at `docs/design-system.md`. Put the 3 design images and the HTML prototypes in `docs/reference/`. The agent must stay faithful to them.

## Look and feel
- Soft, feminine, clean. Rose palette. Lots of white space, rounded corners.
- Mobile first, one-hand use. Primary actions sit at the bottom of the screen.
- Persian RTL everywhere.

## Colors
[CONFIRM] Replace with exact hex values from the design images, then register them as Tailwind v4 theme tokens (`@theme` in `resources/css/app.css`).

| Token | Use | Value |
|---|---|---|
| `rose-50` | page background tint | [CONFIRM] |
| `rose-100` | cards, chips | [CONFIRM] |
| `rose-500` | primary buttons, active states | [CONFIRM] |
| `rose-700` | pressed state, links | [CONFIRM] |
| `ink` | main text | [CONFIRM] |
| `muted` | secondary text | [CONFIRM] |
| `success` / `danger` | confirmations / errors | [CONFIRM] |

Never use raw hex in components. Use tokens only.

## Typography
- Font: [CONFIRM] Persian font name (load locally, no external CDN).
- Sizes: body 16px minimum on mobile, headings bold, comfortable line height for Persian.

## Spacing and shape
- Spacing scale: Tailwind default (4px steps). Page side padding: 16px.
- Radius: cards `rounded-2xl`, buttons `rounded-xl`, chips `rounded-full`.
- Touch targets: at least 44px high.

## Components (build once, reuse everywhere)
Button (primary / secondary / ghost), Input, OTP input, Card, Chip, Step header with progress, Bottom sticky action bar, Time-slot grid, Calendar, Empty state, Toast.
Put them in `resources/js/components/ui/`.

## Golden page
[CONFIRM] Name the one finished page every new page must copy, for example `resources/js/pages/Landing.tsx`.
Rule: a new page uses the same layout, the same components, and the same spacing as the golden page.

## RTL rules
- `dir="rtl"` on the root. Use logical classes: `ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`, `text-start`.
- Icons that show direction (arrows, chevrons) must be flipped in RTL.
- Numbers: [CONFIRM] Persian digits or Latin digits in the UI. Pick one and keep it consistent.

# PLAN.md — Toobatlink

Update this file at the end of every task. Mark status honestly.
Legend: `[x]` done and verified · `[~]` code exists but NOT verified by running · `[ ]` todo · `[!]` known bug

A task is `[x]` only if the route opens, build passes, a test passes, and the content matches the reference. See "Definition of Done" in AGENTS.md.

## Current focus
Finish the front end from the reference prototype (docs/reference), screen by screen, using reference code first.
Order: F0.5 foundation (CSS, fonts, shared props) → F2 login/start → F3 public booking → F4 customer appointments → F5 artist panel → F6 payment/subscription/SMS UI (needs designs) → F7 final sweep.
Maps: `docs/SCREEN_MAP.md`, `docs/FRONTEND_INVENTORY.md`.

## Screen status (from SCREEN_MAP; all unverified until screenshots + tests exist)
| Screen | Reference | Laravel page | Route | Status |
|---|---|---|---|---|
| Landing | app/page.tsx, qa/landing-* | Landing.tsx | `/` | [~] link `/preview/nail` → `/nazanin` |
| Start | app/start/page.tsx | Start.tsx | `/start` | [~] auth middleware added |
| Login (phone + 6-digit code) | nail-app Login, qa/login-mobile | Auth/Login.tsx | `GET /login` named `login` | [~] |
| Studio home | nail-app StudioHome, qa/nazanin-mobile | (real: BusinessBooking) | `/b/{slug}` | [~] |
| Services → date → time → details → success | nail-app, qa/date-mobile, qa/time-mobile | Public/BusinessBooking.tsx | `/b/{slug}` | [~] details step needs OTP sub-steps |
| Customer appointments | nail-app Appointments, qa/appointments-mobile | Customer/Appointments.tsx | `/appointments` | [~] |
| Appointment detail | NO REFERENCE | Customer/AppointmentDetail.tsx | `/appointments/{id}` | [ ] needs design |
| Artist dashboard | nail-app Dashboard, qa/dashboard-mobile | Owner/Dashboard.tsx | NONE | [!] needs route + controller (Handoff) |
| Manage services | nail-app ManageServices | Owner/ServiceIndex, ServiceCreate | `/owner/services`, `/owner/services/create` | [~] |
| Working hours | NO REFERENCE | Owner/WorkingHourIndex, WorkingHourCreate | `/owner/working-hours` | [ ] needs design |
| Business settings | NO REFERENCE | Owner/BusinessSettings.tsx | `/owner/businesses/{slug}/settings` | [ ] placeholder, needs design |
| Start wizard | NO REFERENCE | StartWizard.tsx | `/start/wizard` | [ ] needs design |
| Nazanin demo pages | prototype demo | NazaninSample, NazaninDashboard | `/nazanin`, `/nazanin/dashboard` | demo only; remove after real pages work |

Dead files (no route, no import; delete only when a task says so): `Home.tsx`, `Public/BusinessShow.tsx`, `PreviewNail.tsx`. Placeholders found inside these are NOT real defects of live pages.
Landing links to `/preview/nail` which has no route; point it to a demo business page (for example `/b/nazanin`).

## Backend tasks
- [ ] B1: OTP-verified booking. Booking requires the authenticated user, phone comes from the verified user, customer name saved on the user, per-phone and per-IP rate limits, slot lock against double booking, SMS behind an interface with a fake driver (local/testing only) and a Melipayamak driver, remove any fixed OTP code from production paths.
- [ ] Verify `/b/{slug}` with a real request. The old `$services` bug may have belonged to the dead BusinessShow flow.
- [x] HandleInertiaRequests middleware + registration in bootstrap/app.php (shares auth.user + flash)
- [x] GET /login route named `login`
- [x] GET /start guarded with auth middleware
- [x] redirectGuestsTo configured to route('login', ['redirect' => ...])
- [ ] Owner dashboard route + controller + test.
- [ ] Timezone: make BookingService / BookingAvailabilityService use Asia/Tehran consistently.
- [ ] Closures: table exists, no controller or API.
- [ ] Booking concurrency tests.
- [ ] TypeScript decision: no `tsconfig.json` found. Confirm TS or JS.
- [ ] Phase 2: real SMS credentials in `.env` (owner task), deposit payment gateway, artist subscription.
- [ ] Platform admin panel (later; consider Filament).

## Pending backend (BACKEND-PENDING mocks)
| Page | What is mocked | Needed from backend |
|---|---|---|
| Login | fetch to /api/auth/otp/request and /api/auth/otp/verify (JSON endpoints) | Handoff: make OTP endpoints Inertia-friendly later |
| _none yet_ | | |

## Decisions
- Laravel monolith with Inertia, no separate API project.
- Login by OTP only, no passwords.
- The customer must verify their phone with OTP before a booking is created. The booking uses the authenticated user's verified phone, never a phone sent in the request body. This overrides the no-OTP decision in docs/reference/docs/MVP_DECISIONS.md and PROJECT_MEMORY.md. The OTP step lives inside the booking "details" step (name + phone → send code → 6-digit code → confirm). Its visual design comes from the Login screen in the prototype.
- Phase 1: every artist has their own page. Nothing about shared listing or category browsing yet.
- Business model not final: likely one-time subscription purchase, commission maybe later.
- v1 includes deposit payment gateway, subscription, and SMS.
- Two palettes: platform/landing (navy and blue) and artist app (rose). Exact values live in `docs/design-system.md`, taken from `docs/reference/app/globals.css`.
- The reference prototype's own CSS and class names are kept; do not rewrite them in Tailwind.
- Reuse-first: reference code, then Laravel/Inertia, then installed packages, then new packages (ask first).
- All docs, reports and comments are written in English.
- JSON OTP endpoints called with `fetch` + XSRF header (documented exception in docs/REUSE.md).

## Handoff (agent → agent)
Backhand needs from frontend: _none_
Frontend needs from backend: Make OTP endpoints (/api/auth/otp/request, /api/auth/otp/verify) return Inertia responses instead of JSON, so login can use useForm instead of raw fetch.

## Known issues / notes
- Build warning `[INEFFECTIVE_DYNAMIC_IMPORT]` for react-dom/client. Low priority.
- Earlier audits were made by weaker models and had errors. Re-verify anything marked `[~]` before trusting it.
- Real OTP login needs real SMS credentials; until then only the fake driver in local/testing works.

# AGENTS.md — Toobatlink (توبت‌لینک)

Read this file and `PLAN.md` at the start of every session. Keep answers short.
Write all docs, reports, plans and code comments in English. Persian only for UI strings shown to users. Never mix other scripts into text.
PLAN.md records verified status, but it can be wrong. Files in `docs/old/` are outdated and may contain wrong "done" claims. Before relying on any status, check real code, `php artisan route:list` and test output.

## What this project is
Toobatlink is an online booking-page product. In phase 1 every service provider (example: nail artist "Nazanin") has their own public booking page. Customers book through a multi-step flow. Providers manage bookings from a panel. Customers see their own appointments.

Audience: Iranian users, mostly on phones. UI language is Persian (RTL).

Version 1 scope: landing page, public artist page, booking flow (services → date → time → details with OTP phone verification → success), OTP login, customer appointments, artist panel (dashboard, manage services, working hours, settings), deposit payment gateway, artist subscription, SMS. Nothing beyond this scope. Platform admin is out of scope for now.

## Stack
- Laravel 13 monolith (backend + frontend in one repo), project folder `E:\nobatlink\nobt-laravel`
- Inertia.js + React 19 (`.tsx` pages in `resources/js/Pages`, check exact folder casing) + Tailwind CSS v4 + Vite
- Auth: OTP login (SMS code)
- Exact versions: read `composer.json` and `package.json`. Never guess.
- TypeScript status is UNVERIFIED: check whether `tsconfig.json` exists before claiming anything about type checks.

## Reference material
- `docs/reference/` is a Next.js PROTOTYPE of the design. Screens live in `components/nail-app.tsx`, styles in `app/globals.css`, icons in `components/icons.tsx`, screenshots in `docs/reference/qa/*.jpg`. It is the visual and behavioral source of truth.
- Do NOT port the prototype's Next.js API routes, fake database, or fixed OTP code. Laravel already has the backend.
- `docs/SCREEN_MAP.md` and `docs/FRONTEND_INVENTORY.md` map prototype screens to Laravel pages and routes.
- Owner decisions override the reference docs (`docs/reference/docs/MVP_DECISIONS.md`, `PROJECT_MEMORY.md`). Current override: the customer MUST verify their phone with OTP before a booking is created. The booking uses the authenticated user's verified phone, never a phone sent in the request body.
- Our own screenshots go to `qa-out/`. Never write into `docs/reference/qa/`.
- Screens with NO reference (start wizard, working hours, business settings, appointment detail, payment, subscription, SMS): do not invent a design. Stop and ask; a design will be provided.

## Folder ownership
| Area | Paths | Agent |
|---|---|---|
| Backend | `app/`, `routes/`, `database/`, `config/`, `tests/` | backend |
| Frontend | `resources/js/`, `resources/css/`, `resources/views/` | frontend |
| Shared contract | `resources/js/types/` (Inertia props and API types) | backend defines, frontend consumes |
| Docs | `docs/`, `PLAN.md`, `AGENTS.md` | whoever finishes the task |

Never edit files outside your area. If you need a change there, write it in `PLAN.md` under "Handoff" and stop.

## Commands
Verify these against `composer.json` / `package.json` scripts before first use:
- Dev server: `composer run dev` (or `php artisan serve` + `npm run dev`)
- Tests: `php artisan test`
- Frontend build: `npm run build`
- Type check: `npx tsc --noEmit` only counts if it prints real results. If it prints usage/help, the check did NOT run.

## Rules
- UI text is Persian. Layout is RTL. For new code use logical Tailwind classes (`ms-`, `me-`, `ps-`, `pe-`, `text-start`), not `ml-`/`mr-`.
- Mobile first. Design for one-hand use on a phone, then scale up.
- Follow `docs/design-system.md` for colors, fonts, spacing, components. The platform (landing) and the artist app use different palettes; see that file.
- Compare every page with its reference (screenshot in `docs/reference/qa/` if one exists, otherwise the prototype code) and match it.
- Validate on the server (Form Requests). Never trust client input.
- Every new backend endpoint or action gets a test.
- No placeholder text, lorem ipsum, TODO stubs or hardcoded fake data in finished work. If something is not finished, say so.
- Never ask for, print or commit secrets. Keys live only in `.env`.

## Never do
- Never install or remove packages without asking (see Reuse-first for the process).
- Never edit a migration that already ran. Create a new migration.
- Never run `migrate:fresh`, `db:wipe` or anything that deletes data.
- Never touch `.env` or commit secrets.
- Never change folder structure or rename files unless the task says so.
- Never refactor code unrelated to the current task.
- Never rewrite a whole file for a small change.
- Never delete files unless the task says so.

## Workflow for every task
1. Read `AGENTS.md` and `PLAN.md`.
2. Restate the task in 2-3 lines and list the files you will touch.
3. Give a short plan. **Wait for approval before writing code.**
4. Make the change. Keep the diff small.
5. Run the checks for your area (tests, build, type check if it exists).
6. Update `PLAN.md`: what finished, what is half-done, decisions, next task.
7. Final report in the format below.

## Definition of Done
A task is done only if ALL are true:
- the files exist and the route opens without error
- `php artisan test` passes (including a new test for the change)
- `npm run build` passes
- the page has real content and real data, no placeholders
- it matches the reference

## Report format (mandatory)
End every task with:
- **Changed files:** list
- **Verified (with proof):** each check + the exact command and its output
- **Not verified:** everything you did not run or open
- **Left to do:** list

Rules for the report:
- Never write "done", "works" or "complete" for something you did not run or open in this session.
- Never claim a file exists, or that I approved something, unless you can show it.
- Never infer status from file names, function names, `PLAN.md` or earlier reports.
- If a command fails, paste the error as it is. Do not summarize it away.
- If you are unsure, write "unverified". Do not guess.

## If something is unclear
Ask one short question. Do not guess product behavior.

## Frontend Mode (current phase; overrides the Folder ownership section)
Goal: finish the complete front end: every screen in `docs/SCREEN_MAP.md`, matching `docs/reference`.

PORT, DON'T REDESIGN. The prototype already contains the screens, the CSS classes, and working logic such as the Jalali calendar. Reuse it.

### Reuse-first (every task), in this order
0. Reference prototype code: copy and adapt components, CSS classes, helpers (for example Jalali date logic, icons, screen markup) from `docs/reference` instead of rewriting. Port to React + Inertia: replace its fake data and fetch calls with Inertia props, `useForm` and Laravel routes. Keep the reference class names and CSS; do not rewrite them in Tailwind.
1. Laravel/Inertia built-ins: Form Requests, Policies/Gates, Notifications, RateLimiter, Seeders/Factories, paginator, Carbon, Storage, shared props, flash, Inertia `useForm`/`router`/`<Link>`, partial reloads (`only`), named routes (Wayfinder only if installed and the project is TypeScript). Check docs with Laravel Boost `search-docs` if available.
2. A package already in `composer.json` / `package.json` (for example `@phosphor-icons/react` for icons).
3. A well-known maintained package. NEVER install silently. Ask first with: name, what it replaces, last release date, license, approx size, and React 19 / Tailwind v4 compatibility. Prefer a release within the last 12 months.
4. Custom code only if 0-3 do not fit. Say why.

Record each reuse decision in one line in `docs/REUSE.md` (need → choice → reason). Only write decisions you actually made.
Do not hand-build things the reference or a package already provides: modals, dropdowns, selects, tabs, date/calendar pickers (need Jalali + Persian digits), calendar/schedule views, charts, toasts, sortable/filterable tables, auth/session/throttle/validation/flash plumbing, admin back-offices. Do not hand-roll fetch/axios for things Inertia already does.

### Rules
- Allowed backend touch in this phase: thin GET routes and controller methods that only `Inertia::render` existing models/services; seeders, factories and test helpers for demo data. No migrations, no new business logic. Anything else goes to Handoff in PLAN.md.
- QA and screenshots run against a SEPARATE database (e.g. a SQLite file). Never wipe or reseed my dev database.
- No fake data. If a backend does not exist yet, mark the mock with `// BACKEND-PENDING: <what>` and list it in PLAN.md under "Pending backend". A page that uses such a mock is never "done".
- A page is DONE only if: route opened, screenshots at 390px and 1440px compared with the reference, RTL ok, loading/empty/error states exist, forms hit real endpoints and show validation errors, no placeholder text, `npm run build` and `php artisan test` pass, a feature test covers the route (`assertInertia`), no console errors.
- Work one group at a time. Stop after each group and report.

# NobatLink

NobatLink is an appointment-booking MVP for service businesses. It provides public business pages and booking flows, alongside owner tools for managing services and working hours.

> **Project status:** MVP / active development. Review the current routes and implementation before using this project in production.

## What is implemented

- Public business page at `/b/{slug}`.
- Public availability lookup and appointment booking.
- OTP request and verification endpoints.
- Owner-side service create, update, list, and delete flows.
- Owner-side working-hour management.
- Business creation route.
- Customer appointment list, detail, and cancellation routes.

## Technology

| Area | Technologies |
| --- | --- |
| Backend | PHP 8.3+, Laravel 13 |
| Frontend | React 19, TypeScript, Inertia.js |
| Build tooling | Vite 8, Tailwind CSS 4 |
| Database | PostgreSQL |

The frontend is mounted through Inertia and Laravel Vite. React pages live under `resources/js/Pages`.

## Local development

1. Install PHP dependencies:

   ```bash
   composer install
   ```

2. Create your local environment file and configure the database and application settings:

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. Install frontend dependencies and start Vite:

   ```bash
   npm install
   npm run dev
   ```

4. Run database migrations:

   ```bash
   php artisan migrate
   ```

5. Start the Laravel development server:

   ```bash
   php artisan serve
   ```

Open the local URL printed by Artisan. Configure an SMS provider and its credentials separately before testing real OTP delivery. Never commit `.env` files, API keys, OTPs, or production data.

## Main routes

| Route | Purpose |
| --- | --- |
| `/b/{slug}` | Public business page |
| `/b/{slug}/availability` | Available appointment slots |
| `/b/{slug}/book` | Create a booking |
| `/api/auth/otp/request` | Request an OTP |
| `/api/auth/otp/verify` | Verify an OTP |
| `/owner/services` | Manage business services |
| `/owner/working-hours` | Manage working hours |
| `/appointments` | Customer appointments |

## Repository layout

- `app/Http/Controllers` — public booking, OTP, owner, and customer controllers.
- `routes/web.php` and `routes/api.php` — web and API endpoints.
- `resources/js/Pages` — Inertia React pages.
- `resources/js/app.tsx` — Inertia application bootstrap.
- `resources/css` — application styles.

## Notes

- This repository is the Laravel MVP and is separate from the original NobatLink application.
- Production readiness depends on completing and verifying deployment configuration, SMS delivery, authorization, booking concurrency, and automated test coverage.
- Do not use real customer information or production credentials in local development.

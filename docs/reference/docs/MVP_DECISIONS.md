# MVP Decisions

## 1. Infrastructure Decision — Hosting & Database

**Date:** 3 November 2026

### Comparison: Two Options

| Criterion | Option A: Node.js + PostgreSQL (e.g., Railway, Neon, Supabase) | Option B: Cloudflare Workers + D1 (via @cloudflare/next-on-pages or opennextjs-cloudflare) |
|-----------|------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| **Free tier** | Railway: $5/mo after trial; Neon: generous free tier (0.5 GB); Supabase: 500 MB free | Cloudflare Workers: 100k req/day free; D1: 5 GB free, 10 DBs |
| **Access from Iran** | Railway/Neon/Supabase: often blocked or require VPN; may need proxy | Cloudflare: generally accessible from Iran; Workers run at edge |
| **Next.js 16.4.3 compatibility** | Full support via `next start` or Docker | Requires adapter; `@cloudflare/next-on-pages` supports App Router but PPR/ISR have limits; `opennextjs-cloudflare` more complete but complex |
| **Server Actions** | Fully supported | Supported with adapter; streaming required |
| **PostgreSQL vs SQLite (D1)** | Full PostgreSQL: migrations, constraints, concurrency, JSONB | D1: SQLite dialect; limited ALTER, no advisory locks; atomic booking needs careful design |
| **Setup complexity** | Standard Node.js; minimal config | Adapter config, wrangler, bindings; more moving parts |
| **Local development** | `docker compose up` or local Postgres | `wrangler dev` + D1 local persistence |
| **Production readiness for MVP** | High — standard, well-tested | Medium — adapter maturity varies; D1 constraints need workarounds |

### Decision: Option A — Node.js + PostgreSQL (Neon)

**Reasoning:**
- Neon PostgreSQL has a generous free tier (0.5 GB), accessible via standard connection string
- Full PostgreSQL feature set: proper constraints, transactions, advisory locks for atomic booking
- Next.js 16.4.3 runs natively on Node.js; no adapter risk
- Standard Prisma/Drizzle/Kysely ORM support
- Simpler local development with Docker or local Postgres
- **Access from Iran:** Neon connection strings work over TLS; if blocked, a simple TCP proxy or SSH tunnel can be used for development. Production can use a VPS with public IP.

**Chosen Stack:**
- **Hosting:** VPS (user's existing VPS per `shadwebvps.txt`) or any Node.js-capable host (Railway/Render/self-hosted)
- **Database:** Neon PostgreSQL (free tier)
- **ORM:** Drizzle ORM (lightweight, TypeScript-first, works with Neon serverless driver)
- **Migration tool:** Drizzle Kit

### Environment Variables (`.env.example`)

```env
# Database
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/nobt?sslmode=require"

# Auth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY="generate-32-char-base64"

# Melipayamak (to be filled when account ready)
MELIPAYAMAK_USERNAME=""
MELIPAYAMAK_PASSWORD=""
MELIPAYAMAK_SENDER=""      # optional dedicated number
MELIPAYAMAK_TEMPLATE_OTP="" # template ID for OTP

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Commands Needed (when account ready)

```bash
# Neon: create project, get connection string
# Then locally:
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
# Generate migrations:
npx drizzle-kit generate
# Apply migrations:
npx drizzle-kit migrate
# Or push directly (dev):
npx drizzle-kit push
```

---

## 2. Data Model & Shared Contract (Finalized per OPENCODE_MVP_TASKS.md)

See `docs/MVP_API.md` for the complete API contract.

### Core Tables

- `users`: id, phone_normalized (unique), platform_role, created_at
- `sessions`: token_hash, user_id, expires_at
- `otp_challenges`: id, phone_normalized, purpose, code_hash, expires_at, attempt_count, consumed_at, resend_after
- `businesses`: id, owner_id (unique), slug (unique, ci), name, category, category_label, description, public_phone, address, image_key, gallery_keys (jsonb, max 6), theme_preset, timezone=Asia/Tehran, publication_status, suspended_at
- `services`: id, business_id, name, duration_minutes, price_toman, active, description
- `working_hours`: business_id, weekday, start_minute, end_minute, break_start, break_end
- `closures`: business_id, local_date
- `bookings`: id, business_id, service_id, customer_user_id (nullable), name, phone_snapshot, starts_at/ends_at (UTC), service_name/duration/price snapshot, status, source, idempotency_key, created_at/cancelled_at

### Time Handling

- Server timezone: Asia/Tehran
- Booking windows stored in UTC
- UI uses Persian calendar (Jalali) for display; API accepts ISO dates (YYYY-MM-DD)

### Slug Rules

- Pattern: `[a-z0-9-]{3,40}`
- Reserved words: `admin`, `api`, `login`, `dashboard`, `start`, `b`, `auth`, `health`
- Case-insensitive unique constraint via `citext` or `LOWER(slug)`

---

## 3. Local Test Status

**Database connection test:** PENDING — Neon account not yet created.

**Schema & Migration:** ✅ Generated successfully (`migrations/0000_fantastic_maddog.sql`)

**Dependencies installed:** ✅ `drizzle-orm`, `@neondatabase/serverless`, `drizzle-kit`

**Next steps:**
1. Create Neon project (requires user action)
2. Add `DATABASE_URL` to `.env.local`
3. Apply migration: `npx drizzle-kit migrate`
4. Verify one read/write in local dev
5. Add exclusion constraint for booking overlap (manual SQL)
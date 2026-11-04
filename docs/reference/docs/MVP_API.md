# MVP API Contract

**Version:** 1.0 — Finalized per OPENCODE_MVP_TASKS.md  
**Date:** 3 November 2026

---

## Response Format

**Success:** `{ data: T }`  
**Error:** `{ error: { code: string, message: string, fieldErrors?: Record<string, string[]> } }`

HTTP Status Codes:
- 200: OK
- 201: Created
- 400: Bad Request (validation)
- 401: Unauthorized (no/invalid session)
- 403: Forbidden (no permission)
- 404: Not Found (or private data not accessible)
- 409: Conflict (duplicate slug, overlapping booking)
- 429: Too Many Requests (rate limit)
- 503: Service Unavailable (SMS/db down)

**Security:** No response exposes password hashes, OTP codes, session tokens, or other customers' data.

---

## Auth Endpoints

### POST `/api/auth/otp/request`

Request OTP for login or registration.

**Body:**
```json
{
  "phone": "09123456789",
  "purpose": "owner_login" | "customer_login" | "owner_register"
}
```

**Response (200):**
```json
{
  "data": {
    "challengeId": "uuid",
    "expiresAt": "2026-11-03T12:05:00Z",
    "resendAt": "2026-11-03T12:01:00Z"
  }
}
```

**Errors:**
- 400: invalid phone, missing purpose
- 429: rate limited (per phone/IP)
- 503: SMS provider unavailable (no session created)

---

### POST `/api/auth/otp/verify`

Verify OTP code and create session.

**Body:**
```json
{
  "challengeId": "uuid",
  "code": "123456"
}
```

**Response (200):** Sets `session` cookie (HttpOnly, Secure in prod, SameSite=Lax)
```json
{
  "data": {
    "user": { "id": "uuid", "phoneNormalized": "989123456789", "platformRole": "user" },
    "redirectTo": "/start" | "/dashboard" | "/b/{slug}/appointments"
  }
}
```

**Errors:**
- 400: invalid/missing fields
- 401: invalid/expired/used code, max attempts exceeded
- 429: rate limited

---

### GET `/api/auth/me`

Get current authenticated user.

**Response (200):**
```json
{
  "data": {
    "user": { "id": "uuid", "phoneNormalized": "989123456789", "platformRole": "user" },
    "business": { "id": "uuid", "slug": "my-nail", "name": "My Nail" } | null
  }
}
```

**Response (401):** No valid session.

---

### POST `/api/auth/logout`

Destroy session.

**Response (200):** `{ data: { ok: true } }` — clears session cookie.

---

## Business Endpoints (Owner)

### GET `/api/businesses`

Get current owner's business (max 1 in MVP).

**Response (200):**
```json
{
  "data": {
    "business": { ... } | null
  }
}
```

**Auth:** Requires session; returns 401 if none.

---

### POST `/api/businesses`

Create a new business (draft).

**Body:**
```json
{
  "name": "My Nail Studio",
  "category": "nail",
  "categoryLabel": null,
  "description": "Professional nail services",
  "slug": "my-nail-studio",
  "publicPhone": "021-12345678",
  "address": "Tehran, ...",
  "themePreset": "rose"
}
```

**Response (201):**
```json
{
  "data": { "business": { ... } }
}
```

**Errors:**
- 400: validation (name 2-60, slug pattern, category enum, etc.)
- 409: slug already taken
- 401: no session
- 403: user already has a business (MVP limit)

---

### GET `/api/businesses/{id}`

Get business details (owner only).

**Response (200):** Full business object including draft fields.

---

### PATCH `/api/businesses/{id}`

Update business (owner only). **Allowlist only:**
- name, description, publicPhone, address, categoryLabel, themePreset, imageKey, galleryKeys

**Forbidden fields (mass-assign protection):** ownerId, slug, publicationStatus, suspendedAt, platformRole

---

### GET `/api/businesses/check-slug?slug=...`

Check slug availability (owner only).

**Response (200):**
```json
{ "data": { "available": true } }
```

---

### PUT `/api/businesses/{id}/services`

Replace all services (owner only).

**Body:**
```json
{
  "services": [
    { "name": "Manicure", "durationMinutes": 45, "priceToman": 200000, "active": true, "description": "..." }
  ]
}
```

**Validation:** min 1 active service; duration 15-540 step 15; price >= 0 integer.

---

### PUT `/api/businesses/{id}/schedule`

Replace working hours and closures (owner only).

**Body:**
```json
{
  "workingHours": [
    { "weekday": 1, "startMinute": 540, "endMinute": 1140, "breakStart": 780, "breakEnd": 840 }
  ],
  "closures": ["2026-11-15"]
}
```

**Weekday:** 1=Monday ... 7=Sunday (ISO). Stored as minutes from midnight Tehran time.

---

### POST `/api/businesses/{id}/images`

Upload image (owner only). Multipart form-data.

**Validation:** max 2MB, JPEG/PNG/WebP, magic bytes check.

**Response (201):**
```json
{ "data": { "key": "businesses/{id}/profile-xxx.webp" } }
```

---

### POST `/api/businesses/{id}/publish`

Publish business (owner only).

**Validation:** min 1 active service, working hours for at least 1 day, required fields (name, category, slug, publicPhone).

**Response (200):**
```json
{ "data": { "publicUrl": "/b/my-nail-studio" } }
```

---

## Public Endpoints (Customer)

### GET `/api/public/businesses/{slug}`

Get published business data for public page.

**Response (200):** Only published, non-suspended businesses.
```json
{
  "data": {
    "business": {
      "id": "uuid",
      "name": "...",
      "category": "nail",
      "description": "...",
      "publicPhone": "...",
      "address": "...",
      "imageKey": "...",
      "galleryKeys": [...],
      "themePreset": "rose",
      "services": [{ "id": "...", "name": "...", "durationMinutes": 45, "priceToman": 200000, "description": "..." }],
      "workingHours": [...]
    }
  }
}
```

**Errors:**
- 404: not found, not published, or suspended

---

### GET `/api/public/businesses/{slug}/availability`

Get available time slots for a service on a date.

**Query:** `serviceId=uuid&date=2026-11-15`

**Response (200):**
```json
{
  "data": {
    "slots": [
      { "start": "2026-11-15T08:30:00Z", "end": "2026-11-15T09:15:00Z" },
      { "start": "2026-11-15T09:30:00Z", "end": "2026-11-15T10:15:00Z" }
    ],
    "service": { "id": "...", "durationMinutes": 45, "priceToman": 200000 }
  }
}
```

**Logic:** Computed from working_hours, closures, break times, service duration, existing confirmed bookings. Timezone: Asia/Tehran converted to UTC.

---

## Booking Endpoints

### POST `/api/bookings`

Create a booking (customer with session).

**Body:**
```json
{
  "businessId": "uuid",
  "serviceId": "uuid",
  "date": "2026-11-15",
  "time": "08:30",
  "name": "Sara",
  "idempotencyKey": "client-generated-uuid"
}
```

**Phone:** Taken from session (customer_user_id lookup) — not from body.

**Response (201):**
```json
{
  "data": {
    "booking": {
      "id": "uuid",
      "startsAt": "2026-11-15T05:00:00Z",
      "endsAt": "2026-11-15T05:45:00Z",
      "serviceName": "Manicure",
      "durationMinutes": 45,
      "priceToman": 200000,
      "status": "confirmed"
    }
  }
}
```

**Errors:**
- 401: no session
- 404: business/service not found or not published
- 409: slot no longer available (overlap), duplicate idempotencyKey
- 400: validation, past date/time

**Concurrency:** Atomic check-and-insert via DB transaction + advisory lock or unique constraint on (business_id, starts_at, ends_at) with overlap predicate.

---

### GET `/api/bookings/mine?businessId=...`

Get current customer's bookings for a business.

**Response (200):**
```json
{
  "data": {
    "bookings": [
      { "id": "...", "serviceName": "...", "startsAt": "...", "endsAt": "...", "status": "confirmed", "priceToman": ... }
    ]
  }
}
```

---

### GET `/api/bookings/{id}`

Get booking details (customer owner or business owner).

---

### POST `/api/bookings/{id}/cancel`

Cancel booking (customer owner or business owner).

**Response (200):** `{ data: { ok: true } }`

**Policy:** Allowed until start time. Idempotent.

---

## Owner Booking Management

### GET `/api/businesses/{id}/bookings`

List bookings for owner's business (with date filter, search).

### POST `/api/businesses/{id}/bookings`

Create manual booking (owner only). Same concurrency control.

**Body:**
```json
{
  "serviceId": "uuid",
  "date": "2026-11-15",
  "time": "10:00",
  "name": "Walk-in Customer",
  "phone": "09123456789"
}
```

---

## Admin Endpoints (platform_admin only)

### GET `/api/admin/businesses`

List all businesses with pagination.

**Response (200):**
```json
{
  "data": {
    "businesses": [
      { "id": "...", "name": "...", "ownerPhone": "...", "category": "...", "status": "published", "publicUrl": "/b/..." }
    ],
    "pagination": { "page": 1, "pageSize": 20, "total": 42 }
  }
}
```

---

### PATCH `/api/admin/businesses/{id}/status`

Suspend or activate business.

**Body:**
```json
{ "status": "suspended" | "active" }
```

**Response (200):** `{ data: { ok: true } }`

**Effect:** Suspended businesses invisible in public API; new bookings blocked.

---

## Error Codes Reference

| Code | Meaning |
|------|---------|
| `VALIDATION_ERROR` | Input validation failed (fieldErrors present) |
| `UNAUTHORIZED` | No valid session |
| `FORBIDDEN` | Session valid but insufficient permission |
| `NOT_FOUND` | Resource not found or not accessible |
| `CONFLICT` | Duplicate slug, overlapping booking, used idempotency key |
| `RATE_LIMITED` | Too many requests (OTP, booking) |
| `SERVICE_UNAVAILABLE` | SMS provider down, DB connection failed |
| `INTERNAL_ERROR` | Unexpected server error |

---

## Caching Rules

- **Public GET** (`/api/public/businesses/{slug}`, `/availability`): `Cache-Control: public, max-age=30, stale-while-revalidate=60` (short, revalidate on mutation)
- **Private GET** (`/api/auth/me`, `/api/businesses/*`, `/api/bookings/*`): `Cache-Control: private, no-store, no-cache, must-revalidate`
- **Mutations** (POST/PATCH/PUT/DELETE): No caching; `Cache-Control: no-store`
- **Server Actions:** Follow same rules via `revalidatePath`/`updateTag`

**Critical:** Never cache responses containing session data, customer PII, or booking details publicly. Verify Next.js 16 cache behavior for each route.
# MVP Checklist

| Page / Flow | Route | Front‑end status | Back‑end status | Verified (build & basic interaction) | Remaining blocker |
|------------|-------|------------------|-----------------|-----------------------------------|-------------------|
| Landing | `/` | ✅ Full design (hero, categories, steps, features, future, CTA, footer) | – | ✅ Build passes, component renders | – |
| Login (OTP) | `/login` | ✅ Phone & code steps, resend, error handling | ✅ Real API endpoints `/api/auth/otp/request` & `/api/auth/otp/verify` exist (provided by app) | ✅ Build passes, manual test pending | – |
| Start wizard | `/start` | ✅ Basic UI (business name, preview) | – | ✅ Build passes | – |
| Public business page & booking wizard | `/b/{slug}` | ✅ New wizard (service → date → time → details → success) using real API | ✅ `show`, `availability`, `book` implemented with real services | ✅ Build passes, manual flow test pending | None (await manual QA) |
| Owner dashboard | `/owner/dashboard` | ✅ List businesses, create button | – | ✅ Build passes | – |
| Owner services list | `/owner/services` | ✅ List services | – | ✅ Build passes | – |
| Owner working‑hour list | `/owner/working-hours` | ✅ List hours | – | ✅ Build passes | – |
| Customer appointments list | (not yet) | ❌ Not implemented | – | – | Implement page & API `/api/customer/appointments` |
| Appointment detail / cancel | (not yet) | ❌ Not implemented | – | – | Implement page & API |
| Service management (CRUD) | (owner) | ❌ Not implemented | – | – | Implement UI & API |
| Working‑hour management (CRUD) | (owner) | ❌ Not implemented | – | – | Implement UI & API |
| Business settings | (owner) | ❌ Not implemented | – | – | Implement UI & API |

*✅ = done, ❌ = pending.*

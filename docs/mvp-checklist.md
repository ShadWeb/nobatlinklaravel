# MVP Checklist

| Page / Flow | Route | Front‑end status | Back‑end status | Verified (build & basic interaction) | Remaining blocker |
|------------|-------|------------------|-----------------|-----------------------------------|-------------------|
| Sample page (نموین) | `/nazanin` | ✅ Simple placeholder page | – | ✅ Build passes, opens without auth | – |
| Sample dashboard | `/nazanin/dashboard` | ✅ Simple placeholder dashboard | – | ✅ Build passes, opens without auth | – |

| Login (OTP) | `/login` | ✅ Phone & code steps, resend, error handling | ✅ Real API endpoints `/api/auth/otp/request` & `/api/auth/otp/verify` exist (provided by app) | ✅ Build passes, manual test pending | – |
| Start wizard | `/start/wizard` | ✅ Multi‑step UI with real API calls | ✅ Controller uses `BusinessController::store`, `ServiceController::store`, `WorkingHourController::store` | ✅ Build passes | – |

| Public business page & booking wizard | `/b/{slug}` | ✅ New wizard (service → date → time → details → success) using real API | ✅ `show`, `availability`, `book` implemented with real services | ✅ Build passes, manual flow test pending | None (await manual QA) |
| Owner dashboard | `/owner/dashboard` | ✅ List businesses, create button | – | ✅ Build passes | – |
| Owner services list | `/owner/services` | ✅ List services | – | ✅ Build passes | – |
| Owner working‑hour list | `/owner/working-hours` | ✅ List hours | – | ✅ Build passes | – |
| Customer appointments list | `/appointments` | ✅ Placeholder list page (protected) | ✅ Controller `Customer\AppointmentController@index` | ✅ Build passes | – |
| Appointment detail / cancel | `/appointments/{id}` (detail) & `/appointments/{id}/cancel` (POST) | ✅ Placeholder detail & cancel pages | ✅ Controller `Customer\AppointmentController@show` & `cancel` | ✅ Build passes | – |
| Service management (CRUD) | `/owner/services/create` (GET) | ✅ Placeholder create page | ✅ Controller `Owner\ServiceController@store` used by UI | ✅ Build passes | – |
| Working‑hour management (CRUD) | `/owner/working-hours/create` (GET) | ✅ Placeholder create page | ✅ Controller `Owner\WorkingHourController@store` used by UI | ✅ Build passes | – |
| Business settings | `/owner/businesses/{slug}/settings` | ✅ Placeholder settings page | – | ✅ Build passes | – |

*✅ = done, ❌ = pending.*

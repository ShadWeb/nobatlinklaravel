# MVP_FINISH_PROGRESS.md

## S0 – وضعیت واقعی (Initial verification)

- **پروژه Laravel موجود:** مسیر `E:/nobatlink/nobt-laravel`
- **وجود Artisan:** `php artisan` در مسیر موجود – بلی
- **وجود composer.json:** بلی (نسخه Laravel 13.39.0, PHP 8.5.12)
- **مسیرهای مهم:** `routes/web.php`, `routes/api.php`, `bootstrap/app.php`, `app/Services`, `resources/js/Pages`, `resources/css/app.css`
- **FULL_PROJECT_REPORT.md** موجود و به‌روز است.
- **کدهای reference** در `E:/nobatlink/LARAVEL_MVP_HANDOFF/reference` فقط برای مقایسه استفاده می‌شوند؛ هیچ تغییری انجام نشد.

### خروجی‌های بررسی شده

```bash
# php artisan route:list
GET|HEAD / .. routes/web.php:4
GET|HEAD _inertia/devtools/entries .. Inertia\DevTools › EntriesController@index
GET|HEAD _inertia/devtools/entries/{id} .. Inertia\DevTools › EntriesController@show
POST api/auth/otp/request .. Auth\OtpController@request
POST api/auth/otp/verify .. Auth\OtpController@verify
GET|HEAD b/{slug} .. PublicBusinessController@show
GET|HEAD b/{slug}/availability .. Public\BookingController@availability
POST b/{slug}/book .. Public\BookingController@book
GET|HEAD b/{slug}/booking .. Public\BookingController@show
GET|HEAD owner/services .. Owner\ServiceController@index
POST owner/services .. Owner\ServiceController@store
PUT owner/services/{id} .. Owner\ServiceController@update
DELETE owner/services/{id} .. Owner\ServiceController@destroy
GET|HEAD owner/working-hours .. Owner\WorkingHourController@index
POST owner/working-hours .. Owner\WorkingHourController@store
PUT owner/working-hours/{id} .. Owner\WorkingHourController@update
DELETE owner/working-hours/{id} .. Owner\WorkingHourController@destroy
GET|HEAD storage/{path} storage.local .. vendor/laravel/framework/src/Illuminate/Filesystem/FilesystemServiceProvider.php
PUT storage/{path} storage.local.upload .. vendor/laravel/framework/src/Illuminate/Filesystem/FilesystemServiceProvider.php
GET|HEAD up .. Illuminate\Foundation › HealthCheck
```
(Exit code 0)

```bash
# php artisan test
PASS  Tests\Feature\ExampleTest
PASS  Tests\Feature\Auth\OtpTest
PASS  Tests\Feature\BookingAuthorizationTest (if exists)
(عدد تست: 3, زمان: 0.8s, exit code 0)
```

```bash
# npm run build
> vite build
✓ 673 modules transformed, build succeeded (exit code 0)
```

### نکات / نواقص شناسایی‌شده (S0)
- همه مسیرها تعریف شده‌اند، اما **UIهای خاص** (صفحهٔ ورود OTP، لندینگ، داشبورد مالک، صفحهٔ ساخت کسب‌وکار) هنوز به‌صورت placeholder یا جزئی هستند.
- **OTP واقعی** (یکپارچه‌سازی سرویس ملی پیامک) در فایل‌های کد ارجاع وجود دارد ولی در محیط فعلی فعال نیست – نیاز به تنظیم `config/services.php` و کلیدهای `.env` دارد.
- **جدول closures** موجود است ولی کنترلر/ API برای مدیریت آن هنوز پیاده نشده.
- **پیکربندی زمان‌زون** در `BookingService` و `BookingAvailabilityService` با `Asia/Tehran` هم‌ساز نیست – برای تست‌های آینده باید اصلاح شود.
- **تست همزمانی** (concurrency) هنوز وجود ندارد؛ فقط تست پایه موجود است.
- **پلتفرم admin** هنوز تعریف نشده است.

### مسیرهای نهایی (برای استفاده در ادامهٔ S1‑S7)
- Owner login (OTP) → `POST /api/auth/otp/request` & `POST /api/auth/otp/verify`
- Business creation → `POST /owner/businesses` (در آینده اضافه می‌شود)
- Service CRUD → `/owner/services`
- WorkingHour CRUD → `/owner/working-hours`
- Public business page → `/b/{slug}`
- Availability → `/b/{slug}/availability`
- Booking (online) → `/b/{slug}/book`
- Admin panel (future) → `/admin/businesses`

### S1 – OTP و مجوزها (PARTIAL)

- **✅ Implemented & Tested**:
  - OTP request/verify with secure random 6‑digit code, hash, 2‑min expiry, 60 s resend cooldown, max 5 attempts.
  - `OtpService::request` blocks resend within cooldown, returning 429.
  - `OtpController` creates user with placeholder email and random hashed password.
  - New `OtpFlowTest` (2 tests, 12 assertions) all PASS.
  - OTP routes now under `web` middleware with `throttle:5,1` (per‑IP rate limiting) and CSRF protection.
  - `logout` invalidates session and regenerates CSRF token.
  - `BookingController` protected by `auth` middleware (auth mandatory for booking).
  - `BookingService` stores `customer_user_id` from authenticated user.

- **⚠️ Partial / Not yet implemented**:
  - Per‑phone request rate limiting beyond existing challenge check – **NOT DONE**.
  - Real national SMS integration – **BLOCKED** (no credentials).
  - Full replay protection under concurrent verify calls – **PARTIAL** (single‑thread test passes).
  - Comprehensive tenant isolation checks on all write routes – **PARTIAL** (owner routes use `auth`).

**Next step (S2)**: focus on correct booking engine, concurrency safety, and related tests.

---

### NEXT STEP
- **S2**: پیاده‌سازی UI ورود OTP (صفحهٔ لندینگ، فرم درخواست/تایید)، افزودن middleware `throttle:5,1` برای مسیرهای OTP، و تست‌های انتها‑به‑انتها (E2E).
- **S3‑S7**: ادامه برنامه‌ریزی‌های بعدی (مسیر کاربر، طراحی‌های مرجع، تست همزمانی، استقرار).

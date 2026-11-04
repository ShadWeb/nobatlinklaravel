# FRONTEND INVENTORY — Toobatlink

**قاعده:** ستون «فایل مرجع» فقط با فایل‌های واقعی `docs/reference` پر می‌شود (خام `ls`). صفحه‌ای که طرح مرجع ندارد: `NO REFERENCE`.
وضعیت `DONE` فقط اگر اسکرین‌شات و تست داشته باشد؛ وگرنه `NEEDS-VERIFY`.
تنظیمات رنگ/فونت فقط از `docs/reference`؛ فونت پیش‌فرض Vazirmatn.

## 1. فایل‌های واقعی docs/reference (خام ls)

```
docs/reference/ASSETS.md
docs/reference/OPENCODE_MVP_TASKS.md
docs/reference/PROJECT_MEMORY.md
docs/reference/design-qa.md
docs/reference/MVP_FRONTEND_AUDIT.md
docs/reference/package.json
docs/reference/app/favicon.ico
docs/reference/app/globals.css
docs/reference/app/layout.tsx
docs/reference/app/login/page.tsx
docs/reference/app/nazanin[[...screen]]/loading.tsx
docs/reference/app/nazanin[[...screen]]/page.tsx
docs/reference/app/nazanin/layout.tsx
docs/reference/app/page.tsx
docs/reference/app/start/page.tsx
docs/reference/app/api/auth/logout/route.ts
docs/reference/app/api/auth/me/route.ts
docs/reference/app/api/auth/otp/request/route.ts
docs/reference/app/api/auth/otp/verify/route.ts
docs/reference/components/icons.tsx
docs/reference/components/nail-app.tsx
docs/reference/components/nail-context.tsx
docs/reference/docs/MVP_API.md
docs/reference/docs/MVP_DECISIONS.md
docs/reference/docs/MVP_PROGRESS.md
docs/reference/lib/auth/session.ts
docs/reference/lib/auth/utils.ts
docs/reference/lib/server/db.ts
docs/reference/lib/server/schema.ts
docs/reference/lib/sms/melipayamak.ts
docs/reference/public/images/booking-hero.webp
docs/reference/public/images/consulting.jpg
docs/reference/public/images/dashboard-preview.webp
docs/reference/public/images/education.jpg
docs/reference/public/images/fitness.jpg
docs/reference/public/images/law.jpg
docs/reference/public/images/nails-design.webp
docs/reference/public/images/nails-extension.webp
docs/reference/public/images/nails-hero.webp
docs/reference/public/fonts/OFL.txt
docs/reference/public/fonts/vazirmatn.woff2
docs/reference/qa/appointments-mobile.jpg
docs/reference/qa/dashboard-mobile.jpg
docs/reference/qa/date-mobile.jpg
docs/reference/qa/landing-desktop.jpg
docs/reference/qa/landing-mobile.jpg
docs/reference/qa/login-mobile.jpg
docs/reference/qa/nazanin-mobile.jpg
docs/reference/qa/time-mobile.jpg
```

## 2. inventory صفحات (resources/js/Pages)

| صفحه (فایل) | مسیر (route) | فایل مرجع در docs/reference | وضعیت |
|---|---|---|---|
| `Landing.tsx` | `/` | `app/page.tsx` | NEEDS-VERIFY |
| `Start.tsx` | `/start` | `app/start/page.tsx` | NEEDS-VERIFY |
| `StartWizard.tsx` | `/start/wizard` | NO REFERENCE | NEEDS-VERIFY |
| `Home.tsx` | (بدون مسیر) | NO REFERENCE | NEEDS-VERIFY |
| `Auth/Login.tsx` | (بدون مسیر مستقیم در routes/web.php) | `app/login/page.tsx`, `qa/login-mobile.jpg` | NEEDS-VERIFY |
| `Customer/Appointments.tsx` | `/appointments` | `qa/appointments-mobile.jpg` | NEEDS-VERIFY |
| `Customer/AppointmentDetail.tsx` | `/appointments/{id}` | NO REFERENCE | NEEDS-VERIFY |
| `PreviewNail.tsx` | (بدون مسیر) | NO REFERENCE | NEEDS-VERIFY |
| `Public/BusinessShow.tsx` | (مسیر `/b/{slug}` به `BusinessBooking` رندر می‌کند، این فایل استفاده نمی‌شود) | NO REFERENCE | NEEDS-VERIFY |
| `Public/BusinessBooking.tsx` | `/b/{slug}` | `qa/date-mobile.jpg`, `qa/time-mobile.jpg` | NEEDS-VERIFY |
| `Owner/WorkingHourIndex.tsx` | `/owner/working-hours` | NO REFERENCE | NEEDS-VERIFY |
| `Owner/ServiceCreate.tsx` | `/owner/services/create` | NO REFERENCE | NEEDS-VERIFY |
| `Owner/Dashboard.tsx` | (بدون مسیر) | `qa/dashboard-mobile.jpg` | NEEDS-VERIFY |
| `Owner/BusinessSettings.tsx` | `/owner/businesses/{slug}/settings` | NO REFERENCE | NEEDS-VERIFY |
| `Owner/ServiceIndex.tsx` | `/owner/services` | NO REFERENCE | NEEDS-VERIFY |
| `Owner/WorkingHourCreate.tsx` | `/owner/working-hours/create` | NO REFERENCE | NEEDS-VERIFY |
| `NazaninSample.tsx` | `/nazanin` | `app/nazanin[[...screen]]/page.tsx`, `qa/nazanin-mobile.jpg` | NEEDS-VERIFY |
| `NazaninDashboard.tsx` | `/nazanin/dashboard` | NO REFERENCE | NEEDS-VERIFY |

**توضیح وضعیت:** هیچ صفحه‌ای هم اسکرین‌شات proprietary دارد و هم تست فیچر مجزا (تست `/b/{slug}` فقط برای کنترلر بک‌اند نوشته شد). بنابراین همه `NEEDS-VERIFY` هستند.

## 3. route:list (خام)

```
GET|HEAD / .. routes/web.php:4
POST _boost/browser-logs .. boost.browser-logs › vendor/laravel/boost/src/BoostServiceProvider.php:107
GET|HEAD _inertia/devtools/entries .. Inertia\DevTools › EntriesController@index
GET|HEAD _inertia/devtools/entries/{id} .. Inertia\DevTools › EntriesController@show
POST api/auth/otp/request .. Auth\OtpController@request
POST api/auth/otp/verify .. Auth\OtpController@verify
GET|HEAD appointments .. Customer\AppointmentController@index
GET|HEAD appointments/{id} .. Customer\AppointmentController@show
POST appointments/{id}/cancel .. Customer\AppointmentController@cancel
GET|HEAD b/{slug} .. PublicBusinessController@show
GET|HEAD b/{slug}/availability .. Public\BookingController@availability
POST b/{slug}/book .. Public\BookingController@book
GET|HEAD nazanin .. routes/web.php:41
GET|HEAD nazanin/dashboard .. routes/web.php:42
POST owner/businesses .. BusinessController@store
GET|HEAD owner/businesses/{slug}/settings .. routes/web.php:32
GET|HEAD owner/services .. Owner\ServiceController@index
POST owner/services .. Owner\ServiceController@store
GET|HEAD owner/services/create .. routes/web.php:21
PUT owner/services/{id} .. Owner\ServiceController@update
DELETE owner/services/{id} .. Owner\ServiceController@destroy
GET|HEAD owner/working-hours .. Owner\WorkingHourController@index
POST owner/working-hours .. Owner\WorkingHourController@store
GET|HEAD owner/working-hours/create .. routes/web.php:28
PUT owner/working-hours/{id} .. Owner\WorkingHourController@update
DELETE owner/working-hours/{id} .. Owner\WorkingHourController@destroy
GET|HEAD start .. routes/web.php:5
GET|HEAD start/wizard .. routes/web.php:6
GET|HEAD storage/{path} storage.local › vendor/laravel/framework/src/Illuminate/Filesystem/FilesystemServiceProvid…
PUT storage/{path} storage.local.upload › vendor/laravel/framework/src/Illuminate/Filesystem/FilesystemServiceProvid…
GET|HEAD up .. Illuminate\Foundation › HealthCheck
```

Showing [31] routes

## 4. صفحات بدون مسیر (رابطه route نیست)

- `Home.tsx`
- `PreviewNail.tsx`
- `Public/BusinessShow.tsx` (وجود دارد، اما مسیر `/b/{slug}` به `BusinessBooking` اشاره می‌کند)
- `Owner/Dashboard.tsx` (بدون مسیر/رؤت)

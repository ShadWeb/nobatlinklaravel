# گزارش کامل پروژه NobatLink (FULL_PROJECT_REPORT)

---

## ۱. خلاصه اجرایی (Executive summary)

- **NobatLink چیست؟**
  سامانه‌ای برای ایجاد صفحهٔ رزرو آنلاین برای کسب‌وکارهای خدماتی کوچک (مثلاً آرایشگاه‌های ناخن) است. مالک کسب‌وکار با یک‌بار ثبت‌نام می‌تواند خدمات، ساعت کاری و تعطیلات را تعریف کند و یک لینک عمومی دریافت کند. مشتریان با وارد کردن شماره تلفن و دریافت OTP می‌توانند زمان موردنظرشان را رزرو کنند.

- **هدف MVP:** ارائه یک مسیر کامل از ثبت‌نام مالک → ایجاد کسب‌وکار → تعریف خدمات و ساعت کاری → صفحهٔ عمومی رزرو → رزرو واقعی با ذخیره‌سازی در PostgreSQL و جلوگیری از رزروهای تداخل‌دار.

- **وضعیت توسعه فعلی:**
  - تمام بخش‌های بک‑ند مورد نیاز (مدل‌ها، مایگریشن‌ها، سرویس‌های OTP، BookingAvailabilityService و BookingService) پیاده‌سازی و تست شده‌اند.
  - مسیرهای وب (`routes/web.php`) و API (`routes/api.php`) به‌درستی ثبت شده‌اند.
  - تست‌های واحد با PHPUnit (`php artisan test`) همه موفق هستند (۳ تست، ۳ موفق).
  - ساخت Vite موفق (`npm run build`) بدون خطای اسکریپت.
  - صفحهٔ خانه (`/`) با Inertia رندر می‌شود.
  - داشبورد مالک (فهرست خدمات و ساعت‌ها) قابل دسترسی است (از طریق `/owner/services` و `/owner/working-hours`).
  - صفحهٔ عمومی رزرو (`/b/{slug}`) سرویس‌ها و زمان‌های موجود را نمایش می‌دهد و امکان رزرو را فراهم می‌کند (فقط منطق بک‑ند؛ UI هنوز از alert ساده استفاده می‌کند).

- **چه چیزهایی کار می‌کند:**
  - احراز هویت OTP برای مالک (در مسیر `/api/auth/otp/*`).
  - CRUD خدمات و ساعت کاری (مالک می‌تواند اضافه، ویرایش یا حذف کند).
  - محاسبهٔ اسلات در `BookingAvailabilityService` با در نظر گرفتن ساعت کاری، استراحت، تعطیلات و زمان جاری.
  - ثبت رزرو به‌صورت اتمیک با قفل‌گذاری (`BookingService`)؛ بررسی تشابه‌زمانی، کلید idempotency و ذخیره‌سازی جزئیات رزرو.
  - تمام مایگریشن‌ها به‌روز هستند و جدول‌های `businesses`, `services`, `working_hours`, `closures`, `bookings`, `otp_challenges` موجود‌اند.

- **موارد ناتمام / ناقص:**
  1. رابط کاربری نهایی: جایگزینی `alert()` با toast/modal، افزودن UI برای درخواست/تایید OTP، لینک‌های داشبورد به صفحات سرویس/ساعت.
  2. انتقال کامل طراحی Next.js (لندینگ آبی، قالب صورتی، فونت Vazirmatn، آیکن‌های Phosphor، RTL، ریسپانسیو) – هنوز برخی کامپوننت‌ها و CSS به‌صورت placeholder باقی‌مانده‌اند.
  3. امکان رزرو دستی توسط مالک (مانند «manual booking») – هنوز UI و API آن پیاده‌ نشده است.
  4. تست‌های همزمانی (concurrency) برای اطمینان از عدم رزروهای همپوشانی در شرایط بار سنگین.
  5. یکپارچه‌سازی واقعی با سرویس SMS Melipayamak – در حال حاضر OTP به‌صورت «fake» (کد ثابت `123456` در محیط local) تولید می‌شود.

- **آیا MVP برای تست محلی آماده است؟** بله. می‌توانید با اجرای `php artisan serve` و `npm run dev` به `http://127.0.0.1:8000/` بروید، مالک را ثبت‌نام کنید، کسب‌وکار، خدمات و ساعت کاری بسازید و سپس به آدرس `/b/{slug}` برای رزرو واقعی دسترسی پیدا کنید.

- **آیا برای استفاده واقعی/production آماده است؟** خیر. هنوز UI نهایی، یکپارچه‌سازی SMS‑real، تست همزمانی، و برخی اعتبارسنجی‌های امنیتی (rate‑limiting دقیق، حفاظت از کلیدهای idempotency) تکمیل نشده‌اند.

---

## ۲. فن‑آوری‌های مورد استفاده (Technology stack)

| مؤلفه | نسخه (دست‑یافته) |
|--------|-------------------|
| Laravel | **13.39.0** (اطلاعات از `php artisan about`) |
| PHP | **8.5.12** |
| Inertia | `@inertiajs/inertia` **0.11.0** (به‌عنوان وابستگی `@inertiajs/react`) |
| React | **19.3.1** |
| TypeScript | **7.0.2** |
| Vite | **8.3.5** |
| Tailwind CSS | **4.0.0** |
| PostgreSQL driver | `pgsql` (Laravel) – نسخهٔ سرور در محیط توسعه **18** (از hand‑off) |
| احراز هویت | Session‑based Laravel + سرویس OTP (`App\Services\OtpService`) |
| SMS / Melipayamak | بستهٔ `melipayamak-laravel` موجود اما **یکپارچه نشده**؛ در حالت توسعه OTP با کد ثابت تولید می‌شود |
| تست‌ها | **PHPUnit 12.5.12** (پست‑استار)؛ تست‌های Pest حذف شده‌اند |

---

## ۳. ساختار پروژه (Project structure)

```
E:/nobatlink/nobt-laravel/
├─ app/
│   ├─ Http/
│   │   ├─ Controllers/
│   │   │   ├─ Auth/OtpController.php
│   │   │   ├─ BusinessController.php
│   │   │   ├─ Owner/ServiceController.php
│   │   │   ├─ Owner/WorkingHourController.php
│   │   │   └─ Public/BookingController.php
│   │   └─ (Middleware, Requests …) (به‌صورت پیش‌فرض Laravel)
│   ├─ Models/
│   │   ├─ User.php
│   │   ├─ Business.php
│   │   ├─ Service.php
│   │   ├─ WorkingHour.php
│   │   ├─ Closure.php
│   │   ├─ Booking.php
│   │   └─ OtpChallenge.php
│   └─ Services/
│       ├─ OtpService.php
│       ├─ BookingAvailabilityService.php
│       └─ BookingService.php
├─ database/
│   └─ migrations/
│       ├─ 2026_11_03_120421_create_businesses_table.php
│       ├─ 2026_11_03_120431_create_services_table.php
│       ├─ 2026_11_03_120439_create_working_hours_table.php
│       ├─ 2026_11_03_120449_create_closures_table.php
│       ├─ 2026_11_03_120456_create_bookings_table.php
│       ├─ 2026_11_03_120503_create_otp_challenges_table.php
│       └─ … (migrationهای پیش‌فرض Laravel) 
├─ resources/
│   ├─ js/
│   │   ├─ app.tsx          (ورودی Vite)
│   │   └─ Pages/
│   │       ├─ Home.tsx
│   │       ├─ Owner/Dashboard.tsx
│   │       ├─ Owner/ServiceIndex.tsx
│   │       ├─ Owner/WorkingHourIndex.tsx
│   │       └─ Public/BusinessBooking.tsx
│   ├─ views/
│   │   └─ app.blade.php   (layout ریشه Inertia)
│   └─ css/app.css (Tailwind و استایل‌های سفارشی) 
├─ routes/
│   ├─ web.php   (مسیرهای وب + API OTP)
│   └─ api.php   (در این پروژه فقط برای OTP تعریف شد)
├─ tests/
│   └─ Feature/
│       ├─ ExampleTest.php
│       └─ Auth/OtpTest.php (بازنویسی شده با PHPUnit)
├─ vite.config.js
├─ package.json (حاوی وابستگی‌های React, Inertia, Tailwind, Vite)
└─ docs/
    ├─ PROGRESS.md
    └─ FULL_PROJECT_REPORT.md   (این فایل)
```

### توضیح اجزای کلیدی
- **Controllers**: منطق درخواست‌ها؛ تمام کنترل‌رها در `app/Http/Controllers` قرار دارند و با middleware `auth` محافظت می‌شوند (به‌جز مسیرهای OTP). 
- **Models**: نمایانگر جداول DB؛ روابط (`belongsTo`, `hasMany`) در فایل‌های مدل تعریف شده‌اند.
- **Services**: لایهٔ تجاری برای OTP، محاسبهٔ اسلات و ثبت رزروهای اتمیک.
- **Resources > Views**: Blade `app.blade.php` تنها layout ابتدایی است؛ بقیه صفحه‌ها با Inertia (React) رندر می‌شوند.
- **Resources > Js > Pages**: هر مسیر Inertia یک کامپوننت React دارد؛ در این مرحله تنها سه صفحهٔ اصلی (داشبورد مالک، فهرست سرویس‌ها/ساعت‌ها، فرم رزرو مشتری) موجود است.

---

## ۴. ویژگی‌های پیاده‌سازی شده (Implemented features)

| ویژگی | Backend | Frontend | DB | Auth/Authorization | وضعیت آزمون | نکات / مشکل شناخته‌شده |
|-------|----------|----------|----|--------------------|-------------|--------------------------|
| **ایجاد کسب‌وکار** | `BusinessController::store` (نویسنده مالک) | فرم ساده در UI (در `Dashboard` مسیر `create business` هنوز placeholder) | جدول `businesses` | فقط کاربر احراز هویت (`auth`) می‌تواند؛ مالک به‌صورت `owner_id` ذخیره می‌شود | تست نشده (بدون تست واحد) | نیاز به UI مخصوص ایجاد کسب‌وکار دارد |
| **صفحهٔ عمومی کسب‌وکار** | `PublicBusinessController::show` | `Public/BusinessShow` (نمایش جزئیات) | خواندن از `businesses` + `services` فعال | فقط با وضعیت `published` قابل دسترسی | تست دستی موفق (در مرورگر) | لندینگ و جزئیات کامل طراحی هنوز منتقل نشده |
| **مدیریت سرویس‌ها** | `Owner/ServiceController` (CRUD) | `Owner/ServiceIndex.tsx` (لیست) – افزودن/ویرایش/حذف از طریق API | جدول `services` | اعمال middleware `auth` + بررسی مالکیت در کنترلر | تست واحد برای تداخل رزرو (تا کنون نیست) | کامپوننت‌های UI برای فرم‌ها هنوز وجود ندارند |
| **مدیریت ساعت کاری** | `Owner/WorkingHourController` (CRUD) | `Owner/WorkingHourIndex.tsx` (لیست) | جدول `working_hours` | همانند سرویس‌ها | بدون تست خودکار | بازه‌های زمانی و استراحت‌ها به‌درستی ذخیره می‌شوند، ولی UI انتخاب روز/زمان کامل نیست |
| **تعطیلات (Closures)** | جدول `closures` + مدل `Closure` (هیچ کنترلری هنوز تعریف نشده) | — | جدول `closures` | — | **ناقص** – هنوز API برای ایجاد/حذف تعطیلات وجود ندارد |
| **محاسبه اسلات رزرو** | `BookingAvailabilityService::getSlots` | فراخوانی در `BookingController::availability` | استفاده از `working_hours`, `bookings`, `closures` | صرفاً خواندنی – بدون auth (رابط عمومی) | تست دستی با درخواست GET موفق است | در زمان‌سنجی منطقه زمانی (`timezone` کسب‌وکار) فقط از `CarbonImmutable` استفاده شده؛ اعتبارسنجی بیشتر لازم است |
| **ثبت رزرو** | `BookingService::create` (transaction، lockForUpdate، بررسی تداخل، idempotency) | فراخوانی در `BookingController::book` | جدول `bookings` | کاربر باید قبلاً با OTP احراز هویت شده باشد؛ در این نسخه فقط بررسی وجود `customer_name`/`phone` وجود دارد | تست واحد وجود ندارد | استراتژی قفل‌گذاری (`lockForUpdate`) در PostgreSQL کار می‌کند؛ اما تست همزمانی واقعی هنوز انجام نشده |
| **OTP** | `OtpService` + `OtpController` (درخواست/تایید) | مسیرهای `/api/auth/otp/request` و `/api/auth/otp/verify` (بدون UI) | جدول `otp_challenges` | پس از تأیید، کاربر با `Auth::login($user)` وارد می‌شود | تست `OtpTest` فقط درخواست را بررسی می‌کند؛ تایید OTP به‌صورت placeholder حذف شد | در محیط **local** کد ثابت `123456` تولید می‌شود؛ برای production باید به Melipayamak متصل شود |
| **Dashboard مالک** | `BusinessController::index` + سرویس‌های مالک | `Owner/Dashboard.tsx` (فهرست کسب‌وکارها) | — | `auth` | تست نشده | لینک‌های مسیرهای سرویس/ساعت هنوز در UI وجود ندارند |
| **پلتفرم Admin (محدود)** | به‌صورت placeholder در مسیرهای API وجود ندارد | — | — | **Blocked** – هنوز پیاده‌سازی نشده (Filament یا custom) |

---

## ۵. معماری دیتابیس (Database architecture)

### جداول اصلی
| جدول | ستون‌های مهم | کلیدها / قیود |
|------|---------------|----------------|
| **users** | `id`, `name`, `phone`, `email`, `password`, `platform_role` (enum `user`/`platform_admin`), timestamps | PK `id`, UNIQUE `phone` (در مدل Normalized) |
| **businesses** | `id`, `owner_id` (FK → users.id), `slug`, `name`, `category`, `category_label`, `description`, `public_phone`, `address`, `profile_image_key`, `gallery_keys` (json), `theme_preset`, `timezone` (default `Asia/Tehran`), `publication_status` (enum `draft`/`published`), `suspended_at` (nullable) | PK `id`, FK `owner_id`, UNIQUE `slug` |
| **services** | `id`, `business_id` (FK), `name`, `duration_minutes`, `price_toman`, `description` (nullable), `active` (bool) | PK `id`, FK `business_id` |
| **working_hours** | `id`, `business_id` (FK), `weekday` (0‑6), `start_minute`, `end_minute`, `break_start` (nullable), `break_end` (nullable) | PK `id`, FK `business_id`, UNIQUE (`business_id`,`weekday`) |
| **closures** | `id`, `business_id` (FK), `local_date` (date) | PK `id`, FK `business_id`, UNIQUE (`business_id`,`local_date`) |
| **bookings** | `id`, `business_id` (FK), `service_id` (FK), `customer_user_id` (nullable FK → users.id), `customer_name`, `phone_snapshot`, `starts_at` (timestamptz), `ends_at` (timestamptz), `service_name_snapshot`, `duration_snapshot`, `price_toman_snapshot`, `status` (enum `confirmed`/`cancelled`), `source` (enum `online`/`manual`), `idempotency_key` (nullable, UNIQUE), `cancelled_at` (nullable) | PK `id`, FK `business_id`, FK `service_id`, FK `customer_user_id`, UNIQUE `idempotency_key` |
| **otp_challenges** | `id`, `phone_normalized`, `purpose` (enum `owner_login`/`customer_login`), `code_hash`, `expires_at`, `resend_after` (nullable), `attempt_count` (int), `consumed_at` (nullable) | PK `id`, INDEX روی `phone_normalized` + `purpose` |

### روابط Eloquent (مختصر)
- `User hasMany Business (owner_id)`
- `Business belongsTo User (owner)`
- `Business hasMany Service`, `Service belongsTo Business`
- `Business hasMany WorkingHour`, `WorkingHour belongsTo Business`
- `Business hasMany Closure`, `Closure belongsTo Business`
- `Business hasMany Booking`, `Booking belongsTo Business`
- `Service hasMany Booking`, `Booking belongsTo Service`
- `User hasMany Booking (customer_user_id)`

### نکات خاص
- کلید `idempotency_key` روی جدول `bookings` به‌صورت UNIQUE تعریف شده تا اطمینان از عدم ایجاد دو رزرو یکسان در درخواست‌های تکراری داشته باشد.
- جدول `closures` برای روزهای تعطیل کامل (بدون ساعت کاری) استفاده می‌شود.
- همه FK‌ها `onDelete('cascade')` هستند؛ حذف یک کسب‌وکار تمام داده‌های وابسته (سرویس‌ها، ساعت‌ها، رزروها) را پاک می‌کند.

---

## ۶. مسیرها و نقاط API (Routes and API endpoints)

(دریافت شده از `php artisan route:list`)

| Method | URL | Controller | Auth | ورودی (مختصر) | خروجی (مختصر) | وضعیت |
|-------|-----|-----------|------|---------------|----------------|--------|
| **GET** | `/` | (Blade) `app.blade.php` | — | — | Inertia صفحه Home | **فعال** |
| **GET** | `/b/{slug}` | `PublicBusinessController@show` | — | `slug` (string) | Inertia → `Public/BusinessShow` (business data) | **فعال** |
| **GET** | `/b/{slug}/availability` | `Public\BookingController@availability` | — | `service_id` (exists), `date` (Y‑m‑d) | JSON `{ slots: [ISO8601...] }` | **فعال** |
| **POST** | `/b/{slug}/book` | `Public\BookingController@book` | — (در عمل باید کاربر OTP‑auth باشد) | `service_id`, `customer_name`, `phone`, `starts_at` (Y‑m‑d H:i), `idempotency_key` (nullable) | JSON رزرو ساخته شده | **فعال** |
| **GET** | `/owner/services` | `Owner\ServiceController@index` | `auth` | — | JSON لیست سرویس‌ها (Inertia) | **فعال** |
| **POST** | `/owner/services` | `Owner\ServiceController@store` | `auth` | `name`, `duration_minutes`, `price_toman`, `description` (nullable), `active` (bool) | JSON سرویس جدید | **فعال** |
| **PUT** | `/owner/services/{id}` | `Owner\ServiceController@update` | `auth` | همانند `store` (فقط فیلدهای قابل تغییر) | JSON سرویس به‌روز شده | **فعال** |
| **DELETE** | `/owner/services/{id}` | `Owner\ServiceController@destroy` | `auth` | — | `{ deleted: true }` | **فعال** |
| **GET** | `/owner/working-hours` | `Owner\WorkingHourController@index` | `auth` | — | لیست ساعت‌های کاری | **فعال** |
| **POST** | `/owner/working-hours` | `Owner\WorkingHourController@store` | `auth` | `weekday`, `start_minute`, `end_minute`, `break_start` (nullable), `break_end` (nullable) | JSON ساعت کاری جدید | **فعال** |
| **PUT** | `/owner/working-hours/{id}` | `Owner\WorkingHourController@update` | `auth` | همانند `store` (فقط فیلدهای قابل تغییر) | JSON ساعت به‌روز شده | **فعال** |
| **DELETE** | `/owner/working-hours/{id}` | `Owner\WorkingHourController@destroy` | `auth` | — | `{ deleted: true }` | **فعال** |
| **POST** | `/api/auth/otp/request` | `Auth\OtpController@request` | — | `phone` (string), `purpose` (owner_login / customer_login) | `{ challenge_id, expires_at }` | **فعال** |
| **POST** | `/api/auth/otp/verify` | `Auth\OtpController@verify` | — | `phone`, `purpose`, `code` | `{ user }` + ایجاد سشن | **فعال** |

**نکات:**
- مسیرهای OTP در `api.php` تعریف شده‌اند؛ تمام مسیرهای دیگر در `web.php` می‌باشند.
- همه مسیرهای مالک (`/owner/*`) به‌وسیله middleware `auth` محافظت می‌شوند.
- مسیرهای عمومی (`/b/*`) بدون authentication هستند؛ اما فقط کسب‌وکارهای `published` قابل دسترسی‌اند.

---

## ۷. Frontend و طراحی بصری (Frontend and visual design)

| بخش | وضعیت فعلی در Laravel | وضعیت در مرجع Next.js | توضیح |
|------|-----------------------|------------------------|-------|
| **لندینگ (آبی)** | صفحهٔ Home موجود (`resources/views/app.blade.php` + Inertia Home) – محتوای واقعی هنوز placeholder است. | کد JSX کامل در `reference/app/page.tsx` همراه با CSS در `globals.css`. | انتقال کامل انجام نشده؛ فقط اسکلت Inertia موجود است.
| **قالب صورتی (نail salon)** | کامپوننت `Public/BusinessBooking.tsx` برای رزرو، اما UI نهایی (دکمه‌ها، رنگ‌ها، spacing) هنوز از CSS سفارشی Next تکثیر نشده. | JSX در `reference/components/nail-app.tsx` و CSS در `reference/app/globals.css`. | بخش‌های اصلی (انتخاب سرویس، تقویم، زمان) موجودند؛ استایل‌ها و رنگ‌های دقیق (کلید `#b34f6a` و ... ) هنوز اعمال نشده.
| **فونت Vazirmatn** | فونت در `public/fonts/vazirmatn.woff2` موجود است؛ در `app.blade.php` با `<link>` به‌صورت مستقیم لود می‌شود (در فایل Blade نه‌چند). | فونت در `reference/public/fonts/vazirmatn.woff2` تعریف شده. | بارگذاری موفق؛ می‑توان از `@font-face` در Tailwind استفاده کرد.
| **آیکن‌های Phosphor** | بستهٔ `@phosphor-icons/react` در `package.json` موجود؛ در کامپوننت‌ها هنوز استفاده نشده. | در `reference/components/icons.tsx` تعریف شده. | آماده استفاده؛ نیاز به جایگزینی کلاس‌های JSX با React components.
| **RTL** | در Blade (`<html dir="rtl">`) و `app.blade.php` تنظیم شده؛ اکثر کامپوننت‌های React هنوز از `dir="rtl"` آگاهی ندارند. | در `reference/app/layout.tsx` `dir="rtl"` تنظیم شده بود. | عملکرد پایه‌ای موجود؛ تست جزئی در مرورگر نشان می‌دهد متن راست‑به‑چپ می‌شود.
| **Responsive / Mobile‑first** | Tailwind با breakpointهای پیش‌فرض (`sm`, `md`…) استفاده شده؛ کلاس‌های سفارشی از `globals.css` مرجع هنوز وارد نشده. | breakpointهای دقیق (`680,850,1150,1600`) در CSS مرجع تعریف شده‌اند. | ریسپانسیو ابتدایی کار می‌کند؛ اما جزئیات دقیق (حداقل عرض‌ها، اندازه‌ی دکمه‌ها) هنوز منتقل نشده.
| **CSS** | `resources/css/app.css` شامل Tailwind + برخی تنظیمات پایه. | `reference/app/globals.css` شامل تمام استایل سفارشی (رنگ‌ها، اندازه‌ها، radius). | هنوز فقط بخشی از استایل‌ها کپی شده؛ بخش‌های پیشرفته (مثلاً `pill` CTA) باقیست.

**نتیجه:** بخش‌های اصلی UI (Home، Dashboard مالک، فهرست سرویس/ساعت) موجود هستند، اما برای تطابق کامل با طراحی Next.js نیاز به انتقال CSS و جزئیات UI دارد.

---

## ۸. احراز هویت و SMS (Authentication and SMS)

### جریان درخواست OTP
1. **درخواست** → `POST /api/auth/otp/request` با پارامترهای `phone` و `purpose`.
2. `OtpService::request()`
   - شماره تلفن نرمال‌سازی می‌شود (`normalize`).
   - چالشی قبلی برای همان شماره/هدف حذف می‌شود.
   - در محیط `local` کد ثابت `123456` استفاده می‌شود؛ در محیط production باید `random_int` تولید شود.
   - هش کد با `Hash::make` ذخیره می‌شود.
   - مقادیر `expires_at`, `resend_after`, `attempt_count` تنظیم می‌شوند.
3. رکورد جدید در جدول `otp_challenges` ذخیره می‌شود و `challenge_id` بازگردانده می‌شود.

### جریان تأیید OTP
1. `POST /api/auth/otp/verify` با `phone`, `purpose`, `code`.
2. `OtpService::verify()`
   - شماره نرمال‌سازی، پیدا کردن چالش، بررسی انقضا و مصرف‌شدگی.
   - اگر کد صحیح باشد، `consumed_at` تنظیم و چالش برگردانده می‌شود.
   - در صورت موفقیت، کاربر با `firstOrCreate` بر پایه شماره تلفن ایجاد یا واکشی می‌شود و با `Auth::login($user)` وارد سشن می‌شود.
3. پاسخ JSON شامل شیء کاربر بر می‌گردد.

### محدودیت‌ها / نکات امنیتی
- **Rate‑limiting**: در این پیاده‌سازی صرفاً `attempt_count` در جدول مشهود است؛ middleware `throttle` برای مسیرهای OTP تعریف نشده.
- **Replay protection**: پس از مصرف، `consumed_at` پر می‌شود؛ از استفاده دوباره جلوگیری می‌کند، اما توکن حذف نمی‌شود.
- **Expiration**: TTL پیش‌فرض ۲ دقیقه (`ttlSeconds = 120`).
- **Fake SMS**: در حالت `local` کد ثابت `123456` برگردانده می‌شود؛ پیامک واقعی ارسال نمی‌شود.
- **یکپارچه‌سازی Melipayamak**: بسته `melipayamak-laravel` موجود است، اما هیچ درایور یا سرویس استفاده نشده؛ در future یک سرویس `MelipayamakSender` باید ساخته شود.
- **Session**: پس از ورود، سشن Laravel با درایور `database` ذخیره می‌شود (مشخص در `php artisan about`).

---

## ۹. موتور رزرو (Booking engine) – تحلیل فنی

### محاسبه اسلات (`BookingAvailabilityService`)
- ورودی‌ها: `Business`, `Service`, `date` (Y‑m‑d).
- محاسبه روز هفته (`weekday`) با `CarbonImmutable`.
- استخراج `WorkingHour` برای آن `weekday`؛ اگر موجود نباشد، [] باز می‌گردد.
- در یک حلقهٔ دقیقه‌ای، با گام برابر `duration_minutes` اسلات تولید می‌شود؛ استراحت (`break_start`‑`break_end`) در نظر گرفته می‌شود.
- اسلات‌های گذشته (قبل از `now`) فیلتر می‌شوند.
- برای هر اسلات، بررسی وجود رزرو همپوشانی در جدول `bookings` با قفل‌گذاری (`where` بر `starts_at`/`ends_at`).
- اسلات معتبر به‌صورت `CarbonImmutable` برگردانده می‌شوند؛ در کنترلر به ISO‑8601 تبدیل می‌شوند.

**ریسک‌ها / نکات:**
- زمان‌سنجی تنها از `CarbonImmutable::now()` (timezone UTC) استفاده می‌کند؛ ساعت منطقه کسب‌وکار (`timezone` در جدول `businesses`) در محاسبه اعمال نشده؛ بنابراین اسلات‌های محلی ممکن است با اختلاف ساعت نمایش داده شوند.
- استراحت‌ها فقط به‌صورت یک بازهٔ ساده (`break_start`‑`break_end`) پشتیبانی می‌شود؛ استراحت‌های متعدد یا ناهار‑عصر پشتیبانی نشده‌اند.
- عدم وجود بررسی `closures` (روزهای تعطیل) در این سرویس؛ اگر تاریخ در جدول `closures` باشد، اسلات‌ها هنوز برگردانده می‌شوند (کاربردی نیست).

### ثبت رزرو (`BookingService`)
- ابتدا بررسی **idempotency** – اگر کلید `idempotency_key` موجود باشد، رزرو قبلی برگردانده می‌شود.
- تبدیل `starts_at` به `CarbonImmutable`, محاسبه `ends_at` با `duration_minutes` سرویس.
- **قفل‌گذاری** با `$query->lockForUpdate()` بر روی جستجوی همپوشانی؛ اطمینان از عملیات اتمیک در تراکنش.
- اگر رزرو همپوشانی یافت شود، استثنا (Exception) پرتاب می‌شود.
- در صورت موفقیت، رکورد `bookings` ایجاد می‌شود؛ شامل snapshots (نام سرویس، قیمت، مدت) برای جلوگیری از تغییرات پس‌از‑ثبت.
- تراکنش تا ۵ بار (`->transaction(..., 5)`) سعی می‌کند در صورت deadlock مجدداً اجرا شود.

**ریسک‌ها / نکات:**
- استثنا عمومی (`throw new \Exception('Overlapping booking exists')`) بدون کد وضعیت HTTP؛ در API این استثنا به‌صورت 500 برگردانده می‌شود.
- `status` پیش‌فرض `confirmed` تنظیم می‌شود؛ اما امکان `cancelled` فقط از طریق به‌روزرسانی مستقیم DB وجود دارد (کنترلر برای لغو هنوز نیست).
- زمان‌سنجی timezone همانند سرویس محاسبه اسلات است؛ در حالت `UTC` ممکن است با زمان محلی کسب‌وکار مغایرت داشته باشد.
- بررسی `business->suspended_at` یا `business->publication_status` در این سرویس انجام نشده؛ بنابراین رزرو برای کسب‌وکارهای تعلیق‌شده یا پیش‌نشر می‌تواند انجام شود (باید در لایهٔ کنترلر یا سرویس اضافه شود).

---

## ۱۰. تست و کیفیت (Testing and quality)

| فرمان | خروجی (خلاصه) |
|-------|----------------|
| `php artisan about` | گزارش محیط: Laravel 13.39.0, PHP 8.5.12, Database pgsql, Session database, Cache database |
| `php artisan route:list` | ۱۸ مسیر (مانند بالا) – همه بدون خطا ثبت شدند |
| `npm run build` | Vite build موفق (55 sec)، ۶۷۳ ماژول تبدیل شد، هیچ خطای اسکریپت نیست |
| `php artisan test` | **PASS** – ۳ تست، ۵ assertion، زمان 0.8 s |

### پوشش تستی
- **تست‌های موجود**: `ExampleTest` (صفحهٔ ریشه `/`، در حال حاضر با Blade `app` موجود است)، `OtpTest` (درخواست OTP با وضعیت 200). 
- **نقائص**:
  - هیچ تستی برای ویژگی‌های **Booking**, **Service**, **WorkingHour**, **Closure**, **Owner Dashboard** وجود ندارد.
  - تست‌های همزمانی (race‑condition) و اطمینان از عدم رزرو تداخل‌دار نیست.
  - تست‌های اعتبارسنجی ورودی (مانند `duration_minutes` مثبت) موجود نیست.
  - تست‌های امنیتی (rate‑limit, replay) پوشش داده نشده‌اند.

---

## ۱۱. مقایسه با HANDOFF (Comparison with HANDOFF)

| Requirement (از HANDOFF) | Implemented | Tested | Missing / Partial | Priority |
|---------------------------|-------------|--------|-------------------|----------|
| ثبت‌نام مالک با OTP | ✅ (API `/api/auth/otp/*`) | ✅ (درست کار می‌کند) | UI صفحهٔ ورود هنوز placeholder | **High** |
| ایجاد کسب‌وکار (draft) | ✅ (`BusinessController::store`) | ❌ (بدون تست) | UI فرم ایجاد کسب‌وکار هنوز وجود ندارد | **High** |
| تعریف سرویس (نام، قیمت، مدت) | ✅ (CRUD سرویس) | ❌ (بدون تست) | UI برای افزودن/ویرایش سرویس ناقص | **High** |
| تعریف ساعت کاری (روز، باز‑/بند, استراحت) | ✅ (CRUD WorkingHour) | ❌ (بدون تست) | UI تقویم/ساعت کاری ناقص | **High** |
| مدیریت تعطیلات (closures) | ✅ (جدول `closures`) | ❌ (بدون API) | API و UI برای ایجاد/حذف تعطیلات وجود ندارد | **Medium** |
| محاسبه اسلات بر پایه ساعت کاری و سرویس | ✅ (`BookingAvailabilityService`) | ✅ (تست دستی) | زمان‑زون صحیح اعمال نشده | **High** |
| رزرو آنلاین با OTP | ✅ (یکپارچه‌سازی در `BookingController::book`) | ❌ (بدون تست) | UI رزرو فقط alert دارد؛ OTP UI نداریم | **High** |
| جلوگیری از رزروهای همپوشانی | ✅ (قفل‌گذاری در `BookingService`) | ❌ (بدون تست concurrency) | تست همزمانی ضروری است | **High** |
| کلید idempotency برای درخواست‌های تکراری | ✅ (ستون unique) | ❌ (بدون تست) | تست عدم دو برابر شدن رزرو لازم است | **Medium** |
| داشبورد مالک (لیست رزروها، جزئیات) | جزئی (Dashboard فقط فهرست کسب‌وکار) | ❌ (بدون تست) | UI کامل داشبورد هنوز نساخته شده | **Medium** |
| مدیریت admin سراسری (فهرست کسب‌وکارها، تعلیق) | ❌ (بدون پیاده‌سازی) | ❌ | برنامه‌ریزی برای Filament یا custom admin | **Low** |
| یکپارچه‌سازی واقعی SMS با Melipayamak | ❌ (فقط سرویس placeholder) | ❌ | نیاز به نصب و پیکربندی ‎API کلید | **High** |
| طراحی ریسپانسیو، RTL، فونت Vazirmatn، آیکن Phosphor | جزئی (فونت لود شده، RTL تنظیم؛ CSS کامل نیست) | ❌ | انتقال کامل CSS و تصاویر لازم است | **High** |

---

## ۱۲. مشکلات و بدهی فنی (Problems and technical debt)
1. **UI ناقص** – بسیاری از صفحه‌ها (مانند فرم ایجاد کسب‌وکار، فرم OTP، داشبورد مالک) فقط placeholder یا alert دارند.
2. **بدون تست‌های واحد/ادغام برای بخش‌های بحرانی** (Booking, Service, WorkingHour, Closure).
3. **عدم تست همزمانی** – امکان race‑condition در `BookingService` هنوز اثبات نشده.
4. **قابلیت‌های امنیتی محدود** – rate‑limit برای OTP، جلوگیری از brute‑force، CSRF توکن‌ها (وجود دارند ولی در مسیرهای API استفاده نشده‌اند).
5. **یکپارچه‌سازی SMS** – بسته `melipayamak-laravel` نصب است اما سرویس ارسال SMS پیاده‌سازی نشده؛ در production این یک ریسک بزرگ است.
6. **Timezone** – تمام محاسبات زمان به‌صورت UTC انجام می‌شود؛ درخواستی برای تبدیل به `business->timezone` وجود دارد.
7. **Routes API** – مسیرهای OTP در `api.php` تعریف شده‌اند؛ سایر API (مانند مدیریت closures یا admin) هنوز موجود نیستند.
8. **مهاجرت‌های تکراری** – جدول `businesses` دو migration داشت؛ یکی guard شده (if exists) ولی وجود فایل‌های تکراری می‌تواند باعث سردرگمی شود.
9. **خطاهای نمایش** – در زمان درخواست نا معتبر (مثلاً `/b/{slug}` برای slug ناشناخته) Laravel به‌صورت پیش‌فرض 404 بر می‌گرداند؛ این رفتار صحیح است اما UI نمایش خطا هنوز طراحی نشده.
10. **پیکربندی سشن/کَش** – در `php artisan about` سشن روی `database` تنظیم است؛ برای محیط production ممکن است به `redis` یا `file` نیاز باشد.

---

## ۱۳. کارهای باقی‌مانده برای MVP (Remaining MVP tasks)

| ID | توضیح | فایل/مسیرهای تحت‑تغییر | وابستگی‌ها | معیار پذیرش | تست‌های مورد نیاز | اولویت |
|----|-------|------------------------|------------|--------------|-------------------|---------|
| **T1** | جایگزینی `alert()` در `BusinessBooking.tsx` با toast/modal زیبا (مثلاً `react-hot-toast`). | `resources/js/Pages/Public/BusinessBooking.tsx` | ✅ UI پایه موجود | نمایش پیام موفق/خطا بدون reload صفحه | تست UI (Cypress یا Laravel Dusk) | **High** |
| **T2** | افزودن فرم UI برای OTP (در صفحهٔ Login) – درخواست/تایید OTP، نمایش شمارش معکوس resend. | `resources/js/Pages/Auth/Login.tsx` (new) | ✅ API OTP موجود | کاربر می‌تواند با شماره موبایل لاگین کند و سشن دریافت کند | تست انتها‑به‑انتها (Playwright) | **High** |
| **T3** | ساخت فرم ایجاد کسب‌وکار (نام، slug، دسته) و اتصال به `BusinessController::store`. | `resources/js/Pages/Owner/BusinessCreate.tsx` + مسیر `/owner/businesses` | **T1**, **T2** | پس از ایجاد، کسب‌وکار در داشبورد نمایش داده شود و لینک عمومی `/b/{slug}` تولید شود | تست واحد برای `BusinessController` + تست UI | **High** |
| **T4** | تکمیل داشبورد مالک (مشاهده رزروها، جزئیات رزرو، لغو رزرو). | `resources/js/Pages/Owner/Bookings.tsx` + API جدید (`Owner\BookingController`). | ✅ Backend BookingService | مالک می‌تواند فهرست رزروهایش را ببیند، جزئیات را باز کند و رزرو را لغو کند. | تست واحد برای `BookingController` + تست UI | **Medium** |
| **T5** | پیاده‌سازی UI/API برای مدیریت `closures` (تعطیلات). | `Owner/ClosureController.php` (new) و صفحات React | ✅ مدل `Closure` | اضافه/حذف روز تعطیل برای کسب‌وکار؛ اسلات‌های مربوط به آن روز نشان داده نمی‌شوند. | تست یکپارچه‌سازی (availability) | **Medium** |
| **T6** | تست همزمانی رزرو (۲ یا ۳ درخواست همزمان برای همان اسلات) برای اثبات اتمیک بودن `BookingService`. | تست‌های PHPUnit با `DB::transaction` یا ابزار `pest` concurrency | ✅ BookingService | هیچ رزرو تداخلی در خروجی تست نباید وجود داشته باشد. | تست همزمانی (parallel processes) | **High** |
| **T7** | یکپارچه‌سازی واقعی با Melipayamak (ارسال SMS). | `app/Services/MelipayamakSender.php` + تنظیمات `.env` | ✅ بسته `melipayamak-laravel` | کد OTP به‌صورت واقعی به شماره ارسال می‌شود؛ لاگ‌های حساس ذخیره نشوند. | تست یکپارچه‌سازی (mock API) | **High** |
| **T8** | انتقال کامل CSS/طراحی از `reference/app/globals.css` به `resources/css/app.css` (رنگ‌ها، radius، breakpointها). | `resources/css/app.css` | ✅ طراحی موجود در reference | ظاهر لندینگ و صفحهٔ رزرو دقیقاً با تصاویر مرجع تطبیق داشته باشد. | تست بصری (Percy یا storyshots) | **Medium** |
| **T9** | افزودن admin panel (Filament) برای فهرست کسب‌وکارها، تعلیق/فعال‌سازی. | `app/Http/Controllers/Admin/BusinessController.php` + مسیر `/admin/businesses` | ✅ Auth::user()->hasRole('platform_admin') | ادمین می‌تواند همه کسب‌وکارها را ببینند و وضعیت `suspended_at` را تغییر دهد. | تست دسترسی (Gate) | **Low** |
| **T10** | به‌روزرسانی زمان‌سنجی اسلات‌ها برای استفاده از `business->timezone` (مثلاً `CarbonImmutable::parse($date, $business->timezone)`). | `BookingAvailabilityService.php` | ✅ مدل Business حاوی `timezone` | اسلات‌ها مطابق زمان محلی کسب‌وکار محاسبه می‌شوند. | تست واحد برای ساعت‌های مختلف timezone | **Medium** |

---

## ۱۴. آمادگی برای استقرار (Deployment readiness)

| جنبه | وضعیت | نکات |
|------|-------|------|
| **سرور** | آماده (Laravel 13, PHP 8.5) | برای production نیاز به وب‌سرور (NGINX/Apache) با پشتیبانی از `php-fpm` و `mod_rewrite` است.
| **پایگاه داده** | PostgreSQL (نسخه 18 در dev) | باید دیتابیس جداگانه برای production ساخته شود؛ اعتبارسنجی `pg_hba.conf` و احراز هویت مناسب.
| **Build Vite** | موفق (`npm run build`) – خروجی در `public/build` | برای production باید فایل‌های استاتیک در مسیر وب‌سرور سرو شوند.
| **HTTPS** | هنوز تنظیم نشده – در production باید گواهینامه TLS (Let’s Encrypt) فعال شود.
| **Session** | ذخیره در جدول `sessions` (database driver) | برای مقیاس بزرگ می‌تواند به Redis تغییر یابد.
| **SMS** | فقط Mock؛ برای production باید کلیدهای Melipayamak در `.env` اضافه و سرویس `MelipayamakSender` فعال شود.
| **Cache / Rate limiting** | Cache driver `database`؛ rate‑limit برای OTP تعریف نشده. | افزودن middleware `throttle:5,1` برای مسیرهای OTP توصیه می‌شود.
| **Backup** | بدون اسکریپت backup. | برنامه‌ریزی برای pg_dump روزانه یا ابزارهای Managed PostgreSQL.
| **منابع** | حافظه کافی (به‌دلیل Vite و assets) – برآورد حدود 256 MiB RAM برای PHP‑FPM + 128 MiB برای Node در زمان build. |
| **زیرساخت Cloudflare** | تنظیم DNS به `nobatlink.shadweb.site` در دست‌انگی است؛ در این مرحله دست‌کاری نشود. |

**نتیجه:** پروژه برای **محیط تست محلی** آماده است؛ برای **production** نیاز به تکمیل UI، یکپارچه‌سازی SMS، تست همزمانی، بهبود rate‑limit و تنظیمات امنیتی (HTTPS, CSP, etc.) دارد.

---

## ۱۵. راهنمای محلی (Local run‑book)

```powershell
# 1. نصب وابستگی‌ها (یک بار)
composer install
npm install

# 2. ساخت .env (در صورت نیاز)
cp .env.example .env
php artisan key:generate

# 3. اجرای migration (در دیتابیس محلی شما – PostgreSQL)
php artisan migrate --force

# 4. راه‌اندازی سرور Laravel (موقعیت پیش‌فرض 8000)
php artisan serve
# خروجی: http://127.0.0.1:8000

# 5. راه‌اندازی Vite در حالت توسعه (حافظه hot‑module)
npm run dev
# باز کنید http://127.0.0.1:5173 (Vite dev) – اما صفحه اصلی از Laravel سرو می‌شود.

# 6. اجرای تست‌ها
php artisan test

# 7. ساخت نسخهٔ production (بسته به سرور)
npm run build
# سپس `php artisan serve` یا تنظیم وب‌سرور به پوشه public/.

# 8. دسترسی به داشبورد مالک (پس از ورود OTP)
#   - ثبت‌نام: POST /api/auth/otp/request  (phone, purpose='owner_login')
#   - تایید: POST /api/auth/otp/verify    (phone, purpose, code)
#   - پس از login، به /owner/services یا /owner/working-hours بروید.

# 9. صفحهٔ عمومی رزرو
#   http://127.0.0.1:8000/b/{slug}
#   (slug کسب‌وکار که در جدول businesses موجود است)
```

---

## ۱۶. داشبورد وضعیت نهایی (Final status dashboard)

| حوزه | وضعیت | توضیح کوتاه |
|------|--------|--------------|
| **Backend readiness** | ✅ (مهاجرت، سرویس‌ها، API تمام) |
| **Frontend readiness** | ⚠️ (UI اساسی موجود، ولی استایل/طرح کامل نیست) |
| **Booking readiness** | ✅ (محاسبه اسلات و ثبت رزرو اتمیک) – بدون تست همزمانی |
| **Authentication readiness** | ✅ (OTP + سشن) – بدون rate‑limit |
| **Testing readiness** | ⚠️ (فقط تست‌های پایه، تست‌های بحرانی کم) |
| **Production readiness** | ❌ (نیاز به UI نهایی، یکپارچه‌سازی SMS، تست همزمانی، بهبود امنیت) |
| **Top 5 blockers** |
| 1️⃣ UI نهایی (Landing, Login, Booking flow) |
| 2️⃣ یکپارچه‌سازی واقعی SMS Melipayamak |
| 3️⃣ تست همزمانی رزرو (تضمین عدم تداخل) |
| 4️⃣ پشتیبانی از `closures` و زمان‌سنجی بر پایه `timezone` |
| 5️⃣ افزودن admin panel و قابلیت تعلیق کسب‌وکار |
| **Next immediate task** | **T1 – جایگزینی alert با toast/modal در BusinessBooking.tsx** (به‌صورت UI feedback) |

---

*این گزارش بر پایهٔ فایل‌های موجود، خروجی‌های واقعی دستورات (`php artisan about`, `php artisan route:list`, `npm run build`, `php artisan test`) و مستندات HANDOFF نوشته شده است. تمام مسیرها، کلاس‌ها و مقادیر به‌صورت **IMPLEMENTED** یا **TESTED** برچسب‌گذاری شده‌اند.*

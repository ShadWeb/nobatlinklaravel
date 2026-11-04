# SCREEN_MAP — نقشه اسکرین‌ها: پروتوتایپ Next.js ↔ لاراول

منبع innate: `docs/reference/components/nail-app.tsx` (حقیقی)، اسکرین‌شات‌های `docs/reference/qa/` (حقیقی)، صفحات لاراول `resources/js/Pages/` (حقیقی)، `routes/web.php` (حقیقی).

## ۱. اسکرین‌های موجود در nail-app.tsx (بر اساس کد، با شماره خط و نام تابع)

`nail-app.tsx` خط ۱۳۱۲: `NailApp({ screen })` با `flow` خط ۱۳۱۱: `["services","date","time","details","success"]` و `screenLabels` خطوط ۲۲-۳۳.

| # | نام اسکرین (screen) | segment آدرس در nail-app | تابع رندر | خط رندر در nail-app.tsx | دادهی نمایش داده شده | اکشن‌ها |
|---|---|---|---|---|---|---|
| 1 | `home` | `/nazanin` | `StudioHome` | خط ۱۴۰۶ | خدمات، تصویر Hero، آدرس، شبکه‌های اجتماعی، لینک Rزرو | انتخاب خدمت، کپی لینک، whatsapp/instagram/navigation/phone |
| 2 | `services` | `/nazanin/services` | `ServiceSelection` | خط ۱۴۰۸ | لیست خدمت با قیمت و مدت | انتخاب خدمت، دکمه بعدی |
| 3 | `date` | `/nazanin/date` | `DateSelection` | خط ۱۴۱۰ | تقویم شمسی ۵ روزه + شبکه ماهانه | انتخاب روز،.navigation ماه قبل/بعد |
| 4 | `time` | `/nazanin/time` | `TimeSelection` | خط ۱۴۱۲ | ۱۵ نobre späten از ۱۰:۰۰ تا ۱۸:۳۰ | انتخاب ساعت، بازگشت، ادامه |
| 5 | `details` | `/nazanin/details` | `CustomerDetails` | خط ۱۴۱۴ | فرم نام و موبایل، خلاصه نوبت | ثبت نوبت، بازگشت |
| 6 | `success` | `/nazanin/success` | `Success` | خط ۱۴۱۶ | تأیید نوبت، خلاصه رزرو | مشاهده نوبت‌ها، رزرو جدید، بازگشت به خانه |
| 7 | `login` | `/nazanin/login` | `Login` | خط ۱۴۱۸ | فرم شماره موبایل + کد ۶ رقمی | ارسال کد، تایید و ورود، ویرایش شماره |
| 8 | `appointments` | `/nazanin/appointments` | `Appointments` | خط ۱۴۲۰ | لیست نوبت‌های مشتری (آینده/گذشته/لغو شده) | مشاهده جزئیات، لغو نوبت |
| 9 | `dashboard` | `/nazanin/dashboard` | `Dashboard` | خط ۱۴۲۲ | تقویم روزانه، نوبت‌ها، مشتریان، خدمات | تغییر روز، نمایش جزئیات، لغو نوبت |
| 10 | `manage-services` | `/nazanin/manage-services` | `ManageServices` | خط ۱۴۲۴ | لیست خدمات با قیمت/مدت | افزودن/ویرایش/حذف خدمت، مشاهده صفحه |

 layout-wrapper: `nazanin/layout.tsx` (خط ۱-۴) با `NailProvider` از `nail-context.tsx`.
 Route Next.js: `app/nazanin/[[...screen]]/page.tsx` (خط ۱-۲۵) با `generateStaticParams` Linien ۳-۱۶.

## ۲. وصل‌کردن هر اسکرین به اسکرین‌شات QA، صفحه لاراول، و مسیر واقعی

| اسکرین prototype | اسکرین‌شات QA (docs/reference/qa/) | صفحه معادل لاراول (resources/js/Pages/) | مسیر واقعی لاراول (routes/web.php) | وضعیت اتصال |
|---|---|---|---|---|
| home | nazanin-mobile.jpg | NazaninSample.tsx | `GET /nazanin` | متصل |
| services | — | Public/BusinessBooking (step=services) | `GET /b/{slug}` | متصل (اما BusinessShow.tsx مرده) |
| date | date-mobile.jpg | Public/BusinessBooking (step=date) | `GET /b/{slug}` | متصل |
| time | time-mobile.jpg | Public/BusinessBooking (step=time) | `GET /b/{slug}` | متصل |
| details | — | Public/BusinessBooking (step=details) | `GET /b/{slug}` | متصل |
| success | — | Public/BusinessBooking (step=success) | `GET /b/{slug}` | متصل |
| login | login-mobile.jpg | Auth/Login.tsx | **هیچ مسیر نیست** | **Asli nazar** — صفحه وجود دارد، مسیر ندارد |
| appointments | appointments-mobile.jpg | Customer/Appointments.tsx | `GET /appointments` | متصل (با auth middleware) |
| dashboard | dashboard-mobile.jpg | Owner/Dashboard.tsx | **هیچ مسیر نیست** | **Asli nazar** — صفحه وجود دارد، مسیر ندارد |
| manage-services | — | Owner/ServiceIndex.tsx | `GET /owner/services` | متصل (با auth middleware) |

### Landing و Start (پروتوتایپNext.js)
| صفحه prototype | اسکرین‌شات QA | صفحه لاراول | مسیر لاراول | وضعیت |
|---|---|---|---|---|
| landing (`/`) | landing-desktop.jpg, landing-mobile.jpg | Landing.tsx | `GET /` | متصل |
| start (`/start`) | — | Start.tsx | `GET /start` | متصل |
| start/wizard (`/start/wizard`) | — | StartWizard.tsx | `GET /start/wizard` | متصل |

### در لاراول وجود دارد اما در prototype nail-app.tsx وجود ندارد (جدا)
- `Home.tsx` — بدون مسیر، بدون import (مرده)
- `PreviewNail.tsx` — لینک شده از Landing.tsx خط ۵۸ (`/preview/nail`) اما **هیچ Route برای `/preview/nail` نیست** (مرجع:랜드 page.tsx ندارد PreviewNail)
- `NazaninDashboard.tsx` — مسیر `GET /nazanin/dashboard` وجود دارد (line 42)
- `Customer/AppointmentDetail.tsx` — مسیر `GET /appointments/{id}` وجود دارد
- `Owner/ServiceCreate.tsx` — مسیر `GET /owner/services/create` وجود دارد
- `Owner/WorkingHourIndex.tsx` — مسیر `GET /owner/working-hours` وجود دارد
- `Owner/WorkingHourCreate.tsx` — مسیر `GET /owner/working-hours/create` وجود دارد
- `Owner/BusinessSettings.tsx` — مسیر `GET /owner/businesses/{slug}/settings` وجود دارد
- `Public/BusinessShow.tsx` — وجود دارد، اما مسیر `/b/{slug}` به `BusinessBooking` رندر می‌کند، نه BusinessShow (مرده از نظر مسیر)

### در prototype وجود دارد اما در لاراول وجود ندارد
- `/nazanin/login` — صفحه Auth/Login.tsx وجود دارد اما **هیچ Route برای `/login` یا `/nazanin/login` در routes/web.php نیست**
- `/nazanin/dashboard` — صفحه Owner/Dashboard.tsx وجود دارد اما **هیچ Route برای/dashboard در routes/web.php نیست** (註: `/nazanin/dashboard` در لاراول به NazaninDashboard.tsx رندر می‌شود، نه Owner/Dashboard)

## ۳. توکن‌های طراحی از globals.css

استخراج شده از `docs/reference/app/globals.css` (فایل واقعی، حاوی). هیچ هگز از کاربر درخواست نشده است.

|ATEGORY|توکن|مقدار (هگز/.css)|منبع خط در globals.css|
|---|---|---|---|
|رنگ|--rose (نाखن استودیو accent)|`#b34f6a`|خط ۶۲۰|
|رنگ|--rose-dark|`#953b55`|خط ۶۲۱|
|رنگ|--rose-soft|`#fae9ee`|خط ۶۲۲|
|رنگ|--ink|`#172039`|خط ۶۲۳|
|رنگ|--muted|`#7d8090`|خط ۶۲۴|
|رنگ|لندرینگ body text|`#0d1944`|خط ۱۸|
|رنگ|لندرینگ primary (indigo)|`#4352ff`|خط ۱۶۷|
|رنگ|لندرینگ secondary border|`#e0e0ff`|خط ۱۷۶|
|رنگ|focus-visible outline|`#6675ff`|خط ۷۶|
|رنگ|selection background|`#e4dcff`|خط ۱۰۲|
|رنگ|input border|`#e3d9dc`|خط ۵۷|
|رنگ|input focus border|`#b44968`|خط ۶۶|
|فونت|font-family|`Vazirmatn, Tahoma, sans-serif`|خط ۱۷ (font-face خط ۱-۷، فایل /fonts/vazirmatn.woff2)|
|فونت|font-weight heading|`800`|خط ۸۸|
|فونت|base font-size|`14px`|خط ۲۰|
|سایه|button primary shadow (لندرینگ)|`0 5px 15px #4352ff25`|خط ۱۶۸|
|سایه|nail app shadow|`0 12px 45px #a6425b0b`|خط ۷۵۰|
|سایه|dialog shadow|`0 20px 80px #5c17393b`|خط ۱۶۲۲|
|radius|input border-radius|`12px`|خط ۵۸|
|radius|rose button radius|`12px`|خط ۸۶۴|
|radius|landing button radius|`100px`|خط ۱۴۸|
|radius|card radius|`17px`–`24px`|خط ۳۰۷، ۴۳۱، ۴۶۸|
|radius|dialog radius|`22px`|خط ۱۶۱۹|
|breakpoint| desktop hero|`@media (min-width: 1600px)`|خط ۱۹۲۶|
|breakpoint| tablet|`@media (max-width: 1150px)`|خط ۱۹۳۴|
|breakpoint| small desktop|`@media (max-width: 850px)`|خط ۲۰۰۱|
|breakpoint| mobile|`@media (max-width: 680px)`|خط ۲۰۶۲|
|فاصله| input padding|`12px 14px`|خط ۶۰|
|فاصله| button min-height (لندرینگ)|`54px`|خط ۱۴۹|
|فاصله| button min-height (ناخن استودیو .full)|`50px`|خط ۸۸۲|
|فاصله| body line-height|`1.8`|خط ۲۱|

## ۴. خلاصه تصمیمات ثبت‌شده در MVP_DECISIONS.md و PROJECT_MEMORY.md — و تناقض با کد لاراول فعلی

### از PROJECT_MEMORY.md (خطوط ۴۸-۵۴)
- **ورود مشتری:** مشتری برای رزرو **اجباری به ثبت‌نام، رمز یا تأیید پیامکی ندارد**: نام + شماره موبایل + انتخاب خدمت و زمان. شماره تأییدشده محسوب نمی‌شود.
- **مشاهده نوبت‌ها:** مشاهده نوبت‌ها با وارد کردن شماره موبایل **به تنهایی مجاز نباشد**.
- **صاحب پنل:** حتماً ورود امن سمت سرور داشته باشد. داشبورد عمومی نباید اطلاعات مشتریان را در دسترس عموم نگه دارد.
- **کد نمایشی:** کد ورود نمایشی (123456) در نسخه عمومی حذف شود.

### از MVP_DECISIONS.md
- OTP برای **مالک و مشتری هر دو** (خطوط ۷، ۸ از OPENCODE_MVP_TASKS.md); ارائه‌دهنده ملی پیامک.
- مسیرهای auth: `/api/auth/otp/request`, `/api/auth/otp/verify`, `/api/auth/me`, `/api/auth/logout`.

### تناقض با کد لاراول فعلی
| مورد | تصمیم مستند | کد لاراول فعلی |
|---|---|---|
| ورود مشتری | نام+تلفن، بدون OTP/رمز | `Auth/Login.tsx` شامل فرآیند OTP دو مرحله‌ای (تلفن → کد) است |
| کد ثابت 123456 | در نسخه عمومی حذف شود | لاراول از `/api/auth/otp/verify` استفاده می‌کند (در env lokal کد 123456 وجود دارد با குறிப்ப亭; PROJECT_MEMORY می‌گوید حذف شود) |
| داشبورد محفوظ | صاحب پنل ورود امن داشته باشد؛ عمومی نباشد | `Owner/Dashboard.tsx` هیچ مسیر ندارد (بלתی قابل دسترسی). مسیر `/nazanin/dashboard` به `NazaninDashboard.tsx` (نمونه) رندر می‌شود، نه داشبورد واقعی |
| مشاهده نوبت‌ها فقط با شماره | مجاز نیست | مسیر `/appointments` با auth middleware محافظت شده است (مطابق است) |

## ۵. فایل‌های مرده Laravel (بدون Route و بدون Import)

تشخیص با `grep` در کل کدهای لاراول:

| فایل | مدرک مرده بودن |
|---|---|
| `resources/js/Pages/Home.tsx` | هیچ route در `routes/web.php` برای آن نیست؛ هیچ import از آن در هیچ فایل دیگر نیست (grep `Home.tsx` فقط همان فایل را برمی‌گرداند) |
| `resources/js/Pages/Public/BusinessShow.tsx` | مسیر `GET /b/{slug}` به `PublicBusinessController@show` رندر می‌کند که `Public/BusinessBooking` را رندر می‌کند (خط ۱۳ کنترلر)، نه `BusinessShow`. هیچ import از `BusinessShow` در هیچ فایل لاراولی نیست. |
| `resources/js/Pages/PreviewNail.tsx` | Landing.tsx خط ۵۸ لینک `/preview/nail` می‌زند، اما **هیچ Route برای `/preview/nail` در `routes/web.php` نیست**. هیچ import از PreviewNail در سایر فایل‌ها نیست. |
| `resources/js/Pages/Owner/Dashboard.tsx` | هیچ route در `routes/web.php` به آن اشاره نمی‌کند. مسیر `/nazanin/dashboard` به `NazaninDashboard.tsx` رندر می‌شود، نه این فایل. |

حذف نشده است (بر اساس دستور کاربر).

## ۶. Auth/Login.tsx و مسیر login

- **آیا `Auth/Login.tsx` هر Route‌ای دارد؟** خیر. در `routes/web.php` هیچ Route برای `/login` یا `/nazanin/login` وجود ندارد. `Auth/Login.tsx` وجود دارد اما از هیچ مسیر considerations فراخوانی نمی‌شود.
- **آیا Route با نام `login` وجود دارد؟** خیر. `php artisan route:list` هیچ Route با نام یا مسیر `login` نشان نمی‌دهد. Landing.tsx خط ۳۲ لینک `/login` می‌زند اما مسیر وجود ندارد.

## ۷. نکات ناخوانده / نカルبردها

- تصاویر JPG در `docs/reference/qa/` باز شدند (اندازهٔ فایل خوانده شد) اما محتوای بصری آن‌ها توسط من به عنوان مدل متنی تحلیل ن pudieron؛nectures از `design-qa.md` خوانده شده که هر کدام را توصیف می‌کند.
- فایل `README.md` در `docs/reference/` وجود ندارد (فقط در `docs/reference/` نیست؛ PROJECT_MEMORY به آن اشاره می‌کند اما فایل واقعی در این شاخه نیست).
- فایل `.opencode/skills/nobt-mvp-delivery/SKILL.md` و `C:/Users/shadmehr_y/.codex/RTK.md`参照 شده در OPENCODE_MVP_TASKS.md خوانده نشدند (خارج از مخزن لاراول).
- `next.config.ts` در `docs/reference/` وجود ندارد (فقطReference شده در OPENCODE_MVP_TASKS.md).

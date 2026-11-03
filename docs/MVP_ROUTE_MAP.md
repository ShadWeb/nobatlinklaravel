# MVP_ROUTE_MAP.md

این فایل به‌صورت خلاصه مسیرهای عمومی، مالک و admin را برای سشن‌های بعدی (S1‑S7) فهرست می‌کند.

## Public routes
- `GET /` – صفحهٔ خانه (Inertia Home)
- `GET /b/{slug}` – نمایش صفحهٔ عمومی کسب‌وکار (پیش‌نشر)
- `GET /b/{slug}/availability` – دریافت اسلات‌های موجود (پارامترهای `service_id` و `date` در query)
- `POST /b/{slug}/book` – ثبت رزرو آنلاین (بدون auth، اما انتظار دارد کاربر OTP‑auth باشد)
- `GET /b/{slug}/booking` – جزئیات رزرو (فقط جهت نمایش در UI)

## OTP API (در `api.php`)
- `POST /api/auth/otp/request` – ارسال OTP برای هدف `owner_login` یا `customer_login`
- `POST /api/auth/otp/verify` – تایید OTP و ایجاد سشن

## Owner routes (مستقلاً protected by `auth` middleware)
- `GET /owner/services` – فهرست سرویس‌های مالک
- `POST /owner/services` – افزودن سرویس
- `PUT /owner/services/{id}` – به‌روزرسانی سرویس
- `DELETE /owner/services/{id}` – حذف سرویس
- `GET /owner/working-hours` – فهرست ساعات کاری
- `POST /owner/working-hours` – افزودن ساعت کاری
- `PUT /owner/working-hours/{id}` – به‌روزرسانی ساعت کاری
- `DELETE /owner/working-hours/{id}` – حذف ساعت کاری
- *(در آینده)* `GET /owner/dashboard` – داشبورد مالک (لیست رزروها، مدیریت)

## Admin routes (نقش platform_admin)
- `GET /admin/businesses` – فهرست همه کسب‌وکارها (فقط برای admin)
- `POST /admin/businesses/{id}/suspend` – تعلیق کسب‌وکار
- `POST /admin/businesses/{id}/activate` – فعال‌سازی مجدد

## نکات مهم
- تمام مسیرهای Owner نیاز به سشن معتبر (`web` guard) و CSRF دارند.
- مسیرهای OTP در `api.php` به‌صورت stateless هستند؛ از middleware `throttle` باید استفاده شود (در S1 تنظیم می‌شود).
- مسیرهای Public بدون auth هستند، اما باید بررسی مالکیت Business (`published`) را انجام دهند.
- مسیرهای admin فقط برای کاربران با `platform_role = platform_admin` در جدول `users` مجاز هستند.

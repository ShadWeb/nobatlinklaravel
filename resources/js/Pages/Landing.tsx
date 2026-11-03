import { Link } from '@inertiajs/react';
import Icon from '../Components/Icon';

export default function Landing() {
  return (
    <main className="landing">
      <header className="site-header wrap">
        <Link href="/" className="brand">
          <span className="brand-icon">
            <Icon name="calendar" size={31} />
          </span>
          نوبت‌لینک
        </Link>
        <nav aria-label="منوی اصلی">
          <a href="#features">امکانات</a>
          <a href="#how-it-works">چطور کار می‌کند؟</a>
          <a href="#pricing">قیمت‌ها</a>
          <Link href="/login">ورود</Link>
        </nav>
        <Link className="button primary header-cta" href="/start">
          ساخت صفحه رزرو رایگان
          <Icon name="arrow" size={18} />
        </Link>
      </header>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">راه‌حل ساده برای رزرو نوبت آنلاین</span>
            <h1>
              صفحه رزرو اختصاصی شما،
              <br />
              <em>بدون نیاز به سایت</em>
            </h1>
            <p>
              لینکت رو به مشتری بده، زمان آزاد رو انتخاب کنه و نوبتش ثبت بشه.
              <br />
              مناسب هر کسی که به رزرو وقت نیاز داره؛ سریع، ساده و حرفه‌ای.
            </p>
            <div className="hero-actions">
              <Link className="button primary" href="/start">
                ساخت صفحه رزرو
                <Icon name="arrow" />
              </Link>
              <Link className="button secondary" href="/preview/nail">
                مشاهده نمونه
              </Link>
            </div>
            <div className="hero-benefits">
              <span>
                <Icon name="bolt" size={19} />
                راه‌اندازی در چند دقیقه
              </span>
              <span>
                <Icon name="link" size={19} />
                لینک اختصاصی هر نفر
              </span>
              <span>
                <Icon name="settings" size={19} />
                بدون نیاز به دانش فنی
              </span>
            </div>
          </div>
          <div className="hero-art">
            <img src="/images/booking-hero.webp" alt="نمونه صفحه شخصی و تقویم رزرو آنلاین در تلفن همراه" loading="lazy" />
            <span className="hero-caption">
              لینک اختصاصی شما
              <br />
              <b dir="ltr">site.ir/ali</b>
            </span>
          </div>
        </div>
      </section>
      {/* Other sections omitted for brevity */}
    </main>
  );
}

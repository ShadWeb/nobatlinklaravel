import Link from "next/link";
import Icon, { type IconName } from "../components/icons";
const categories = [
  {
    name: "زیبایی",
    sub: "ناخن، پوست، مو و ...",
    image: "nails-hero.webp",
    active: true,
  },
  { name: "مشاوره", sub: "روانشناس، مشاور فردی", image: "consulting.jpg" },
  { name: "وکالت", sub: "مشاوره حقوقی، وکیل", image: "law.jpg" },
  { name: "آموزش", sub: "معلم، مدرس، کلاس خصوصی", image: "education.jpg" },
  {
    name: "ورزش و تناسب اندام",
    sub: "مربی شخصی، باشگاه",
    image: "fitness.jpg",
  },
];
const features: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "link",
    title: "لینک اختصاصی",
    body: "هر نفر یک صفحه اختصاصی مثل site.ir/nazanin خواهد داشت.",
  },
  {
    icon: "chart",
    title: "داشبورد مدیریت",
    body: "مشاهده و مدیریت نوبت‌ها، خدمات و تنظیمات.",
  },
  {
    icon: "calendar",
    title: "تقویم و ساعت‌های آزاد",
    body: "تعریف روزها و ساعت‌های کاری و نمایش زمان‌های قابل رزرو.",
  },
  {
    icon: "user",
    title: "ثبت نام و شماره مشتری",
    body: "مشتری با نام و شماره موبایل نوبت خود را ثبت می‌کند.",
  },
];
export default function Home() {
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
          <Link href="/nazanin/login">ورود</Link>
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
              <Link className="button secondary" href="/nazanin">
                <Icon name="play" />
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
            <img
              src="/images/booking-hero.webp"
              alt="نمونه صفحه شخصی و تقویم رزرو آنلاین در تلفن همراه"
              fetchPriority="high"
            />
            <span className="hero-caption">
              لینک اختصاصی شما
              <br />
              <b dir="ltr">site.ir/ali</b>
            </span>
          </div>
        </div>
      </section>
      <section className="section categories wrap" id="templates">
        <div className="section-heading">
          <h2>مناسب برای انواع کسب‌وکارها</h2>
          <p>
            هر حرفه‌ای که نیاز به رزرو نوبت دارد، می‌تواند در چند دقیقه صفحه
            اختصاصی خود را بسازد.
          </p>
        </div>
        <div className="category-grid">
          {categories.map((c) =>
            c.active ? (
              <Link href="/nazanin" className="category-card" key={c.name}>
                <img src={"/images/" + c.image} alt="خدمات زیبایی و ناخن" />
                <div>
                  <h3>{c.name}</h3>
                  <p>{c.sub}</p>
                </div>
              </Link>
            ) : (
              <div className="category-card upcoming-category" key={c.name}>
                <img src={"/images/" + c.image} alt={c.name} loading="lazy" />
                <div>
                  <h3>{c.name}</h3>
                  <p>{c.sub}</p>
                </div>
                <span className="category-soon">به‌زودی</span>
              </div>
            ),
          )}
          <div className="category-card other-category">
            <div className="other-art">
              <Icon name="dots" size={36} />
            </div>
            <div>
              <h3>سایر خدمات</h3>
              <p>و خدمات شخصی دیگر</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section wrap" id="how-it-works">
        <div className="section-heading">
          <h2>چطور کار می‌کند؟</h2>
          <p>راه‌اندازی صفحه رزرو شما در ۳ مرحله ساده</p>
        </div>
        <div className="steps-strip">
          {[
            {
              icon: "user",
              title: "صفحه‌ات رو بساز",
              body: "اطلاعات، خدمات و ساعات کاری خود را در چند دقیقه وارد کنید.",
            },
            {
              icon: "share",
              title: "لینکت رو منتشر کن",
              body: "لینک اختصاصی رزرو را در اینستاگرام، واتساپ یا هر جایی که می‌خواهید قرار دهید.",
            },
            {
              icon: "calendar",
              title: "نوبت‌هات رو مدیریت کن",
              body: "مشتریان زمان آزاد را انتخاب می‌کنند و نوبت‌ها در داشبورد شما ثبت می‌شود.",
            },
          ].map((s, i) => (
            <div className="step-item" key={s.title}>
              <span className="step-number">{["۱", "۲", "۳"][i]}</span>
              <span className="icon-tile">
                <Icon name={s.icon as IconName} size={35} />
              </span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
              {i < 2 && <Icon name="left" className="step-chevron" />}
            </div>
          ))}
        </div>
      </section>
      <section className="section wrap" id="features">
        <div className="section-heading">
          <h2>امکانات فعلی</h2>
          <p>
            در نسخه فعلی فقط رزرو آنلاین نوبت ارائه می‌شود. سایر امکانات در
            به‌روزرسانی‌های بعدی اضافه خواهند شد.
          </p>
        </div>
        <div className="feature-grid">
          {features.map((f) => (
            <article className="feature-card" key={f.title}>
              <span className="icon-tile">
                <Icon name={f.icon} size={31} />
              </span>
              <div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section wrap future">
        <div className="section-heading">
          <h2>امکانات در به‌روزرسانی‌های بعدی</h2>
          <p>
            این امکانات فعلاً فعال نیستند و در نسخه‌های بعدی اضافه خواهند شد.
          </p>
        </div>
        <div className="future-grid">
          <article className="future-card amber">
            <span className="icon-tile">
              <Icon name="bell" size={32} />
            </span>
            <div>
              <h3>پیامک یادآوری</h3>
              <p>ارسال پیامک یادآوری نوبت به مشتریان.</p>
            </div>
            <span className="soon">به‌زودی</span>
          </article>
          <article className="future-card pink">
            <span className="icon-tile">
              <Icon name="wallet" size={32} />
            </span>
            <div>
              <h3>پرداخت آنلاین</h3>
              <p>دریافت بیعانه یا پرداخت کامل نوبت از طریق درگاه بانکی.</p>
            </div>
            <span className="soon">به‌زودی</span>
          </article>
        </div>
      </section>
      <section className="bottom-cta wrap" id="pricing">
        <div>
          <h2>همین حالا صفحه رزرو خود را بسازید</h2>
          <p>بدون نیاز به سایت، بدون پیچیدگی، مناسب هر حرفه‌ای</p>
          <Link href="/start" className="button primary">
            ساخت صفحه رزرو رایگان
            <Icon name="arrow" />
          </Link>
          <div className="cta-checks">
            <span>
              <Icon name="check" size={16} />
              بدون نیاز به دانش فنی
            </span>
            <span>
              <Icon name="check" size={16} />
              راه‌اندازی در چند دقیقه
            </span>
            <span>
              <Icon name="check" size={16} />
              لینک اختصاصی
            </span>
          </div>
        </div>
        <div className="bottom-art">
          <img
            src="/images/dashboard-preview.webp"
            alt="صفحه رزرو اختصاصی روی موبایل"
            loading="lazy"
          />
          <span className="quality-badge">
            <Icon name="check" />
            سریع
            <br />
            ساده
            <br />
            حرفه‌ای
          </span>
        </div>
      </section>
      <footer className="site-footer wrap">
        <Link href="/" className="brand">
          <Icon name="calendar" />
          نوبت‌لینک
        </Link>
        <p>یک لینک، شروعِ نوبت‌های منظم‌تر.</p>
        <Link href="/nazanin/dashboard">
          مشاهده پنل نمونه
          <Icon name="arrow" size={16} />
        </Link>
      </footer>
    </main>
  );
}

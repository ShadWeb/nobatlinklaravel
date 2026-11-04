"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useState,
  useEffect,
  useRef,
  type ReactNode,
  type FormEvent,
} from "react";
import Icon, { type IconName } from "./icons";
import {
  useNail,
  fa,
  iso,
  dateLabel,
  today,
  type Service,
  type Booking,
} from "./nail-context";
const path = (s: string) => "/nazanin" + (s === "home" ? "" : "/" + s);
const screenLabels: Record<string, string> = {
  home: "صفحه اصلی",
  services: "انتخاب خدمت",
  date: "انتخاب روز نوبت",
  time: "انتخاب ساعت",
  details: "اطلاعات مشتری",
  success: "تأیید نوبت",
  login: "ورود مشتری",
  appointments: "نوبت‌های من",
  dashboard: "داشبورد ناخن‌کار",
  "manage-services": "مدیریت خدمات",
};
function Photo({
  service,
  className = "",
}: {
  service?: Service;
  className?: string;
}) {
  return (
    <img
      className={"nail-photo " + className}
      src={
        service?.id === "extension"
          ? "/images/nails-extension.webp"
          : service?.id === "design"
            ? "/images/nails-design.webp"
            : "/images/nails-hero.webp"
      }
      alt={service?.name || "مانیکور صورتی و طراحی ناخن نازنین"}
      style={{ objectPosition: service?.crop }}
    />
  );
}
function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    d?.showModal();
    return () => d?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="nail-dialog"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialog-heading">
        <h2>{title}</h2>
        <button className="icon-button" aria-label="بستن" onClick={onClose}>
          <Icon name="close" />
        </button>
      </div>
      {children}
    </dialog>
  );
}
function Summary({ booking }: { booking?: Booking }) {
  const c = useNail();
  const s = booking?.service || c.selected;
  return (
    <div className="booking-summary">
      <div className="summary-copy">
        <h3>{s.name}</h3>
        <p>
          <Icon name="calendar" size={15} />
          {dateLabel(booking?.date || c.date)}
        </p>
        <p>
          <Icon name="clock" size={15} />
          {fa(booking?.time || c.time)}
          <span className="summary-duration"> · {fa(s.duration)} دقیقه</span>
        </p>
        <strong>{fa(s.price.toLocaleString("en-US"))} تومان</strong>
      </div>
      <Photo service={s} />
    </div>
  );
}
function Top({ title, back = "home" }: { title: string; back?: string }) {
  return (
    <header className="nail-top">
      <Link
        href={path(back)}
        className="icon-button back-button"
        aria-label="بازگشت"
      >
        <Icon name="arrow" />
      </Link>
      <span>{title}</span>
      <Link href="/" className="tiny-brand" aria-label="نوبت‌لینک">
        <Icon name="calendar" size={19} />
      </Link>
    </header>
  );
}
function BottomNav({
  active = "appointments",
  admin = false,
}: {
  active?: string;
  admin?: boolean;
}) {
  const items: { id: string; label: string; icon: IconName }[] = admin
    ? [
        { id: "dashboard", label: "خانه", icon: "home" },
        { id: "bookings", label: "نوبت‌ها", icon: "calendar" },
        { id: "manage-services", label: "خدمات", icon: "scissors" },
        { id: "customers", label: "مشتریان", icon: "users" },
      ]
    : [
        { id: "home", label: "خانه", icon: "home" },
        { id: "appointments", label: "نوبت‌های من", icon: "calendar" },
        { id: "services", label: "خدمات", icon: "flower" },
        { id: "login", label: "حساب من", icon: "user" },
      ];
  return (
    <nav
      className="nail-bottom-nav"
      aria-label={admin ? "منوی مدیریت" : "منوی مشتری"}
    >
      {items.map((it, i) => (
        <Link
          key={it.label}
          href={
            admin && (it.id === "customers" || it.id === "bookings")
              ? path("dashboard") + "?view=" + it.id
              : path(it.id)
          }
          className={
            active === it.id && (i === 0 || it.id !== "dashboard")
              ? "active"
              : ""
          }
        >
          <Icon name={it.icon} size={23} />
          <span>{it.label}</span>
        </Link>
      ))}
    </nav>
  );
}
function StudioHome() {
  const { services, selected, setSelected } = useNail();
  const [share, setShare] = useState(false);
  return (
    <>
      <section className="studio-hero">
        <Photo />
        <div className="studio-hero-actions">
          <Link
            className="icon-button"
            href="/"
            aria-label="بازگشت به نوبت‌لینک"
          >
            <Icon name="arrow" />
          </Link>
          <button
            className="icon-button"
            aria-label="اشتراک‌گذاری صفحه"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href);
                setShare(true);
              } catch {
                setShare(true);
              }
            }}
          >
            <Icon name="share" />
          </button>
        </div>
        <div className="studio-identity">
          <span>زیبایی در جزئیات است</span>
          <h1>نازنین</h1>
          <p>خدمات تخصصی ناخن</p>
          <span className="studio-address">
            <Icon name="pin" size={17} />
            تهران، صادقیه
          </span>
        </div>
      </section>
      <div className="studio-content">
        <div className="service-tabs" role="group" aria-label="خدمات ناخن">
          {[...services]
            .sort(
              (a, b) =>
                (a.id === "extension" ? -1 : a.id === "repair" ? 0 : 1) -
                (b.id === "extension" ? -1 : b.id === "repair" ? 0 : 1),
            )
            .map((s, i) => (
              <button
                key={s.id}
                className={selected.id === s.id ? "selected" : ""}
                onClick={() => setSelected(s)}
              >
                <Icon
                  name={
                    (["flower", "sparkle", "edit", "scissors"] as IconName[])[
                      i % 4
                    ]
                  }
                  size={28}
                />
                <span>{s.name}</span>
              </button>
            ))}
        </div>
        <article className="service-feature">
          <div>
            <h2>{selected.name}</h2>
            <p>{selected.description}</p>
            <span className="muted inline">
              <Icon name="clock" size={15} />
              {fa(selected.duration)} دقیقه
            </span>
            <strong>{fa(selected.price.toLocaleString("en-US"))} تومان</strong>
          </div>
          <Photo service={selected} />
        </article>
        <div className="studio-accordions">
          <details>
            <summary>
              توضیحات بیشتر
              <Icon name="down" size={15} />
            </summary>
            <p>
              با دقت و حوصله، متناسب با فرم دست و سلیقه شما. لطفاً بدون لاک
              معمولی و در زمان تعیین‌شده تشریف بیاورید.
            </p>
          </details>
          <details>
            <summary>
              نمونه کارها
              <Icon name="down" size={15} />
            </summary>
            <div className="portfolio">
              {services.slice(0, 3).map((s) => (
                <Photo key={s.id} service={s} />
              ))}
            </div>
          </details>
          <details>
            <summary>
              نظرات مشتریان
              <Icon name="down" size={15} />
            </summary>
            <p>سارا: کارشون خیلی تمیز و ظریفه، از نتیجه خیلی راضی‌ام.</p>
          </details>
        </div>
        <Link href={path("services")} className="button rose full">
          <Icon name="calendar" />
          رزرو نوبت {selected.name}
        </Link>
        <div className="contact-grid">
          {[
            {
              icon: "whatsapp",
              label: "واتساپ",
              href: "https://wa.me/989120000000",
            },
            {
              icon: "instagram",
              label: "اینستاگرام",
              href: "https://instagram.com",
            },
            {
              icon: "navigation",
              label: "مسیریابی",
              href: "https://www.google.com/maps/search/?api=1&query=Sadeghiyeh+Tehran",
            },
            { icon: "phone", label: "تماس", href: "tel:+989120000000" },
          ].map((i) => (
            <a
              href={i.href}
              key={i.label}
              target={i.icon === "phone" ? undefined : "_blank"}
              rel="noreferrer"
            >
              <Icon name={i.icon as IconName} />
              <span>{i.label}</span>
            </a>
          ))}
        </div>
        <p className="studio-credit">
          ساخته‌شده با <Link href="/">نوبت‌لینک</Link>
          <span>صفحه نمونه</span>
        </p>
      </div>
      {share && (
        <Modal title="اشتراک‌گذاری صفحه" onClose={() => setShare(false)}>
          <p>لینک صفحه نازنین را برای دوستانتان بفرستید.</p>
          <input
            readOnly
            dir="ltr"
            value={
              typeof window !== "undefined"
                ? window.location.origin + "/nazanin"
                : ""
            }
            onFocus={(e) => e.target.select()}
          />
          <p className="muted">برای کپی، لینک را انتخاب کنید.</p>
        </Modal>
      )}
    </>
  );
}
function ServiceSelection() {
  const { services, selected, setSelected } = useNail();
  return (
    <>
      <Top title="" />
      <div className="nail-page">
        <div className="nail-page-heading">
          <h1>انتخاب خدمت</h1>
          <p>لطفاً خدمت مورد نظر خود را انتخاب کنید.</p>
        </div>
        <div className="service-list">
          {services.map((s) => (
            <button
              key={s.id}
              className={
                "service-option " + (s.id === selected.id ? "selected" : "")
              }
              onClick={() => setSelected(s)}
              aria-pressed={s.id === selected.id}
            >
              <Icon name="left" size={21} />
              <div>
                <h2>{s.name}</h2>
                <p>{fa(s.duration)} دقیقه</p>
                <strong>{fa(s.price.toLocaleString("en-US"))} تومان</strong>
              </div>
              <Photo service={s} />
            </button>
          ))}
        </div>
        <Link href={path("date")} className="button rose full">
          بعدی
          <Icon name="arrow" />
        </Link>
      </div>
    </>
  );
}
function getMonth(value: string) {
  const date = new Date(value + "T12:00:00");
  const formatter = new Intl.DateTimeFormat("en-US-u-ca-persian", {
    day: "numeric",
  });
  const day = Number(formatter.format(date));
  date.setDate(date.getDate() - day + 1);
  const start = new Date(date);
  const days: Date[] = [];
  do {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  } while (Number(formatter.format(date)) !== 1);
  return {
    start,
    days,
    next: new Date(date),
    label: new Intl.DateTimeFormat("fa-IR", {
      month: "long",
      year: "numeric",
    }).format(start),
  };
}
function DateSelection() {
  const { date, setDate, setTime } = useNail();
  const [view, setView] = useState(date);
  const month = getMonth(view);
  const offset = (month.start.getDay() + 1) % 7;
  const five = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(today() + "T12:00:00");
    d.setDate(d.getDate() + i);
    return d;
  });
  return (
    <>
      <Top title="" back="services" />
      <div className="nail-page">
        <div className="nail-page-heading">
          <h1>انتخاب روز نوبت</h1>
          <p>لطفاً روز مورد نظر خود را انتخاب کنید.</p>
        </div>
        <div className="date-strip">
          {five.map((d) => {
            const key = iso(d);
            return (
              <button
                key={key}
                className={date === key ? "selected" : ""}
                onClick={() => {
                  setDate(key);
                  setView(key);
                  setTime("");
                }}
              >
                <span>
                  {new Intl.DateTimeFormat("fa-IR", {
                    weekday: "short",
                  }).format(d)}
                </span>
                <b>
                  {new Intl.DateTimeFormat("fa-IR", { day: "numeric" }).format(
                    d,
                  )}
                </b>
                <span>
                  {new Intl.DateTimeFormat("fa-IR", { month: "long" }).format(
                    d,
                  )}
                </span>
              </button>
            );
          })}
        </div>
        <div className="month-heading">
          <button
            className="icon-button"
            aria-label="ماه قبل"
            onClick={() => {
              const d = new Date(month.start);
              d.setDate(d.getDate() - 1);
              setView(iso(d));
            }}
          >
            <Icon name="right" />
          </button>
          <h2>{month.label}</h2>
          <button
            className="icon-button"
            aria-label="ماه بعد"
            onClick={() => setView(iso(month.next))}
          >
            <Icon name="left" />
          </button>
        </div>
        <div className="calendar-grid">
          <div className="week-labels">
            {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="month-days">
            {Array.from({ length: offset }, (_, i) => (
              <span key={"blank" + i} />
            ))}
            {month.days.map((d, i) => (
              <button
                key={iso(d)}
                disabled={iso(d) < today()}
                className={date === iso(d) ? "selected" : ""}
                onClick={() => {
                  setDate(iso(d));
                  setTime("");
                }}
                aria-label={dateLabel(iso(d))}
                aria-pressed={date === iso(d)}
              >
                {fa(i + 1)}
              </button>
            ))}
          </div>
        </div>
        <div className="date-selection-note">
          <Icon name="calendar" size={17} />
          {dateLabel(date)}
        </div>
        <Link href={path("time")} className="button rose full">
          انتخاب ساعت‌ها
          <Icon name="arrow" />
        </Link>
      </div>
    </>
  );
}
function TimeSelection() {
  const { date, time, setTime, selected, available } = useNail();
  const times = Array.from(
    { length: 15 },
    (_, i) =>
      String(10 + Math.floor(i / 3) * 2 + (i % 3 === 2 ? 1 : 0)).padStart(
        2,
        "0",
      ) +
      ":" +
      (i % 3 === 1 ? "30" : "00"),
  );
  const canContinue = time && available(date, time, selected.duration);
  return (
    <>
      <Top title="" back="date" />
      <div className="nail-page">
        <div className="nail-page-heading">
          <h1>ساعت‌های قابل رزرو</h1>
          <p>{dateLabel(date)}</p>
        </div>
        <div className="time-grid">
          {times.map((t) => (
            <button
              key={t}
              className={time === t ? "selected" : ""}
              disabled={!available(date, t, selected.duration)}
              onClick={() => setTime(t)}
              aria-pressed={time === t}
            >
              {fa(t)}
            </button>
          ))}
        </div>
        {!times.some((t) => available(date, t, selected.duration)) && (
          <p className="empty-message">
            برای این روز زمان آزادی باقی نمانده. روز دیگری را انتخاب کنید.
          </p>
        )}
        <Summary />
        {canContinue ? (
          <Link href={path("details")} className="button rose full">
            ادامه و ثبت مشخصات
            <Icon name="arrow" />
          </Link>
        ) : (
          <button disabled className="button rose full">
            یک ساعت را انتخاب کنید
          </button>
        )}
      </div>
    </>
  );
}
function CustomerDetails() {
  const { addBooking, available, date, time, selected } = useNail();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    const normalized = phone
      .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
      .replace(/[\s-]/g, "");
    if (name.trim().length < 3) {
      setError("لطفاً نام و نام خانوادگی را کامل وارد کنید.");
      return;
    }
    if (!/^09\d{9}$/.test(normalized)) {
      setError("شماره موبایل معتبر وارد کنید؛ مثل 09123456789.");
      return;
    }
    if (
      !available(date, time, selected.duration) ||
      !addBooking(name.trim(), normalized)
    ) {
      setError("این ساعت دیگر در دسترس نیست. لطفاً ساعت دیگری انتخاب کنید.");
      return;
    }
    router.push(path("success"));
  }
  return (
    <>
      <Top title="" back="time" />
      <div className="nail-page">
        <div className="nail-page-heading">
          <h1>تکمیل اطلاعات</h1>
          <p>لطفاً اطلاعات خود را وارد کنید تا نوبت ثبت شود.</p>
        </div>
        <form onSubmit={submit} className="customer-form">
          <label htmlFor="customer-name">نام و نام خانوادگی</label>
          <div className="input-with-icon">
            <Icon name="user" />
            <input
              id="customer-name"
              autoComplete="name"
              placeholder="مثال: سارا احمدی"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={3}
            />
          </div>
          <label htmlFor="customer-phone">شماره موبایل</label>
          <div className="input-with-icon">
            <Icon name="phone" />
            <input
              id="customer-phone"
              dir="ltr"
              inputMode="tel"
              autoComplete="tel"
              placeholder="09123456789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              maxLength={14}
            />
          </div>
          <Summary />
          <p className="terms-note">
            با ثبت نوبت، زمان انتخابی برای شما در نظر گرفته می‌شود. لطفاً ۵
            دقیقه زودتر حضور داشته باشید.
          </p>
          {error && (
            <p className="form-error" role="alert">
              {error} <Link href={path("time")}>انتخاب ساعت</Link>
            </p>
          )}
          <button className="button rose full" type="submit">
            <Icon name="calendar" />
            ثبت نوبت
          </button>
          <p className="demo-notice">
            نسخه نمایشی؛ این رزرو فقط در همین مرورگر ذخیره می‌شود.
          </p>
        </form>
      </div>
    </>
  );
}
function Success() {
  const { last } = useNail();
  return (
    <>
      <Top title="تأیید نوبت" />
      <div className="nail-page success-page">
        <span className="success-check">
          <Icon name="check" size={44} />
        </span>
        <h1>
          {last ? "نوبت شما با موفقیت ثبت شد!" : "آماده رزرو نوبت هستید؟"}
        </h1>
        <p>
          {last
            ? "اطلاعات نوبت برای شما ذخیره شده است."
            : "با انتخاب خدمت و زمان، نوبت خود را ثبت کنید."}
        </p>
        {last ? <Summary booking={last} /> : null}
        <Link
          href={path(last ? "appointments" : "services")}
          className="button rose full"
        >
          <Icon name="plus" />
          {last ? "مشاهده نوبت‌های من" : "رزرو نوبت"}
        </Link>
        <Link href={path("home")} className="button rose-outline full">
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </>
  );
}
function Login() {
  const { setCustomer } = useNail();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<"phone" | "code">("phone");
  const [error, setError] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    const normalized = phone.replace(/[۰-۹]/g, (d) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)),
    );
    if (!/^09\d{9}$/.test(normalized)) {
      setError("شماره موبایل معتبر وارد کنید.");
      return;
    }
    if (stage === "phone") {
      setPhone(normalized);
      setError("");
      setStage("code");
      return;
    }
    const normalizedCode = code.replace(/[۰-۹]/g, (d) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)),
    );
    if (normalizedCode !== "123456") {
      setError("در نسخه نمایشی کد ۱۲۳۴۵۶ را وارد کنید.");
      return;
    }
    setCustomer(normalized);
    router.push(path("appointments"));
  }
  return (
    <>
      <Top title="" />
      <div className="nail-page login-page">
        <span className="login-illustration">
          <Icon name="mobile" size={46} />
        </span>
        <h1>
          {stage === "phone" ? "ورود به حساب کاربری" : "کد تأیید را وارد کنید"}
        </h1>
        <p>
          {stage === "phone" ? (
            <>
              برای مشاهده و مدیریت نوبت‌های خود،
              <br />
              شماره موبایل خود را وارد کنید.
            </>
          ) : (
            <>
              ورود نمایشی برای شماره <b dir="ltr">{fa(phone)}</b>
            </>
          )}
        </p>
        <form onSubmit={submit}>
          {stage === "phone" ? (
            <>
              <label htmlFor="login-phone">شماره موبایل</label>
              <div className="input-with-icon">
                <Icon name="mobile" />
                <input
                  id="login-phone"
                  dir="ltr"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="09123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <>
              <label htmlFor="login-code">کد تأیید شش‌رقمی</label>
              <input
                id="login-code"
                dir="ltr"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                required
                autoFocus
              />
              <p className="demo-notice">کد نمایشی: ۱۲۳۴۵۶</p>
            </>
          )}
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          <button type="submit" className="button rose full">
            {stage === "phone" ? "ارسال کد تأیید" : "تأیید و ورود"}
          </button>
          <p className="demo-notice">
            ورود نمایشی است و پیامک ارسال نمی‌شود. اطلاعات تنها روی این دستگاه
            نگهداری می‌شود.
          </p>
        </form>
        {stage === "code" ? (
          <button
            className="text-link"
            onClick={() => {
              setStage("phone");
              setError("");
              setCode("");
            }}
          >
            ویرایش شماره موبایل
          </button>
        ) : (
          <Link href={path("home")} className="text-link">
            <Icon name="arrow" />
            بازگشت
          </Link>
        )}
      </div>
    </>
  );
}
function Appointments() {
  const { bookings, customer, cancelBooking } = useNail();
  const [tab, setTab] = useState("future");
  const [cancel, setCancel] = useState<Booking | null>(null);
  const [detail, setDetail] = useState<Booking | null>(null);
  const list = bookings.filter(
    (b) =>
      (!customer || b.phone === customer) &&
      (tab === "cancelled"
        ? b.status === "cancelled"
        : b.status !== "cancelled" &&
          (tab === "past" ? b.date < today() : b.date >= today())),
  );
  return (
    <>
      <Top title="نوبت‌های من" />
      <div className="nail-page appointments-page">
        <div className="segmented-tabs">
          {[
            { id: "future", label: "آینده" },
            { id: "past", label: "گذشته" },
            { id: "cancelled", label: "لغو شده" },
          ].map((t) => (
            <button
              className={tab === t.id ? "selected" : ""}
              key={t.id}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {list.length ? (
          list.map((b) => (
            <article className="appointment-card" key={b.id}>
              <div className="appointment-main">
                <span
                  className={
                    "status " +
                    (b.status === "cancelled"
                      ? "cancelled"
                      : b.status === "pending"
                        ? "pending"
                        : "confirmed")
                  }
                >
                  {b.status === "cancelled"
                    ? "لغو شده"
                    : b.status === "pending"
                      ? "در انتظار"
                      : "تأیید شده"}
                </span>
                <div>
                  <h2>{b.service.name}</h2>
                  <p>
                    {dateLabel(b.date)} · {fa(b.time)}
                  </p>
                </div>
                <Photo service={b.service} />
              </div>
              <div className="appointment-actions">
                <button onClick={() => setDetail(b)}>مشاهده جزئیات</button>
                {b.status !== "cancelled" && b.date >= today() && (
                  <button className="danger" onClick={() => setCancel(b)}>
                    لغو نوبت
                  </button>
                )}
              </div>
            </article>
          ))
        ) : (
          <div className="empty-state">
            <Icon name="calendar" size={49} />
            <h2>
              {tab === "future" ? "هنوز نوبتی ندارید" : "نوبتی در این بخش نیست"}
            </h2>
            <p>وقت یک تغییر کوچک و زیباست.</p>
            <Link href={path("services")} className="button rose">
              رزرو اولین نوبت
              <Icon name="plus" size={18} />
            </Link>
          </div>
        )}
      </div>
      <BottomNav />
      {cancel && (
        <Modal title="لغو نوبت" onClose={() => setCancel(null)}>
          <p>
            از لغو نوبت {cancel.service.name} در {dateLabel(cancel.date)} ساعت{" "}
            {fa(cancel.time)} مطمئن هستید؟
          </p>
          <div className="dialog-actions">
            <button
              className="button rose"
              onClick={() => {
                cancelBooking(cancel.id);
                setCancel(null);
              }}
            >
              بله، لغو نوبت
            </button>
            <button
              className="button rose-outline"
              onClick={() => setCancel(null)}
            >
              انصراف
            </button>
          </div>
        </Modal>
      )}
      {detail && (
        <Modal title="جزئیات نوبت" onClose={() => setDetail(null)}>
          <Summary booking={detail} />
          <p>نام مشتری: {detail.name}</p>
          <p>
            شماره تماس: <b dir="ltr">{fa(detail.phone)}</b>
          </p>
          <p>آدرس: تهران، صادقیه</p>
          <p className="muted">شناسه پیگیری: {detail.id.slice(0, 8)}</p>
        </Modal>
      )}
    </>
  );
}
function Dashboard() {
  const { bookings, cancelBooking } = useNail();
  const [day, setDay] = useState(today);
  const router = useRouter();
  const search = useSearchParams();
  const tab = search.get("view") || "calendar";
  function setTab(value: string) {
    router.replace(
      path("dashboard") + (value === "calendar" ? "" : "?view=" + value),
      { scroll: false },
    );
  }
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<Booking | null>(null);
  const active = bookings
    .filter((b) => b.status !== "cancelled" && b.date === day)
    .sort((a, b) => a.time.localeCompare(b.time));
  const customers = Array.from(
    new Map(bookings.map((b) => [b.phone, b])).values(),
  ).filter((b) => (b.name + b.phone).includes(query));
  return (
    <>
      <Top title="داشبورد" />
      <div className="nail-page dashboard-page">
        <div className="segmented-tabs admin-tabs">
          {[
            { id: "calendar", label: "تقویم" },
            { id: "bookings", label: "نوبت‌ها" },
            { id: "services", label: "خدمات" },
            { id: "customers", label: "مشتریان" },
          ].map((t) =>
            t.id === "services" ? (
              <Link key={t.id} href={path("manage-services")}>
                {t.label}
              </Link>
            ) : (
              <button
                key={t.id}
                className={tab === t.id ? "selected" : ""}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ),
          )}
        </div>
        {tab !== "customers" ? (
          <>
            <div className="month-heading admin-date">
              <button
                className="icon-button"
                aria-label="روز قبل"
                onClick={() => {
                  const d = new Date(day + "T12:00:00");
                  d.setDate(d.getDate() - 1);
                  setDay(iso(d));
                }}
              >
                <Icon name="right" />
              </button>
              <h2>{dateLabel(day, true)}</h2>
              <button
                className="icon-button"
                aria-label="روز بعد"
                onClick={() => {
                  const d = new Date(day + "T12:00:00");
                  d.setDate(d.getDate() + 1);
                  setDay(iso(d));
                }}
              >
                <Icon name="left" />
              </button>
            </div>
            {tab === "calendar" ? (
              <div className="day-schedule">
                {Array.from({ length: 11 }, (_, i) => i + 9).map((h) => (
                  <div className="schedule-row" key={h}>
                    <span>{fa(h + ":00")}</span>
                  </div>
                ))}
                {active.map((b, i) => (
                  <button
                    key={b.id}
                    className={"schedule-booking tone-" + (i % 3)}
                    style={{
                      top:
                        (((Number(b.time.split(":")[0]) - 9) * 60 +
                          Number(b.time.split(":")[1])) /
                          60) *
                        60,
                      height: Math.max(45, b.service.duration - 5),
                    }}
                    onClick={() => setDetail(b)}
                  >
                    <b>{b.name}</b>
                    <span>
                      {b.service.name} · {fa(b.service.duration)} دقیقه
                    </span>
                  </button>
                ))}
                {!active.length && (
                  <div className="schedule-empty">
                    <Icon name="calendar" size={32} />
                    <p>برنامه امروز آزاد است</p>
                    <span>نوبت‌های ثبت‌شده اینجا نمایش داده می‌شوند.</span>
                  </div>
                )}
              </div>
            ) : active.length ? (
              active.map((b) => (
                <button
                  className="dashboard-list-item"
                  onClick={() => setDetail(b)}
                  key={b.id}
                >
                  <b>{b.name}</b>
                  <span>
                    {b.service.name} · {fa(b.time)}
                  </span>
                  <Icon name="left" size={18} />
                </button>
              ))
            ) : (
              <div className="empty-state">
                <Icon name="calendar" size={40} />
                <p>برای این روز نوبتی ثبت نشده است.</p>
              </div>
            )}
          </>
        ) : (
          <div className="customers-view">
            <div className="input-with-icon">
              <Icon name="search" />
              <input
                placeholder="جستجوی نام یا شماره مشتری"
                aria-label="جستجوی مشتری"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            {customers.length ? (
              customers.map((b) => (
                <div className="customer-row" key={b.phone}>
                  <span className="icon-tile">
                    <Icon name="user" />
                  </span>
                  <div>
                    <b>{b.name}</b>
                    <p dir="ltr">{fa(b.phone)}</p>
                  </div>
                  <span>
                    {fa(bookings.filter((x) => x.phone === b.phone).length)}{" "}
                    نوبت
                  </span>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <Icon name="users" size={40} />
                <p>هنوز مشتری‌ای ثبت نشده است.</p>
              </div>
            )}
          </div>
        )}
        <Link
          className="floating-add"
          href={path("services")}
          aria-label="ثبت نوبت جدید"
        >
          <Icon name="plus" size={28} />
        </Link>
      </div>
      <BottomNav admin active={tab === "calendar" ? "dashboard" : tab} />
      {detail && (
        <Modal title="اطلاعات نوبت" onClose={() => setDetail(null)}>
          <Summary booking={detail} />
          <p>مشتری: {detail.name}</p>
          <a className="text-link" href={"tel:" + detail.phone}>
            <Icon name="phone" size={18} />
            {fa(detail.phone)}
          </a>
          <button
            className="button rose-outline full"
            onClick={() => {
              cancelBooking(detail.id);
              setDetail(null);
            }}
          >
            لغو این نوبت
          </button>
        </Modal>
      )}
    </>
  );
}
function ManageServices() {
  const { services, setServices } = useNail();
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState<Service | null>(null);
  const [notice, setNotice] = useState("");
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const s: Service = {
      id: editing?.id || crypto.randomUUID(),
      name: String(data.get("name")).trim(),
      duration: Number(data.get("duration")),
      price: Number(data.get("price")),
      description: String(data.get("description")).trim(),
      crop: editing?.crop || "50% 50%",
    };
    if (
      !s.name ||
      !Number.isFinite(s.duration) ||
      s.duration < 15 ||
      !Number.isFinite(s.price) ||
      s.price < 0
    )
      return;
    setServices(
      services.some((x) => x.id === s.id)
        ? services.map((x) => (x.id === s.id ? s : x))
        : [...services, s],
    );
    setEditing(null);
    setNotice("خدمت با موفقیت ذخیره شد.");
  }
  return (
    <>
      <Top title="مدیریت خدمات" back="dashboard" />
      <div className="nail-page manage-page">
        <p className="manage-intro">
          خدمات، زمان و قیمت‌ها را به سلیقه خود تنظیم کنید.
        </p>
        {notice && (
          <p className="success-notice" role="status">
            {notice}
          </p>
        )}
        <div className="manage-service-list">
          {services.map((s) => (
            <article className="manage-service" key={s.id}>
              <Photo service={s} />
              <div>
                <h2>{s.name}</h2>
                <p>
                  {fa(s.duration)} دقیقه · {fa(s.price.toLocaleString("en-US"))}{" "}
                  تومان
                </p>
              </div>
              <button
                className="icon-button"
                aria-label={"ویرایش " + s.name}
                onClick={() => setEditing(s)}
              >
                <Icon name="edit" size={20} />
              </button>
              <button
                className="icon-button danger"
                aria-label={"حذف " + s.name}
                onClick={() => setDeleting(s)}
              >
                <Icon name="trash" size={20} />
              </button>
            </article>
          ))}
        </div>
        <button
          className="button rose full"
          onClick={() =>
            setEditing({
              id: "",
              name: "",
              duration: 60,
              price: 0,
              description: "",
              crop: "50% 50%",
            })
          }
        >
          <Icon name="plus" />
          افزودن خدمت جدید
        </button>
        <Link href={path("home")} className="text-link preview-link">
          <Icon name="link" size={17} />
          مشاهده صفحه من
        </Link>
      </div>
      <BottomNav admin active="manage-services" />
      {editing && (
        <Modal
          title={editing.id ? "ویرایش خدمت" : "افزودن خدمت جدید"}
          onClose={() => setEditing(null)}
        >
          <form className="service-form" onSubmit={submit}>
            <label htmlFor="service-name">نام خدمت</label>
            <input
              id="service-name"
              name="name"
              defaultValue={editing.name}
              required
              autoFocus
              maxLength={60}
            />
            <div className="form-columns">
              <div>
                <label htmlFor="service-duration">مدت (دقیقه)</label>
                <input
                  id="service-duration"
                  name="duration"
                  type="number"
                  min="15"
                  max="540"
                  step="15"
                  defaultValue={editing.duration}
                  required
                />
              </div>
              <div>
                <label htmlFor="service-price">قیمت (تومان)</label>
                <input
                  id="service-price"
                  name="price"
                  type="number"
                  min="0"
                  max="100000000"
                  step="1000"
                  defaultValue={editing.price}
                  required
                />
              </div>
            </div>
            <label htmlFor="service-desc">توضیحات</label>
            <textarea
              id="service-desc"
              name="description"
              defaultValue={editing.description}
              rows={3}
            />
            <button type="submit" className="button rose full">
              ذخیره خدمت
              <Icon name="check" size={18} />
            </button>
          </form>
        </Modal>
      )}
      {deleting && (
        <Modal title="حذف خدمت" onClose={() => setDeleting(null)}>
          <p>خدمت «{deleting.name}» از صفحه شما حذف شود؟</p>
          <p className="muted">نوبت‌های قبلی این خدمت حفظ می‌شوند.</p>
          <div className="dialog-actions">
            <button
              className="button rose"
              disabled={services.length === 1}
              onClick={() => {
                setServices(services.filter((s) => s.id !== deleting.id));
                setDeleting(null);
                setNotice("خدمت حذف شد.");
              }}
            >
              حذف خدمت
            </button>
            <button
              className="button rose-outline"
              onClick={() => setDeleting(null)}
            >
              انصراف
            </button>
          </div>
          {services.length === 1 && (
            <p className="form-error">حداقل یک خدمت باید باقی بماند.</p>
          )}
        </Modal>
      )}
    </>
  );
}
const flow = ["services", "date", "time", "details", "success"];
export default function NailApp({ screen }: { screen: string }) {
  const { ready } = useNail();
  if (!ready)
    return (
      <div className="nail-loading" role="status">
        <span />
        <p>در حال آماده‌سازی صفحه نازنین…</p>
      </div>
    );
  const index = flow.indexOf(screen);
  return (
    <main className="nail-world">
      <aside className="studio-sidebar">
        <Link href="/" className="brand">
          <Icon name="calendar" size={30} />
          نوبت‌لینک
        </Link>
        <div className="sidebar-copy">
          <span className="eyebrow rose-eyebrow">صفحه اختصاصی رزرو نوبت</span>
          <h2>
            کمی وقت
            <br />
            برای زیبایی خودت.
          </h2>
          <p>
            خدمت دلخواهت را انتخاب کن،
            <br />
            بقیه‌اش را به نازنین بسپار.
          </p>
          <div className="sidebar-studio">
            <Photo />
            <div>
              <b>استودیو ناخن نازنین</b>
              <span>
                <Icon name="pin" size={15} />
                تهران، صادقیه
              </span>
            </div>
            <span className="studio-online">رزرو آنلاین</span>
          </div>
        </div>
        <nav aria-label="صفحات نمونه" className="studio-route-nav">
          <Link
            href={path("home")}
            className={screen === "home" ? "active" : ""}
          >
            <Icon name="home" />
            صفحه نازنین
          </Link>
          <Link
            href={path("appointments")}
            className={screen === "appointments" ? "active" : ""}
          >
            <Icon name="calendar" />
            نوبت‌های من
          </Link>
          <Link
            href={path("dashboard")}
            className={screen === "dashboard" ? "active" : ""}
          >
            <Icon name="chart" />
            پنل ناخن‌کار
          </Link>
          <Link
            href={path("manage-services")}
            className={screen === "manage-services" ? "active" : ""}
          >
            <Icon name="scissors" />
            مدیریت خدمات
          </Link>
        </nav>
        <Link href="/" className="sidebar-back">
          <Icon name="arrow" size={18} />
          بازگشت به نوبت‌لینک
        </Link>
      </aside>
      <div className="studio-app-area">
        {index >= 0 && (
          <div
            className="booking-progress"
            aria-label={"مرحله " + fa(index + 1) + " از ۵"}
          >
            {flow.map((s, i) => (
              <span key={s} className={i <= index ? "completed" : ""}>
                <b>{i < index ? <Icon name="check" size={14} /> : fa(i + 1)}</b>
                <small>{["خدمت", "روز", "ساعت", "اطلاعات", "تأیید"][i]}</small>
              </span>
            ))}
          </div>
        )}
        <section
          className={"nail-app screen-" + screen}
          aria-label={screenLabels[screen] || "صفحه نازنین"}
        >
          {screen === "home" ? (
            <StudioHome />
          ) : screen === "services" ? (
            <ServiceSelection />
          ) : screen === "date" ? (
            <DateSelection />
          ) : screen === "time" ? (
            <TimeSelection />
          ) : screen === "details" ? (
            <CustomerDetails />
          ) : screen === "success" ? (
            <Success />
          ) : screen === "login" ? (
            <Login />
          ) : screen === "appointments" ? (
            <Appointments />
          ) : screen === "dashboard" ? (
            <Dashboard />
          ) : screen === "manage-services" ? (
            <ManageServices />
          ) : (
            <>
              <Top title="صفحه پیدا نشد" />
              <div className="empty-state">
                <h1>این صفحه وجود ندارد.</h1>
                <Link href={path("home")} className="button rose">
                  بازگشت به صفحه نازنین
                </Link>
              </div>
            </>
          )}
        </section>
        <p className="app-stage-caption">نازنین · خدمات تخصصی ناخن</p>
      </div>
    </main>
  );
}

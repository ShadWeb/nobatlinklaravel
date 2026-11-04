"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import Icon from "../../components/icons";
export default function Start() {
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    setDone(true);
  }
  return (
    <main className="start-world">
      <section className="start-card">
        <Link href="/" className="brand">
          <Icon name="calendar" size={28} />
          نوبت‌لینک
        </Link>
        <h1>{done ? "صفحه نمونه شما آماده است" : "صفحه رزروت رو بساز"}</h1>
        <p>
          {done
            ? "این مرحله پیش‌نمایش است. برای دیدن امکانات، صفحه و پنل نمونه نازنین را باز کنید."
            : "از یک صفحه ساده، برای نوبت‌های منظم‌تر شروع کن."}
        </p>
        {done ? (
          <>
            <p>
              نام کسب‌وکار: <b>{name}</b>
            </p>
            <Link href="/nazanin" className="button primary full">
              مشاهده نمونه صفحه
              <Icon name="arrow" />
            </Link>
            <Link href="/nazanin/dashboard" className="text-link">
              مشاهده پنل مدیریت
            </Link>
          </>
        ) : (
          <form onSubmit={submit}>
            <label htmlFor="studio-name">نام کسب‌وکار شما</label>
            <input
              id="studio-name"
              placeholder="مثلاً استودیو ناخن نازنین"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={60}
            />
            <label htmlFor="studio-type">حوزه فعالیت</label>
            <input id="studio-type" value="خدمات تخصصی ناخن" readOnly />
            <p className="demo-notice">
              اولین قالب آماده: ناخن‌کار · سایر مشاغل به‌زودی
            </p>
            <button className="button primary full" type="submit">
              ساخت پیش‌نمایش
              <Icon name="arrow" />
            </button>
          </form>
        )}
        <Link href="/" className="text-link">
          بازگشت به صفحه اصلی
        </Link>
      </section>
    </main>
  );
}

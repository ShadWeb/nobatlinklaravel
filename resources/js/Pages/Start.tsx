import { useState, FormEvent } from 'react';
import { Link } from '@inertiajs/react';
import Icon from '../Components/Icon';

export default function Start() {
  const [done, setDone] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const slugify = (text: string) =>
    text
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^\-+/, '')
      .replace(/\-+$/, '');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const generatedSlug = slugify(name);
    setSlug(generatedSlug);
    try {
      const res = await fetch('/owner/businesses', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          // Laravel expects X-XSRF-TOKEN header; we read cookie if present
          'X-XSRF-TOKEN': decodeURIComponent(document.cookie.split('XSRF-TOKEN=')[1] || ''),
        },
        body: JSON.stringify({ name, slug: generatedSlug, category: 'nails' }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error?.message || 'خطا در ساخت کسب‌وکار');
        return;
      }
      setDone(true);
    } catch (err) {
      alert('خطای شبکه');
    }
  };

  return (
    <main className="start-world">
      <section className="start-card">
        <Link href="/" className="brand">
          <Icon name="calendar" size={28} />
          نوبت‌لینک
        </Link>
        <h1>{done ? 'صفحه نمونه شما آماده است' : 'صفحه رزروت رو بساز'}</h1>
        <p>{done ? 'این مرحله پیش‌نمایش است. برای دیدن امکانات، صفحه و پنل نمونه نازنین را باز کنید.' : 'از یک صفحه ساده، برای نوبت‌های منظم‌تر شروع کن.'}</p>
        {done ? (
          <>
            <p>
              نام کسب‌وکار: <b>{name}</b>
              <br />
              لینک: <b dir="ltr">/b/{slug}</b>
            </p>
            <Link href={`/b/${slug}`} className="button primary full">
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
              onChange={e => setName(e.target.value)}
              required
              minLength={2}
              maxLength={60}
            />
            <label htmlFor="studio-type">حوزه فعالیت</label>
            <input id="studio-type" value="خدمات تخصصی ناخن" readOnly />
            <p className="demo-notice">اولین قالب آماده: ناخن‌کار · سایر مشاغل به‌زودی</p>
            <button className="button primary full" type="submit">
              ساخت پیش‌نمایش
              <Icon name="arrow" />
            </button>
          </form>
        )}
        <Link href="/" className="text-link">بازگشت به صفحه اصلی</Link>
      </section>
    </main>
  );
}

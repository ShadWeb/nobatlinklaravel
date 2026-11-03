import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function BusinessSettings({ slug }) {
  return (
    <>
      <Head title="تنظیمات کسب‌وکار" />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">تنظیمات کسب‌وکار – {slug}</h1>
        <p>در این صفحه می‌توانید تنظیمات متنوع (قیمت‌ها، رنگ‌ها، آدرس) را اضافه کنید.</p>
        <Link href="/owner/dashboard" className="btn-primary mt-4 inline-block">بازگشت به داشبورد</Link>
      </div>
    </>
  );
}

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Icon from '../../Components/Icon';

export default function NazaninDashboard() {
  return (
    <>
      <Head title="پنل نمونه نازنین" />
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">پنل نمونه نازنین</h1>
        <p className="mb-2">در این پنل می‌توانید لیست خدمات، نوبت‌ها و تنظیمات نمونه را ببینید.</p>
        <Link href="/" className="btn-primary mt-4 inline-block">بازگشت به صفحه اصلی</Link>
      </main>
    </>
  );
}

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Icon from '../../Components/Icon';

export default function NazaninSample() {
  return (
    <>
      <Head title="نمونه صفحه رزرو" />
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">نمونه صفحه رزرو نوبت‌لینک</h1>
        <p className="mb-2">این صفحه نمونه‌ای از ظاهر صفحه رزرو است که می‌توانید بدون ورود به آن دسترسی داشته باشید.</p>
        <Link href="/" className="btn-primary mt-4 inline-block">بازگشت به صفحه اصلی</Link>
      </main>
    </>
  );
}

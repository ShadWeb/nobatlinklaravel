import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function AppointmentDetail({ appointment }) {
  return (
    <>
      <Head title="جزئیات نوبت" />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">جزئیات نوبت</h1>
        <p><strong>خدمت:</strong> {appointment.service_name_snapshot}</p>
        <p><strong>زمان:</strong> {new Date(appointment.starts_at).toLocaleString('fa-IR')}</p>
        <p><strong>وضعیت:</strong> {appointment.status}</p>
        <p><strong>نام مشتری:</strong> {appointment.customer_name}</p>
        <p><strong>شماره تماس:</strong> {appointment.phone_snapshot}</p>
        <Link href="/appointments" className="btn-primary mt-4 inline-block">بازگشت به لیست نوبت‌ها</Link>
      </div>
    </>
  );
}

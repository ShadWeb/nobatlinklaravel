import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function CustomerAppointments({ appointments }) {
  return (
    <>
      <Head title="نوبت‌های من" />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">نوبت‌های من</h1>
        {appointments.length === 0 ? (
          <p>نوبتی موجود نیست.</p>
        ) : (
          <ul>
            {appointments.map(a => (
              <li key={a.id} className="mb-2">
                <Link href={`/appointments/${a.id}`} className="text-indigo-600 underline">
                  {a.service_name_snapshot} – {new Date(a.starts_at).toLocaleString('fa-IR')}
                </Link>
                {a.status === 'confirmed' && (
                  <button
                    className="btn-secondary ml-2"
                    onClick={async () => {
                      await fetch(`/appointments/${a.id}/cancel`, { method: 'POST' });
                      window.location.reload();
                    }}
                  >لغو</button>
                )}
              </li>
            ))}
          </ul>
        )}
        <Link href="/" className="btn-primary mt-4 inline-block">بازگشت به صفحه اصلی</Link>
      </div>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function BusinessBooking({ business, services }) {
  const [step, setStep] = useState('services'); // services | date | time | details | success
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bookingId, setBookingId] = useState(null);
  const [error, setError] = useState('');

  // fetch slots when service & date change
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedService || !date) return;
      const resp = await fetch(`/b/${business.slug}/availability?service_id=${selectedService}&date=${date}`);
      const data = await resp.json();
      if (resp.ok) {
        setSlots(data.slots);
        setError('');
      } else {
        setError(data.error ?? 'خطا در دریافت زمان‌های خالی');
      }
    };
    fetchSlots();
  }, [selectedService, date]);

  const handleBook = async () => {
    if (!selectedService || !date || !selectedSlot || !name || !phone) {
      setError('تمام فیلدها مورد نیاز است');
      return;
    }
    const payload = {
      service_id: selectedService,
      customer_name: name,
      phone,
      starts_at: selectedSlot,
      idempotency_key: `${Date.now()}-${Math.random()}`,
    };
    try {
      const resp = await fetch(`/b/${business.slug}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data.error?.message ?? 'خطا در رزرو');
        return;
      }
      setBookingId(data.booking?.id ?? null);
      setStep('success');
    } catch {
      setError('خطای شبکه');
    }
  };

  return (
    <>
      <Head title={business.name + ' – رزرو'} />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">{business.name}</h1>
        {error && <p className="form-error" role="alert">{error}</p>}
        {step === 'services' && (
          <div>
            <h2 className="text-xl mb-2">انتخاب خدمت</h2>
            <ul className="space-y-2">
              {services.map(s => (
                <li key={s.id}>
                  <button className="btn-primary w-full" onClick={() => { setSelectedService(s.id); setStep('date'); }}>{s.name} – {s.price_toman} تومان</button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {step === 'date' && (
          <div>
            <h2 className="text-xl mb-2">انتخاب تاریخ</h2>
            <input type="date" className="border p-1" value={date} onChange={e => setDate(e.target.value)} />
            <div className="mt-4 flex space-x-2">
              <button className="btn-secondary" onClick={() => setStep('services')}>بازگشت</button>
              <button className="btn-primary" onClick={() => setStep('time')} disabled={!date}>بعدی</button>
            </div>
          </div>
        )}
        {step === 'time' && (
          <div>
            <h2 className="text-xl mb-2">انتخاب ساعت</h2>
            {slots.length === 0 ? (
              <p>هیچ زمان خالی برای این تاریخ وجود ندارد.</p>
            ) : (
              <ul className="space-y-1">
                {slots.map((s, i) => (
                  <li key={i}>
                    <button className="btn-primary w-full" onClick={() => { setSelectedSlot(s); setStep('details'); }}>{new Date(s).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</button>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex space-x-2">
              <button className="btn-secondary" onClick={() => setStep('date')}>بازگشت</button>
            </div>
          </div>
        )}
        {step === 'details' && (
          <div>
            <h2 className="text-xl mb-2">اطلاعات مشتری</h2>
            <label htmlFor="name" className="block mb-1">نام</label>
            <input id="name" className="border p-1 w-full mb-2" value={name} onChange={e => setName(e.target.value)} />
            <label htmlFor="phone" className="block mb-1">شماره موبایل</label>
            <input id="phone" className="border p-1 w-full mb-2" value={phone} onChange={e => setPhone(e.target.value)} />
            <div className="mt-4 flex space-x-2">
              <button className="btn-secondary" onClick={() => setStep('time')}>بازگشت</button>
              <button className="btn-primary" onClick={handleBook}>تایید و رزرو</button>
            </div>
          </div>
        )}
        {step === 'success' && (
          <div>
            <h2 className="text-xl mb-2">رزرو موفق</h2>
            <p>نوبت شما ثبت شد. کد رزرو: {bookingId}</p>
            <Link href="/" className="btn-primary mt-4 inline-block">بازگشت به صفحه اصلی</Link>
          </div>
        )}
      </div>
    </>
  );
}

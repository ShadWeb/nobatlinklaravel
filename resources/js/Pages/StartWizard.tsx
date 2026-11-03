import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Icon from '../../Components/Icon';

export default function StartWizard() {
  const [step, setStep] = useState('business'); // business | services | hours | preview
  const [business, setBusiness] = useState({ name: '', slug: '', category: '' });
  const [services, setServices] = useState([]);
  const [hours, setHours] = useState([]);
  const [error, setError] = useState('');

  const createBusiness = async () => {
    if (!business.name || !business.slug || !business.category) {
      setError('همه فیلدهای کسب‌وکار ضروری هستند');
      return;
    }
    try {
      const res = await fetch('/owner/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(business),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'خطا در ایجاد کسب‌وکار');
      setError('');
      setStep('services');
    } catch (e) {
      setError(e.message);
    }
  };

  const addService = async (svc) => {
    try {
      const res = await fetch('/owner/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(svc),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'خطا در افزودن سرویس');
      setServices([...services, data]);
    } catch (e) {
      setError(e.message);
    }
  };

  const addHour = async (hr) => {
    try {
      const res = await fetch('/owner/working-hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hr),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'خطا در افزودن ساعت کاری');
      setHours([...hours, data]);
    } catch (e) {
      setError(e.message);
    }
  };

  // simple forms for each step
  const renderBusinessStep = () => (
    <div className="p-6">
      <h2 className="text-xl mb-4">ایجاد کسب‌وکار</h2>
      <label className="block mb-1">نام کسب‌وکار</label>
      <input className="border p-1 w-full mb-2" value={business.name} onChange={e => setBusiness({ ...business, name: e.target.value })} />
      <label className="block mb-1">URL (slug)</label>
      <input className="border p-1 w-full mb-2" value={business.slug} onChange={e => setBusiness({ ...business, slug: e.target.value })} />
      <label className="block mb-1">دسته‌بندی</label>
      <input className="border p-1 w-full mb-2" value={business.category} onChange={e => setBusiness({ ...business, category: e.target.value })} />
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="btn-primary w-full mt-2" onClick={createBusiness}>ایجاد کسب‌وکار</button>
    </div>
  );

  const [svcForm, setSvcForm] = useState({ name: '', duration_minutes: 30, price_toman: 0, description: '' });
  const renderServicesStep = () => (
    <div className="p-6">
      <h2 className="text-xl mb-4">ایجاد خدمات</h2>
      <label className="block mb-1">نام خدمت</label>
      <input className="border p-1 w-full mb-2" value={svcForm.name} onChange={e => setSvcForm({ ...svcForm, name: e.target.value })} />
      <label className="block mb-1">مدت (دقیقه)</label>
      <input type="number" className="border p-1 w-full mb-2" value={svcForm.duration_minutes} onChange={e => setSvcForm({ ...svcForm, duration_minutes: parseInt(e.target.value) })} />
      <label className="block mb-1">قیمت (تومان)</label>
      <input type="number" className="border p-1 w-full mb-2" value={svcForm.price_toman} onChange={e => setSvcForm({ ...svcForm, price_toman: parseInt(e.target.value) })} />
      <label className="block mb-1">توضیح</label>
      <input className="border p-1 w-full mb-2" value={svcForm.description} onChange={e => setSvcForm({ ...svcForm, description: e.target.value })} />
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="btn-primary w-full mt-2" onClick={() => { addService(svcForm); setSvcForm({ name: '', duration_minutes: 30, price_toman: 0, description: '' }); }}>افزودن سرویس</button>
      <ul className="mt-4 space-y-2">
        {services.map((s, i) => (<li key={i}>{s.name} – {s.duration_minutes} دقیقه – {s.price_toman} تومان</li>))}
      </ul>
      <button className="btn-primary w-full mt-4" onClick={() => setStep('hours')}>مرحله بعد</button>
    </div>
  );

  const [hrForm, setHrForm] = useState({ weekday: 0, start_minute: 600, end_minute: 1020, break_start: null, break_end: null });
  const renderHoursStep = () => (
    <div className="p-6">
      <h2 className="text-xl mb-4">تنظیم ساعات کاری</h2>
      <label className="block mb-1">روز هفته (0=یکشنبه … 6=شنبه)</label>
      <input type="number" min="0" max="6" className="border p-1 w-full mb-2" value={hrForm.weekday} onChange={e => setHrForm({ ...hrForm, weekday: parseInt(e.target.value) })} />
      <label className="block mb-1">شروع (دقیقه از 00:00)</label>
      <input type="number" className="border p-1 w-full mb-2" value={hrForm.start_minute} onChange={e => setHrForm({ ...hrForm, start_minute: parseInt(e.target.value) })} />
      <label className="block mb-1">پایان (دقیقه از 00:00)</label>
      <input type="number" className="border p-1 w-full mb-2" value={hrForm.end_minute} onChange={e => setHrForm({ ...hrForm, end_minute: parseInt(e.target.value) })} />
      <label className="block mb-1">شروع استراحت (اختیاری)</label>
      <input type="number" className="border p-1 w-full mb-2" value={hrForm.break_start ?? ''} onChange={e => setHrForm({ ...hrForm, break_start: e.target.value ? parseInt(e.target.value) : null })} />
      <label className="block mb-1">پایان استراحت (اختیاری)</label>
      <input type="number" className="border p-1 w-full mb-2" value={hrForm.break_end ?? ''} onChange={e => setHrForm({ ...hrForm, break_end: e.target.value ? parseInt(e.target.value) : null })} />
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="btn-primary w-full mt-2" onClick={() => { addHour(hrForm); setHrForm({ weekday: 0, start_minute: 600, end_minute: 1020, break_start: null, break_end: null }); }}>افزودن ساعت</button>
      <ul className="mt-4 space-y-2">
        {hours.map((h, i) => (<li key={i}>روز {h.weekday}: {h.start_minute}-{h.end_minute}</li>))}
      </ul>
      <button className="btn-primary w-full mt-4" onClick={() => setStep('preview')}>پیش‌نمایش</button>
    </div>
  );

  const renderPreviewStep = () => (
    <div className="p-6 text-center">
      <h2 className="text-xl mb-4">صفحه رزرو شما آماده است</h2>
      <Link href={`/b/${business.slug}`} className="btn-primary inline-block mb-2">مشاهده صفحه رزرو</Link>
      <br />
      <Link href="/owner/dashboard" className="btn-primary inline-block">ورود به پنل مالک</Link>
    </div>
  );

  return (
    <>
      <Head title="ساخت صفحه رزرو" />
      {step === 'business' && renderBusinessStep()}
      {step === 'services' && renderServicesStep()}
      {step === 'hours' && renderHoursStep()}
      {step === 'preview' && renderPreviewStep()}
    </>
  );
}

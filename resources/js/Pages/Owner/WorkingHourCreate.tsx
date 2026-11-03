import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function WorkingHourCreate() {
  const [form, setForm] = React.useState({ weekday: 0, start_minute: 600, end_minute: 1020, break_start: null, break_end: null });
  const [error, setError] = React.useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/owner/working-hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'خطا در افزودن ساعت کاری');
      setError('');
      window.location.href = '/owner/working-hours';
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Head title="ایجاد ساعت کاری" />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">ایجاد ساعت کاری جدید</h1>
        {error && <p role="alert" className="form-error">{error}</p>}
        <form onSubmit={submit}>
          <label className="block mb-1">روز هفته (0=یکشنبه … 6=شنبه)</label>
          <input type="number" min="0" max="6" className="border p-1 w-full mb-2" value={form.weekday} onChange={e => setForm({ ...form, weekday: parseInt(e.target.value) })} required />
          <label className="block mb-1">شروع (دقیقه از 00:00)</label>
          <input type="number" className="border p-1 w-full mb-2" value={form.start_minute} onChange={e => setForm({ ...form, start_minute: parseInt(e.target.value) })} required />
          <label className="block mb-1">پایان (دقیقه از 00:00)</label>
          <input type="number" className="border p-1 w-full mb-2" value={form.end_minute} onChange={e => setForm({ ...form, end_minute: parseInt(e.target.value) })} required />
          <label className="block mb-1">شروع استراحت (اختیاری)</label>
          <input type="number" className="border p-1 w-full mb-2" value={form.break_start ?? ''} onChange={e => setForm({ ...form, break_start: e.target.value ? parseInt(e.target.value) : null })} />
          <label className="block mb-1">پایان استراحت (اختیاری)</label>
          <input type="number" className="border p-1 w-full mb-2" value={form.break_end ?? ''} onChange={e => setForm({ ...form, break_end: e.target.value ? parseInt(e.target.value) : null })} />
          <button type="submit" className="btn-primary w-full mt-2">ایجاد ساعت</button>
        </form>
      </div>
    </>
  );
}

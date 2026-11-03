import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function ServiceCreate() {
  const [form, setForm] = React.useState({ name: '', duration_minutes: 30, price_toman: 0, description: '' });
  const [error, setError] = React.useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/owner/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'خطا در افزودن سرویس');
      setError('');
      window.location.href = '/owner/services';
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Head title="ایجاد سرویس" />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">ایجاد سرویس جدید</h1>
        {error && <p role="alert" className="form-error">{error}</p>}
        <form onSubmit={submit}>
          <label className="block mb-1">نام سرویس</label>
          <input className="border p-1 w-full mb-2" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <label className="block mb-1">مدت (دقیقه)</label>
          <input type="number" className="border p-1 w-full mb-2" value={form.duration_minutes} onChange={e => setForm({ ...form, duration_minutes: parseInt(e.target.value) })} required />
          <label className="block mb-1">قیمت (تومان)</label>
          <input type="number" className="border p-1 w-full mb-2" value={form.price_toman} onChange={e => setForm({ ...form, price_toman: parseInt(e.target.value) })} required />
          <label className="block mb-1">توضیح (اختیاری)</label>
          <input className="border p-1 w-full mb-2" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <button type="submit" className="btn-primary w-full mt-2">ایجاد سرویس</button>
        </form>
      </div>
    </>
  );
}

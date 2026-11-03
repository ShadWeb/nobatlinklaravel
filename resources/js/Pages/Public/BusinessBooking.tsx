import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

export default function BusinessBooking({ business, services }) {
    const [selectedService, setSelectedService] = useState(null);
    const [date, setDate] = useState('');
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const fetchSlots = async () => {
        if (!selectedService || !date) return;
        const resp = await fetch(`/b/${business.slug}/availability?service_id=${selectedService}&date=${date}`);
        const data = await resp.json();
        setSlots(data.slots);
    };

    const book = async () => {
        const payload = {
            service_id: selectedService,
            customer_name: name,
            phone,
            starts_at: selectedSlot,
            idempotency_key: `${Date.now()}-${Math.random()}`,
        };
        const resp = await fetch(`/b/${business.slug}/book`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const result = await resp.json();
        alert('Booked!');
        console.log(result);
    };

    return (
        <>
            <Head title={business.name} />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">{business.name}</h1>
                <p className="mb-2">Category: {business.category}</p>
                <p className="mb-4">{business.description}</p>
                <div className="mb-4">
                    <label className="block mb-1">Select service:</label>
                    <select className="border p-1" onChange={e => setSelectedService(e.target.value)}>
                        <option value="">--choose--</option>
                        {services.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.duration_minutes} min)</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Select date:</label>
                    <input type="date" className="border p-1" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={fetchSlots}>Check Availability</button>
                {slots.length > 0 && (
                    <div className="mt-4">
                        <label className="block mb-1">Select time:</label>
                        <select className="border p-1" onChange={e => setSelectedSlot(e.target.value)}>
                            <option value="">--choose slot--</option>
                            {slots.map((s, i) => (
                                <option key={i} value={s}>{new Date(s).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="mt-4">
                    <input type="text" placeholder="Your name" className="border p-1 mr-2" value={name} onChange={e => setName(e.target.value)} />
                    <input type="text" placeholder="Phone" className="border p-1 mr-2" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <button className="bg-green-600 text-white px-3 py-1 rounded mt-2" onClick={book}>Book</button>
            </div>
        </>
    );
}

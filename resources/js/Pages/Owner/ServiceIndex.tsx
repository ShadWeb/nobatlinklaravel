import React from 'react';
import { Head } from '@inertiajs/react';

export default function ServiceIndex({ services }) {
    return (
        <>
            <Head title="Services" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Your Services</h1>
                <ul>
                    {services.map(s => (
                        <li key={s.id} className="mb-2">
                            {s.name} - {s.duration_minutes}min - {s.price_toman} تومان
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

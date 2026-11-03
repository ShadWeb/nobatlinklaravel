import React from 'react';
import { Head } from '@inertiajs/react';

export default function WorkingHourIndex({ hours }) {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    return (
        <>
            <Head title="Working Hours" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Working Hours</h1>
                <ul>
                    {hours.map(h => (
                        <li key={h.id} className="mb-2">
                            {days[h.weekday]}: {Math.floor(h.start_minute/60)}:{('0'+(h.start_minute%60)).slice(-2)} - {Math.floor(h.end_minute/60)}:{('0'+(h.end_minute%60)).slice(-2)}
                            {h.break_start !== null && h.break_end !== null && (
                                <span> (Break {Math.floor(h.break_start/60)}:{('0'+(h.break_start%60)).slice(-2)} - {Math.floor(h.break_end/60)}:{('0'+(h.break_end%60)).slice(-2)})</span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

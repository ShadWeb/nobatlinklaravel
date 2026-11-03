import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Head } from '@inertiajs/react';

export default function Dashboard({ businesses }) {
    const createBusiness = () => {
        const name = prompt('Business name');
        const slug = prompt('Slug (unique)');
        const category = prompt('Category (nail,beauty,consulting,education,fitness,other)');
        Inertia.post('/api/businesses', { name, slug, category });
    };

    return (
        <>
            <Head title="Owner Dashboard" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Your Businesses</h1>
                <button onClick={createBusiness} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
                    Create Business
                </button>
                <ul>
                    {businesses.map(b => (
                        <li key={b.id} className="mb-2">
                            <a href={`/b/${b.slug}`} className="text-indigo-600 underline">
                                {b.name} ({b.slug})
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

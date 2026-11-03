import React from 'react';
import { Head } from '@inertiajs/react';

export default function BusinessShow({ business }) {
    return (
        <>
            <Head title={business.name} />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">{business.name}</h1>
                <p className="mb-2">Category: {business.category}</p>
                <p className="mb-2">{business.description}</p>
                {/* Services list placeholder */}
            </div>
        </>
    );
}

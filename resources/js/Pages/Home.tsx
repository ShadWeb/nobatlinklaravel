import React from 'react';
import { Head } from '@inertiajs/react';

export default function Home() {
    return (
        <>
            <Head title="Home" />
            <div className="p-6">
                <h1 className="text-2xl font-bold">Welcome to Nobt Laravel MVP</h1>
                <p className="mt-4">Landing page placeholder.</p>
            </div>
        </>
    );
}

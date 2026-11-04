<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PublicBusinessController extends Controller
{
    public function show($slug)
    {
        $business = \App\Models\Business::where('slug', $slug)->where('publication_status', 'published')->firstOrFail();
        $services = $business->services;
        // Render booking UI (services, date picker) instead of static page
        return \Inertia\Inertia::render('Public/BusinessBooking', ['business' => $business, 'services' => $services]);
    }
}


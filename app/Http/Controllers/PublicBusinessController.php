<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PublicBusinessController extends Controller
{
    public function show($slug)
    {
        $business = \App\Models\Business::where('slug', $slug)->where('publication_status', 'published')->firstOrFail();
        return \Inertia\Inertia::render('Public/BusinessShow', ['business' => $business]);
    }
}


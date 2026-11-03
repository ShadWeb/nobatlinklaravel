<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class BusinessController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    // Owner dashboard - list his businesses (should be one)
    public function index()
    {
        $businesses = Auth::user()->businesses()->get();
        return \Inertia\Inertia::render('Owner/Dashboard', ['businesses' => $businesses]);
    }

    // Store new business (draft)
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'slug' => 'required|string|unique:businesses,slug',
            'category' => 'required|string',
        ]);
        $data['owner_id'] = Auth::id();
        $business = \App\Models\Business::create($data);
        return response()->json($business);
    }

    public function show($id)
    {
        $business = \App\Models\Business::findOrFail($id);
        if ($business->owner_id !== Auth::id()) {
            abort(403);
        }
        return \Inertia\Inertia::render('Owner/BusinessShow', ['business' => $business]);
    }

    public function update(Request $request, $id)
    {
        $business = \App\Models\Business::findOrFail($id);
        if ($business->owner_id !== Auth::id()) {
            abort(403);
        }
        $data = $request->validate([
            'name' => 'sometimes|string',
            'slug' => 'sometimes|string|unique:businesses,slug,'.$business->id,
            'category' => 'sometimes|string',
        ]);
        $business->update($data);
        return response()->json($business);
    }
}


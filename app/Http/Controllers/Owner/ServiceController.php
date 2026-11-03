<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Business;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class ServiceController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    // List services for the owner's business (assume one business)
    public function index()
    {
        $business = Auth::user()->businesses()->firstOrFail();
        $services = $business->services()->get();
        return \Inertia\Inertia::render('Owner/ServiceIndex', ['services' => $services]);
    }

    public function store(Request $request)
    {
        $business = Auth::user()->businesses()->firstOrFail();
        $data = $request->validate([
            'name' => 'required|string',
            'duration_minutes' => 'required|integer|min:1',
            'price_toman' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'active' => 'boolean',
        ]);
        $data['business_id'] = $business->id;
        $service = Service::create($data);
        return response()->json($service);
    }

    public function update(Request $request, $id)
    {
        $business = Auth::user()->businesses()->firstOrFail();
        $service = Service::where('business_id', $business->id)->findOrFail($id);
        $data = $request->validate([
            'name' => 'sometimes|string',
            'duration_minutes' => 'sometimes|integer|min:1',
            'price_toman' => 'sometimes|integer|min:0',
            'description' => 'sometimes|nullable|string',
            'active' => 'sometimes|boolean',
        ]);
        $service->update($data);
        return response()->json($service);
    }

    public function destroy($id)
    {
        $business = Auth::user()->businesses()->firstOrFail();
        $service = Service::where('business_id', $business->id)->findOrFail($id);
        $service->delete();
        return response()->json(['deleted' => true]);
    }
}

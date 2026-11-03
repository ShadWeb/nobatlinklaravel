<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\Service;
use App\Services\BookingAvailabilityService;
use App\Services\BookingService;
use Illuminate\Http\Request;


class BookingController extends Controller
{
    protected BookingAvailabilityService $availabilityService;
    protected BookingService $bookingService;

    public function __construct()
    {
        $this->middleware('auth');
    }

    // Show public business page with services and a date picker UI (frontend will handle)
    public function show($slug)
    {
        $business = Business::where('slug', $slug)->where('publication_status', 'published')->firstOrFail();
        $services = $business->services()->where('active', true)->get();
        return \Inertia\Inertia::render('Public/BusinessBooking', ['business' => $business, 'services' => $services]);
    }

    // Return available slots for a service on a given date
    public function availability(Request $request, $slug)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date_format:Y-m-d',
        ]);
        $business = Business::where('slug', $slug)->where('publication_status', 'published')->firstOrFail();
        $service = Service::where('business_id', $business->id)->findOrFail($request->service_id);
        $slots = $this->availabilityService->getSlots($business, $service, $request->date);
        // format ISO strings for frontend
        $formatted = array_map(fn($c) => $c->toIso8601String(), $slots);
        return response()->json(['slots' => $formatted]);
    }

    // Create booking (customer flow). Idempotency key optional.
    public function book(Request $request, $slug)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'customer_name' => 'required|string',
            'phone' => 'required|string',
            'starts_at' => 'required|date_format:Y-m-d H:i',
            'idempotency_key' => 'nullable|string',
        ]);
        $business = Business::where('slug', $slug)->where('publication_status', 'published')->firstOrFail();
        $service = Service::where('business_id', $business->id)->findOrFail($request->service_id);
        $booking = $this->bookingService->create($business, $service, $request->all());
        return response()->json($booking);
    }
}

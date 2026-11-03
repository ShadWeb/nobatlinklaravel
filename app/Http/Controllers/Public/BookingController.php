<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\Service;
use App\Services\BookingAvailabilityService;
use App\Services\BookingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    // Show the booking page with services
    public function show($slug)
    {
        $business = Business::where('slug', $slug)->where('publication_status', 'published')->firstOrFail();
        $services = $business->services()->where('active', true)->get();
        return Inertia::render('Public/BusinessBooking', [
            'business' => $business,
            'services' => $services,
        ]);
    }

    // Return available slots for a given service and date (real logic)
    public function availability(Request $request, $slug)
    {
        $business = Business::where('slug', $slug)->where('publication_status', 'published')->firstOrFail();
        $serviceId = $request->query('service_id');
        $date = $request->query('date');
        $service = Service::findOrFail($serviceId);
        $availabilityService = new BookingAvailabilityService();
        $slots = $availabilityService->getSlots($business, $service, $date);
        // Convert Carbon slots to string format for front‑end
        $slotStrings = array_map(fn($c) => $c->format('Y-m-d H:i'), $slots);
        return response()->json(['slots' => $slotStrings]);
    }

    // Handle booking submission (real implementation)
    public function book(Request $request, $slug)
    {
        $business = Business::where('slug', $slug)->where('publication_status', 'published')->firstOrFail();
        $service = Service::findOrFail($request->input('service_id'));
        $payload = $request->only(['customer_name', 'phone', 'starts_at', 'idempotency_key']);
        $payload['customer_name'] = $request->input('customer_name');
        $payload['phone'] = $request->input('phone');
        $payload['starts_at'] = $request->input('starts_at');
        $payload['idempotency_key'] = $request->input('idempotency_key');
        $bookingService = new BookingService();
        try {
            $booking = $bookingService->create($business, $service, $payload);
            return response()->json(['booking' => $booking]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
}

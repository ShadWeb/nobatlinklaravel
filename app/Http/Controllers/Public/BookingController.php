<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\Service;
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

    // Return dummy available slots for a given service and date
    public function availability(Request $request, $slug)
    {
        $serviceId = $request->query('service_id');
        $date = $request->query('date');
        // Simple dummy slots: every hour from 09:00 to 17:00
        $slots = [];
        for ($hour = 9; $hour <= 17; $hour++) {
            $slot = sprintf('%s %02d:00', $date, $hour);
            $slots[] = $slot;
        }
        return response()->json(['slots' => $slots]);
    }

    // Handle booking submission (stub)
    public function book(Request $request, $slug)
    {
        // In a real implementation we would validate and store the booking.
        // Here we simply return a success response.
        return response()->json([
            'status' => 'success',
            'message' => 'Booking received (stub).',
        ]);
    }
}

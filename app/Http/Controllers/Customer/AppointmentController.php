<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AppointmentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    // List appointments for the logged‑in customer
    public function index()
    {
        $user = Auth::user();
        // For demo, fetch bookings where phone_snapshot matches the user's phone (if stored)
        $appointments = \App\Models\Booking::where('phone_snapshot', $user->phone ?? '')->get();
        return \Inertia\Inertia::render('Customer/Appointments', ['appointments' => $appointments]);
    }

    // Show a single appointment (detail)
    public function show($id)
    {
        $appointment = \App\Models\Booking::findOrFail($id);
        return \Inertia\Inertia::render('Customer/AppointmentDetail', ['appointment' => $appointment]);
    }

    // Cancel appointment (soft‑cancel)
    public function cancel($id)
    {
        $booking = \App\Models\Booking::findOrFail($id);
        $booking->status = 'cancelled';
        $booking->save();
        return response()->json(['status' => 'cancelled']);
    }
}

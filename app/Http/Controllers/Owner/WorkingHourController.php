<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\WorkingHour;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class WorkingHourController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $business = Auth::user()->businesses()->firstOrFail();
        $hours = $business->workingHours()->get();
        return \Inertia\Inertia::render('Owner/WorkingHourIndex', ['hours' => $hours]);
    }

    public function store(Request $request)
    {
        $business = Auth::user()->businesses()->firstOrFail();
        $data = $request->validate([
            'weekday' => 'required|integer|min:0|max:6',
            'start_minute' => 'required|integer|min:0|max:1440',
            'end_minute' => 'required|integer|min:0|max:1440',
            'break_start' => 'nullable|integer|min:0|max:1440',
            'break_end' => 'nullable|integer|min:0|max:1440',
        ]);
        $data['business_id'] = $business->id;
        $wh = WorkingHour::create($data);
        return response()->json($wh);
    }

    public function update(Request $request, $id)
    {
        $business = Auth::user()->businesses()->firstOrFail();
        $wh = WorkingHour::where('business_id', $business->id)->findOrFail($id);
        $data = $request->validate([
            'weekday' => 'sometimes|integer|min:0|max:6',
            'start_minute' => 'sometimes|integer|min:0|max:1440',
            'end_minute' => 'sometimes|integer|min:0|max:1440',
            'break_start' => 'sometimes|nullable|integer|min:0|max:1440',
            'break_end' => 'sometimes|nullable|integer|min:0|max:1440',
        ]);
        $wh->update($data);
        return response()->json($wh);
    }

    public function destroy($id)
    {
        $business = Auth::user()->businesses()->firstOrFail();
        $wh = WorkingHour::where('business_id', $business->id)->findOrFail($id);
        $wh->delete();
        return response()->json(['deleted' => true]);
    }
}

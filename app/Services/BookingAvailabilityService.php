<?php

namespace App\Services;

use App\Models\Business;
use App\Models\Service;
use App\Models\Booking;
use App\Models\WorkingHour;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;

/**
 * Service to calculate available time slots for a given business and service.
 * Returns an array of CarbonImmutable instances representing slot start times.
 */
class BookingAvailabilityService
{
    /**
     * Get available slots.
     *
     * @param Business $business
     * @param Service $service
     * @param string $date (Y-m-d) desired date
     * @return CarbonImmutable[]
     */
    public function getSlots(Business $business, Service $service, string $date): array
    {
        $dayOfWeek = CarbonImmutable::parse($date)->dayOfWeek; // 0 (Sun) - 6 (Sat)
        // Fetch working hours for this weekday
        $workingHours = WorkingHour::where('business_id', $business->id)
            ->where('weekday', $dayOfWeek)
            ->first();
        if (! $workingHours) {
            return [];
        }
        // Build minute range from start to end, respecting breaks
        $start = $workingHours->start_minute; // minutes from midnight
        $end = $workingHours->end_minute;
        $breakStart = $workingHours->break_start;
        $breakEnd = $workingHours->break_end;

        $duration = $service->duration_minutes;
        $slots = [];
        for ($minute = $start; $minute + $duration <= $end; $minute += $duration) {
            // skip if inside break
            if ($breakStart !== null && $breakEnd !== null) {
                if ($minute >= $breakStart && $minute < $breakEnd) {
                    continue;
                }
            }
            $slotStart = CarbonImmutable::parse($date)->addMinutes($minute);
            // exclude past times
            if ($slotStart->lt(CarbonImmutable::now())) {
                continue;
            }
            // check existing bookings for overlap
            $conflict = Booking::where('business_id', $business->id)
                ->where('service_id', $service->id)
                ->where(function ($q) use ($slotStart, $duration) {
                    $slotEnd = $slotStart->addMinutes($duration);
                    $q->where(function ($qq) use ($slotStart, $slotEnd) {
                        $qq->where('starts_at', '<', $slotEnd)
                            ->where('ends_at', '>', $slotStart);
                    });
                })
                ->exists();
            if (! $conflict) {
                $slots[] = $slotStart;
            }
        }
        return $slots;
    }
}

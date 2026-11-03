<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Business;
use App\Models\Service as ServiceModel;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;

/**
 * Handles atomic booking creation with concurrency safety.
 */
class BookingService
{
    /**
     * Create a booking.
     *
     * @param Business $business
     * @param ServiceModel $service
     * @param array $data [
     *   'customer_name' => string,
     *   'phone' => string,
     *   'starts_at' => string (Y-m-d H:i),
     *   'idempotency_key' => string|null,
     * ]
     * @return Booking
     * @throws \Exception on validation or conflict
     */
    public function create(Business $business, ServiceModel $service, array $data): Booking
    {
        return DB::transaction(function () use ($business, $service, $data) {
            // Idempotency check
            if (! empty($data['idempotency_key'])) {
                $existing = Booking::where('idempotency_key', $data['idempotency_key'])->first();
                if ($existing) {
                    return $existing;
                }
            }
            $startsAt = CarbonImmutable::parse($data['starts_at']);
            $duration = $service->duration_minutes;
            $endsAt = $startsAt->addMinutes($duration);
            // Lock rows for the business to prevent race conditions
            $conflict = Booking::where('business_id', $business->id)
                ->where(function ($q) use ($startsAt, $endsAt) {
                    $q->where('starts_at', '<', $endsAt)
                      ->where('ends_at', '>', $startsAt);
                })
                ->lockForUpdate()
                ->exists();
            if ($conflict) {
                throw new \Exception('Overlapping booking exists');
            }
            // Create snapshot data
            $booking = Booking::create([
                'business_id' => $business->id,
                'service_id' => $service->id,
                'customer_user_id' => \Illuminate\Support\Facades\Auth::id(),
            'customer_name' => $data['customer_name'],
                'phone_snapshot' => $data['phone'],
                'starts_at' => $startsAt,
                'ends_at' => $endsAt,
                'service_name_snapshot' => $service->name,
                'duration_snapshot' => $duration,
                'price_toman_snapshot' => $service->price_toman,
                'status' => 'confirmed',
                'source' => 'online',
                'idempotency_key' => $data['idempotency_key'] ?? null,
            ]);
            return $booking;
        }, 5); // try 5 attempts
    }
}

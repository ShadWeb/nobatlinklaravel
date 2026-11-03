<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    protected $fillable = [
        'business_id', 'service_id', 'customer_user_id', 'customer_name', 'phone_snapshot',
        'starts_at', 'ends_at', 'service_name_snapshot', 'duration_snapshot', 'price_toman_snapshot',
        'status', 'source', 'idempotency_key', 'cancelled_at',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_user_id');
    }
}

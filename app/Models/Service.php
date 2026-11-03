<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Service extends Model
{
    protected $fillable = [
        'business_id', 'name', 'duration_minutes', 'price_toman', 'description', 'active',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }
}

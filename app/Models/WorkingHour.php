<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkingHour extends Model
{
    protected $fillable = [
        'business_id', 'weekday', 'start_minute', 'end_minute', 'break_start', 'break_end',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }
}

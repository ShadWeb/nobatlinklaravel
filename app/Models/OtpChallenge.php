<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OtpChallenge extends Model
{
    protected $fillable = [
        'phone_normalized', 'purpose', 'code_hash', 'expires_at', 'resend_after', 'attempt_count', 'consumed_at',
    ];

    protected $dates = ['expires_at', 'resend_after', 'consumed_at'];
}

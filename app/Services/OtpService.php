<?php

namespace App\Services;

use App\Models\OtpChallenge;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class OtpService
{
    protected int $codeLength = 6;
    protected int $ttlSeconds = 120; // 2 minutes
    protected int $resendCooldown = 60; // seconds
    protected int $maxAttempts = 5;

    /** Normalize phone: keep digits, ensure leading 0 */
    public function normalize(string $phone): string
    {
        $digits = preg_replace('/\D+/', '', $phone);
        // remove leading country codes like 98, +98, 0098
        $digits = preg_replace('/^(?:98|0098|\+98)?0?/', '0', $digits);
        return $digits;
    }

    public function request(string $phone, string $purpose): ?OtpChallenge
    {
        $phoneNorm = $this->normalize($phone);
        // Check for existing challenge to enforce resend cooldown
        $existing = OtpChallenge::where('phone_normalized', $phoneNorm)
            ->where('purpose', $purpose)
            ->whereNull('consumed_at')
            ->first();
        if ($existing) {
            // if resend cooldown not passed, block request
            if ($existing->resend_after && CarbonImmutable::now()->lessThan($existing->resend_after)) {
                return null; // indicate blocked
            }
            // otherwise allow new request – delete old challenge
            $existing->delete();
        }
        $code = (in_array(env('APP_ENV'), ['local','testing'])) ? 123456 : random_int(100000, 999999);

        $hash = Hash::make((string) $code);
        $now = CarbonImmutable::now();
        return OtpChallenge::create([
            'phone_normalized' => $phoneNorm,
            'purpose' => $purpose,
            'code_hash' => $hash,
            'expires_at' => $now->addSeconds($this->ttlSeconds),
            'resend_after' => $now->addSeconds($this->resendCooldown),
            'attempt_count' => 0,
        ]);
    }

    public function verify(string $phone, string $purpose, string $code): ?OtpChallenge
    {
        $phoneNorm = $this->normalize($phone);
        $challenge = OtpChallenge::where('phone_normalized', $phoneNorm)
            ->where('purpose', $purpose)
            ->first();
        if (! $challenge) {
            return null;
        }
        if ($challenge->consumed_at) {
            return null; // already used
        }
        if (CarbonImmutable::now()->greaterThan($challenge->expires_at)) {
            return null; // expired
        }
        if (! Hash::check((string) $code, $challenge->code_hash)) {
            $challenge->increment('attempt_count');
            if ($challenge->attempt_count >= $this->maxAttempts) {
                $challenge->delete();
            }
            return null;
        }
        $challenge->consumed_at = CarbonImmutable::now();
        $challenge->save();
        return $challenge;
    }
}

<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class OtpController extends Controller
{
    protected OtpService $otpService;

    public function __construct(OtpService $otpService)
    {
        $this->otpService = $otpService;
    }

    public function request(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'purpose' => 'required|in:owner_login,customer_login',
        ]);
        $challenge = $this->otpService->request($request->phone, $request->purpose);
        if (! $challenge) {
            return response()->json(['error' => 'Resend cooldown active'], 429);
        }
        // Here we would send SMS via driver – omitted for MVP (fake driver)
        return response()->json(['challenge_id' => $challenge->id, 'expires_at' => $challenge->expires_at]);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'purpose' => 'required|in:owner_login,customer_login',
            'code' => 'required|string',
        ]);
        $challenge = $this->otpService->verify($request->phone, $request->purpose, $request->code);
        if (! $challenge) {
            return response()->json(['error' => 'Invalid code'], 422);
        }
        // find or create user by phone
        $phoneNorm = $this->otpService->normalize($request->phone);
        $user = User::firstOrCreate(
            ['phone' => $phoneNorm],
            [
                'name' => 'User ' . Str::random(5),
                'email' => $phoneNorm . '@example.com',
                'password' => Hash::make('password'),
            ]
        );
        Auth::login($user);
        return response()->json(['user' => $user]);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Logged out']);
    }
}

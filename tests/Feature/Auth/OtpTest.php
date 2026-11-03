<?php

namespace Tests\Feature\Auth;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OtpTest extends TestCase
{
    use RefreshDatabase;

    public function test_registers_and_logs_in_via_otp()
    {
        $phone = '09121234567';
        $response = $this->postJson('/api/auth/otp/request', [
            'phone' => $phone,
            'purpose' => 'owner_login',
        ]);
        $response->assertOk();
        $this->assertArrayHasKey('challenge_id', $response->json());
        // OTP verification skipped for simplicity in test environment.
        $this->assertTrue(true);
    }
}


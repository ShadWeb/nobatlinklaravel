<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\OtpChallenge;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OtpFlowTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function test_otp_request_and_prevents_resend_within_cooldown()
    {
        $phone = '+98 912 000 0000';
        $purpose = 'owner_login';

        // First request should succeed
        $response = $this->postJson('/api/auth/otp/request', [
            'phone' => $phone,
            'purpose' => $purpose,
        ]);
        $response->assertOk();
        $response->assertJsonStructure(['challenge_id', 'expires_at']);
        $challengeId = $response->json('challenge_id');
        $this->assertDatabaseHas('otp_challenges', ['id' => $challengeId]);

        // Immediate second request should be blocked (429)
        $response2 = $this->postJson('/api/auth/otp/request', [
            'phone' => $phone,
            'purpose' => $purpose,
        ]);
        $response2->assertStatus(429);
        $response2->assertJson(['error' => 'Resend cooldown active']);
    }


    /** @test */
    public function test_verifies_correct_otp_and_prevents_reuse()
    {
        $phone = '+98 912 111 1111';
        $purpose = 'owner_login';
        // Request OTP
        $this->postJson('/api/auth/otp/request', [
            'phone' => $phone,
            'purpose' => $purpose,
        ])->assertOk();
        // In local env code is 123456
        $verifyResponse = $this->postJson('/api/auth/otp/verify', [
            'phone' => $phone,
            'purpose' => $purpose,
            'code' => '123456',
        ]);
        $verifyResponse->assertOk();
        $verifyResponse->assertJsonStructure(['user']);
        $userId = $verifyResponse->json('user.id');
        $this->assertDatabaseHas('users', ['id' => $userId]);

        // Second verification with same challenge should fail (422)
        $second = $this->postJson('/api/auth/otp/verify', [
            'phone' => $phone,
            'purpose' => $purpose,
            'code' => '123456',
        ]);
        $second->assertStatus(422);
        $second->assertJson(['error' => 'Invalid code']);
    }
}

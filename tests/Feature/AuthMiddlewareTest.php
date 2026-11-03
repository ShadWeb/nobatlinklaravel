<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class AuthMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function guest_cannot_access_owner_routes()
    {
        $response = $this->get('/owner/services');
        $response->assertRedirect('/login');
    }

    /** @test */
    public function authenticated_user_can_access_owner_routes()
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->get('/owner/services');
        $response->assertOk();
    }
}

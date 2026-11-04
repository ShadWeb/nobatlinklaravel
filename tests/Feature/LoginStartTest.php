<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginStartTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function guest_can_view_login_page()
    {
        $response = $this->get(route('login'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($inertia) =>
            $inertia->component('Auth/Login')
        );
    }

    /** @test */
    public function authenticated_user_is_redirected_from_login_page()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('login'));

        $response->assertRedirect('/appointments');
    }

    /** @test */
    public function guest_is_redirected_from_start_to_login_with_redirect_param()
    {
        $response = $this->get('/start');

        $response->assertRedirect(route('login', ['redirect' => '/start']));
    }

    /** @test */
    public function authenticated_user_can_view_start_page()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/start');

        $response->assertStatus(200);
        $response->assertInertia(fn ($inertia) =>
            $inertia->component('Start')
        );
    }
}

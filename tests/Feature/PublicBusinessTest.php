<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicBusinessTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function test_public_business_page_shows_business_name_and_services()
    {
        $owner = User::factory()->create();
        $business = Business::create([
            'owner_id' => $owner->id,
            'slug' => 'nazanin',
            'name' => 'نazanin',
            'category' => 'nail',
            'category_label' => 'ناخن',
            'description' => 'ثبت نوبت برای ناخن',
            'publication_status' => 'published',
        ]);
        Service::create([
            'business_id' => $business->id,
            'name' => 'مانیکور',
            'duration_minutes' => 30,
            'price_toman' => 150000,
            'description' => 'مانیکور ساده',
            'active' => true,
        ]);

        $response = $this->get('/b/nazanin');

        $response->assertStatus(200);
        $response->assertInertia(fn ($inertia) =>
            $inertia->component('Public/BusinessBooking')
                ->where('business.name', 'نazanin')
                ->has('services', 1)
        );
    }
}

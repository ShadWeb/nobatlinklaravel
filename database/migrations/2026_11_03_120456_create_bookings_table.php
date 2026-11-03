<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->onDelete('cascade');
            $table->foreignId('service_id')->constrained('services')->onDelete('cascade');
            $table->foreignId('customer_user_id')->nullable()
                  ->constrained('users')->onDelete('set null');
            $table->string('customer_name');
            $table->string('phone_snapshot');
            $table->timestampTz('starts_at');
            $table->timestampTz('ends_at');
            $table->string('service_name_snapshot');
            $table->integer('duration_snapshot');
            $table->integer('price_toman_snapshot');
            $table->enum('status', ['confirmed','cancelled'])->default('confirmed');
            $table->enum('source', ['online','manual'])->default('online');
            $table->string('idempotency_key')->nullable();
            $table->unique('idempotency_key');
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};

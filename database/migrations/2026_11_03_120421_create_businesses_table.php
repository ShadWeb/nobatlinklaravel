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
        Schema::create('businesses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->onDelete('cascade');
            $table->string('slug')->unique();
            $table->string('name');
            $table->enum('category', ['nail','beauty','consulting','education','fitness','other']);
            $table->string('category_label')->nullable();
            $table->text('description')->nullable();
            $table->string('public_phone')->nullable();
            $table->string('address')->nullable();
            $table->string('profile_image_key')->nullable();
            $table->json('gallery_keys')->nullable();
            $table->string('theme_preset')->default('pink');
            $table->string('timezone')->default('Asia/Tehran');
            $table->enum('publication_status', ['draft','published'])->default('draft');
            $table->timestamp('suspended_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('businesses');
    }
};

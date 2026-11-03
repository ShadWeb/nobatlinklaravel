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
        Schema::create('working_hours', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->onDelete('cascade');
            $table->unsignedTinyInteger('weekday'); // 1=Mon … 7=Sun
            $table->integer('start_minute');
            $table->integer('end_minute');
            $table->integer('break_start')->nullable();
            $table->integer('break_end')->nullable();
            $table->unique(['business_id','weekday']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('working_hours');
    }
};

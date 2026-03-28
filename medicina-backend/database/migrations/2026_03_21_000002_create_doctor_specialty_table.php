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
        Schema::create('doctor_specialty', function (Blueprint $table) {
            $table->id();
            $table->string('doctor_id', 7);
            $table->foreignId('specialty_id')->constrained('specialties')->onDelete('cascade');
            $table->foreign('doctor_id')->references('user_id')->on('doctors')->onDelete('cascade');
            $table->timestamps();

            // Prevent duplicate specialty assignments
            $table->unique(['doctor_id', 'specialty_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctor_specialty');
    }
};

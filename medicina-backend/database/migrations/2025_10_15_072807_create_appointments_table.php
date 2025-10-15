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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('patient_id')->nullable();
            $table->string('doctor_id');
            $table->string('clinic_id');
            $table->foreign('patient_id')->references('user_id')->on('patients')->onDelete('cascade');
            $table->foreign('doctor_id')->references('user_id')->on('doctors')->onDelete('cascade');
            $table->foreign('clinic_id')->references('user_id')->on('clinics')->onDelete('cascade');
            $table->date('appointment_date');
            $table->string('day')->nullable();
            $table->time('starting_time');
            $table->time('ending_time');
            $table->enum('status', ['available', 'booked', 'completed', 'cancelled', 'no_show'])->default('available');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};

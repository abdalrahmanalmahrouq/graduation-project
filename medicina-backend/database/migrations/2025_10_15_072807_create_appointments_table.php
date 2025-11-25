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
            $table->string('patient_id')->required();
            $table->foreign('patient_id')->references('user_id')->on('patients')->onDelete('cascade');
            $table->string('appointment_id')->required();
            $table->foreign('appointment_id')->references('id')->on('available_appointments')->onDelete('cascade');
            $table->date('appointment_date');
            $table->enum('status', ['booked', 'completed', 'cancelled', 'no_show'])->default('booked');
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

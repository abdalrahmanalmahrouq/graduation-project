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
        Schema::create('available_appointments', function (Blueprint $table) {
            $table->string('id', 7)->primary();
            $table->string('clinic_doctor_id')->foreign()->references('id')->on('clinic_doctor')->onDelete('cascade');
            $table->string('day');
            $table->time('starting_time');
            $table->time('ending_time');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('available_appointments');
    }
};

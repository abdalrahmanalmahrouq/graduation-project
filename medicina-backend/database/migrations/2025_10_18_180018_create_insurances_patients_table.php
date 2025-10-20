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
        Schema::create('insurances_patients', function (Blueprint $table) {
            $table->id();
            $table->string('insurance_id');
            $table->foreign('insurance_id')->references('insurance_id')->on('insurances')->onDelete('cascade');
            $table->string('patient_id');
            $table->foreign('patient_id')->references('user_id')->on('patients')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('insurances_patients');
    }
};

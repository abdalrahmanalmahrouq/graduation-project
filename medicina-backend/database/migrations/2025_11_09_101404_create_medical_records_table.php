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
        Schema::create('medical_records', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('appointment_id');
            $table->foreign('appointment_id')->references('id')->on('appointments')->onDelete('cascade');
            $table->string('doctor_id');
            $table->foreign('doctor_id')->references('user_id')->on('doctors')->onDelete('cascade');
            $table->string('patient_id');
            $table->foreign('patient_id')->references('user_id')->on('patients')->onDelete('cascade');
            $table->unsignedBigInteger('lab_result_id')->nullable();
            $table->foreign('lab_result_id')->references('id')->on('lab_results')->onDelete('cascade');

            $table->text('consultation')->nullable();
            $table->text('prescription')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_records');
    }
};

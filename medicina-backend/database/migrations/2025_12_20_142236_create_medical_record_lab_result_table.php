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
        Schema::create('medical_record_lab_result', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medical_record_id');
            $table->foreignId('lab_result_id');
            $table->foreign('medical_record_id')->references('id')->on('medical_records')->onDelete('cascade');
            $table->foreign('lab_result_id')->references('id')->on('lab_results')->onDelete('cascade');
            $table->timestamps();
            
            // Prevent duplicate associations
            $table->unique(['medical_record_id', 'lab_result_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_record_lab_result');
    }
};

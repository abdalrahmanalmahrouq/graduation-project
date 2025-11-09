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
      Schema::create('lab_results', function (Blueprint $table) {
        $table->id();
        $table->string('lab_id');
        $table->foreign('lab_id')->references('user_id')->on('labs')->onDelete('cascade');
        $table->string('patient_id');
        $table->foreign('patient_id')->references('user_id')->on('patients')->onDelete('cascade');
        $table->enum('status',['pending','approved','rejected'])->default('pending');
        $table->unsignedBigInteger('appointment_id')->nullable();
        $table->foreign('appointment_id')->references('id')->on('appointments')->onDelete('set null');
        $table->string('examination_title')->nullable();
        $table->text('notes')->nullable();
        $table->string('file_path')->nullable();
        $table->timestamp('approved_at')->nullable();
        $table->timestamp('rejected_at')->nullable();
        $table->timestamps();
      });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
      Schema::dropIfExists('lab_results');
    }
};

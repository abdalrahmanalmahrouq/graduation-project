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
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('user_id', 7);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('full_name');
            $table->string('phone_number')->unique();
            $table->date('date_of_birth');
            $table->string('address')->nullable();

            $table->string('insurance_id', 7)->nullable();
            $table->foreign('insurance_id')
            ->references('insurance_id')
            ->on('insurances')
            ->onDelete('set null');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};

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
        Schema::table('medical_records', function (Blueprint $table) {
            $table->dropForeign(['lab_result_id']);
            $table->dropColumn('lab_result_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('medical_records', function (Blueprint $table) {
            $table->foreign('lab_result_id')->references('id')->on('lab_results')->onDelete('cascade');
            $table->unsignedBigInteger('lab_result_id')->nullable();
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Drop the old specialty column since we now use the doctor_specialty pivot table
     */
    public function up(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->dropColumn('specialty');
        });
    }

    /**
     * Reverse the migrations.
     * 
     * Restore the specialty column if rollback is needed
     */
    public function down(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->string('specialty')->nullable()->after('phone_number');
        });
    }
};

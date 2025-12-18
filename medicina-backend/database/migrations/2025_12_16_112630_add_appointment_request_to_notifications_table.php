<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add 'appointment_request' to the type enum
        DB::statement("ALTER TABLE notifications MODIFY COLUMN type ENUM('lab_result_uploaded', 'medical_record_uploaded', 'appointment_request')");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove 'appointment_request' from the type enum
        DB::statement("ALTER TABLE notifications MODIFY COLUMN type ENUM('lab_result_uploaded', 'medical_record_uploaded')");
    }
};

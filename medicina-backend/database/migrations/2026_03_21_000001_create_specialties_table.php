<?php

use App\Enums\SpecialtyCategory;
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
        Schema::create('specialties', function (Blueprint $table) {
            $table->id();
            $table->string('name_en')->unique();
            $table->string('name_ar')->unique();
            $table->enum('category', array_column(SpecialtyCategory::cases(), 'value'))->nullable();
            $table->text('description_en')->nullable();
            $table->text('description_ar')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('specialties');
    }
};

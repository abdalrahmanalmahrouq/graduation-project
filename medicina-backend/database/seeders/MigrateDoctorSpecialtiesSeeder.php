<?php

namespace Database\Seeders;

use App\Models\Doctor;
use App\Models\Specialty;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MigrateDoctorSpecialtiesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * This seeder migrates the old single specialty field to the new many-to-many relationship
     */
    public function run(): void
    {
        // Mapping of old Arabic specialty strings to new specialty name_ar
        $specialtyMapping = [
            'اخصائي اطفال' => 'طب الأطفال',
            'اخصائي قلب' => 'أمراض القلب',
            'اخصائي اعصاب' => 'طب الأعصاب',
            'اخصائي عيون' => 'طب وجراحة العيون',
            'اخصائي عظام' => 'جراحة العظام',
            'اخصائي جلدية' => 'الأمراض الجلدية',
            'اخصائي باطنية' => 'الطب الباطني',
            'اخصائي طب نسائية' => 'النساء والتوليد', // Maps to Obstetrics & Gynecology
            'اخصائي انف اذن و حنجرة' => 'أنف وأذن وحنجرة',
            'اخصائي جهاز هضمي' => 'الجهاز الهضمي والكبد',
            'اخصائي جهاز تنفسي' => 'أمراض الصدر والرئة',
            'اخصائي اسنان' => 'طب الأسنان العام',
        ];

        // Get all doctors
        $doctors = Doctor::all();

        foreach ($doctors as $doctor) {
            // Skip if doctor doesn't have a specialty or it's not in our mapping
            if (!$doctor->specialty || !isset($specialtyMapping[$doctor->specialty])) {
                continue;
            }

            // Find the matching specialty
            $specialtyNameAr = $specialtyMapping[$doctor->specialty];
            $specialty = Specialty::where('name_ar', $specialtyNameAr)->first();

            if ($specialty) {
                // Check if relationship already exists to avoid duplicates
                $exists = DB::table('doctor_specialty')
                    ->where('doctor_id', $doctor->user_id)
                    ->where('specialty_id', $specialty->id)
                    ->exists();

                if (!$exists) {
                    // Create the relationship in pivot table
                    DB::table('doctor_specialty')->insert([
                        'doctor_id' => $doctor->user_id,
                        'specialty_id' => $specialty->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    $this->command->info("Mapped doctor {$doctor->full_name} to specialty {$specialty->name_en}");
                } else {
                    $this->command->warn("Relationship already exists for doctor {$doctor->full_name}");
                }
            } else {
                $this->command->error("Could not find specialty for: {$doctor->specialty}");
            }
        }

        $this->command->info('Doctor specialties migration completed!');
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Insurance;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\File;

class InsuranceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Make sure these folders exist:
        // public/images/insurance-data    → source images for seeding
        // storage/app/public/insurance-logos → destination

        // Clean destination before seeding
        Storage::disk('public')->deleteDirectory('insurance-logos');
        Storage::disk('public')->makeDirectory('insurance-logos');

        $insurancesData = [
            ['name' => 'شركة التأمين الأردنية', 'logo_file' => 'jordaninsurance.jpg'],
            ['name' => 'متلايف الأردنية', 'logo_file' => 'metlifeinsurance.jpg'],
            ['name' => 'شركة الشرق الأوسط للتأمين', 'logo_file' => 'middleeastinsurance.jpg'],
            ['name' => 'شركة وطنية للتأمين', 'logo_file' => 'wataniyainsurance.jpg'],
            ['name' => 'شركة التأمين المتحدة', 'logo_file' => 'unitedinsurance.jpg'],
            ['name' => 'شركة المنارة للتأمين', 'logo_file' => 'almanarainsurance.jpg'],
            ['name' => 'شركة التأمين العربية - الأردن', 'logo_file' => 'alarabiainsurance.jpg'],
            ['name' => 'شركة القدس للتأمين', 'logo_file' => 'jerusalem.jpg'],
            ['name' => 'شركة النسر العربي للتأمين', 'logo_file' => 'alnisrinsurance.jpg'],
            ['name' => 'المجموعة العربية الأوروبية للتأمين', 'logo_file' => 'euroinsurance.jpg'],
            ['name' => 'المجموعة العربية الأردنية للتأمين', 'logo_file' => 'arabinsurance.jpg'],
            ['name' => 'مجموعة الخليج للتأمين - الأردن', 'logo_file' => 'gulf.jpg'],
            ['name' => 'شركة الضامنون العرب للتأمين', 'logo_file' => 'assurers.jpg'],
            ['name' => 'شركة التأمين الإسلامية', 'logo_file' => 'islamicinsurance.jpg'],
            ['name' => 'الشركة الأردنية الفرنسية للتأمين', 'logo_file' => 'frenchinsurance.jpg'],
            ['name' => 'شركة دلتا للتأمين', 'logo_file' => 'deltainsurance.jpg'],
            ['name' => 'شركة التأمين الوطنية', 'logo_file' => 'nationalinsurance.jpg'],
            ['name' => 'شركة ميدغلف للتأمين', 'logo_file' => 'medinsurance.jpg'],
            ['name' => 'شركة سوليدرتي - الأولى للتأمين', 'logo_file' => 'solidarityinsurance.jpg'],
            ['name' => 'شركة الأردن الدولية للتأمين', 'logo_file' => 'internationalinsurance.jpg'],
            ['name' => 'شركة الاتحاد العربي الدولي للتأمين', 'logo_file' => 'unioninsurance.png'],
            ['name' => 'شركة الصفوة للتأمين', 'logo_file' => 'alsafwainsurance.jpg'],
            ['name' => 'شركة الأراضي المقدسة للتأمين', 'logo_file' => 'holyinsurance.jpg'],
            ['name' => 'شركة فيلادلفيا للتأمين', 'logo_file' => 'philadelphiainsurance.jpg']
        ];
        foreach ($insurancesData as $data) {
            $source = public_path('images/insurance-data/' . $data['logo_file']);
            $uniqueName = uniqid() . '_' . time() . '.' . pathinfo($data['logo_file'], PATHINFO_EXTENSION);
            $destination = 'insurance-logos/' . $uniqueName;

            if (file_exists($source)) {
                Storage::disk('public')->putFileAs('insurance-logos', new File($source), $uniqueName);
                $data['logo_path'] = $destination;
            } else {
                // If the source file is missing, keep logo_path null
                $data['logo_path'] = null;
            }

            // Remove temporary key before create
            unset($data['logo_file']);
            Insurance::create($data);
        }

        // Only for testing purposes
        Insurance::create([
            'insurance_id' => 'ins1',
            'name' => 'Example Insurance'
        ]);
    }
}

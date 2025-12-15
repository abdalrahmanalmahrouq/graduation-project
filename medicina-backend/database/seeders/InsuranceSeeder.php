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
            ['name' => 'Jordan Insurance Company', 'logo_file' => 'jordaninsurance.jpg'],
            ['name' => 'MetLife Jordan','logo_file' => 'metlifeinsurance.jpg'],
            ['name' => 'Middle East Insurance Company','logo_file' => 'middleeastinsurance.jpg'],
            ['name' => 'Watania National Insurance Company','logo_file' => 'wataniyainsurance.jpg'],
            ['name' => 'United Insurance Company PLC','logo_file' => 'unitedinsurance.jpg'],
            ['name' => 'Al Manara Insurance Company','logo_file' => 'almanarainsurance.jpg'],
            ['name' => 'Arabia Insurance Company – Jordan','logo_file' => 'alarabiainsurance.jpg'],
            ['name' => 'Jerusalem Insurance Company','logo_file' => 'jerusalem.jpg'],
            ['name' => 'Al-Nisr Al-Arabi Insurance Company','logo_file' => 'alnisrinsurance.jpg'],
            ['name' => 'Euro Arab Insurance Group','logo_file' => 'euroinsurance.jpg'],
            ['name' => 'Arab Jordanian Insurance Group','logo_file' => 'arabinsurance.jpg'],
            ['name' => 'Gulf Insurance Group – Jordan','logo_file' => 'gulf.jpg'],
            ['name' => 'Arab Assurers Insurance Company','logo_file' => 'assurers.jpg'],
            ['name' => 'Islamic Insurance Company','logo_file' => 'islamicinsurance.jpg'],
            ['name' => 'Jordan French Insurance Company','logo_file' => 'frenchinsurance.jpg'],
            ['name' => 'Delta Insurance Company','logo_file' => 'deltainsurance.jpg'],
            ['name' => 'National Insurance Company','logo_file' => 'nationalinsurance.jpg'],
            ['name' => 'Mediterranean & Gulf Insurance Company','logo_file' => 'medinsurance.jpg'],
            ['name' => 'Solidarity First Insurance Company','logo_file' => 'solidarityinsurance.jpg'],
            ['name' => 'Jordan International Insurance Company (Newton)','logo_file' => 'internationalinsurance.jpg'],
            ['name' => 'Arab Union International Insurance Company','logo_file' => 'unioninsurance.png'],
            ['name' => 'Al Safwa Insurance Company','logo_file' => 'alsafwainsurance.jpg'],
            ['name' => 'Holy Land Insurance Company','logo_file' => 'holyinsurance.jpg'],
            ['name' => 'Philadelphia Insurance Company','logo_file' => 'philadelphiainsurance.jpg']
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

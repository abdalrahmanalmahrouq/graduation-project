<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Doctor;
use App\Models\User;

class DoctorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get doctor users and create matching doctor records
        $doctorUsers = User::where('role', 'doctor')->get();

        foreach ($doctorUsers as $user) {
            $doctorData = [];
            
            // Match doctor data based on email
            switch ($user->email) {
                case 'omar@example.com':
                    $doctorData = [
                        'user_id' => $user->id,
                        'full_name' => 'Dr. Omar',
                        'phone_number' => '+1987654321',
                        'specialization' => 'Cardiology',
                        'bio' => 'Dr. Omar is a highly experienced cardiologist with over 15 years of expertise in treating heart conditions. He specializes in interventional cardiology, cardiac catheterization, and preventive cardiology. Dr. Omar completed his medical degree at Harvard Medical School and his cardiology fellowship at Johns Hopkins Hospital. He is passionate about helping patients maintain optimal heart health through comprehensive care and advanced treatment options. His approach combines cutting-edge medical technology with personalized patient care to achieve the best possible outcomes.',
                        'consultation_duration' => 30,
                    ];
                    break;
                    
                case 'ali@example.com':
                    $doctorData = [
                        'user_id' => $user->id,
                        'full_name' => 'Dr. Ali',
                        'phone_number' => '+1987654322',
                        'specialization' => 'Neurology',
                        'bio' => 'Dr. Ali is a distinguished neurologist specializing in the diagnosis and treatment of complex neurological disorders. With 12 years of clinical experience, he has expertise in treating epilepsy, multiple sclerosis, Parkinson\'s disease, and stroke management. Dr. Ali completed his neurology residency at the Mayo Clinic and has published numerous research papers in leading medical journals. He is committed to providing compassionate care and staying at the forefront of neurological advances to offer his patients the most effective treatment options available.',
                        'consultation_duration' => 45,
                    ];
                    break;
                    
                case 'fatima@example.com':
                    $doctorData = [
                        'user_id' => $user->id,
                        'full_name' => 'Dr. Fatima Al-Zahra',
                        'phone_number' => '+1987654323',
                        'specialization' => 'Pediatrics',
                        'bio' => 'Dr. Fatima Al-Zahra is a dedicated pediatrician with a special focus on child development and preventive care. She has been caring for children for over 10 years and has extensive experience in managing common childhood illnesses, vaccinations, and developmental assessments. Dr. Fatima completed her pediatric residency at Boston Children\'s Hospital and is board-certified in pediatrics. She believes in building strong relationships with families and providing comprehensive care that supports both the physical and emotional well-being of her young patients. Her gentle approach and expertise make her a trusted healthcare provider for families in the community.',
                        'consultation_duration' => 20,
                    ];
                    break;
            }
            
            if (!empty($doctorData)) {
                Doctor::create($doctorData);
            }
        }

     
       
    }
}

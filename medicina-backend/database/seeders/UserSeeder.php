<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
           
            'email' => 'admin@medicina.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create sample patient users
        User::create([
                
            'email' => 'john@example.com',
            'password' => Hash::make('password123'),
            'role' => 'patient',
            'email_verified_at' => now(),
        ]);

        User::create([
           
            'email' => 'jane@example.com',
            'password' => Hash::make('password123'),
            'role' => 'patient',
            'email_verified_at' => now(),
        ]);

        User::create([
          
            'email' => 'ahmed@example.com',
            'password' => Hash::make('password123'),
            'role' => 'patient',
            'email_verified_at' => now(),
        ]);

        // Create sample doctor users
        User::create([
           
            'email' => 'omar@example.com',
            'password' => Hash::make('password123'),
            'role' => 'doctor',
            'email_verified_at' => now(),
        ]);

        User::create([
           
            'email' => 'ali@example.com',
            'password' => Hash::make('password123'),
            'role' => 'doctor',
            'email_verified_at' => now(),
        ]);

        User::create([
            
            'email' => 'fatima@example.com',
            'password' => Hash::make('password123'),
            'role' => 'doctor',
            'email_verified_at' => now(),
        ]);

        // Create sample clinic users
        User::create([
            
            'email' => 'alzayed@example.com',
            'password' => Hash::make('password123'),
            'role' => 'clinic',
            'email_verified_at' => now(),
        ]);

        User::create([
           
            'email' => 'healthplus@example.com',
            'password' => Hash::make('password123'),
            'role' => 'clinic',
            'email_verified_at' => now(),
        ]);

        User::create([
            
            'email' => 'alnoor@example.com',
            'password' => Hash::make('password123'),
            'role' => 'clinic',
            'email_verified_at' => now(),
        ]);

        User::create([

            'email' => 'medlab@example.com',
            'password' => Hash::make('password123'),
            'role' => 'lab',
            'email_verified_at' => now(),
        ]);

        User::create([
            
            'email' => 'biolab@example.com',
            'password' => Hash::make('password123'),
            'role' => 'lab',
            'email_verified_at' => now(),
        ]);
     
    }
}

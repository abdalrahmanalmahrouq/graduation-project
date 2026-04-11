<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Doctor;

class DoctorPolicy
{
    /**
     * Determine if the user can update the doctor's bio.
     */
    public function update(User $user, Doctor $doctor): bool
    {
        // User can only update their own doctor profile
        return $user->id === $doctor->user_id;
    }
    
    /**
     * Determine if the user can view the doctor's bio.
     */
    public function view(User $user, Doctor $doctor): bool
    {
        // Anyone can view doctor bios (public information)
        return true;
    }
}
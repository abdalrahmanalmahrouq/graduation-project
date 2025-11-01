<?php

namespace App\Policies;

use App\Models\LabResult;
use App\Models\User;

class LabResultPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        
    }

    public function create(User $user): bool {
        return $user->role === 'lab';
    }

    public function respond(User $user, LabResult $result): bool {
        return $user->role ==='patient' && $user->id ===$result->patient_id;
    }

    public function upload(User $user, LabResult $result): bool {
        return $user->role ==='lab' && $user->id ===$result->lab_id && $result->status ==='approved';
    }

    public function view(User $user, LabResult $result): bool {
        if($user->role ==='patient' && $user->id === $result->patient_id){
            return true;
        }
        if($user->role ==='lab' && $user->id === $result->lab_id){
            return true;
        }
        return false;
    }
}

<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;

use App\Models\Doctor;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\LabResult;
use App\Policies\DoctorPolicy;
use App\Policies\LabResultPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        LabResult::class => LabResultPolicy::class,
        Doctor::class => DoctorPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}

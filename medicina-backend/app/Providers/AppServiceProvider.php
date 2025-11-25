<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\ClinicDoctor;
use App\Observers\ClinicDoctorObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ClinicDoctor::observe(ClinicDoctorObserver::class);
    }
}

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\InsuranceController;

Route::middleware('web')->prefix('admin')->name('admin.')->group(function(){

    Route::middleware('guest:admin')->group(function(){
        Route::get('/login',[AuthenticatedSessionController::class,'create'])->name('login');
        Route::post('/login',[AuthenticatedSessionController::class,'store'])->name('login.store');
    }); 


    Route::middleware('auth:admin')->group(function(){
        Route::post('/logout',[AuthenticatedSessionController::class,'destroy'])->name('logout');
        Route::get('/dashboard',[DashboardController::class,'index'])->name('dashboard');
        
        // Insurance CRUD Routes
        Route::get('insurances',[InsuranceController::class,'index'])->name('insurances.index');
        Route::get('insurances/create',[InsuranceController::class,'create'])->name('insurances.create');
        Route::post('insurances/store',[InsuranceController::class,'store'])->name('insurances.store');
        Route::get('insurances/{id}/edit',[InsuranceController::class,'edit'])->name('insurances.edit');
        Route::put('insurances/{id}',[InsuranceController::class,'update'])->name('insurances.update');
        Route::delete('insurances/{id}',[InsuranceController::class,'destroy'])->name('insurances.destroy');
    });
});



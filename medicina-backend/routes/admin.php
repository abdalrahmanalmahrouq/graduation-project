<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Admin\DashboardController;
Route::middleware('web')->prefix('admin')->name('admin.')->group(function(){

    Route::middleware('guest:admin')->group(function(){
        Route::get('/login',[AuthenticatedSessionController::class,'create'])->name('login');
        Route::post('/login',[AuthenticatedSessionController::class,'store'])->name('login.store');
    }); 


    Route::middleware('auth:admin')->group(function(){
        Route::post('/logout',[AuthenticatedSessionController::class,'destroy'])->name('logout');
        Route::get('/dashboard',[DashboardController::class,'index'])->name('dashboard');
    });
});



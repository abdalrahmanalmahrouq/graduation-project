<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Email verification link (accessed from email)
Route::get('/email/verify/{id}/{hash}', function ($id, $hash) {
    $user = \App\Models\User::findOrFail($id);
    
    // Verify the hash matches the user's email
    if (!hash_equals($hash, sha1($user->getEmailForVerification()))) {
        return redirect(env('FRONTEND_URL', 'http://localhost:3000') . '/#/email-verification-failed?error=invalid_hash');
    }
    
    // Check if already verified
    if ($user->hasVerifiedEmail()) {
        return redirect(env('FRONTEND_URL', 'http://localhost:3000') . '/#/email-verified?success=true&already_verified=true');
    }
    
    // Mark email as verified
    $user->markEmailAsVerified();
    
    // Redirect to frontend with success message
    return redirect(env('FRONTEND_URL', 'http://localhost:3000') . '/#/email-verified?success=true');
})->middleware(['signed', 'throttle:6,1'])->name('verification.verify');

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

// Serve profile images without CORS restrictions for frontend access
Route::get('/images/profile/{filename}', function ($filename) {
    $path = storage_path('app/public/profile-images/' . $filename);
    
    if (!file_exists($path)) {
        abort(404);
    }
    
    // Determine the correct MIME type based on file extension
    $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    $mimeTypes = [
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'gif' => 'image/gif',
        'webp' => 'image/webp'
    ];
    
    $mimeType = $mimeTypes[$extension] ?? 'application/octet-stream';
    
    $response = response()->file($path, ['Content-Type' => $mimeType]);
    
    // Add CORS headers
    $response->headers->set('Access-Control-Allow-Origin', '*');
    $response->headers->set('Access-Control-Allow-Methods', 'GET');
    $response->headers->set('Access-Control-Allow-Headers', 'Content-Type');
    
    return $response;
})->where('filename', '.*');

// Serve lab result files without CORS restrictions for frontend access
Route::get('/lab-results/{filename}', function ($filename) {
    $path = storage_path('app/public/lab-results/' . $filename);
    
    if (!file_exists($path)) {
        abort(404);
    }
    
    // Determine the correct MIME type based on file extension
    $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    $mimeTypes = [
        'pdf' => 'application/pdf',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'gif' => 'image/gif',
        'doc' => 'application/msword',
        'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    $mimeType = $mimeTypes[$extension] ?? 'application/octet-stream';
    
    $response = response()->file($path, ['Content-Type' => $mimeType]);
    
    // Add CORS headers
    $response->headers->set('Access-Control-Allow-Origin', '*');
    $response->headers->set('Access-Control-Allow-Methods', 'GET');
    $response->headers->set('Access-Control-Allow-Headers', 'Content-Type');
    
    return $response;
})->where('filename', '.*');


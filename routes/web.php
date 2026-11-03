<?php


Route::get('/', fn() => \Inertia\Inertia::render('Landing'));
Route::get('/preview/nail', fn() => \Inertia\Inertia::render('PreviewNail'));

Route::get('/b/{slug}', [\App\Http\Controllers\PublicBusinessController::class, 'show']);

// Owner protected routes
Route::middleware(['auth'])->group(function () {
    // Service management
    Route::get('/owner/services', [\App\Http\Controllers\Owner\ServiceController::class, 'index']);
    Route::post('/owner/services', [\App\Http\Controllers\Owner\ServiceController::class, 'store']);
    Route::put('/owner/services/{id}', [\App\Http\Controllers\Owner\ServiceController::class, 'update']);
    Route::delete('/owner/services/{id}', [\App\Http\Controllers\Owner\ServiceController::class, 'destroy']);

    // Working hours management
    Route::get('/owner/working-hours', [\App\Http\Controllers\Owner\WorkingHourController::class, 'index']);
    Route::post('/owner/working-hours', [\App\Http\Controllers\Owner\WorkingHourController::class, 'store']);
    Route::put('/owner/working-hours/{id}', [\App\Http\Controllers\Owner\WorkingHourController::class, 'update']);
    Route::delete('/owner/working-hours/{id}', [\App\Http\Controllers\Owner\WorkingHourController::class, 'destroy']);
});


// OTP routes
Route::middleware(['web','throttle:5,1'])->group(function () {
    Route::post('/api/auth/otp/request', [\App\Http\Controllers\Auth\OtpController::class, 'request']);
    Route::post('/api/auth/otp/verify', [\App\Http\Controllers\Auth\OtpController::class, 'verify']);
});



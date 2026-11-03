<?php


Route::get('/', fn() => \Inertia\Inertia::render('Landing'));
Route::get('/login', fn() => \Inertia\Inertia::render('Auth/Login'));


Route::get('/b/{slug}', [\App\Http\Controllers\PublicBusinessController::class, 'show']);

Route::get('/b/{slug}/availability', [\App\Http\Controllers\Public\BookingController::class, 'availability']);
Route::post('/b/{slug}/book', [\App\Http\Controllers\Public\BookingController::class, 'book']);

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
    Route::post('/owner/businesses', [\App\Http\Controllers\BusinessController::class, 'store']);

});


// OTP routes
Route::middleware(['web','throttle:5,1'])->group(function () {
    Route::post('/api/auth/otp/request', [\App\Http\Controllers\Auth\OtpController::class, 'request']);
    Route::post('/api/auth/otp/verify', [\App\Http\Controllers\Auth\OtpController::class, 'verify']);
});



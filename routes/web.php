<?php


Route::get('/', fn() => \Inertia\Inertia::render('Landing'));
Route::get('/start', fn() => \Inertia\Inertia::render('Start'))->middleware('auth');
Route::get('/login', fn() => \Inertia\Inertia::render('Auth/Login'))->name('login');
Route::get('/start/wizard', fn() => \Inertia\Inertia::render('StartWizard'));


Route::get('/b/{slug}', [\App\Http\Controllers\PublicBusinessController::class, 'show']);

Route::get('/b/{slug}/availability', [\App\Http\Controllers\Public\BookingController::class, 'availability']);
Route::post('/b/{slug}/book', [\App\Http\Controllers\Public\BookingController::class, 'book']);

Route::middleware(['auth'])->group(function () {
    // Service management
    Route::get('/owner/services', [\App\Http\Controllers\Owner\ServiceController::class, 'index']);
    Route::post('/owner/services', [\App\Http\Controllers\Owner\ServiceController::class, 'store']);
    Route::put('/owner/services/{id}', [\App\Http\Controllers\Owner\ServiceController::class, 'update']);
    Route::delete('/owner/services/{id}', [\App\Http\Controllers\Owner\ServiceController::class, 'destroy']);
    // Create service UI
    Route::get('/owner/services/create', fn() => \Inertia\Inertia::render('Owner/ServiceCreate'));
    // Working hours management
    Route::get('/owner/working-hours', [\App\Http\Controllers\Owner\WorkingHourController::class, 'index']);
    Route::post('/owner/working-hours', [\App\Http\Controllers\Owner\WorkingHourController::class, 'store']);
    Route::put('/owner/working-hours/{id}', [\App\Http\Controllers\Owner\WorkingHourController::class, 'update']);
    Route::delete('/owner/working-hours/{id}', [\App\Http\Controllers\Owner\WorkingHourController::class, 'destroy']);
    // Create working‑hour UI
    Route::get('/owner/working-hours/create', fn() => \Inertia\Inertia::render('Owner/WorkingHourCreate'));
    // Business creation (already exists)
    Route::post('/owner/businesses', [\App\Http\Controllers\BusinessController::class, 'store']);
    // Business settings UI (placeholder)
    Route::get('/owner/businesses/{slug}/settings', fn($slug) => \Inertia\Inertia::render('Owner/BusinessSettings', ['slug' => $slug]));
    // Customer appointments
    Route::get('/appointments', [\App\Http\Controllers\Customer\AppointmentController::class, 'index']);
    Route::get('/appointments/{id}', [\App\Http\Controllers\Customer\AppointmentController::class, 'show']);
    Route::post('/appointments/{id}/cancel', [\App\Http\Controllers\Customer\AppointmentController::class, 'cancel']);
});



Route::get('/nazanin', fn() => \Inertia\Inertia::render('NazaninSample'));
Route::get('/nazanin/dashboard', fn() => \Inertia\Inertia::render('NazaninDashboard'));

Route::middleware(['web','throttle:5,1'])->group(function () {
    Route::post('/api/auth/otp/request', [\App\Http\Controllers\Auth\OtpController::class, 'request']);
    Route::post('/api/auth/otp/verify', [\App\Http\Controllers\Auth\OtpController::class, 'verify']);
});



<?php
use App\Http\Controllers\Auth\OtpController;

Route::post('/auth/otp/request', [OtpController::class, 'request']);
Route::post('/auth/otp/verify', [OtpController::class, 'verify']);

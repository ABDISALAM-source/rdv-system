<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Routes publiques
Route::prefix('appointments')->group(function () {
    Route::post('/', [AppointmentController::class, 'store']);
    Route::get('/unavailable', [AppointmentController::class, 'unavailableSlots']);
    Route::get('/check-slot', [AppointmentController::class, 'checkSlot']);
});

// Auth admin
Route::post('/admin/login', [AuthController::class, 'login']);

// Routes protégées admin
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::prefix('appointments')->group(function () {
        Route::get('/', [AdminController::class, 'index']);
        Route::get('/pending', [AdminController::class, 'pending']);
        Route::get('/accepted', [AdminController::class, 'accepted']);
        Route::get('/refused', [AdminController::class, 'refused']);
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::patch('/{id}/accept', [AdminController::class, 'accept']);
        Route::patch('/{id}/refuse', [AdminController::class, 'refuse']);
        Route::patch('/{id}/refuse-explain', [AdminController::class, 'refuseWithExplanation']);
        Route::patch('/{id}/report', [AdminController::class, 'report']);
        Route::delete('/{id}', [AdminController::class, 'destroy']);
    });
});

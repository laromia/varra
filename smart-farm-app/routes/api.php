<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\FarmController;
use App\Http\Controllers\API\ZoneController;
use App\Http\Controllers\API\SensorController;
use App\Http\Controllers\API\MeasureController;

// Public auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (requires authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('farms', FarmController::class);
    Route::apiResource('zones', ZoneController::class);
    Route::apiResource('sensors', SensorController::class);
    Route::apiResource('measures', MeasureController::class);

    Route::get('/dashboard-data', [FarmController::class, 'dashboardData']);
});

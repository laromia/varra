<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\FarmController;
use App\Http\Controllers\API\ZoneController;
use App\Http\Controllers\API\MeasureController;
use App\Http\Controllers\API\plantController;
use App\Http\Controllers\SensorController;


// Public auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (requires authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('farms', FarmController::class);
    Route::apiResource('zones', ZoneController::class);
    Route::apiResource('measures', MeasureController::class);
    Route::get('/farms/{farm}/sensor-data', [FarmController::class, 'getSensorData']);
    Route::get('/zones/{zone}/sensor-data', [ZoneController::class, 'getSensorData']);
    Route::get('/plant-types', [plantController::class, 'getPlantTypes']);
    Route::delete('/zones/{zone}', [ZoneController::class, 'destroy']);

    Route::get('/dashboard-data', [FarmController::class, 'dashboardData'])
    ->name('api.dashboard.data');
    
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
  
});
Route::middleware('auth')->group(function () {
    Route::get('/sensors', [SensorController::class, 'index']);
    Route::post('/sensors', [SensorController::class, 'store']);
    Route::get('/sensors/create', [SensorController::class, 'create']);
    Route::get('/sensors/zone/{zone}', [SensorController::class, 'showByZone']);
});


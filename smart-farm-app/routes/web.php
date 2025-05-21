<?php

use App\Http\Controllers\ProfileController;
use App\Models\Farm;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Api\FieldViewController;
use App\Http\Controllers\SensorController;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/zones', [\App\Http\Controllers\API\ZoneController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('zones');
    Route::get('/sensors', [SensorController::class, 'index'])->name('sensors.index');
     Route::get('/sensors/create', [SensorController::class, 'create'])->name('sensors.create');
    Route::post('/sensors', [SensorController::class, 'store'])->name('sensors.store');
    Route::get('/sensors/zone/{zone}', [SensorController::class, 'showByZone'])->name('sensors.zone');
    Route::get('/sensors/{sensor}/edit', [SensorController::class, 'edit'])->name('sensors.edit');
Route::put('/sensors/{sensor}', [SensorController::class, 'update'])->name('sensors.update');
Route::delete('/sensors/{sensor}', [SensorController::class, 'destroy'])->name('sensors.destroy');
Route::get('/sensors/{sensor}/measures', [SensorController::class, 'showMeasures'])->name('sensors.measures');
});
Route::get('/zones/create', [\App\Http\Controllers\API\ZoneController::class, 'create'])->name('zones.create');
    Route::post('/zones', [\App\Http\Controllers\API\ZoneController::class, 'store'])->name('zones.store');
Route::get('/register', function () {
    return Inertia::render('Register');
});
Route::get('/dev/seed', function () {
    if (app()->environment('local')) {
        Artisan::call('migrate:fresh --seed');
        return response()->json(['message' => 'Database re-seeded']);
    }
    abort(403);
});
Route::get('/map', function () {
    return Inertia::render('MapView');
})->middleware(['auth', 'verified']);
Route::get('/field-view', [FieldViewController::class, 'index'])
     ->middleware(['auth', 'verified']);


require __DIR__.'/auth.php';

<?php

namespace App\Http\Controllers;

use App\Models\Farm;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
{
    $farms = Farm::with('zones.sensors.latestMeasure')
        ->where('user_id', auth()->id())
        ->get();

    // Debug the data being sent to Inertia
    logger('Sending to Inertia:', [
        'farms_count' => $farms->count(),
        'first_farm' => $farms->first() ? $farms->first()->name : null
    ]);

    return Inertia::render('Dashboard', [
        'farms' => $farms,
        'auth_user_id' => auth()->id() 
    ]);
}
}

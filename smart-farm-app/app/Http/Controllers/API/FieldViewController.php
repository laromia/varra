<?php
// app/Http/Controllers/Api/FieldViewController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Farm;
use Inertia\Inertia;

class FieldViewController extends Controller
{
    public function index()
    {
        $farms = Farm::with(['zones.sensors.latestMeasure'])
            ->where('user_id', auth()->id())
            ->get()
            ->map(function ($farm) {
                return [
                    'id' => $farm->id,
                    'name' => $farm->name,
                    'zones' => $farm->zones->map(function ($zone) {
                        return [
                            'id' => $zone->id,
                            'name' => $zone->name,
                            'location' => [
                                $zone->latitude ?? 35.6895, // Default to Tokyo if not set
                                $zone->longitude ?? 139.6917
                            ],
                            'sensors' => $zone->sensors
                        ];
                    })
                ];
            });

        return Inertia::render('MapView', [
            'farms' => $farms
        ]);
    }
}
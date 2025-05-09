<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Farm;
use Inertia\Inertia;

class MapViewController extends Controller
{
    public function index()
    {
        $farms = Farm::with([
            'zones.sensors.latestMeasure',
            'zones.plantTypes'
        ])
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
                            $zone->latitude,
                            $zone->longitude
                        ],
                        'sensors' => $zone->sensors->map(function ($sensor) {
                            return [
                                'id' => $sensor->id,
                                'type' => $sensor->type,
                                'latest_measure' => $sensor->latestMeasure
                            ];
                        }),
                        'plant_types' => $zone->plantTypes
                    ];
                })
            ];
        });

        return Inertia::render('MapView', [
            'farms' => $farms
        ]);
    }
}
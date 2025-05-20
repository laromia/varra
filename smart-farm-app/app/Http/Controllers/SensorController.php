<?php

namespace App\Http\Controllers;

use App\Models\Sensor;
use App\Models\Zone;
use App\Models\Farm;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SensorController extends Controller
{
    public function index()
    {
        $farms = auth()->user()->farms()->with(['zones' => function($query) {
            $query->withCount('sensors');
        }])->get();

        return Inertia::render('Sensors/Index', [
            'farms' => $farms
        ]);
    }

    public function create()
    {
        $farms = auth()->user()->farms()->with(['zones.plantTypes'])->get();
        
        return Inertia::render('Sensors/Create', [
            'farms' => $farms
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'zone_id' => 'required|exists:zones,id',
            'type' => 'required|in:temperature,humidity,soil_moisture',
            'identifier_code' => 'required|unique:sensors',
            'position' => 'nullable|string',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'plant_type_id' => 'nullable|exists:plant_types,id'
        ]);

        Sensor::create($validated);

        return redirect()->route('sensors.index')
            ->with('success', 'Sensor created successfully!');
    }

    public function showByZone(Zone $zone)
    {
        $zone->load(['sensors', 'farm']);
        
        return Inertia::render('Sensors/ZoneSensors', [
            'zone' => $zone
        ]);
    }
}
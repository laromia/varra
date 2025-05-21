<?php

namespace App\Http\Controllers;

use App\Models\Sensor;
use App\Models\Zone;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SensorController extends Controller
{
   public function index()
{
    $farms = auth()->user()->farms()->with(['zones' => function($query) {
        $query->withCount('sensors')->with('sensors');
    }])->get();

    return Inertia::render('Sensors/Index', [
        'farms' => $farms
    ]);
}

    public function create()
    {
        $farms = auth()->user()->farms()->with('zones')->get();
        return Inertia::render('Sensors/Create', compact('farms'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'zone_id' => 'required|exists:zones,id',
            'type' => 'required|in:temperature,humidity,soil_moisture',
            'identifier_code' => 'required|unique:sensors',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        Sensor::create($request->all());

        return redirect()->route('sensors.index')->with('success', 'Sensor added!');
    }

    public function showByZone(Zone $zone)
    {
        $zone->load('sensors', 'farm');
        return Inertia::render('Sensors/ZoneSensors', compact('zone'));
    }
    public function edit(Sensor $sensor)
{
    $sensor->load('zone.farm');
    $farms = auth()->user()->farms()->with('zones')->get();
    
    return Inertia::render('Sensors/Edit', [
        'sensor' => $sensor,
        'farms' => $farms
    ]);
}
public function showMeasures(Sensor $sensor)
{
    $measures = $sensor->measures()->with('plantType')->latest()->paginate(20);
    
    return Inertia::render('Sensors/Measures', [
        'sensor' => $sensor,
        'measures' => $measures
    ]);
}


public function update(Request $request, Sensor $sensor)
{
    $validated = $request->validate([
        'zone_id' => 'required|exists:zones,id',
        'type' => 'required|in:temperature,humidity,soil_moisture',
        'identifier_code' => 'required|unique:sensors,identifier_code,'.$sensor->id,
        'position' => 'nullable|string',
        'latitude' => 'required|numeric|between:-90,90',
        'longitude' => 'required|numeric|between:-180,180',
    ]);

    $sensor->update($validated);

    return redirect()->route('sensors.index')
        ->with('success', 'Sensor updated successfully!');
}

public function destroy(Sensor $sensor)
{
    $sensor->delete();
    
    return redirect()->route('sensors.index')
        ->with('success', 'Sensor deleted successfully!');
}
}
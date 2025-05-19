<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Zone;
use App\Models\Farm;
use App\Models\PlantType;

class ZoneController extends Controller
{
    public function index()
{
    $zones = auth()->user()
        ->farms()
        ->with(['zones' => function($query) {
            $query->with([
                'farm:id,name',
                'plantTypes:id,name', // Many-to-many relationship
                'sensors.latestMeasure',
            ]);
        }])
        ->get()
        ->pluck('zones')
        ->flatten();

    return inertia('Zones', [
        'zones' => $zones,
        'auth' => [
            'user' => auth()->user()->only('id', 'name', 'email')
        ]
    ]);
}

    public function show($id)
    {
        $zone = Zone::with('sensors.latestMeasure')->findOrFail($id);
        $farm = $zone->farm;

        if ($farm->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($zone);
    }

    public function create()
    {
        $farms = auth()->user()->farms()->select('id', 'name')->get();
        $plantTypes = PlantType::select('id', 'name')->get();

        return inertia('Zones/Create', [
            'farms' => $farms,
            'plantTypes' => $plantTypes,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'farm_id' => 'required|exists:farms,id',
        'latitude' => 'nullable|numeric',
        'longitude' => 'nullable|numeric',
        'plant_type_ids' => 'nullable|array',
        'plant_type_ids.*' => 'exists:plant_types,id',
    ]);

    $zone = Zone::create([
        'name' => $validated['name'],
        'farm_id' => $validated['farm_id'],
        'latitude' => $validated['latitude'] ?? null,
        'longitude' => $validated['longitude'] ?? null,
    ]);

    if (!empty($validated['plant_type_ids'])) {
        $zone->plantTypes()->sync($validated['plant_type_ids']);
    }

    return redirect()->route('zones.index')->with('success', 'Zone created successfully.');
}

    public function destroy(Zone $zone)
    {
        // Verify zone belongs to user's farm
        if ($zone->farm->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        $zone->delete();
    
        return response()->noContent(); // Return 204 status
    }

    public function getSensorData(Zone $zone)
    {
        return response()->json([
            'zone' => $zone,
            'sensors' => $zone->sensors()->with(['latestMeasure'])->get(),
            'measurements_24h' => $zone->getMeasurements24h()
        ]);
    }
}

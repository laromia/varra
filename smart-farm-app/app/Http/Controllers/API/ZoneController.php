<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Zone;
use App\Models\Farm;

class ZoneController extends Controller
{
    public function index()
    {
        $zones = auth()->user()
            ->farms()
            ->with(['zones' => function($query) {
                $query->with([
                    'farm:id,name',
                    'plantTypes:id,name,zone_id',
                    'sensors.latestMeasure'
                ]);
            }])
            ->get()
            ->pluck('zones')
            ->flatten();
    
        return inertia('Zones', [
            'zones' => $zones,
            'auth' => [  // Add this
                'user' => auth()->user()->only('id', 'name', 'email')
            ]
        ]);
    }
    public function show($id)
    {
        $zone = Zone::with('sensors.measures')->findOrFail($id);
        $farm = $zone->farm;

        if ($farm->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($zone);
    }

    public function create()
{
    return inertia('Zones/Create', [
        'farms' => auth()->user()->farms,
        'flash' => [
            'success' => session('success'),
            'error' => session('errors') ? session('errors')->first() : null
        ]
    ]);
}
    
public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'farm_id' => 'required|exists:farms,id,user_id,'.auth()->id()
    ]);

    Zone::create($validated);

    return redirect()->route('zones.index')
        ->with('success', 'Zone created successfully!');
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


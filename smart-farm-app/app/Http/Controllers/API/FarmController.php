<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Farm;
use Illuminate\Support\Facades\Auth;

class FarmController extends Controller
{
    public function index()
{
    return auth()->user()->farms()->with('zones.sensors.measures')->get();
}

public function store(Request $request)
{
    $data = $request->validate([
        'name' => 'required|string',
        'location' => 'nullable|string'
    ]);

    $farm = auth()->user()->farms()->create($data);
    return response()->json($farm, 201);
}

public function show(Farm $farm)
{
    $this->authorizeAccess($farm);
    return $farm->load('zones.sensors.measures');
}

public function update(Request $request, Farm $farm)
{
    $this->authorizeAccess($farm);
    $data = $request->validate([
        'name' => 'string',
        'location' => 'nullable|string'
    ]);
    $farm->update($data);
    return response()->json($farm);
}

public function destroy(Farm $farm)
{
    $this->authorizeAccess($farm);
    $farm->delete();
    return response()->json(['message' => 'Deleted']);
}

protected function authorizeAccess($farm)
{
    abort_if($farm->user_id !== auth()->id(), 403, 'Unauthorized');
}

public function dashboardData()
    {
        $user = Auth::user();

        // Fetch farms and their zones
        $farms = Farm::where('user_id', $user->id)->with('zones.sensors')->get();

        // Prepare dashboard data (e.g., the latest data for each sensor)
        $dashboardData = $farms->map(function ($farm) {
            return [
                'farm' => $farm,
                'zones' => $farm->zones->map(function ($zone) {
                    return [
                        'zone' => $zone,
                        'sensors' => $zone->sensors->map(function ($sensor) {
                            // Get the latest measurement for the sensor
                            $latestMeasure = $sensor->measures()->latest()->first();
                            return [
                                'sensor' => $sensor,
                                'latest_measurement' => $latestMeasure,
                            ];
                        }),
                    ];
                }),
            ];
        });

        return response()->json($dashboardData);
    }
}
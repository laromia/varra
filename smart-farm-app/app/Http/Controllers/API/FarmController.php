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

public function dashboardData(Request $request)
{
    $farms = Farm::with(['zones.sensors.latestMeasure'])
        ->where('user_id', $request->user()->id)
        ->get();

    return response()->json([
        'success' => true,
        'farms' => $farms,
        'message' => 'Farm data retrieved successfully'
    ]);
}
public function getSensorData(Farm $farm)
{
    return response()->json([
        'farm' => $farm,
        'zones' => $farm->zones()->with(['sensors' => function($query) {
            $query->with(['latestMeasure']);
        }])->get(),
        'latest_measurements' => $farm->getLatestMeasurements()
    ]);
}
    
}
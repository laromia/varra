<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sensor;
use App\Models\Zone;
use Illuminate\Support\Facades\Auth;

class SensorController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Fetch all sensors owned by user's zones
        $sensors = Sensor::whereHas('zone.farm', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->with('zone')->get();

        return response()->json($sensors);
    }

    public function store(Request $request)
    {
        $request->validate([
            'zone_id' => 'required|exists:zones,id',
            'type' => 'required|string|max:50',
            'position' => 'nullable|string|max:100',
        ]);

        $zone = Zone::findOrFail($request->zone_id);

        // Check ownership
        if ($zone->farm->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $sensor = Sensor::create([
            'zone_id' => $request->zone_id,
            'type' => $request->type,
            'position' => $request->position,
        ]);

        return response()->json($sensor, 201);
    }

    public function show($id)
    {
        $sensor = Sensor::with('zone.farm')->findOrFail($id);

        if ($sensor->zone->farm->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($sensor);
    }

    public function update(Request $request, $id)
    {
        $sensor = Sensor::with('zone.farm')->findOrFail($id);

        if ($sensor->zone->farm->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'type' => 'sometimes|string|max:50',
            'position' => 'nullable|string|max:100',
        ]);

        $sensor->update($request->only(['type', 'position']));

        return response()->json($sensor);
    }

    public function destroy($id)
    {
        $sensor = Sensor::with('zone.farm')->findOrFail($id);

        if ($sensor->zone->farm->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $sensor->delete();

        return response()->json(['message' => 'Sensor deleted successfully']);
    }
}

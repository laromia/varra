<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Measure;
use App\Models\Sensor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MeasureController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $measures = Measure::whereHas('sensor.zone.farm', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->with('sensor.zone')->get();

        return response()->json($measures);
    }

    public function store(Request $request)
    {
        $request->validate([
            'sensor_id' => 'required|exists:sensors,id',
            'value' => 'required|numeric',
            'measured_at' => 'required|date',
        ]);

        $sensor = Sensor::findOrFail($request->sensor_id);

        // Check if the sensor belongs to the authenticated user's farm
        if ($sensor->zone->farm->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $measure = Measure::create([
            'sensor_id' => $request->sensor_id,
            'value' => $request->value,
            'measured_at' => $request->measured_at,
        ]);

        return response()->json($measure, 201);
    }

    public function show($id)
    {
        $measure = Measure::with('sensor.zone.farm')->findOrFail($id);

        if ($measure->sensor->zone->farm->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($measure);
    }

    public function update(Request $request, $id)
    {
        $measure = Measure::findOrFail($id);

        // Ownership check
        if ($measure->sensor->zone->farm->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'value' => 'sometimes|numeric',
            'measured_at' => 'sometimes|date',
        ]);

        $measure->update($request->only(['value', 'measured_at']));

        return response()->json($measure);
    }

    public function destroy($id)
    {
        $measure = Measure::findOrFail($id);

        // Ownership check
        if ($measure->sensor->zone->farm->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $measure->delete();

        return response()->json(['message' => 'Measurement deleted successfully']);
    }
}

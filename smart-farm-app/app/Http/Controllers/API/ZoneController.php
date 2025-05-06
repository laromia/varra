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
        return Zone::with('sensors')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'crop_type' => 'nullable|string|max:255',
            'farm_id' => 'required|exists:farms,id',
        ]);

        // Optional: Ensure the farm belongs to the authenticated user
        $farm = Farm::findOrFail($data['farm_id']);
        if ($farm->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $zone = Zone::create($data);
        return response()->json($zone, 201);
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

    public function update(Request $request, $id)
    {
        $zone = Zone::findOrFail($id);
        $farm = $zone->farm;

        if ($farm->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'crop_type' => 'nullable|string|max:255',
        ]);

        $zone->update($data);
        return response()->json($zone);
    }

    public function destroy($id)
    {
        $zone = Zone::findOrFail($id);
        $farm = $zone->farm;

        if ($farm->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $zone->delete();
        return response()->json(['message' => 'Zone deleted successfully']);
    }
}

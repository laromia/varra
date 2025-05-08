<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PlantType;
use Illuminate\Support\Facades\Auth;

class PlantController extends Controller{

    public function getPlantTypes()
    {
        $plantTypes = PlantType::with('zone.farm')->get();
    
        return response()->json($plantTypes);
    }
}
   

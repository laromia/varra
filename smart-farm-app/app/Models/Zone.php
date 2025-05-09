<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Zone extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'farm_id',
        // Add any other fields you need to mass assign
    ];
    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }
    
    public function sensors()
    {
        return $this->hasMany(Sensor::class);
    }
    public function plantTypes()
    {
        return $this->hasMany(PlantType::class);
    }

    
}

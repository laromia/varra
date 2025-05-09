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
    'latitude',  // Add these
    'longitude'  // Add these
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
    return $this->belongsToMany(PlantType::class);
}
    
}

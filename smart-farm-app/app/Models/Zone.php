<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Zone extends Model
{
    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }
    
    public function sensors()
    {
        return $this->hasMany(Sensor::class);
    }
    
}

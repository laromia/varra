<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Farm extends Model
{
    use HasFactory;
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function zones()
    {
        return $this->hasMany(Zone::class);
    }
    public function getLatestMeasurements()
{
    return Measure::whereIn('sensor_id', function($query) {
        $query->select('id')
            ->from('sensors')
            ->whereIn('zone_id', $this->zones()->pluck('id'));
    })
    ->orderBy('measured_at', 'desc')
    ->limit(100)
    ->get();
}
    
}

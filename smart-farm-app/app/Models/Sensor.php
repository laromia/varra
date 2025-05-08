<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Sensor extends Model
{
    use HasFactory;
    public function zone()
{
    return $this->belongsTo(Zone::class);
}

public function measures()
{
    return $this->hasMany(Measure::class);
}
public function latestMeasure()
{
    return $this->hasOne(Measure::class)->latestOfMany();
}

}

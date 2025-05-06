<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sensor extends Model
{
    public function zone()
{
    return $this->belongsTo(Zone::class);
}

public function measures()
{
    return $this->hasMany(Measure::class);
}

}

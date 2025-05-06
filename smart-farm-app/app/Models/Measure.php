<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Measure extends Model
{
    public function sensor()
{
    return $this->belongsTo(Sensor::class);
}

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Measure extends Model
{
    use HasFactory;
    public function sensor()
{
    return $this->belongsTo(Sensor::class);
}
public function plantType()
{
    return $this->belongsTo(PlantType::class);
}


}

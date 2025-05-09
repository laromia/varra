<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlantType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'zone_id',
    ];

    public function zones()
{
    return $this->belongsToMany(Zone::class);
}

}


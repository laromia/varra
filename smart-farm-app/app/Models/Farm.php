<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Farm extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function zones()
    {
        return $this->hasMany(Zone::class);
    }
    
}

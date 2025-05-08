<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Zone;
use App\Models\Farm;

class ZoneFactory extends Factory
{
    protected $model = Zone::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->randomElement(['North', 'South', 'East', 'West']) . ' Field',
            'crop_type' => $this->faker->randomElement(['Tomatoes', 'Cucumbers', 'Wheat', 'Corn']),
            'farm_id' => Farm::factory(),
        ];
    }
}

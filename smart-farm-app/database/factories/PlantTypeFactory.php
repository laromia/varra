<?php

namespace Database\Factories;

use App\Models\PlantType;
use App\Models\Zone;
use Illuminate\Database\Eloquent\Factories\Factory;

class PlantTypeFactory extends Factory
{
    protected $model = PlantType::class;

    public function definition(): array
{
    return [
        'name' => $this->faker->randomElement(['Tomato', 'Wheat', 'Corn', 'Lettuce']),
        // Remove the zone_id assignment here
    ];
}
}


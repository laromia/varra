<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Sensor;
use App\Models\Zone;

class SensorFactory extends Factory
{
    protected $model = Sensor::class;

    public function definition(): array
    {
        return [
            'type' => $this->faker->randomElement(['temperature', 'humidity', 'soil_moisture']),
            'position' => $this->faker->randomElement(['North corner', 'Center', 'South edge']),
            'zone_id' => Zone::factory(),
        ];
    }
}

<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Zone;
use Illuminate\Support\Str;
use App\Models\Sensor;

class SensorFactory extends Factory
{
    protected $model = Sensor::class;


    public function definition(): array
    {
        return [
            'type' => $this->faker->randomElement(['temperature', 'humidity', 'soil_moisture']),
            'position' => $this->faker->randomElement([
                'North corner', 
                'Center', 
                'South edge',
                'Near irrigation',
                'Under canopy'
            ]),
            'zone_id' => Zone::factory(),
            'latitude' => $this->faker->latitude(35.6, 35.7),  // Tokyo area coordinates
            'longitude' => $this->faker->longitude(139.6, 139.8),
            'identifier_code' => 'SENSOR-' . Str::upper(Str::random(6)) . '-' . $this->faker->unique()->numberBetween(1000, 9999),
        ];
    }
}
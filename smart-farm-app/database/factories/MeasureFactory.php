<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Measure;
use App\Models\Sensor;
use App\Models\PlantType;

class MeasureFactory extends Factory
{
    protected $model = Measure::class;

    public function definition(): array
    {
        $type = $this->faker->randomElement(['temperature', 'humidity', 'soil_moisture']);

        return [
            'value' => $type === 'temperature'
                ? $this->faker->numberBetween(10, 40)  // Temperature range
                : $this->faker->numberBetween(20, 90), // Humidity/soil moisture range
            'measured_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
            'sensor_id' => Sensor::factory(),
            'plant_type_id' => $this->faker->optional(0.7, null)->randomElement(PlantType::pluck('id')->toArray()),
        ];
    }
}
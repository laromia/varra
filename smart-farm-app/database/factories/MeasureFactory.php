<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Measure;
use App\Models\Sensor;

class MeasureFactory extends Factory
{
    protected $model = Measure::class;

    public function definition(): array
    {
        $type = $this->faker->randomElement(['temperature', 'humidity', 'soil_moisture']);

        return [
            'value' => $type === 'temperature'
                ? $this->faker->numberBetween(10, 40)
                : $this->faker->numberBetween(20, 90),
            'measured_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
            'sensor_id' => Sensor::factory(),
        ];
    }
}

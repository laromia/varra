<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Farm;
use App\Models\User;

class FarmFactory extends Factory
{
    protected $model = Farm::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->company . ' Farm',
            'location' => $this->faker->address,
            'user_id' => User::factory(), // Proper way to associate a user
        ];
    }
}

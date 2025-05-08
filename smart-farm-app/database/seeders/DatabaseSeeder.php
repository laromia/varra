<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Farm;
use App\Models\Zone;
use App\Models\Sensor;
use App\Models\Measure;
use App\Models\PlantType; // Don't forget this

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Create test user
        $user = User::factory()->create([
            'name' => 'Test Farmer',
            'email' => 'farmer@example.com',
            'password' => bcrypt('password'),
        ]);

        // Create 2-3 farms for the user
        $farms = Farm::factory()->count(rand(2, 3))->create([
            'user_id' => $user->id,
        ]);

        $farms->each(function ($farm) {
            // For each farm, create 3-5 zones
            $zones = Zone::factory()->count(rand(3, 5))->create([
                'farm_id' => $farm->id,
            ]);

            $zones->each(function ($zone) {
                // For each zone, create 2-4 sensors
                $sensors = Sensor::factory()->count(rand(2, 4))->create([
                    'zone_id' => $zone->id,
                ]);

                // Create 1-3 plant types for each zone
                PlantType::factory()->count(rand(1, 3))->create([
                    'zone_id' => $zone->id,
                ]);

                $sensors->each(function ($sensor) {
                    // For each sensor, create 20-50 measurements
                    Measure::factory()->count(rand(20, 50))->create([
                        'sensor_id' => $sensor->id,
                        'value' => $sensor->type === 'temperature' 
                            ? rand(10, 40) 
                            : rand(20, 90),
                    ]);
                });
            });
        });

        $this->command->info('Demo data seeded successfully!');
        $this->command->info('Test user: farmer@example.com / password');
    }
}

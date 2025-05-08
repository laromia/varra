<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Farm;
use App\Models\Zone;
use App\Models\Sensor;
use App\Models\Measure;

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

        // For each farm, create 3-5 zones
        $farms->each(function ($farm) {
            $zones = Zone::factory()->count(rand(3, 5))->create([
                'farm_id' => $farm->id,
            ]);

            // For each zone, create 2-4 sensors
            $zones->each(function ($zone) {
                $sensors = Sensor::factory()->count(rand(2, 4))->create([
                    'zone_id' => $zone->id,
                ]);

                // For each sensor, create 20-50 measurements
                $sensors->each(function ($sensor) {
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

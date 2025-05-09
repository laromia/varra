<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Farm;
use App\Models\Zone;
use App\Models\Sensor;
use App\Models\Measure;
use App\Models\PlantType;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $user = User::factory()->create([
            'name' => 'Test Farmer',
            'email' => 'farmer@example.com',
            'password' => bcrypt('password'),
        ]);

        // Create distinct plant types FIRST
        $plantTypes = collect([
            'Tomato', 'Lettuce', 'Wheat', 
            'Corn', 'Strawberry', 'Basil',
            'Cucumber', 'Pepper'
        ])->map(function ($name) {
            return PlantType::factory()->create(['name' => $name]);
        });

        // Create farms
        $farms = Farm::factory()->count(rand(2, 3))->create([
            'user_id' => $user->id,
        ]);

        $farms->each(function ($farm) use ($plantTypes) {
            $zones = Zone::factory()->count(rand(3, 5))->create([
                'farm_id' => $farm->id,
                // Add coordinates - Tokyo area with slight variations
                'latitude' => 35.68 + (rand(-50, 50) / 1000),
                'longitude' => 139.76 + (rand(-50, 50) / 1000),
            ]);

            $zones->each(function ($zone) use ($plantTypes) {
                // Attach 1-3 random plant types to this zone
                $zone->plantTypes()->attach(
                    $plantTypes->random(rand(1, 3))->pluck('id')
                );

                // Create 2-4 sensors per zone
                $sensors = Sensor::factory()->count(rand(2, 4))->create([
                    'zone_id' => $zone->id,
                ]);

                // Create measurements for each sensor
                $sensors->each(function ($sensor) use ($zone) {
                    Measure::factory()->count(rand(20, 50))->create([
                        'sensor_id' => $sensor->id,
                        'plant_type_id' => $zone->plantTypes->random()->id,
                        'value' => $sensor->type === 'temperature' 
                            ? rand(10, 40)  // Temperature range
                            : rand(20, 90), // Humidity/soil moisture range
                        'measured_at' => now()->subDays(rand(0, 30)),
                    ]);
                });
            });
        });

        $this->command->info('Seeding completed!');
        $this->command->info('Test user: farmer@example.com / password');
    }
}
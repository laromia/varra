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
        // 1. Create test user FIRST
        $user = User::factory()->create([
            'name' => 'Test Farmer',
            'email' => 'farmer@example.com',
            'password' => bcrypt('password'),
        ]);

        // 2. Create plant types (independent)
        $plantTypes = PlantType::factory()->createMany([
            ['name' => 'Tomato'],
            ['name' => 'Lettuce'],
            ['name' => 'Wheat'],
            ['name' => 'Corn'],
            ['name' => 'Strawberry'],
            ['name' => 'Basil'],
            ['name' => 'Cucumber'],
            ['name' => 'Pepper']
        ]);

        // 3. Create farms with explicit user_id
        $farms = Farm::factory()
            ->count(rand(2, 3))
            ->create(['user_id' => $user->id]);

        // 4. Create zones for each farm
        $farms->each(function ($farm) use ($plantTypes) {
            $zones = Zone::factory()
                ->count(rand(3, 5))
                ->create([
                    'farm_id' => $farm->id,
                    'latitude' => 35.68 + (rand(-50, 50) / 1000),
                    'longitude' => 139.76 + (rand(-50, 50) / 1000),
                ]);

            // 5. Attach plant types to zones
            $zones->each(function ($zone) use ($plantTypes) {
                $zone->plantTypes()->attach(
                    $plantTypes->random(rand(1, 3))->pluck('id')
                );

                // 6. Create sensors for each zone
                $sensors = Sensor::factory()
                    ->count(rand(2, 4))
                    ->create(['zone_id' => $zone->id]);

                // 7. Create measures for each sensor
                $sensors->each(function ($sensor) use ($zone) {
                    Measure::factory()
                        ->count(rand(20, 50))
                        ->create([
                            'sensor_id' => $sensor->id,
                            'plant_type_id' => $zone->plantTypes->random()->id,
                            'value' => $this->getValueBasedOnType($sensor->type),
                            'measured_at' => now()->subDays(rand(0, 30)),
                        ]);
                });
            });
        });

        $this->command->info('Seeding completed!');
        $this->command->info('Test user: farmer@example.com / password');
    }

    protected function getValueBasedOnType($type)
    {
        return match($type) {
            'temperature' => rand(10, 40),
            default => rand(20, 90),
        };
    }
}
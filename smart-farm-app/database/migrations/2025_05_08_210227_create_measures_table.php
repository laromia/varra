<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('measures', function (Blueprint $table) {
        $table->id();
        $table->float('value');
        $table->foreignId('sensor_id')->constrained()->onDelete('cascade');
        $table->foreignId('plant_type_id')->nullable()->constrained()->onDelete('set null'); // add this line
        $table->timestamp('measured_at');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('measures');
    }
};


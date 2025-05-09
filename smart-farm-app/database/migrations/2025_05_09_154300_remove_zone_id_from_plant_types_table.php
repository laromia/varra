<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('plant_types', function (Blueprint $table) {
        // First drop the foreign key constraint
        $table->dropForeign(['zone_id']);
        // Then drop the column
        $table->dropColumn('zone_id');
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plant_types', function (Blueprint $table) {
            //
        });
    }
};

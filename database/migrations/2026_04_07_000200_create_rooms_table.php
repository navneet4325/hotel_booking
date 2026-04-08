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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('room_number')->unique();
            $table->string('slug')->unique();
            $table->string('type');
            $table->decimal('price', 10, 2);
            $table->boolean('availability')->default(true);
            $table->decimal('rating', 3, 1)->default(4.5);
            $table->unsignedInteger('size')->default(420);
            $table->unsignedTinyInteger('beds')->default(1);
            $table->unsignedTinyInteger('bathrooms')->default(1);
            $table->unsignedTinyInteger('capacity')->default(2);
            $table->string('floor')->nullable();
            $table->string('view')->nullable();
            $table->string('short_description');
            $table->longText('description');
            $table->string('image')->nullable();
            $table->json('gallery')->nullable();
            $table->json('amenities')->nullable();
            $table->boolean('featured')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};

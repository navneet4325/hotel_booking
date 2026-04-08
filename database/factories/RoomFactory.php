<?php

namespace Database\Factories;

use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Room>
 */
class RoomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement([
            'Skyline Suite',
            'Lagoon Loft',
            'Panorama Deluxe',
            'Signature Studio',
        ]);

        return [
            'room_number' => (string) fake()->unique()->numberBetween(201, 999),
            'slug' => Str::slug($type.'-'.fake()->unique()->numberBetween(201, 999)),
            'type' => $type,
            'price' => fake()->numberBetween(180, 540),
            'availability' => true,
            'rating' => fake()->randomFloat(1, 4.2, 5.0),
            'size' => fake()->numberBetween(320, 960),
            'beds' => fake()->numberBetween(1, 3),
            'bathrooms' => fake()->numberBetween(1, 2),
            'capacity' => fake()->numberBetween(2, 5),
            'floor' => fake()->randomElement(['Ocean Deck', 'Sky Wing', 'Atrium', 'Garden Level']),
            'view' => fake()->randomElement(['Ocean', 'Skyline', 'Garden', 'Courtyard']),
            'short_description' => fake()->sentence(8),
            'description' => fake()->paragraphs(3, true),
            'image' => fake()->imageUrl(1200, 900, 'hotel', true),
            'gallery' => [
                fake()->imageUrl(1200, 900, 'hotel', true),
                fake()->imageUrl(1200, 900, 'hotel', true),
                fake()->imageUrl(1200, 900, 'hotel', true),
            ],
            'amenities' => fake()->randomElements([
                'Private terrace',
                'Spa shower',
                'Curated minibar',
                'Smart lighting',
                'Workspace lounge',
                'Breakfast included',
                'Airport transfer',
            ], fake()->numberBetween(4, 6)),
            'featured' => fake()->boolean(40),
        ];
    }
}

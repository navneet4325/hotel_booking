<?php

use App\Models\Room;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('admins can create rooms from the management panel', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('admin.rooms.store'), [
        'room_number' => '840',
        'type' => 'Harbor Club Suite',
        'slug' => 'harbor-club-suite-840',
        'price' => 410,
        'availability' => true,
        'rating' => 4.9,
        'size' => 760,
        'beds' => 2,
        'bathrooms' => 2,
        'capacity' => 4,
        'floor' => 'Harbor Wing',
        'view' => 'Marina',
        'short_description' => 'Club suite with marina-facing lounge seating.',
        'description' => 'An expansive premium suite for long stays and signature guest moments.',
        'image' => 'https://example.com/rooms/harbor-suite.jpg',
        'gallery' => [
            'https://example.com/rooms/harbor-suite-1.jpg',
            'https://example.com/rooms/harbor-suite-2.jpg',
        ],
        'amenities' => ['Club lounge', 'Late checkout', 'Private bar'],
        'featured' => true,
    ]);

    $response
        ->assertRedirect(route('admin.rooms.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('rooms', [
        'room_number' => '840',
        'type' => 'Harbor Club Suite',
        'featured' => true,
        'availability' => true,
    ]);
});

test('admins can update room inventory details', function () {
    $admin = User::factory()->admin()->create();
    $room = Room::factory()->create([
        'room_number' => '210',
        'type' => 'Original Room',
        'price' => 190,
        'availability' => true,
        'featured' => false,
    ]);

    $response = $this->actingAs($admin)->put(route('admin.rooms.update', $room), [
        'room_number' => '210',
        'type' => 'Skyline Signature Room',
        'slug' => $room->slug,
        'price' => 275,
        'availability' => false,
        'rating' => 4.7,
        'size' => 540,
        'beds' => 1,
        'bathrooms' => 1,
        'capacity' => 2,
        'floor' => 'Sky Wing',
        'view' => 'Cityline',
        'short_description' => 'Upgraded skyline-facing room.',
        'description' => 'Freshly repositioned room with better media and new pricing.',
        'image' => 'https://example.com/rooms/skyline-signature.jpg',
        'gallery' => ['https://example.com/rooms/skyline-signature-1.jpg'],
        'amenities' => ['Welcome drink', 'Priority elevator'],
        'featured' => true,
    ]);

    $response
        ->assertRedirect(route('admin.rooms.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('rooms', [
        'id' => $room->id,
        'type' => 'Skyline Signature Room',
        'price' => 275,
        'availability' => false,
        'featured' => true,
    ]);
});

test('admins can filter room inventory by type and availability', function () {
    $admin = User::factory()->admin()->create();

    Room::factory()->create([
        'type' => 'Skyline Signature Room',
        'availability' => true,
    ]);

    Room::factory()->create([
        'type' => 'Garden Escape Room',
        'availability' => false,
    ]);

    $response = $this->actingAs($admin)->get('/admin/rooms?type=Skyline%20Signature%20Room&availability=available');

    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/rooms/index')
        ->where('filters.type', 'Skyline Signature Room')
        ->where('filters.availability', 'available')
        ->has('rooms', 1)
        ->where('rooms.0.type', 'Skyline Signature Room')
    );
});

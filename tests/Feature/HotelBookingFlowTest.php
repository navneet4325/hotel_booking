<?php

use App\Models\Booking;
use App\Models\Payment;
use App\Models\Room;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;

test('availability api marks rooms unavailable when dates overlap', function () {
    $room = Room::factory()->create();
    $guest = User::factory()->create();

    Booking::factory()->for($room)->for($guest)->create([
        'check_in' => now()->addDays(4)->toDateString(),
        'check_out' => now()->addDays(7)->toDateString(),
        'status' => Booking::STATUS_CONFIRMED,
    ]);

    $response = $this->getJson('/api/v1/availability?room_id='.$room->id.'&check_in='.now()->addDays(5)->toDateString().'&check_out='.now()->addDays(6)->toDateString());

    $response
        ->assertOk()
        ->assertJson([
            'room_id' => $room->id,
            'available' => false,
        ]);
});

test('authenticated users can create a booking and get redirected into checkout', function () {
    $user = User::factory()->create();
    $room = Room::factory()->create([
        'capacity' => 2,
        'price' => 320,
    ]);

    $response = $this
        ->actingAs($user)
        ->withHeader('X-Inertia', 'true')
        ->post(route('bookings.store'), [
            'room_id' => $room->id,
            'check_in' => now()->addDays(10)->toDateString(),
            'check_out' => now()->addDays(13)->toDateString(),
            'guests' => 2,
            'payment_method' => 'stripe',
        ]);

    $booking = Booking::query()->first();

    expect($booking)->not->toBeNull();
    expect($booking?->total_price)->toBe('960.00');

    $response->assertStatus(409);
    expect($response->headers->get('X-Inertia-Location'))->toContain("/payments/{$booking->id}/success?demo=1");
});

test('admin dashboard is protected by role middleware', function () {
    $customer = User::factory()->create();
    $admin = User::factory()->admin()->create();

    $this->actingAs($customer)
        ->get(route('admin.dashboard'))
        ->assertForbidden();

    $this->actingAs($admin)
        ->get(route('admin.dashboard'))
        ->assertOk();
});

test('authenticated users can create a razorpay booking and fall back to demo success when keys are missing', function () {
    config([
        'services.razorpay.key' => null,
        'services.razorpay.secret' => null,
        'services.razorpay.currency' => 'INR',
    ]);

    $user = User::factory()->create();
    $room = Room::factory()->create([
        'capacity' => 2,
        'price' => 250,
    ]);

    $response = $this
        ->actingAs($user)
        ->withHeader('X-Inertia', 'true')
        ->post(route('bookings.store'), [
            'room_id' => $room->id,
            'check_in' => now()->addDays(14)->toDateString(),
            'check_out' => now()->addDays(16)->toDateString(),
            'guests' => 2,
            'payment_method' => 'razorpay',
        ]);

    $booking = Booking::query()->latest('id')->first();
    $payment = Payment::query()->where('booking_id', $booking?->id)->first();

    expect($booking)->not->toBeNull();
    expect($payment?->provider)->toBe('razorpay');
    $response->assertStatus(409);
    expect($response->headers->get('X-Inertia-Location'))->toContain("/payments/{$booking->id}/success?demo=1");
});

test('authenticated users can create a razorpay booking and get redirected to the razorpay handoff page', function () {
    config([
        'services.razorpay.key' => 'rzp_test_example',
        'services.razorpay.secret' => 'secret_example',
        'services.razorpay.currency' => 'INR',
    ]);

    Http::fake([
        'https://api.razorpay.com/v1/orders' => Http::response([
            'id' => 'order_test_123',
            'entity' => 'order',
            'amount' => 50000,
            'currency' => 'INR',
            'receipt' => 'AST-DEMO',
            'status' => 'created',
        ], 200),
    ]);

    $user = User::factory()->create();
    $room = Room::factory()->create([
        'capacity' => 2,
        'price' => 250,
    ]);

    $response = $this
        ->actingAs($user)
        ->withHeader('X-Inertia', 'true')
        ->post(route('bookings.store'), [
            'room_id' => $room->id,
            'check_in' => now()->addDays(14)->toDateString(),
            'check_out' => now()->addDays(16)->toDateString(),
            'guests' => 2,
            'payment_method' => 'razorpay',
        ]);

    $booking = Booking::query()->latest('id')->first();
    $payment = Payment::query()->where('booking_id', $booking?->id)->first();

    expect($booking)->not->toBeNull();
    expect($payment)->not->toBeNull();
    expect($payment?->provider)->toBe('razorpay');
    expect($payment?->gateway_reference)->toBe('order_test_123');

    $response->assertStatus(409);
    expect($response->headers->get('X-Inertia-Location'))->toContain("/payments/{$booking->id}/razorpay");
});

test('rooms listing can be filtered by location', function () {
    Room::factory()->create([
        'type' => 'Skyline Test Suite',
        'floor' => 'Sky Wing',
        'view' => 'Cityline',
    ]);

    Room::factory()->create([
        'type' => 'Garden Test Room',
        'floor' => 'Garden Level',
        'view' => 'Courtyard',
    ]);

    $response = $this->get('/rooms?location=Sky%20Wing');

    $response->assertInertia(fn (Assert $page) => $page
        ->component('rooms/index')
        ->where('meta.result_count', 1)
        ->has('rooms', 1)
        ->where('rooms.0.type', 'Skyline Test Suite')
    );
});

test('users can view their booking confirmation page', function () {
    $user = User::factory()->create();
    $room = Room::factory()->create();
    $booking = Booking::factory()->for($user)->for($room)->create([
        'status' => Booking::STATUS_CONFIRMED,
        'payment_status' => Booking::PAYMENT_PAID,
    ]);

    Payment::query()->create([
        'booking_id' => $booking->id,
        'provider' => 'razorpay',
        'payment_method' => 'razorpay',
        'payment_status' => Booking::PAYMENT_PAID,
        'amount' => $booking->total_price,
        'currency' => 'INR',
    ]);

    $this->actingAs($user)
        ->get(route('bookings.confirmation', $booking))
        ->assertOk()
        ->assertSee($booking->booking_reference);
});

test('rooms listing excludes rooms with overlapping confirmed bookings and respects guest capacity', function () {
    $bookedRoom = Room::factory()->create([
        'type' => 'Booked Skyline Suite',
        'floor' => 'Sky Wing',
        'capacity' => 2,
    ]);

    $availableRoom = Room::factory()->create([
        'type' => 'Available Family Loft',
        'floor' => 'Sky Wing',
        'capacity' => 4,
    ]);

    $guest = User::factory()->create();

    Booking::factory()->for($bookedRoom)->for($guest)->create([
        'check_in' => now()->addDays(10)->toDateString(),
        'check_out' => now()->addDays(13)->toDateString(),
        'status' => Booking::STATUS_CONFIRMED,
    ]);

    $response = $this->get('/rooms?location=Sky%20Wing&check_in='.now()->addDays(11)->toDateString().'&check_out='.now()->addDays(12)->toDateString().'&guests=4');

    $response->assertInertia(fn (Assert $page) => $page
        ->component('rooms/index')
        ->where('meta.result_count', 1)
        ->has('rooms', 1)
        ->where('rooms.0.type', 'Available Family Loft')
    );
});

test('unknown location search does not hide all rooms in single hotel mode', function () {
    Room::factory()->create([
        'type' => 'Searchable Deluxe Suite',
        'capacity' => 4,
        'availability' => true,
    ]);

    $response = $this->get('/rooms?location=Delhi&guests=2');

    $response->assertInertia(fn (Assert $page) => $page
        ->component('rooms/index')
        ->where('meta.result_count', 1)
        ->has('rooms', 1)
        ->where('rooms.0.type', 'Searchable Deluxe Suite')
    );
});

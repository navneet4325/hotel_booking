<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::query()->updateOrCreate(
            ['email' => 'admin@aetherstay.test'],
            [
                'name' => 'AetherStay Admin',
                'role' => 'admin',
                'phone' => '+1-555-010-4400',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        Admin::query()->updateOrCreate(
            ['user_id' => $admin->id],
            [
                'email' => $admin->email,
                'password' => 'password',
                'access_level' => 'super-admin',
                'last_login_at' => now(),
            ]
        );

        $guests = collect([
            [
                'name' => 'Maya Flores',
                'email' => 'maya@aetherstay.test',
                'phone' => '+1-555-010-2201',
            ],
            [
                'name' => 'Ethan Cole',
                'email' => 'ethan@aetherstay.test',
                'phone' => '+1-555-010-2202',
            ],
            [
                'name' => 'Priya Nair',
                'email' => 'priya@aetherstay.test',
                'phone' => '+1-555-010-2203',
            ],
        ])->map(function (array $guest) {
            return User::query()->updateOrCreate(
                ['email' => $guest['email']],
                [
                    'name' => $guest['name'],
                    'role' => 'customer',
                    'phone' => $guest['phone'],
                    'password' => 'password',
                    'email_verified_at' => now(),
                ]
            );
        });

        $roomData = [
            [
                'room_number' => '501',
                'type' => 'Aurora Skyline Suite',
                'price' => 349,
                'rating' => 4.9,
                'size' => 720,
                'beds' => 1,
                'bathrooms' => 2,
                'capacity' => 3,
                'floor' => 'Sky Wing',
                'view' => 'Cityline',
                'featured' => true,
                'short_description' => 'Panoramic glass walls, sunset lounge seating, and a floating marble bath.',
                'description' => 'A signature suite designed for skyline seekers. The Aurora Skyline Suite blends cinematic city views with a quiet palette, layered lighting, and a private dining nook for elevated evenings.',
                'image' => 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
                ],
                'amenities' => ['Sky lounge access', 'Freestanding tub', 'Smart blinds', 'Late checkout', 'Breakfast tasting'],
            ],
            [
                'room_number' => '307',
                'type' => 'Lagoon Loft',
                'price' => 289,
                'rating' => 4.7,
                'size' => 610,
                'beds' => 2,
                'bathrooms' => 1,
                'capacity' => 4,
                'floor' => 'Lagoon Deck',
                'view' => 'Pool',
                'featured' => true,
                'short_description' => 'A soft-toned family loft with layered seating and breezy terrace access.',
                'description' => 'The Lagoon Loft brings resort energy into a smart, family-friendly layout with dual sleeping zones, a sun-washed lounge, and easy access to the central water court.',
                'image' => 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1464890100898-a385f744067f?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80',
                ],
                'amenities' => ['Private terrace', 'Family setup', 'Nespresso bar', 'Poolside priority', 'Concierge chat'],
            ],
            [
                'room_number' => '612',
                'type' => 'Nocturne Executive Studio',
                'price' => 229,
                'rating' => 4.6,
                'size' => 490,
                'beds' => 1,
                'bathrooms' => 1,
                'capacity' => 2,
                'floor' => 'Executive Floor',
                'view' => 'Atrium',
                'featured' => false,
                'short_description' => 'A work-ready studio with acoustic zoning, espresso tones, and ergonomic comfort.',
                'description' => 'Built for short business stays and creative retreats, the Nocturne Executive Studio pairs hotel polish with productive comfort, including a statement desk and low-glare lighting.',
                'image' => 'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
                ],
                'amenities' => ['Acoustic work zone', 'Fast Wi-Fi', 'Espresso setup', 'Priority ironing', 'Boardroom credits'],
            ],
            [
                'room_number' => '214',
                'type' => 'Horizon Garden Residence',
                'price' => 319,
                'rating' => 4.8,
                'size' => 780,
                'beds' => 2,
                'bathrooms' => 2,
                'capacity' => 5,
                'floor' => 'Garden Level',
                'view' => 'Botanical Courtyard',
                'featured' => true,
                'short_description' => 'A two-bedroom residence opening into a lush private courtyard retreat.',
                'description' => 'The Horizon Garden Residence is tuned for longer stays and premium family escapes, with indoor-outdoor lounging, generous storage, and a calming botanical outlook.',
                'image' => 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1200&q=80',
                ],
                'amenities' => ['Two-bedroom layout', 'Garden terrace', 'Kitchenette', 'Laundry care', 'Kids sleep kit'],
            ],
            [
                'room_number' => '718',
                'type' => 'Solstice Panorama Room',
                'price' => 199,
                'rating' => 4.5,
                'size' => 420,
                'beds' => 1,
                'bathrooms' => 1,
                'capacity' => 2,
                'floor' => 'Panorama Deck',
                'view' => 'Sunset ridge',
                'featured' => false,
                'short_description' => 'A minimalist premium room with warm materials and a wide-angle sunset frame.',
                'description' => 'The Solstice Panorama Room is intentionally calm, with soft textures, integrated lighting, and an uninterrupted seat to golden-hour skies.',
                'image' => 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
                ],
                'amenities' => ['Window lounge', 'Wellness shower', 'Streaming-ready TV', 'Sound bath playlist', 'Tea ritual set'],
            ],
            [
                'room_number' => '109',
                'type' => 'Canvas Social Suite',
                'price' => 259,
                'rating' => 4.6,
                'size' => 560,
                'beds' => 2,
                'bathrooms' => 1,
                'capacity' => 4,
                'floor' => 'Lobby Loft',
                'view' => 'Atrium lounge',
                'featured' => false,
                'short_description' => 'A vibrant suite for group city stays, anchored by a conversational lounge.',
                'description' => 'The Canvas Social Suite is tuned for shared itineraries, spontaneous hangouts, and flexible sleeping arrangements, all wrapped in gallery-inspired finishes.',
                'image' => 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1464890100898-a385f744067f?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
                ],
                'amenities' => ['Convertible lounge', 'Welcome drinks', 'Group seating', 'Fast room service', 'City guide pack'],
            ],
        ];

        $rooms = collect($roomData)->map(function (array $room) {
            return Room::query()->updateOrCreate(
                ['room_number' => $room['room_number']],
                [
                    ...$room,
                    'slug' => Str::slug($room['type'].'-'.$room['room_number']),
                    'availability' => true,
                ]
            );
        });

        $bookingBlueprints = [
            [
                'reference' => 'AST-DEMO401',
                'guest' => $guests[0],
                'room' => $rooms[0],
                'check_in' => Carbon::today()->addDays(5),
                'nights' => 3,
                'guests_count' => 2,
                'status' => Booking::STATUS_CONFIRMED,
                'payment_status' => Booking::PAYMENT_PAID,
                'special_requests' => 'Window-side breakfast setup.',
            ],
            [
                'reference' => 'AST-DEMO402',
                'guest' => $guests[1],
                'room' => $rooms[1],
                'check_in' => Carbon::today()->addDays(12),
                'nights' => 2,
                'guests_count' => 3,
                'status' => Booking::STATUS_PENDING,
                'payment_status' => Booking::PAYMENT_PENDING,
                'special_requests' => 'Need a crib in the suite.',
            ],
            [
                'reference' => 'AST-DEMO403',
                'guest' => $guests[2],
                'room' => $rooms[3],
                'check_in' => Carbon::today()->subDays(8),
                'nights' => 4,
                'guests_count' => 4,
                'status' => Booking::STATUS_COMPLETED,
                'payment_status' => Booking::PAYMENT_PAID,
                'special_requests' => 'Airport transfer at checkout.',
            ],
            [
                'reference' => 'AST-DEMO404',
                'guest' => $guests[0],
                'room' => $rooms[5],
                'check_in' => Carbon::today()->addDays(20),
                'nights' => 2,
                'guests_count' => 2,
                'status' => Booking::STATUS_CANCELLED,
                'payment_status' => Booking::PAYMENT_REFUNDED,
                'special_requests' => null,
            ],
        ];

        foreach ($bookingBlueprints as $blueprint) {
            $checkOut = $blueprint['check_in']->copy()->addDays($blueprint['nights']);
            $total = $blueprint['nights'] * (float) $blueprint['room']->price;

            $booking = Booking::query()->updateOrCreate(
                ['booking_reference' => $blueprint['reference']],
                [
                    'user_id' => $blueprint['guest']->id,
                    'room_id' => $blueprint['room']->id,
                    'check_in' => $blueprint['check_in']->toDateString(),
                    'check_out' => $checkOut->toDateString(),
                    'guests' => $blueprint['guests_count'],
                    'nights' => $blueprint['nights'],
                    'total_price' => $total,
                    'status' => $blueprint['status'],
                    'payment_status' => $blueprint['payment_status'],
                    'special_requests' => $blueprint['special_requests'],
                    'cancelled_at' => $blueprint['status'] === Booking::STATUS_CANCELLED ? now()->subDays(3) : null,
                    'paid_at' => in_array($blueprint['payment_status'], [Booking::PAYMENT_PAID, Booking::PAYMENT_REFUNDED], true) ? now()->subDays(2) : null,
                ]
            );

            Payment::query()->updateOrCreate(
                ['booking_id' => $booking->id],
                [
                    'payment_method' => 'stripe',
                    'payment_status' => $blueprint['payment_status'],
                    'transaction_id' => 'TXN-'.Str::upper(Str::random(10)),
                    'provider' => 'stripe',
                    'amount' => $total,
                    'currency' => 'USD',
                    'gateway_reference' => 'CHK-'.Str::upper(Str::random(8)),
                    'provider_payload' => ['seeded' => true],
                    'paid_at' => in_array($blueprint['payment_status'], [Booking::PAYMENT_PAID, Booking::PAYMENT_REFUNDED], true) ? now()->subDays(2) : null,
                ]
            );
        }
    }
}

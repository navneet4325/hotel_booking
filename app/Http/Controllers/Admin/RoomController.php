<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpsertRoomRequest;
use App\Http\Resources\RoomResource;
use App\Models\Booking;
use App\Models\Room;
use Illuminate\Http\RedirectResponse;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class RoomController extends Controller
{
    /**
     * Display the room management screen.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'max:255'],
            'availability' => ['nullable', 'in:any,available,offline'],
            'featured' => ['nullable', 'in:all,featured,standard'],
        ]);

        $editingRoom = $request->filled('edit')
            ? Room::query()->find($request->integer('edit'))
            : null;

        $search = trim((string) ($filters['search'] ?? ''));
        $type = trim((string) ($filters['type'] ?? ''));
        $availability = (string) ($filters['availability'] ?? 'any');
        $featured = (string) ($filters['featured'] ?? 'all');

        $rooms = Room::query()
            ->when($search !== '', function (Builder $query) use ($search) {
                $query->where(function (Builder $builder) use ($search) {
                    $builder
                        ->where('room_number', 'like', "%{$search}%")
                        ->orWhere('type', 'like', "%{$search}%")
                        ->orWhere('floor', 'like', "%{$search}%")
                        ->orWhere('view', 'like', "%{$search}%")
                        ->orWhere('short_description', 'like', "%{$search}%");
                });
            })
            ->when($type !== '', fn (Builder $query) => $query->where('type', $type))
            ->when($availability === 'available', fn (Builder $query) => $query->where('availability', true))
            ->when($availability === 'offline', fn (Builder $query) => $query->where('availability', false))
            ->when($featured === 'featured', fn (Builder $query) => $query->where('featured', true))
            ->when($featured === 'standard', fn (Builder $query) => $query->where('featured', false))
            ->orderByDesc('featured')
            ->orderByDesc('availability')
            ->orderBy('room_number')
            ->get();

        return Inertia::render('admin/rooms/index', [
            'rooms' => RoomResource::collection($rooms)->resolve(),
            'editingRoom' => $editingRoom ? (new RoomResource($editingRoom))->resolve() : null,
            'stats' => [
                'total' => Room::query()->count(),
                'available' => Room::query()->where('availability', true)->count(),
                'featured' => Room::query()->where('featured', true)->count(),
                'average_rate' => (float) Room::query()->avg('price'),
            ],
            'filters' => [
                'search' => $search,
                'type' => $type,
                'availability' => $availability,
                'featured' => $featured,
            ],
            'roomTypes' => Room::query()
                ->orderBy('type')
                ->distinct()
                ->pluck('type')
                ->values(),
        ]);
    }

    /**
     * Store a newly created room.
     */
    public function store(UpsertRoomRequest $request): RedirectResponse
    {
        Room::create($this->payload($request));

        return to_route('admin.rooms.index')->with('success', 'Room created successfully.');
    }

    /**
     * Update the specified room.
     */
    public function update(UpsertRoomRequest $request, Room $room): RedirectResponse
    {
        $room->update($this->payload($request));

        return to_route('admin.rooms.index')->with('success', 'Room updated successfully.');
    }

    /**
     * Remove the specified room.
     */
    public function destroy(Room $room): RedirectResponse
    {
        $hasActiveBookings = $room->bookings()
            ->whereIn('status', [Booking::STATUS_PENDING, Booking::STATUS_CONFIRMED])
            ->exists();

        if ($hasActiveBookings) {
            return back()->with('error', 'This room has active reservations and cannot be removed yet.');
        }

        $room->delete();

        return to_route('admin.rooms.index')->with('success', 'Room deleted successfully.');
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(UpsertRoomRequest $request): array
    {
        $validated = $request->validated();
        $slug = $validated['slug'] ?? Str::slug($validated['type'].'-'.$validated['room_number']);

        return [
            ...$validated,
            'slug' => $slug,
            'gallery' => array_values(array_filter($validated['gallery'] ?? [])),
            'amenities' => array_values(array_filter($validated['amenities'] ?? [])),
        ];
    }
}

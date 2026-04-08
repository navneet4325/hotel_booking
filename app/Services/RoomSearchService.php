<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Room;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class RoomSearchService
{
    /**
     * @param array<string, mixed> $filters
     */
    public function buildQuery(array $filters): Builder
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $location = trim((string) ($filters['location'] ?? ''));
        $type = trim((string) ($filters['type'] ?? ''));
        $view = trim((string) ($filters['view'] ?? ''));
        $amenity = trim((string) ($filters['amenity'] ?? ''));
        $minPrice = $filters['min_price'] ?? null;
        $maxPrice = $filters['max_price'] ?? null;
        $rating = $filters['rating'] ?? null;
        $guests = $filters['guests'] ?? null;
        $availability = $filters['availability'] ?? null;
        $sort = (string) ($filters['sort'] ?? 'featured');

        $checkIn = filled($filters['check_in'] ?? null)
            ? Carbon::parse((string) $filters['check_in'])->toDateString()
            : null;
        $checkOut = filled($filters['check_out'] ?? null)
            ? Carbon::parse((string) $filters['check_out'])->toDateString()
            : null;
        $applyLocationFilter = $location !== ''
            && ! $this->matchesPropertyWideLocation($location)
            && $this->hasLocationMatch($location);

        $query = Room::query()
            ->select('rooms.*')
            ->where('rooms.availability', true)
            ->when(
                $search !== '',
                function (Builder $builder) use ($search) {
                    $builder->where(function (Builder $nested) use ($search) {
                        $nested
                            ->where('rooms.type', 'like', "%{$search}%")
                            ->orWhere('rooms.room_number', 'like', "%{$search}%")
                            ->orWhere('rooms.short_description', 'like', "%{$search}%")
                            ->orWhere('rooms.description', 'like', "%{$search}%")
                            ->orWhere('rooms.floor', 'like', "%{$search}%")
                            ->orWhere('rooms.view', 'like', "%{$search}%");
                    });
                },
            )
            ->when(
                $applyLocationFilter,
                function (Builder $builder) use ($location) {
                    $builder->where(function (Builder $nested) use ($location) {
                        $nested
                            ->where('rooms.floor', 'like', "%{$location}%")
                            ->orWhere('rooms.view', 'like', "%{$location}%")
                            ->orWhere('rooms.description', 'like', "%{$location}%");
                    });
                },
            )
            ->when($type !== '', fn (Builder $builder) => $builder->where('rooms.type', $type))
            ->when($view !== '', fn (Builder $builder) => $builder->where('rooms.view', $view))
            ->when($amenity !== '', fn (Builder $builder) => $builder->whereJsonContains('rooms.amenities', $amenity))
            ->when(is_numeric($minPrice), fn (Builder $builder) => $builder->where('rooms.price', '>=', (float) $minPrice))
            ->when(is_numeric($maxPrice), fn (Builder $builder) => $builder->where('rooms.price', '<=', (float) $maxPrice))
            ->when(is_numeric($rating), fn (Builder $builder) => $builder->where('rooms.rating', '>=', (float) $rating))
            ->when(is_numeric($guests), fn (Builder $builder) => $builder->where('rooms.capacity', '>=', (int) $guests))
            ->when(
                filled($availability) && ! (bool) $availability,
                fn (Builder $builder) => $builder->whereRaw('1 = 0'),
            );

        if ($checkIn && $checkOut) {
            $query
                ->leftJoinSub(
                    $this->buildConflictSubquery($checkIn, $checkOut),
                    'conflicting_bookings',
                    fn ($join) => $join->on('conflicting_bookings.room_id', '=', 'rooms.id'),
                )
                ->whereNull('conflicting_bookings.room_id');
        }

        match ($sort) {
            'price_low' => $query->orderBy('rooms.price'),
            'price_high' => $query->orderByDesc('rooms.price'),
            'rating' => $query->orderByDesc('rooms.rating')->orderBy('rooms.price'),
            default => $query->orderByDesc('rooms.featured')->orderBy('rooms.price'),
        };

        $this->logDebug($filters, $query, $checkIn, $checkOut, $applyLocationFilter);

        return $query;
    }

    private function buildConflictSubquery(string $checkIn, string $checkOut)
    {
        return Booking::query()
            ->select('room_id')
            ->whereIn('status', [Booking::STATUS_PENDING, Booking::STATUS_CONFIRMED])
            ->whereDate('check_in', '<', $checkOut)
            ->whereDate('check_out', '>', $checkIn)
            ->groupBy('room_id');
    }

    private function matchesPropertyWideLocation(string $location): bool
    {
        $normalized = strtolower($location);

        foreach (['oceanfront', 'district', 'miami', 'marina', 'hotel', 'aetherstay'] as $keyword) {
            if (str_contains($normalized, $keyword)) {
                return true;
            }
        }

        return false;
    }

    private function hasLocationMatch(string $location): bool
    {
        return Room::query()
            ->where('availability', true)
            ->where(function (Builder $builder) use ($location) {
                $builder
                    ->where('floor', 'like', "%{$location}%")
                    ->orWhere('view', 'like', "%{$location}%")
                    ->orWhere('description', 'like', "%{$location}%");
            })
            ->exists();
    }

    /**
     * @param array<string, mixed> $filters
     */
    private function logDebug(
        array $filters,
        Builder $query,
        ?string $checkIn,
        ?string $checkOut,
        bool $applyLocationFilter,
    ): void
    {
        if (! config('app.debug')) {
            return;
        }

        Log::debug('Room search request received.', [
            'filters' => $filters,
            'location_filter_applied' => $applyLocationFilter,
        ]);

        Log::debug('Room search SQL generated.', [
            'sql' => $query->toSql(),
            'bindings' => $query->getBindings(),
        ]);

        if ($checkIn && $checkOut) {
            Log::debug('Room search booking conflicts checked.', [
                'check_in' => $checkIn,
                'check_out' => $checkOut,
                'conflicting_room_ids' => $this->buildConflictSubquery($checkIn, $checkOut)->pluck('room_id')->all(),
            ]);
        }
    }
}

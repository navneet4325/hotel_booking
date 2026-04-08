import { Link, router } from '@inertiajs/react';
import {
    CalendarDays,
    Filter,
    LoaderCircle,
    MapPin,
    Search,
    SlidersHorizontal,
    Star,
    Users,
} from 'lucide-react';
import { startTransition, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import RoomCard from '@/components/room-card';
import SeoHead from '@/components/seo-head';
import { heroMedia } from '@/data/site-content';
import type { Room } from '@/types';

type FilterState = {
    search: string;
    location: string;
    type: string;
    view: string;
    amenity: string;
    min_price: string;
    max_price: string;
    rating: string;
    availability: string;
    check_in: string;
    check_out: string;
    guests: string;
    sort: string;
};

type Props = {
    rooms: Room[];
    filters: Partial<FilterState>;
    meta: {
        room_types: string[];
        locations: string[];
        views: string[];
        amenities: string[];
        price_range: {
            min: number;
            max: number;
        };
        result_count: number;
    };
};

const defaultFilters: FilterState = {
    search: '',
    location: '',
    type: '',
    view: '',
    amenity: '',
    min_price: '',
    max_price: '',
    rating: '',
    availability: '',
    check_in: '',
    check_out: '',
    guests: '2',
    sort: 'featured',
};

function normalizeFilters(filters: Partial<FilterState>): FilterState {
    return {
        ...defaultFilters,
        ...Object.fromEntries(
            Object.entries(filters).map(([key, value]) => [key, value == null ? '' : String(value)]),
        ),
    };
}

function cleanFilters(filters: FilterState) {
    return Object.fromEntries(
        Object.entries(filters).filter(([key, value]) => {
            if (value === '') {
                return false;
            }

            if (key === 'guests' && value === defaultFilters.guests) {
                return false;
            }

            if (key === 'sort' && value === defaultFilters.sort) {
                return false;
            }

            return true;
        }),
    );
}

function buildBookingHref(room: Room, filters: FilterState) {
    const params = new URLSearchParams();

    if (filters.check_in) {
        params.set('check_in', filters.check_in);
    }

    if (filters.check_out) {
        params.set('check_out', filters.check_out);
    }

    if (filters.guests) {
        params.set('guests', filters.guests);
    }

    const query = params.toString();

    return query ? `/bookings/create/${room.slug}?${query}` : `/bookings/create/${room.slug}`;
}

export default function RoomsIndex({ rooms, filters, meta }: Props) {
    const [formData, setFormData] = useState<FilterState>(() => normalizeFilters(filters));
    const [isFiltering, setIsFiltering] = useState(false);
    const [filterError, setFilterError] = useState<string | null>(null);
    const deferredFilters = useDeferredValue(formData);
    const initialized = useRef(false);
    const lastSubmitted = useRef(JSON.stringify(cleanFilters(normalizeFilters(filters))));

    useEffect(() => {
        const next = normalizeFilters(filters);
        const serialized = JSON.stringify(next);

        startTransition(() => {
            setFormData((current) => {
                if (JSON.stringify(current) === serialized) {
                    return current;
                }

                return next;
            });
        });

        lastSubmitted.current = JSON.stringify(cleanFilters(next));
    }, [filters]);

    useEffect(() => {
        const payload = cleanFilters(deferredFilters);
        const serialized = JSON.stringify(payload);

        if (!initialized.current) {
            initialized.current = true;

            return;
        }

        if (serialized === lastSubmitted.current) {
            return;
        }

        const timeout = window.setTimeout(() => {
            lastSubmitted.current = serialized;
            setIsFiltering(true);
            setFilterError(null);

            router.get('/rooms', payload, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['rooms', 'filters', 'meta'],
                onError: () => {
                    setFilterError('We could not update room results. Please check your filters and try again.');
                    setIsFiltering(false);
                },
                onFinish: () => setIsFiltering(false),
            });
        }, 320);

        return () => window.clearTimeout(timeout);
    }, [deferredFilters]);

    const updateField = (key: keyof FilterState, value: string) => {
        setFormData((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const submitFilters = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload = cleanFilters(formData);
        lastSubmitted.current = JSON.stringify(payload);
        setIsFiltering(true);
        setFilterError(null);

        router.get('/rooms', payload, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['rooms', 'filters', 'meta'],
            onError: () => {
                setFilterError('We could not update room results. Please check your filters and try again.');
                setIsFiltering(false);
            },
            onFinish: () => setIsFiltering(false),
        });
    };

    const resetFilters = () => {
        const reset = {
            ...defaultFilters,
            guests: '2',
        };

        setFormData(reset);
        lastSubmitted.current = JSON.stringify(cleanFilters(reset));
        setIsFiltering(true);
        setFilterError(null);

        router.get('/rooms', {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['rooms', 'filters', 'meta'],
            onError: () => {
                setFilterError('We could not reset filters right now.');
                setIsFiltering(false);
            },
            onFinish: () => setIsFiltering(false),
        });
    };

    const roomCards = useMemo(() => {
        return rooms.map((room) => ({
            room,
            bookingHref: buildBookingHref(room, formData),
        }));
    }, [formData, rooms]);

    return (
        <>
            <SeoHead
                title="Hotels"
                description="Search and filter premium hotel rooms by dates, guests, amenities, rating, and live availability."
                path="/rooms"
                image={heroMedia[0]}
            />

            <section className="relative overflow-hidden rounded-[2.5rem]">
                <img
                    src={heroMedia[0]}
                    alt="Hotel listing hero"
                    className="h-104 w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.25),rgba(15,23,42,0.72))]" />
                <div className="absolute inset-x-0 top-0 h-full">
                    <div className="mx-auto flex h-full max-w-7xl flex-col justify-end px-6 py-8 sm:px-8 lg:px-10">
                        <div className="max-w-3xl">
                            <p className="text-xs uppercase tracking-[0.32em] text-white/75">
                                Hotels and Rooms
                            </p>
                            <h1 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">
                                Search premium rooms with real availability and direct booking.
                            </h1>
                            <p className="mt-4 text-sm leading-7 text-white/80 sm:text-base">
                                Compare room type, rates, rating, amenities, guests, and stay dates in one clean hotel-results experience.
                            </p>
                        </div>

                        <form
                            onSubmit={submitFilters}
                            className="mt-8 grid gap-3 rounded-4xl border border-white/25 bg-white/95 p-4 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.35)] lg:grid-cols-[1.2fr_repeat(3,minmax(0,0.8fr))_auto]"
                        >
                            <label className="grid gap-2 text-sm text-slate-600">
                                Location
                                <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4">
                                    <MapPin className="h-4 w-4 text-sky-500" />
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(event) => updateField('location', event.target.value)}
                                        placeholder="Oceanfront District, Sky Wing..."
                                        className="w-full bg-transparent text-sm outline-none"
                                    />
                                </div>
                            </label>
                            <label className="grid gap-2 text-sm text-slate-600">
                                Check-in
                                <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4">
                                    <CalendarDays className="h-4 w-4 text-amber-500" />
                                    <input
                                        type="date"
                                        value={formData.check_in}
                                        onChange={(event) => updateField('check_in', event.target.value)}
                                        className="w-full bg-transparent text-sm outline-none"
                                    />
                                </div>
                            </label>
                            <label className="grid gap-2 text-sm text-slate-600">
                                Check-out
                                <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4">
                                    <CalendarDays className="h-4 w-4 text-amber-500" />
                                    <input
                                        type="date"
                                        value={formData.check_out}
                                        onChange={(event) => updateField('check_out', event.target.value)}
                                        className="w-full bg-transparent text-sm outline-none"
                                    />
                                </div>
                            </label>
                            <label className="grid gap-2 text-sm text-slate-600">
                                Guests
                                <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4">
                                    <Users className="h-4 w-4 text-indigo-500" />
                                    <input
                                        type="number"
                                        min={1}
                                        max={10}
                                        value={formData.guests}
                                        onChange={(event) => updateField('guests', event.target.value)}
                                        className="w-full bg-transparent text-sm outline-none"
                                    />
                                </div>
                            </label>
                            <button
                                type="submit"
                                className="inline-flex h-12 items-center justify-center gap-2 self-end rounded-2xl bg-(--brand-primary) px-5 text-sm font-medium text-white transition hover:-translate-y-0.5"
                            >
                                {isFiltering ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[19rem_minmax(0,1fr)]">
                <aside className="glass-panel h-fit rounded-4xl p-5 xl:sticky xl:top-28">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-300">
                                Filters
                            </p>
                            <h2 className="mt-2 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                                Refine your stay
                            </h2>
                        </div>
                        <SlidersHorizontal className="h-5 w-5 text-sky-500" />
                    </div>

                    <form onSubmit={submitFilters} className="mt-6 space-y-4">
                        <label className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                            Search term
                            <input
                                type="text"
                                value={formData.search}
                                onChange={(event) => updateField('search', event.target.value)}
                                placeholder="Suite, family, skyline..."
                                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none dark:border-white/10 dark:bg-white/5"
                            />
                        </label>

                        <label className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                            Location
                            <select
                                value={formData.location}
                                onChange={(event) => updateField('location', event.target.value)}
                                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none dark:border-white/10 dark:bg-white/5"
                            >
                                <option value="">All locations</option>
                                {meta.locations.map((location) => (
                                    <option key={location} value={location}>
                                        {location}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                            Room type
                            <select
                                value={formData.type}
                                onChange={(event) => updateField('type', event.target.value)}
                                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none dark:border-white/10 dark:bg-white/5"
                            >
                                <option value="">All room types</option>
                                {meta.room_types.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                            Availability
                            <select
                                value={formData.availability}
                                onChange={(event) => updateField('availability', event.target.value)}
                                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none dark:border-white/10 dark:bg-white/5"
                            >
                                <option value="">Any</option>
                                <option value="1">Available</option>
                            </select>
                        </label>

                        <label className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                            Rating
                            <select
                                value={formData.rating}
                                onChange={(event) => updateField('rating', event.target.value)}
                                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none dark:border-white/10 dark:bg-white/5"
                            >
                                <option value="">Any rating</option>
                                <option value="4">4.0+</option>
                                <option value="4.5">4.5+</option>
                                <option value="4.8">4.8+</option>
                            </select>
                        </label>

                        <label className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                            Amenities
                            <select
                                value={formData.amenity}
                                onChange={(event) => updateField('amenity', event.target.value)}
                                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none dark:border-white/10 dark:bg-white/5"
                            >
                                <option value="">Any amenity</option>
                                {meta.amenities.map((amenity) => (
                                    <option key={amenity} value={amenity}>
                                        {amenity}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                            View
                            <select
                                value={formData.view}
                                onChange={(event) => updateField('view', event.target.value)}
                                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none dark:border-white/10 dark:bg-white/5"
                            >
                                <option value="">Any view</option>
                                {meta.views.map((view) => (
                                    <option key={view} value={view}>
                                        {view}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                            <label className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                                Min price
                                <input
                                    type="number"
                                    min={meta.price_range.min}
                                    value={formData.min_price}
                                    onChange={(event) => updateField('min_price', event.target.value)}
                                    placeholder={String(meta.price_range.min)}
                                    className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none dark:border-white/10 dark:bg-white/5"
                                />
                            </label>
                            <label className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                                Max price
                                <input
                                    type="number"
                                    min={meta.price_range.min}
                                    value={formData.max_price}
                                    onChange={(event) => updateField('max_price', event.target.value)}
                                    placeholder={String(meta.price_range.max)}
                                    className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none dark:border-white/10 dark:bg-white/5"
                                />
                            </label>
                        </div>

                        <label className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                            Sort by
                            <select
                                value={formData.sort}
                                onChange={(event) => updateField('sort', event.target.value)}
                                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none dark:border-white/10 dark:bg-white/5"
                            >
                                <option value="featured">Featured first</option>
                                <option value="price_low">Price: low to high</option>
                                <option value="price_high">Price: high to low</option>
                                <option value="rating">Top rated</option>
                            </select>
                        </label>

                        <div className="grid gap-3">
                            <button
                                type="submit"
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-(--brand-primary) px-4 text-sm font-medium text-white transition hover:-translate-y-0.5"
                            >
                                {isFiltering ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Filter className="h-4 w-4" />}
                                Apply filters
                            </button>
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:text-(--brand-primary) dark:border-white/10 dark:bg-white/5 dark:text-white"
                            >
                                Reset filters
                            </button>
                        </div>
                    </form>
                </aside>

                <div className="space-y-6">
                    <div className="glass-panel rounded-4xl p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-300">
                                    Search results
                                </p>
                                <h2 className="mt-2 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                                    {meta.result_count} hotel room{meta.result_count === 1 ? '' : 's'} available
                                </h2>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                    Results combine location, room type, guests, dates, price, rating, and amenities.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 dark:bg-white/5 dark:text-slate-200">
                                    <Filter className="h-4 w-4 text-sky-500" />
                                    Dynamic filters
                                </div>
                                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 dark:bg-white/5 dark:text-slate-200">
                                    <Star className="h-4 w-4 fill-current text-amber-500" />
                                    Date overlap checked
                                </div>
                            </div>
                        </div>

                        {isFiltering && (
                            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm text-sky-700 dark:bg-sky-400/10 dark:text-sky-200">
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                Updating room results...
                            </div>
                        )}

                        {filterError && (
                            <div className="mt-4 rounded-3xl border border-rose-300/40 bg-rose-500/10 px-4 py-4 text-sm text-rose-700 dark:border-rose-400/20 dark:text-rose-200">
                                {filterError}
                            </div>
                        )}
                    </div>

                    {roomCards.length > 0 ? (
                        <div className="grid gap-6 xl:grid-cols-2">
                            {roomCards.map(({ room, bookingHref }) => (
                                <RoomCard key={room.id} room={room} bookingHref={bookingHref} />
                            ))}
                        </div>
                    ) : (
                        <div className="glass-panel rounded-4xl px-6 py-12 text-center">
                            <p className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                No rooms matched your search.
                            </p>
                            <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">
                                Try changing the location, dates, or filters to see available hotel rooms.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/rooms"
                                    className="inline-flex items-center justify-center rounded-full bg-(--brand-primary) px-5 py-3 text-sm font-medium text-white"
                                >
                                    Reset and browse all rooms
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

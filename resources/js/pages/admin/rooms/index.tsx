import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowUpRight, BedDouble, ImagePlus, PlusCircle, RefreshCw, Search, Sparkles, Star, Users2, Waves } from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import InputError from '@/components/input-error';
import MetricCard from '@/components/metric-card';
import StatusPill from '@/components/status-pill';
import { formatCurrency, roomLocation } from '@/lib/hotel';
import type { Room } from '@/types';

type Props = {
    rooms: Room[];
    editingRoom?: Room | null;
    stats: {
        total: number;
        available: number;
        featured: number;
        average_rate: number;
    };
    filters: {
        search: string;
        type: string;
        availability: string;
        featured: string;
    };
    roomTypes: string[];
};

const emptyForm = {
    room_number: '',
    slug: '',
    type: '',
    price: '249',
    availability: true,
    rating: '4.8',
    size: '520',
    beds: '1',
    bathrooms: '1',
    capacity: '2',
    floor: '',
    view: '',
    short_description: '',
    description: '',
    image: '',
    featured: false,
};

const inputClassName =
    'h-12 rounded-2xl border border-white/60 bg-white/80 px-4 text-sm text-slate-700 outline-none transition focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/20 dark:border-white/10 dark:bg-white/6 dark:text-slate-100';

const textAreaClassName =
    'min-h-28 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/20 dark:border-white/10 dark:bg-white/6 dark:text-slate-100';

function FieldLabel({
    label,
    hint,
    children,
    error,
}: {
    label: string;
    hint?: string;
    children: ReactNode;
    error?: string;
}) {
    return (
        <label className="block space-y-2">
            <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
                {hint && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">{hint}</span>
                )}
            </div>
            {children}
            <InputError message={error} />
        </label>
    );
}

export default function AdminRooms({
    rooms,
    editingRoom,
    stats,
    filters,
    roomTypes,
}: Props) {
    const form = useForm(emptyForm);
    const [galleryText, setGalleryText] = useState('');
    const [amenitiesText, setAmenitiesText] = useState('');
    const [inventoryFilters, setInventoryFilters] = useState(filters);

    useEffect(() => {
        if (!editingRoom) {
            form.setData({ ...emptyForm });
            setGalleryText('');
            setAmenitiesText('');

            return;
        }

        form.setData({
            room_number: editingRoom.room_number,
            slug: editingRoom.slug,
            type: editingRoom.type,
            price: String(editingRoom.price),
            availability: editingRoom.availability,
            rating: String(editingRoom.rating),
            size: String(editingRoom.size),
            beds: String(editingRoom.beds),
            bathrooms: String(editingRoom.bathrooms),
            capacity: String(editingRoom.capacity),
            floor: editingRoom.floor || '',
            view: editingRoom.view || '',
            short_description: editingRoom.short_description,
            description: editingRoom.description,
            image: editingRoom.image || '',
            featured: editingRoom.featured,
        });
        setGalleryText((editingRoom.gallery ?? []).join('\n'));
        setAmenitiesText((editingRoom.amenities ?? []).join('\n'));
    }, [editingRoom]);

    useEffect(() => {
        setInventoryFilters(filters);
    }, [filters.search, filters.type, filters.availability, filters.featured]);

    const previewImages = useMemo(() => {
        return [form.data.image, ...galleryText.split('\n').map((item) => item.trim())]
            .filter(Boolean)
            .slice(0, 4);
    }, [form.data.image, galleryText]);

    const previewAmenities = useMemo(() => {
        return amenitiesText
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean)
            .slice(0, 8);
    }, [amenitiesText]);

    const galleryError = form.errors.gallery || Object.entries(form.errors).find(([key]) => key.startsWith('gallery.'))?.[1];
    const amenitiesError = form.errors.amenities || Object.entries(form.errors).find(([key]) => key.startsWith('amenities.'))?.[1];

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload = {
            ...form.data,
            price: Number(form.data.price),
            rating: Number(form.data.rating),
            size: Number(form.data.size),
            beds: Number(form.data.beds),
            bathrooms: Number(form.data.bathrooms),
            capacity: Number(form.data.capacity),
            gallery: galleryText.split('\n').map((item) => item.trim()).filter(Boolean),
            amenities: amenitiesText.split('\n').map((item) => item.trim()).filter(Boolean),
            availability: form.data.availability ? 1 : 0,
            featured: form.data.featured ? 1 : 0,
        };

        form.transform(() => payload);

        if (editingRoom) {
            form.put(`/admin/rooms/${editingRoom.id}`);

            return;
        }

        form.post('/admin/rooms');
    };

    const applyFilters = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        router.get(
            '/admin/rooms',
            {
                search: inventoryFilters.search || undefined,
                type: inventoryFilters.type || undefined,
                availability: inventoryFilters.availability !== 'any' ? inventoryFilters.availability : undefined,
                featured: inventoryFilters.featured !== 'all' ? inventoryFilters.featured : undefined,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const resetFilters = () => {
        router.get('/admin/rooms', {}, { preserveState: true, replace: true });
    };

    const removeRoom = (room: Room) => {
        const confirmed = window.confirm(`Delete ${room.type} (${room.room_number}) from the inventory?`);

        if (!confirmed) {
            return;
        }

        router.delete(`/admin/rooms/${room.id}`);
    };

    return (
        <>
            <Head title="Manage rooms" />

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Total rooms" value={stats.total} accent="cyan" detail="Complete inventory across all categories." />
                <MetricCard label="Live now" value={stats.available} accent="amber" detail="Rooms currently visible for booking." />
                <MetricCard label="Featured" value={stats.featured} accent="rose" detail="Homepage-ready suites and premium stays." />
                <MetricCard label="Average rate" value={formatCurrency(stats.average_rate)} accent="cyan" detail="Average nightly room price." />
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                <div className="glass-panel rounded-[2.5rem] p-7 sm:p-8">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-300">
                                Inventory editor
                            </p>
                            <h1 className="mt-4 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                                {editingRoom ? 'Update room details' : 'Add a new room to the hotel'}
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                                Create or update a room with pricing, amenities, media links, and availability so it can immediately appear on the guest website.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/admin"
                                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/50 bg-white/70 px-4 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:text-white"
                            >
                                <ArrowUpRight className="h-4 w-4" />
                                Dashboard
                            </Link>
                            <Link
                                href="/admin/rooms"
                                className="inline-flex h-11 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-medium text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
                            >
                                <PlusCircle className="h-4 w-4" />
                                New room
                            </Link>
                        </div>
                    </div>

                    <form onSubmit={submit} className="mt-8 space-y-7">
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            <FieldLabel label="Room number" error={form.errors.room_number}>
                                <input
                                    value={form.data.room_number}
                                    onChange={(event) => form.setData('room_number', event.target.value)}
                                    placeholder="501"
                                    className={inputClassName}
                                />
                            </FieldLabel>
                            <FieldLabel label="Room type" error={form.errors.type}>
                                <input
                                    value={form.data.type}
                                    onChange={(event) => form.setData('type', event.target.value)}
                                    placeholder="Aurora Skyline Suite"
                                    className={inputClassName}
                                />
                            </FieldLabel>
                            <FieldLabel label="Slug" hint="Optional" error={form.errors.slug}>
                                <input
                                    value={form.data.slug}
                                    onChange={(event) => form.setData('slug', event.target.value)}
                                    placeholder="auto-generated if left blank"
                                    className={inputClassName}
                                />
                            </FieldLabel>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            <FieldLabel label="Nightly price" error={form.errors.price}>
                                <input
                                    value={form.data.price}
                                    onChange={(event) => form.setData('price', event.target.value)}
                                    placeholder="249"
                                    className={inputClassName}
                                />
                            </FieldLabel>
                            <FieldLabel label="Guest rating" error={form.errors.rating}>
                                <input
                                    value={form.data.rating}
                                    onChange={(event) => form.setData('rating', event.target.value)}
                                    placeholder="4.8"
                                    className={inputClassName}
                                />
                            </FieldLabel>
                            <FieldLabel label="Room size (sq ft)" error={form.errors.size}>
                                <input
                                    value={form.data.size}
                                    onChange={(event) => form.setData('size', event.target.value)}
                                    placeholder="520"
                                    className={inputClassName}
                                />
                            </FieldLabel>
                            <FieldLabel label="Capacity" error={form.errors.capacity}>
                                <input
                                    value={form.data.capacity}
                                    onChange={(event) => form.setData('capacity', event.target.value)}
                                    placeholder="2"
                                    className={inputClassName}
                                />
                            </FieldLabel>
                            <FieldLabel label="Beds" error={form.errors.beds}>
                                <input
                                    value={form.data.beds}
                                    onChange={(event) => form.setData('beds', event.target.value)}
                                    placeholder="1"
                                    className={inputClassName}
                                />
                            </FieldLabel>
                            <FieldLabel label="Bathrooms" error={form.errors.bathrooms}>
                                <input
                                    value={form.data.bathrooms}
                                    onChange={(event) => form.setData('bathrooms', event.target.value)}
                                    placeholder="1"
                                    className={inputClassName}
                                />
                            </FieldLabel>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            <FieldLabel label="Floor or wing" hint="Optional" error={form.errors.floor}>
                                <input
                                    value={form.data.floor}
                                    onChange={(event) => form.setData('floor', event.target.value)}
                                    placeholder="Sky Wing"
                                    className={inputClassName}
                                />
                            </FieldLabel>
                            <FieldLabel label="View" hint="Optional" error={form.errors.view}>
                                <input
                                    value={form.data.view}
                                    onChange={(event) => form.setData('view', event.target.value)}
                                    placeholder="Cityline"
                                    className={inputClassName}
                                />
                            </FieldLabel>
                            <FieldLabel label="Hero image URL" hint="Optional" error={form.errors.image}>
                                <input
                                    value={form.data.image}
                                    onChange={(event) => form.setData('image', event.target.value)}
                                    placeholder="https://..."
                                    className={inputClassName}
                                />
                            </FieldLabel>
                        </div>

                        <FieldLabel label="Short description" error={form.errors.short_description}>
                            <input
                                value={form.data.short_description}
                                onChange={(event) => form.setData('short_description', event.target.value)}
                                placeholder="One-line selling point for cards and listings"
                                className={inputClassName}
                            />
                        </FieldLabel>

                        <FieldLabel label="Full description" error={form.errors.description}>
                            <textarea
                                value={form.data.description}
                                onChange={(event) => form.setData('description', event.target.value)}
                                placeholder="Describe the room experience, layout, mood, and premium details."
                                className={textAreaClassName}
                            />
                        </FieldLabel>

                        <div className="grid gap-4 xl:grid-cols-2">
                            <FieldLabel label="Gallery image URLs" hint="One URL per line" error={galleryError}>
                                <textarea
                                    value={galleryText}
                                    onChange={(event) => setGalleryText(event.target.value)}
                                    placeholder={'https://...\nhttps://...\nhttps://...'}
                                    className={textAreaClassName}
                                />
                            </FieldLabel>
                            <FieldLabel label="Amenities" hint="One amenity per line" error={amenitiesError}>
                                <textarea
                                    value={amenitiesText}
                                    onChange={(event) => setAmenitiesText(event.target.value)}
                                    placeholder={'Breakfast tasting\nPrivate terrace\nFreestanding tub'}
                                    className={textAreaClassName}
                                />
                            </FieldLabel>
                        </div>

                        <div className="flex flex-wrap gap-4 rounded-[1.75rem] border border-white/50 bg-white/60 px-5 py-4 text-sm text-slate-700 dark:border-white/10 dark:bg-white/6 dark:text-slate-200">
                            <label className="inline-flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={form.data.availability}
                                    onChange={(event) => form.setData('availability', event.target.checked)}
                                />
                                Room is available for bookings
                            </label>
                            <label className="inline-flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={form.data.featured}
                                    onChange={(event) => form.setData('featured', event.target.checked)}
                                />
                                Feature this room on the homepage
                            </label>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950"
                            >
                                {form.processing ? 'Saving...' : editingRoom ? 'Update room' : 'Create room'}
                            </button>
                            <Link
                                href="/admin/rooms"
                                className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/50 bg-white/70 px-5 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:text-white"
                            >
                                Reset form
                            </Link>
                            {editingRoom && (
                                <Link
                                    href={`/rooms/${editingRoom.slug}`}
                                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-cyan-300/50 bg-cyan-400/10 px-5 text-sm font-medium text-cyan-700 transition hover:-translate-y-0.5 dark:border-cyan-300/20 dark:bg-cyan-400/10 dark:text-cyan-200"
                                >
                                    View live page
                                </Link>
                            )}
                        </div>
                    </form>
                </div>

                <div className="space-y-6">
                    <div className="glass-panel rounded-[2.5rem] p-7">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                            Live preview
                        </p>
                        <h2 className="mt-4 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                            {form.data.type || 'Your room card will appear here'}
                        </h2>
                        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                            Preview the guest-facing room content before saving it to the hotel inventory.
                        </p>

                        <div className="mt-6 overflow-hidden rounded-[2rem] border border-white/50 bg-white/70 dark:border-white/10 dark:bg-white/8">
                            <div className="relative h-72 bg-slate-100 dark:bg-slate-900/60">
                                {previewImages[0] ? (
                                    <img
                                        src={previewImages[0]}
                                        alt={form.data.type || 'Room preview'}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-slate-400 dark:text-slate-500">
                                        <div className="flex flex-col items-center gap-3 text-center">
                                            <ImagePlus className="h-10 w-10" />
                                            <p className="max-w-52 text-sm leading-6">
                                                Add a hero image URL to preview how this room appears to guests.
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent px-5 py-5 text-white">
                                    <p className="text-xs uppercase tracking-[0.24em] text-white/70">
                                        {form.data.room_number || 'Room number'}
                                    </p>
                                    <p className="mt-2 font-display text-2xl font-semibold">
                                        {form.data.type || 'Premium suite name'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-5 p-5">
                                <div className="flex flex-wrap gap-2">
                                    <StatusPill status={form.data.availability ? 'available' : 'offline'} />
                                    <StatusPill status={form.data.featured ? 'featured' : 'standard'} />
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-2xl border border-white/50 bg-white/70 p-4 dark:border-white/10 dark:bg-white/6">
                                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                            Rate
                                        </p>
                                        <p className="mt-2 font-display text-2xl text-slate-950 dark:text-white">
                                            {formatCurrency(Number(form.data.price || 0))}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-white/50 bg-white/70 p-4 dark:border-white/10 dark:bg-white/6">
                                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                            Location
                                        </p>
                                        <p className="mt-2 font-display text-2xl text-slate-950 dark:text-white">
                                            {roomLocation({
                                                location: undefined,
                                                floor: form.data.floor,
                                                view: form.data.view,
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/6">
                                        <Users2 className="h-4 w-4" />
                                        {form.data.capacity} guests
                                    </span>
                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/6">
                                        <BedDouble className="h-4 w-4" />
                                        {form.data.beds} beds
                                    </span>
                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/6">
                                        <Waves className="h-4 w-4" />
                                        {form.data.view || 'Custom view'}
                                    </span>
                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/6">
                                        <Star className="h-4 w-4" />
                                        {form.data.rating} / 5
                                    </span>
                                </div>

                                {previewAmenities.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {previewAmenities.map((amenity) => (
                                            <span
                                                key={amenity}
                                                className="rounded-full border border-cyan-300/50 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-400/10 dark:text-cyan-200"
                                            >
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {previewImages.length > 1 && (
                                    <div className="grid grid-cols-3 gap-3">
                                        {previewImages.slice(1).map((image, index) => (
                                            <div key={`${image}-${index}`} className="overflow-hidden rounded-2xl">
                                                <img
                                                    src={image}
                                                    alt={`Gallery preview ${index + 1}`}
                                                    className="h-24 w-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel rounded-[2.5rem] p-7">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                            Admin workflow
                        </p>
                        <div className="mt-5 space-y-4">
                            <div className="rounded-[1.75rem] border border-white/50 bg-white/70 p-4 dark:border-white/10 dark:bg-white/6">
                                <p className="font-medium text-slate-950 dark:text-white">1. Add polished room content</p>
                                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                    Include a strong title, short summary, and quality visuals so the public room page looks premium.
                                </p>
                            </div>
                            <div className="rounded-[1.75rem] border border-white/50 bg-white/70 p-4 dark:border-white/10 dark:bg-white/6">
                                <p className="font-medium text-slate-950 dark:text-white">2. Mark live availability</p>
                                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                    Keep rooms bookable only when they should appear in search results and booking flows.
                                </p>
                            </div>
                            <div className="rounded-[1.75rem] border border-white/50 bg-white/70 p-4 dark:border-white/10 dark:bg-white/6">
                                <p className="font-medium text-slate-950 dark:text-white">3. Track reservations after publishing</p>
                                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                    After the room is live, use bookings and payments panels to manage guest stays and revenue.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="glass-panel rounded-[2.5rem] p-7 sm:p-8">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                            Inventory browser
                        </p>
                        <h2 className="mt-4 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                            Manage all hotel rooms from one place.
                        </h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/admin/bookings"
                            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/50 bg-white/70 px-4 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:text-white"
                        >
                            <ArrowUpRight className="h-4 w-4" />
                            Manage bookings
                        </Link>
                        <Link
                            href="/admin/payments"
                            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/50 bg-white/70 px-4 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:text-white"
                        >
                            <ArrowUpRight className="h-4 w-4" />
                            Track payments
                        </Link>
                    </div>
                </div>

                <form onSubmit={applyFilters} className="mt-8 grid gap-3 lg:grid-cols-[minmax(0,1.1fr)_repeat(3,minmax(0,0.5fr))_auto_auto]">
                    <label className="relative block">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            value={inventoryFilters.search}
                            onChange={(event) => setInventoryFilters((current) => ({ ...current, search: event.target.value }))}
                            placeholder="Search room number, type, floor, or view"
                            className={`${inputClassName} w-full pl-11`}
                        />
                    </label>
                    <select
                        value={inventoryFilters.type}
                        onChange={(event) => setInventoryFilters((current) => ({ ...current, type: event.target.value }))}
                        className={inputClassName}
                    >
                        <option value="">All room types</option>
                        {roomTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    <select
                        value={inventoryFilters.availability}
                        onChange={(event) => setInventoryFilters((current) => ({ ...current, availability: event.target.value }))}
                        className={inputClassName}
                    >
                        <option value="any">Any status</option>
                        <option value="available">Available</option>
                        <option value="offline">Offline</option>
                    </select>
                    <select
                        value={inventoryFilters.featured}
                        onChange={(event) => setInventoryFilters((current) => ({ ...current, featured: event.target.value }))}
                        className={inputClassName}
                    >
                        <option value="all">All room tiers</option>
                        <option value="featured">Featured only</option>
                        <option value="standard">Standard only</option>
                    </select>
                    <button
                        type="submit"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-medium text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
                    >
                        <Sparkles className="h-4 w-4" />
                        Apply
                    </button>
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/50 bg-white/70 px-5 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:text-white"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Reset
                    </button>
                </form>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-300">
                    <span>{rooms.length} room{rooms.length === 1 ? '' : 's'} shown</span>
                    {(filters.search || filters.type || filters.availability !== 'any' || filters.featured !== 'all') && (
                        <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-200">
                            Filtered inventory
                        </span>
                    )}
                </div>

                <div className="mt-8 grid gap-4">
                    {rooms.length > 0 ? rooms.map((room) => (
                        <div key={room.id} className="neo-panel overflow-hidden rounded-[2rem]">
                            <div className="grid gap-0 lg:grid-cols-[280px_minmax(0,1fr)]">
                                <div className="h-full min-h-60 bg-slate-100 dark:bg-slate-900/60">
                                    {room.image ? (
                                        <img
                                            src={room.image}
                                            alt={room.type}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-slate-400 dark:text-slate-500">
                                            <ImagePlus className="h-8 w-8" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-5 px-5 py-5 lg:px-6">
                                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                                {room.room_number} · {roomLocation(room)}
                                            </p>
                                            <p className="mt-2 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                                                {room.type}
                                            </p>
                                            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                                                {room.short_description}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <StatusPill status={room.featured ? 'featured' : 'standard'} />
                                            <StatusPill status={room.availability ? 'available' : 'offline'} />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
                                        <span className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/6">
                                            <BedDouble className="h-4 w-4" />
                                            {room.beds} bed{room.beds > 1 ? 's' : ''}
                                        </span>
                                        <span className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/6">
                                            <Users2 className="h-4 w-4" />
                                            {room.capacity} guests
                                        </span>
                                        <span className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/6">
                                            <Star className="h-4 w-4" />
                                            {room.rating} rating
                                        </span>
                                        <span className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/6">
                                            <Sparkles className="h-4 w-4" />
                                            {formatCurrency(room.price)} per night
                                        </span>
                                    </div>

                                    {room.amenities.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {room.amenities.slice(0, 6).map((amenity) => (
                                                <span
                                                    key={amenity}
                                                    className="rounded-full border border-white/50 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/6 dark:text-slate-200"
                                                >
                                                    {amenity}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-3">
                                        <Link
                                            href={`/admin/rooms?edit=${room.id}`}
                                            className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-950 px-4 text-sm font-medium text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
                                        >
                                            Edit room
                                        </Link>
                                        <Link
                                            href={`/rooms/${room.slug}`}
                                            className="inline-flex h-11 items-center justify-center rounded-2xl border border-cyan-300/50 bg-cyan-400/10 px-4 text-sm font-medium text-cyan-700 transition hover:-translate-y-0.5 dark:border-cyan-300/20 dark:bg-cyan-400/10 dark:text-cyan-200"
                                        >
                                            View live
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => removeRoom(room)}
                                            className="inline-flex h-11 items-center justify-center rounded-2xl border border-rose-300/60 bg-rose-500/10 px-4 text-sm font-medium text-rose-700 transition hover:-translate-y-0.5 dark:border-rose-300/20 dark:bg-rose-500/10 dark:text-rose-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="rounded-[2rem] border border-dashed border-slate-300/70 bg-white/60 px-6 py-12 text-center dark:border-white/10 dark:bg-white/6">
                            <p className="font-display text-3xl font-semibold text-slate-950 dark:text-white">
                                No rooms matched these filters.
                            </p>
                            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                Reset the filters or create a fresh room entry to build out the hotel inventory.
                            </p>
                            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-950 px-4 text-sm font-medium text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
                                >
                                    Browse all rooms
                                </button>
                                <Link
                                    href="/admin/rooms"
                                    className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/50 bg-white/70 px-4 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:text-white"
                                >
                                    Create room
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

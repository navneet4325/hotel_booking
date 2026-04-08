import { Link } from '@inertiajs/react';
import { ArrowUpRight, BedDouble, MapPin, Maximize2, Sparkles, Star } from 'lucide-react';
import { availabilityLabel, formatCurrency, roomLabel, roomLocation } from '@/lib/hotel';
import type { Room } from '@/types';

export default function RoomCard({
    room,
    compact = false,
    bookingHref,
}: {
    room: Room;
    compact?: boolean;
    bookingHref?: string;
}) {
    const amenities = room.amenities.slice(0, compact ? 2 : 3);

    return (
        <article className="group overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_20px_40px_-28px_rgba(15,23,42,0.22)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_52px_-30px_rgba(30,58,138,0.3)] dark:border-white/10 dark:bg-slate-900">
            <div className="relative h-60 overflow-hidden">
                <img
                    src={room.image || room.gallery[0] || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'}
                    alt={roomLabel(room)}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.05),rgba(15,23,42,0.4))]" />
                <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-(--brand-primary) shadow-sm">
                        {room.view || 'Signature'}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur dark:bg-white/15">
                        <Star className="h-3.5 w-3.5 fill-current text-amber-400" />
                        {room.rating.toFixed(1)}
                    </span>
                </div>
            </div>

            <div className="space-y-5 p-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                            Room {room.room_number}
                        </p>
                        <h3 className="mt-2 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                            {room.type}
                        </h3>
                        <div className="mt-2 inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
                            <MapPin className="h-4 w-4 text-sky-500" />
                            {roomLocation(room)}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">
                            From
                        </p>
                        <p className="mt-2 font-display text-2xl font-semibold text-(--brand-primary) dark:text-white">
                            {formatCurrency(room.price)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-300">per night</p>
                    </div>
                </div>

                <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {room.short_description}
                </p>

                <div className="grid grid-cols-3 gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <div className="rounded-2xl bg-slate-50 px-3 py-3 dark:bg-white/5">
                        <BedDouble className="mb-2 h-4 w-4 text-sky-500" />
                        {room.beds} bed{room.beds > 1 ? 's' : ''}
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-3 py-3 dark:bg-white/5">
                        <Sparkles className="mb-2 h-4 w-4 text-amber-500" />
                        {room.capacity} guests
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-3 py-3 dark:bg-white/5">
                        <Maximize2 className="mb-2 h-4 w-4 text-indigo-500" />
                        {room.size} sqft
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {amenities.map((amenity) => (
                        <span
                            key={amenity}
                            className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800 dark:bg-sky-400/10 dark:text-sky-200"
                        >
                            {amenity}
                        </span>
                    ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-300">
                        {availabilityLabel(room.availability_summary)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href={`/rooms/${room.slug}`}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:text-(--brand-primary) dark:border-white/10 dark:bg-white/5 dark:text-white"
                        >
                            View details
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href={bookingHref || `/bookings/create/${room.slug}`}
                            className="inline-flex items-center gap-2 rounded-full bg-(--brand-primary) px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5"
                        >
                            Book now
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}

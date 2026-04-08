import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Bath,
    BedDouble,
    CalendarRange,
    MapPin,
    Maximize2,
    PlayCircle,
    Sparkles,
    Star,
    Users2,
} from 'lucide-react';
import { startTransition, useEffect, useEffectEvent, useMemo, useState } from 'react';
import PanoramaViewer from '@/components/panorama-viewer';
import RoomCard from '@/components/room-card';
import StatusPill from '@/components/status-pill';
import {
    contactDetails,
    featuredVideos,
    guestReviews,
    immersiveGallery,
    tourScenes,
} from '@/data/site-content';
import { availabilityLabel, formatCurrency } from '@/lib/hotel';
import type { AvailabilitySummary, Room, User } from '@/types';

type Props = {
    room: Room;
    similarRooms: Room[];
    availabilityPreview: Array<{
        date: string;
        label: string;
        available: boolean;
    }>;
};

export default function RoomShow({
    room,
    similarRooms,
    availabilityPreview,
}: Props) {
    const user = usePage().props.auth.user as User | null;
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(String(Math.min(2, room.capacity)));
    const [specialRequests, setSpecialRequests] = useState('');
    const [availability, setAvailability] = useState<AvailabilitySummary | null>(null);
    const [checking, setChecking] = useState(false);

    const fetchAvailability = useEffectEvent(async (nextCheckIn: string, nextCheckOut: string) => {
        setChecking(true);

        try {
            const response = await fetch(
                `/api/v1/availability?room_id=${room.id}&check_in=${nextCheckIn}&check_out=${nextCheckOut}`,
            );
            const payload = (await response.json()) as AvailabilitySummary;

            startTransition(() => setAvailability(payload));
        } finally {
            setChecking(false);
        }
    });

    useEffect(() => {
        if (!checkIn || !checkOut) {
            setAvailability(null);

            return;
        }

        fetchAvailability(checkIn, checkOut);
    }, [checkIn, checkOut]);

    const handleReserve = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!user) {
            router.visit('/login');

            return;
        }

        router.post('/bookings', {
            room_id: room.id,
            check_in: checkIn,
            check_out: checkOut,
            guests: Number(guests),
            special_requests: specialRequests,
            payment_method: 'razorpay',
        });
    };

    const photoHighlights = useMemo(() => {
        return Array.from(
            new Set([
                room.image,
                ...room.gallery,
                immersiveGallery[0]?.image,
                immersiveGallery[1]?.image,
                immersiveGallery[5]?.image,
            ].filter(Boolean)),
        ).slice(0, 5) as string[];
    }, [room.gallery, room.image]);

    return (
        <>
            <Head title={room.type} />

            {/* HOTEL DETAILS HERO + GALLERY */}
            <section className="grid gap-8 lg:grid-cols-[1.1fr_minmax(0,0.9fr)]">
                <div className="overflow-hidden rounded-3xl shadow-xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800">
                    <div className="relative h-120 w-full overflow-hidden rounded-t-4xl">
                        {room.image && (
                            <img
                                src={room.image}
                                alt={room.type}
                                className="h-full w-full object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-blue-900/80 via-blue-700/60 to-blue-400/20" />
                        <div className="absolute inset-x-8 bottom-8 flex flex-col gap-5">
                            <div className="flex flex-wrap items-center gap-3">
                                <StatusPill status={room.featured ? 'featured' : 'signature'} />
                                <StatusPill status={room.view || 'signature'} />
                                <div className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-xl">
                                    <Star className="h-3.5 w-3.5 fill-current text-amber-400" />
                                    {room.rating.toFixed(1)}
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.36em] text-white/70">
                                        Room {room.room_number}
                                    </p>
                                    <h1 className="mt-3 font-display text-5xl font-bold text-white drop-shadow-lg">
                                        {room.type}
                                    </h1>
                                    <p className="mt-3 max-w-2xl text-lg leading-7 text-white/90">
                                        {room.short_description}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/30 bg-white/20 px-7 py-5 text-white backdrop-blur-xl shadow-lg">
                                    <p className="text-xs uppercase tracking-[0.28em] text-white/70">
                                        From
                                    </p>
                                    <p className="mt-2 font-display text-3xl font-bold">
                                        {formatCurrency(room.price)} <span className="text-base font-normal text-white/70">/night</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Image gallery */}
                        <div className="grid gap-4 p-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {photoHighlights.map((image, index) => (
                            <img
                                key={`${image}-${index}`}
                                src={image}
                                alt={`${room.type} highlight ${index + 1}`}
                                className="h-40 w-full rounded-4xl object-cover shadow-md"
                            />
                        ))}
                    </div>
                    {/* Room details and amenities */}
                    <div className="grid gap-8 p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)]">
                        <div>
                            <p className="text-base leading-7 text-blue-900 dark:text-slate-200">
                                {room.description}
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                {room.amenities.map((amenity) => (
                                    <div key={amenity} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium shadow">
                                        {amenity}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid gap-4">
                            <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow flex flex-wrap gap-4 text-blue-900 dark:bg-slate-800 dark:text-slate-200">
                                <div className="flex items-center gap-2"><BedDouble className="h-5 w-5 text-cyan-500" /> {room.beds} bed{room.beds > 1 ? 's' : ''}</div>
                                <div className="flex items-center gap-2"><Bath className="h-5 w-5 text-amber-500" /> {room.bathrooms} bath{room.bathrooms > 1 ? 's' : ''}</div>
                                <div className="flex items-center gap-2"><Users2 className="h-5 w-5 text-rose-500" /> {room.capacity} guests</div>
                                <div className="flex items-center gap-2"><Maximize2 className="h-5 w-5 text-cyan-500" /> {room.size} sqft</div>
                            </div>
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 shadow">
                                <p className="text-xs uppercase tracking-[0.3em] text-blue-400 font-bold">
                                    Two-week availability pulse
                                </p>
                                <div className="mt-4 grid grid-cols-4 gap-2">
                                    {availabilityPreview.map((day) => (
                                        <div
                                            key={day.date}
                                            className={`rounded-2xl px-3 py-3 text-center text-xs font-semibold ${
                                                day.available
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-rose-100 text-rose-700'
                                            }`}
                                        >
                                            <p className="font-medium">{day.label}</p>
                                            <p className="mt-1 uppercase tracking-[0.2em]">
                                                {day.available ? 'Open' : 'Busy'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Booking Panel */}
                <div className="sticky top-28 rounded-3xl bg-white/90 shadow-xl border border-blue-100 p-8 z-10 flex flex-col gap-6">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-blue-400 font-bold">
                        <CalendarRange className="h-4 w-4" />
                        Book this room
                    </div>
                    <h2 className="font-display text-3xl font-bold text-blue-900">Reserve your stay</h2>
                    <p className="text-base text-blue-900/80">Confirm your dates, check live availability, then continue into a secure payment flow with Razorpay.</p>
                    <form onSubmit={handleReserve} className="flex flex-col gap-4">
                        <label className="grid gap-2 text-sm text-blue-900 font-medium">
                            Check in
                            <input
                                type="date"
                                value={checkIn}
                                onChange={(event) => setCheckIn(event.target.value)}
                                className="h-12 rounded-xl border border-blue-200 bg-white px-4 outline-none focus:ring-2 focus:ring-blue-400 text-base"
                                required
                            />
                        </label>
                        <label className="grid gap-2 text-sm text-blue-900 font-medium">
                            Check out
                            <input
                                type="date"
                                value={checkOut}
                                onChange={(event) => setCheckOut(event.target.value)}
                                className="h-12 rounded-xl border border-blue-200 bg-white px-4 outline-none focus:ring-2 focus:ring-blue-400 text-base"
                                required
                            />
                        </label>
                        <label className="grid gap-2 text-sm text-blue-900 font-medium">
                            Guests
                            <input
                                type="number"
                                min={1}
                                max={room.capacity}
                                value={guests}
                                onChange={(event) => setGuests(event.target.value)}
                                className="h-12 rounded-xl border border-blue-200 bg-white px-4 outline-none focus:ring-2 focus:ring-blue-400 text-base"
                            />
                        </label>
                        <label className="grid gap-2 text-sm text-blue-900 font-medium">
                            Special requests
                            <textarea
                                value={specialRequests}
                                onChange={(event) => setSpecialRequests(event.target.value)}
                                className="min-h-28 rounded-xl border border-blue-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 text-base"
                                placeholder="Late arrival, celebration styling, breakfast preferences..."
                            />
                        </label>
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 shadow">
                            <p className="text-xs uppercase tracking-[0.3em] text-blue-400 font-bold">
                                Smart availability checker
                            </p>
                            <p className="mt-3 text-base text-blue-900/80">
                                {checking ? 'Checking live inventory...' : availabilityLabel(availability)}
                            </p>
                            {availability && (
                                <div className="mt-4 grid grid-cols-2 gap-3 text-base text-blue-900/80">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.24em] text-blue-400 font-bold">
                                            Nights
                                        </p>
                                        <p className="mt-1 font-display text-2xl text-blue-900">
                                            {availability.nights}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.24em] text-blue-400 font-bold">
                                            Estimated total
                                        </p>
                                        <p className="mt-1 font-display text-2xl text-blue-900">
                                            {formatCurrency(availability.total_price)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-3 mt-2">
                            <button
                                type="submit"
                                className="h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow transition-all disabled:opacity-50"
                                disabled={!checkIn || !checkOut}
                            >
                                {user ? 'Reserve and continue to payment' : 'Sign in to reserve'}
                            </button>
                            <Link
                                href={`/bookings/create/${room.slug}${checkIn && checkOut ? `?check_in=${checkIn}&check_out=${checkOut}&guests=${guests}` : ''}`}
                                className="h-12 rounded-xl border border-blue-200 bg-white text-blue-700 font-semibold text-base shadow hover:bg-blue-50 transition-all flex items-center justify-center"
                            >
                                Open full booking page
                            </Link>
                        </div>
                    </form>
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.08fr_minmax(0,0.92fr)]">
                <PanoramaViewer scenes={tourScenes} />

                <div className="grid gap-6">
                    <div className="glass-panel rounded-[2.3rem] p-5">
                        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                            <PlayCircle className="h-4 w-4" />
                            Room video
                        </div>
                        <div className={`mt-4 overflow-hidden rounded-[1.7rem] ${featuredVideos[2].aspect}`}>
                            <iframe
                                src={featuredVideos[2].embedUrl}
                                title={featuredVideos[2].title}
                                className="h-full w-full"
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>

                    <div className="glass-panel rounded-[2.3rem] p-5">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                            Photo highlights
                        </p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            {photoHighlights.map((image, index) => (
                                <img
                                    key={`${image}-${index}`}
                                    src={image}
                                    alt={`${room.type} highlight ${index + 1}`}
                                    className={index === 0 ? 'h-56 w-full rounded-[1.6rem] object-cover sm:col-span-2' : 'h-40 w-full rounded-[1.6rem] object-cover'}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1fr_minmax(0,0.9fr)]">
                <div className="glass-panel rounded-[2.5rem] p-7">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                                Reviews and confidence
                            </p>
                            <h2 className="mt-3 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                                Guests book faster when the room story feels complete
                            </h2>
                        </div>
                        <Link
                            href="/reviews"
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
                        >
                            View all reviews
                            <PlayCircle className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="mt-8 grid gap-4">
                        {guestReviews.slice(0, 3).map((review) => (
                            <article key={review.author} className="neo-panel rounded-[1.8rem] p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <img src={review.avatar} alt={review.author} className="h-12 w-12 rounded-full object-cover" />
                                        <div>
                                            <p className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                                {review.author}
                                            </p>
                                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                                {review.location}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="inline-flex items-center gap-1 text-amber-500">
                                        {Array.from({ length: review.rating }).map((_, index) => (
                                            <Star key={`${review.author}-${index}`} className="h-4 w-4 fill-current" />
                                        ))}
                                    </div>
                                </div>
                                <h3 className="mt-4 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                    {review.title}
                                </h3>
                                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                    {review.review}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>

                <div className="glass-panel rounded-[2.5rem] p-7">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                        Hotel location
                    </p>
                    <h2 className="mt-3 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                        Near the waterfront, dining rooms, and concierge experiences
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        {contactDetails.address}
                    </p>
                    <div className="mt-6 overflow-hidden rounded-2xl">
                        <iframe
                            title="AetherStay waterfront map"
                            src="https://www.google.com/maps?q=27%20Horizon%20Marina%20Drive%20Miami&output=embed"
                            className="h-80 w-full"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-4 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                            <MapPin className="h-4 w-4 text-cyan-500" />
                            Marina district
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-4 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                            <Sparkles className="h-4 w-4 text-amber-500" />
                            Concierge-led itinerary support
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                        Similar rooms
                    </p>
                    <h2 className="mt-3 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                        Continue exploring the collection
                    </h2>
                </div>
                <div className="grid gap-6 xl:grid-cols-3">
                    {similarRooms.map((item) => (
                        <RoomCard key={item.id} room={item} compact />
                    ))}
                </div>
            </section>
        </>
    );
}

import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarDays,
    MapPin,
    PlayCircle,
    Search,
    Sparkles,
    Star,
    Users,
} from 'lucide-react';
import MetricCard from '@/components/metric-card';
import RoomCard from '@/components/room-card';
import {
    destinationCollections,
    featuredVideos,
    heroMedia,
    offerCollections,
    signaturePerks,
    sitePageCards,
} from '@/data/site-content';
import { formatCurrency } from '@/lib/hotel';
import type { Room, User } from '@/types';

type WelcomeProps = {
    canRegister: boolean;
    featuredRooms: Room[];
    stats: {
        total_rooms: number;
        featured_rooms: number;
        average_rating: number;
        occupancy_rate: number;
        monthly_revenue: number;
    };
    experienceHighlights: Array<{
        title: string;
        description: string;
    }>;
    testimonials: Array<{
        quote: string;
        author: string;
        role: string;
    }>;
};

export default function Welcome({
    canRegister,
    featuredRooms,
    stats,
    experienceHighlights,
    testimonials,
}: WelcomeProps) {
    const user = usePage().props.auth.user as User | null;

    return (
        <>
            <Head title="Premium Hotel Booking" />

            <section className="glass-panel relative overflow-hidden rounded-[3rem] p-6 sm:p-8 lg:p-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(15,23,42,0.1),transparent_32%)]" />
                <div className="relative grid gap-8 xl:grid-cols-[1.05fr_minmax(0,0.95fr)]">
                    <div className="flex flex-col justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-600 shadow-[0_24px_50px_-34px_rgba(15,23,42,0.8)] dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                                <Sparkles className="h-4 w-4 text-cyan-500" />
                                Premium hotel booking platform
                            </div>
                            <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-[0.98] text-slate-950 sm:text-6xl xl:text-7xl dark:text-white">
                                A real-world hotel website with cinematic rooms, live booking, and standout polish.
                            </h1>
                            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
                                AetherStay combines image-rich discovery, real booking functionality, immersive room media, and a polished hotel booking flow that feels ready for real guests.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    href="/rooms"
                                    className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-primary)] px-5 py-3 text-sm font-medium text-white shadow-[0_28px_50px_-30px_rgba(30,58,138,0.8)] transition hover:-translate-y-0.5"
                                >
                                    Explore hotels
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    href="/virtual-tour"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-5 py-3 text-sm font-medium text-slate-700 shadow-[0_18px_34px_-22px_rgba(15,23,42,0.65)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:text-white"
                                >
                                    Open room tour
                                </Link>
                                {!user && canRegister && (
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center gap-2 rounded-full border border-cyan-300/60 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-cyan-700 transition hover:-translate-y-0.5 dark:border-cyan-300/20 dark:bg-cyan-400/10 dark:text-cyan-200"
                                    >
                                        Create account
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            {signaturePerks.map((perk) => (
                                <div key={perk.title} className="neo-panel rounded-[1.8rem] p-4">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                        Why it stands out
                                    </p>
                                    <h2 className="mt-3 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                        {perk.title}
                                    </h2>
                                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                        {perk.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[1.2fr_minmax(0,0.8fr)]">
                        <div className="relative overflow-hidden rounded-[2.4rem]">
                            <img src={heroMedia[0]} alt="AetherStay hero suite" className="h-full min-h-[26rem] w-full object-cover" />
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08),rgba(15,23,42,0.62))]" />
                            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
                                <div className="rounded-[1.8rem] border border-white/20 bg-white/10 px-5 py-4 text-white backdrop-blur-xl">
                                    <p className="text-xs uppercase tracking-[0.24em] text-white/70">
                                        Signature stay
                                    </p>
                                    <p className="mt-2 font-display text-3xl font-semibold">
                                        Aurora Skyline Suite
                                    </p>
                                </div>
                                <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-xl">
                                    4.9 guest rating
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <img src={heroMedia[1]} alt="Pool and lounge preview" className="h-48 w-full rounded-[2rem] object-cover" />
                            <div className="glass-panel rounded-[2rem] p-5">
                                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-300">
                                    <PlayCircle className="h-4 w-4" />
                                    Brand film
                                </div>
                                <div className={`mt-4 overflow-hidden rounded-[1.6rem] ${featuredVideos[0].aspect}`}>
                                    <iframe
                                        src={featuredVideos[0].embedUrl}
                                        title={featuredVideos[0].title}
                                        className="h-full w-full"
                                        allow="autoplay; fullscreen; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <form
                    action="/rooms"
                    method="get"
                    className="relative mt-8 grid gap-4 rounded-[2.2rem] border border-white/50 bg-white/75 p-4 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.8)] backdrop-blur-xl lg:grid-cols-[1.2fr_repeat(3,minmax(0,0.8fr))_auto] dark:border-white/10 dark:bg-white/8"
                >
                    <label className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                        Location
                        <div className="flex h-[3.25rem] items-center gap-3 rounded-2xl border border-white/60 bg-white/80 px-4 dark:border-white/10 dark:bg-white/6">
                            <MapPin className="h-4 w-4 text-cyan-500" />
                            <input
                                type="text"
                                name="location"
                                placeholder="Oceanfront District, Sky Wing, Marina..."
                                className="w-full bg-transparent text-sm outline-none"
                            />
                        </div>
                    </label>
                    <label className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                        Check in
                        <div className="flex h-[3.25rem] items-center gap-3 rounded-2xl border border-white/60 bg-white/80 px-4 dark:border-white/10 dark:bg-white/6">
                            <CalendarDays className="h-4 w-4 text-amber-500" />
                            <input type="date" name="check_in" className="w-full bg-transparent text-sm outline-none" />
                        </div>
                    </label>
                    <label className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                        Check out
                        <div className="flex h-[3.25rem] items-center gap-3 rounded-2xl border border-white/60 bg-white/80 px-4 dark:border-white/10 dark:bg-white/6">
                            <CalendarDays className="h-4 w-4 text-amber-500" />
                            <input type="date" name="check_out" className="w-full bg-transparent text-sm outline-none" />
                        </div>
                    </label>
                    <label className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                        Guests
                        <div className="flex h-[3.25rem] items-center gap-3 rounded-2xl border border-white/60 bg-white/80 px-4 dark:border-white/10 dark:bg-white/6">
                            <Users className="h-4 w-4 text-rose-500" />
                            <input type="number" name="guests" min={1} max={10} defaultValue={2} className="w-full bg-transparent text-sm outline-none" />
                        </div>
                    </label>
                    <button
                        type="submit"
                        className="inline-flex h-[3.25rem] items-center justify-center gap-2 self-end rounded-2xl bg-[color:var(--brand-primary)] px-6 text-sm font-medium text-white transition hover:-translate-y-0.5"
                    >
                        <Search className="h-4 w-4" />
                        Search hotels
                    </button>
                </form>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.15fr_minmax(0,0.85fr)]">
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <MetricCard
                        label="Monthly revenue"
                        value={formatCurrency(stats.monthly_revenue)}
                        detail="Live payment tracking and bookings feed the ops overview."
                        accent="amber"
                    />
                    <MetricCard
                        label="Occupancy"
                        value={`${stats.occupancy_rate}%`}
                        detail="Availability stays in sync with the live booking calendar."
                        accent="cyan"
                    />
                    <MetricCard
                        label="Average rating"
                        value={stats.average_rating.toFixed(1)}
                        detail={`${stats.total_rooms} rooms across premium categories.`}
                        accent="rose"
                    />
                </div>

                <div className="glass-panel rounded-[2.4rem] p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                        Search inspiration
                    </p>
                    <div className="mt-5 grid gap-4 md:grid-cols-3 lg:grid-cols-1">
                        {destinationCollections.map((destination) => (
                            <article key={destination.title} className="neo-panel overflow-hidden rounded-[1.8rem]">
                                <img src={destination.image} alt={destination.title} className="h-44 w-full object-cover" />
                                <div className="p-4">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                        {destination.label}
                                    </p>
                                    <h2 className="mt-2 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                        {destination.title}
                                    </h2>
                                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                        {destination.description}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                            Featured rooms
                        </p>
                        <h2 className="mt-3 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                            Stay categories that feel ready for a real booking decision
                        </h2>
                    </div>
                    <Link
                        href="/rooms"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
                    >
                        See all stays
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    {featuredRooms.map((room) => (
                        <RoomCard key={room.id} room={room} />
                    ))}
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1fr_minmax(0,0.9fr)]">
                <div className="glass-panel rounded-[2.8rem] p-7 sm:p-9">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                        Explore the property
                    </p>
                    <h2 className="mt-3 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                        More than a booking flow: a full hospitality website with 10+ pages
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-600 dark:text-slate-300">
                        From gallery and virtual tours to dining, reviews, offers, and contact planning, every page is designed to feel like part of a complete brand ecosystem.
                    </p>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {sitePageCards.map((page) => (
                            <Link key={page.href} href={page.href} className="group overflow-hidden rounded-[2rem] border border-white/50 bg-white/70 transition hover:-translate-y-1 dark:border-white/10 dark:bg-white/6">
                                <img src={page.image} alt={page.title} className="h-40 w-full object-cover transition duration-700 group-hover:scale-105" />
                                <div className="p-4">
                                    <h3 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                        {page.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                        {page.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="grid gap-6">
                    <div className="glass-panel rounded-[2.4rem] p-5">
                        <div className={`overflow-hidden rounded-[1.8rem] ${featuredVideos[1].aspect}`}>
                            <iframe
                                src={featuredVideos[1].embedUrl}
                                title={featuredVideos[1].title}
                                className="h-full w-full"
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <div className="mt-4">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                Motion-led storytelling
                            </p>
                            <h3 className="mt-2 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                Videos and room mood reels deepen confidence before checkout
                            </h3>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {offerCollections.map((offer) => (
                            <article key={offer.title} className="neo-panel overflow-hidden rounded-[2rem] sm:grid sm:grid-cols-[0.85fr_minmax(0,1fr)]">
                                <img src={offer.image} alt={offer.title} className="h-44 w-full object-cover sm:h-full" />
                                <div className="p-5">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                        {offer.badge}
                                    </p>
                                    <h3 className="mt-3 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                        {offer.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                        {offer.description}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.1fr_minmax(0,0.9fr)]">
                <div className="glass-panel rounded-[2.6rem] p-7 sm:p-9">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                        Guest perspective
                    </p>
                    <h2 className="mt-3 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                        Reviews that support the premium first impression
                    </h2>
                    <div className="mt-8 grid gap-4">
                        {testimonials.map((item) => (
                            <div key={item.author} className="neo-panel rounded-[1.8rem] p-5">
                                <div className="flex items-center gap-2 text-amber-500">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <Star key={`${item.author}-${index}`} className="h-4 w-4 fill-current" />
                                    ))}
                                </div>
                                <p className="mt-4 text-sm leading-8 text-slate-700 dark:text-slate-200">
                                    “{item.quote}”
                                </p>
                                <p className="mt-4 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                    {item.author}
                                </p>
                                <p className="mt-1 text-xs uppercase tracking-[0.26em] text-slate-500 dark:text-slate-300">
                                    {item.role}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-panel rounded-[2.6rem] p-7 sm:p-9">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                        Built for travel teams
                    </p>
                    <h2 className="mt-3 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                        A booking website on the outside, an operations system underneath
                    </h2>
                    <div className="mt-8 grid gap-4">
                        {experienceHighlights.map((item, index) => (
                            <div key={item.title} className="neo-panel rounded-[1.8rem] p-5">
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                    0{index + 1}
                                </p>
                                <h3 className="mt-2 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                    {item.title}
                                </h3>
                                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href={user ? (user.role === 'admin' ? '/admin' : '/account') : '/login'}
                            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-primary)] px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"
                        >
                            {user ? 'Open dashboard' : 'Sign in'}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-5 py-3 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:text-white"
                        >
                            Plan your stay
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}

import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CalendarClock, Hotel, Wallet } from 'lucide-react';
import MetricCard from '@/components/metric-card';
import StatusPill from '@/components/status-pill';
import { formatCurrency, formatStayRange } from '@/lib/hotel';
import type { Booking } from '@/types';

type Props = {
    overview: {
        total_bookings: number;
        upcoming_bookings: number;
        total_spend: number;
        stay_nights: number;
        upcoming_booking?: Booking | null;
    };
    recentBookings: Booking[];
};

export default function AccountDashboard({ overview, recentBookings }: Props) {
    return (
        <>
            <Head title="Dashboard" />

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                <div className="glass-panel rounded-[2.5rem] p-7 sm:p-9">
                    <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-300">
                        Guest dashboard
                    </p>
                    <h1 className="mt-4 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                        Manage every reservation in one calm view.
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                        Review your upcoming stays, total spend, and recent booking activity without leaving the account workspace.
                    </p>

                    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <MetricCard label="Bookings" value={overview.total_bookings} accent="cyan" />
                        <MetricCard label="Upcoming" value={overview.upcoming_bookings} accent="amber" />
                        <MetricCard label="Spend" value={formatCurrency(overview.total_spend)} accent="rose" />
                        <MetricCard label="Stay nights" value={overview.stay_nights} accent="cyan" />
                    </div>
                </div>

                <div className="glass-panel rounded-[2.5rem] p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                        Next stay
                    </p>
                    {overview.upcoming_booking ? (
                        <div className="mt-5 space-y-4">
                            <div className="rounded-[1.7rem] border border-cyan-300/25 bg-[linear-gradient(145deg,rgba(6,182,212,0.16),rgba(251,191,36,0.16))] p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                            {overview.upcoming_booking.room?.type}
                                        </p>
                                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                            {formatStayRange(overview.upcoming_booking)}
                                        </p>
                                    </div>
                                    <StatusPill status={overview.upcoming_booking.status} />
                                </div>
                                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                    <div className="neo-panel rounded-2xl px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        <CalendarClock className="mb-2 h-4 w-4 text-cyan-500" />
                                        {overview.upcoming_booking.nights} nights
                                    </div>
                                    <div className="neo-panel rounded-2xl px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        <Hotel className="mb-2 h-4 w-4 text-amber-500" />
                                        Room {overview.upcoming_booking.room?.room_number}
                                    </div>
                                    <div className="neo-panel rounded-2xl px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        <Wallet className="mb-2 h-4 w-4 text-rose-500" />
                                        {formatCurrency(overview.upcoming_booking.total_price)}
                                    </div>
                                </div>
                            </div>
                            <Link
                                href="/account/bookings"
                                className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
                            >
                                Open booking history
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="mt-5 rounded-[1.7rem] border border-white/50 bg-white/70 p-5 text-sm text-slate-600 dark:border-white/10 dark:bg-white/6 dark:text-slate-300">
                            No active upcoming stay yet. Browse the room collection to plan your next visit.
                        </div>
                    )}
                </div>
            </section>

            <section className="glass-panel rounded-[2.5rem] p-7 sm:p-9">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                            Recent activity
                        </p>
                        <h2 className="mt-3 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                            Your latest reservations
                        </h2>
                    </div>
                    <Link
                        href="/account/bookings"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
                    >
                        Full history
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="mt-8 space-y-4">
                    {recentBookings.map((booking) => (
                        <div key={booking.id} className="neo-panel flex flex-col gap-4 rounded-[1.75rem] px-5 py-5 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                    {booking.booking_reference}
                                </p>
                                <p className="mt-2 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                    {booking.room?.type}
                                </p>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                    {formatStayRange(booking)} · {booking.guests} guests
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <StatusPill status={booking.status} />
                                <StatusPill status={booking.payment_status} />
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                    {formatCurrency(booking.total_price)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

import { Head, Link } from '@inertiajs/react';
import { ArrowRight, BedDouble, CalendarRange, CreditCard, FileBarChart2, Users2 } from 'lucide-react';
import ChartBars from '@/components/chart-bars';
import MetricCard from '@/components/metric-card';
import RoomCard from '@/components/room-card';
import StatusPill from '@/components/status-pill';
import { formatCurrency } from '@/lib/hotel';
import type { Booking, Room } from '@/types';

type Props = {
    analytics: {
        overview: {
            revenue: number;
            bookings: number;
            customers: number;
            occupancy_rate: number;
        };
        monthly_revenue: Array<{
            label: string;
            revenue: number;
            bookings: number;
        }>;
        booking_statuses: Array<{ label: string; total: number }>;
        payment_statuses: Array<{ label: string; total: number }>;
        room_types: Array<{ label: string; total: number }>;
    };
    recentBookings: Booking[];
    featuredRooms: Room[];
};

export default function AdminDashboard({
    analytics,
    recentBookings,
    featuredRooms,
}: Props) {
    const quickActions = [
        {
            label: 'Add or edit rooms',
            detail: 'Update pricing, photos, room status, and featured inventory.',
            href: '/admin/rooms',
            icon: BedDouble,
        },
        {
            label: 'Manage bookings',
            detail: 'Confirm reservations, complete stays, and handle cancellations.',
            href: '/admin/bookings',
            icon: CalendarRange,
        },
        {
            label: 'Track customers',
            detail: 'Review repeat guests and booking value from one place.',
            href: '/admin/customers',
            icon: Users2,
        },
        {
            label: 'Review payments',
            detail: 'See paid, pending, and refunded transactions quickly.',
            href: '/admin/payments',
            icon: CreditCard,
        },
        {
            label: 'Open reports',
            detail: 'Read occupancy and revenue trends for better decisions.',
            href: '/admin/reports',
            icon: FileBarChart2,
        },
    ];

    return (
        <>
            <Head title="Admin dashboard" />

            <section className="grid gap-6 xl:grid-cols-[1.1fr_minmax(0,0.9fr)]">
                <div className="glass-panel rounded-[2.5rem] p-7 sm:p-9">
                    <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-300">
                        Admin dashboard
                    </p>
                    <h1 className="mt-4 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                        Run inventory, payments, and guests from one command surface.
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                        The analytics layer reads directly from bookings and payments so occupancy, revenue, and customer activity stay aligned with the live system.
                    </p>

                    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <MetricCard label="Revenue" value={formatCurrency(analytics.overview.revenue)} accent="amber" />
                        <MetricCard label="Bookings" value={analytics.overview.bookings} accent="cyan" />
                        <MetricCard label="Customers" value={analytics.overview.customers} accent="rose" />
                        <MetricCard label="Occupancy" value={`${analytics.overview.occupancy_rate}%`} accent="cyan" />
                    </div>
                </div>

                <div className="glass-panel rounded-[2.5rem] p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                        Revenue motion
                    </p>
                    <h2 className="mt-4 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                        Last six months
                    </h2>
                    <ChartBars items={analytics.monthly_revenue} valueKey="revenue" className="mt-8" />
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-3">
                <div className="glass-panel rounded-[2rem] p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                        Booking states
                    </p>
                    <ChartBars items={analytics.booking_statuses} valueKey="total" className="mt-6" />
                </div>
                <div className="glass-panel rounded-[2rem] p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                        Payment states
                    </p>
                    <ChartBars items={analytics.payment_statuses} valueKey="total" className="mt-6" />
                </div>
                <div className="glass-panel rounded-[2rem] p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                        Room mix
                    </p>
                    <ChartBars items={analytics.room_types} valueKey="total" className="mt-6" />
                </div>
            </section>

            <section className="glass-panel rounded-[2.5rem] p-7">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                            Quick actions
                        </p>
                        <h2 className="mt-3 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                            Move faster across your hotel operations.
                        </h2>
                    </div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
                    >
                        Open guest website
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    {quickActions.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="neo-panel group rounded-[1.85rem] px-5 py-5 transition hover:-translate-y-1"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-200">
                                    <item.icon className="h-5 w-5" />
                                </div>
                                <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:text-slate-700 dark:group-hover:text-white" />
                            </div>
                            <p className="mt-5 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                {item.label}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                {item.detail}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
                <div className="glass-panel rounded-[2.5rem] p-7">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                                Recent bookings
                            </p>
                            <h2 className="mt-3 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                                Reservation activity
                            </h2>
                        </div>
                        <Link
                            href="/admin/bookings"
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
                        >
                            Manage bookings
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="mt-8 space-y-4">
                        {recentBookings.map((booking) => (
                            <div key={booking.id} className="neo-panel rounded-[1.75rem] px-5 py-5">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                            {booking.booking_reference}
                                        </p>
                                        <p className="mt-2 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                            {booking.user?.name}
                                        </p>
                                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                            {booking.room?.type} · {booking.check_in} to {booking.check_out}
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
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                                Featured inventory
                            </p>
                            <h2 className="mt-3 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                                Homepage-ready rooms
                            </h2>
                        </div>
                        <Link
                            href="/admin/rooms"
                            className="text-sm font-medium text-slate-700 transition hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
                        >
                            Edit rooms
                        </Link>
                    </div>
                    {featuredRooms.map((room) => (
                        <RoomCard key={room.id} room={room} compact />
                    ))}
                </div>
            </section>
        </>
    );
}

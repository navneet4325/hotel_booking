import { Head } from '@inertiajs/react';
import ChartBars from '@/components/chart-bars';
import MetricCard from '@/components/metric-card';
import { formatCurrency } from '@/lib/hotel';

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
        room_types: Array<{ label: string; total: number }>;
    };
    topRooms: Array<{
        id: number;
        label: string;
        bookings_count: number;
        revenue: number;
    }>;
    statusSummary: Array<{
        label: string;
        total: number;
    }>;
};

export default function AdminReports({ analytics, topRooms, statusSummary }: Props) {
    return (
        <>
            <Head title="Reports" />

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                <div className="glass-panel rounded-[2.5rem] p-7 sm:p-9">
                    <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-300">
                        Reports and statistics
                    </p>
                    <h1 className="mt-4 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                        Revenue, room mix, and booking behavior in one report deck.
                    </h1>
                    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <MetricCard label="Revenue" value={formatCurrency(analytics.overview.revenue)} accent="amber" />
                        <MetricCard label="Bookings" value={analytics.overview.bookings} accent="cyan" />
                        <MetricCard label="Customers" value={analytics.overview.customers} accent="rose" />
                        <MetricCard label="Occupancy" value={`${analytics.overview.occupancy_rate}%`} accent="cyan" />
                    </div>
                    <ChartBars items={analytics.monthly_revenue} valueKey="revenue" className="mt-10" />
                </div>

                <div className="space-y-6">
                    <div className="glass-panel rounded-[2rem] p-6">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                            Status distribution
                        </p>
                        <ChartBars items={statusSummary} valueKey="total" className="mt-6" />
                    </div>
                    <div className="glass-panel rounded-[2rem] p-6">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                            Room type spread
                        </p>
                        <ChartBars items={analytics.room_types} valueKey="total" className="mt-6" />
                    </div>
                </div>
            </section>

            <section className="glass-panel rounded-[2.5rem] p-7 sm:p-9">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-300">
                    Top-performing rooms
                </p>
                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    {topRooms.map((room) => (
                        <div key={room.id} className="neo-panel rounded-[1.75rem] px-5 py-5">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                {room.bookings_count} bookings
                            </p>
                            <p className="mt-3 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                {room.label}
                            </p>
                            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                                {formatCurrency(room.revenue)}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

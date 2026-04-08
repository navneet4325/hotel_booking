import { Head } from '@inertiajs/react';

type Props = {
    month: string;
    days: Array<{
        date: string;
        label: string;
        isCurrentMonth: boolean;
        bookings: Array<{
            reference: string;
            guest: string;
            room: string;
            status: string;
        }>;
    }>;
};

export default function AdminCalendar({ month, days }: Props) {
    return (
        <>
            <Head title="Reservation calendar" />

            <section className="glass-panel rounded-[2.5rem] p-7 sm:p-9">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-300">
                    Reservation calendar
                </p>
                <h1 className="mt-4 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                    Month view for every active reservation.
                </h1>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    Current month: {month}
                </p>

                <div className="mt-8 grid gap-3 md:grid-cols-7">
                    {days.map((day) => (
                        <div
                            key={day.date}
                            className={`rounded-[1.5rem] border p-4 ${
                                day.isCurrentMonth
                                    ? 'border-white/50 bg-white/70 dark:border-white/10 dark:bg-white/6'
                                    : 'border-transparent bg-slate-100/70 dark:bg-white/4'
                            }`}
                        >
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                {day.label}
                            </p>
                            <div className="mt-3 space-y-2">
                                {day.bookings.slice(0, 3).map((booking) => (
                                    <div key={`${day.date}-${booking.reference}`} className="rounded-2xl bg-slate-950/6 px-3 py-2 text-xs text-slate-700 dark:bg-white/10 dark:text-slate-200">
                                        <p className="font-semibold">{booking.reference}</p>
                                        <p className="mt-1">{booking.guest}</p>
                                        <p className="mt-1 uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
                                            {booking.room}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

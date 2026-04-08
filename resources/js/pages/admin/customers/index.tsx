import { Head } from '@inertiajs/react';
import { useDeferredValue, useState } from 'react';
import MetricCard from '@/components/metric-card';
import { formatCurrency, formatDate } from '@/lib/hotel';
import type { Customer } from '@/types';

type Props = {
    customers: Customer[];
    search: string;
};

export default function AdminCustomers({ customers, search }: Props) {
    const [query, setQuery] = useState(search);
    const deferredQuery = useDeferredValue(query);

    const visibleCustomers = customers.filter((customer) => {
        const term = deferredQuery.toLowerCase().trim();

        if (!term) {
            return true;
        }

        return (
            customer.name.toLowerCase().includes(term) ||
            customer.email.toLowerCase().includes(term)
        );
    });

    return (
        <>
            <Head title="Customers" />

            <section className="glass-panel rounded-[2.5rem] p-7 sm:p-9">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-300">
                            Customer management
                        </p>
                        <h1 className="mt-4 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                            Understand customer value and booking behavior.
                        </h1>
                    </div>
                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Filter customers instantly"
                        className="h-12 rounded-2xl border border-white/60 bg-white/80 px-4 text-sm outline-none lg:min-w-80 dark:border-white/10 dark:bg-white/6"
                    />
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <MetricCard label="Customers" value={customers.length} accent="cyan" />
                    <MetricCard label="Returning value" value={formatCurrency(customers.reduce((sum, customer) => sum + customer.total_spend, 0))} accent="amber" />
                    <MetricCard label="Avg bookings" value={(customers.reduce((sum, customer) => sum + customer.bookings_count, 0) / Math.max(customers.length, 1)).toFixed(1)} accent="rose" />
                </div>

                <div className="mt-8 space-y-4">
                    {visibleCustomers.map((customer) => (
                        <div key={customer.id} className="neo-panel rounded-[1.85rem] px-5 py-5">
                            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                                <div>
                                    <p className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                        {customer.name}
                                    </p>
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                        {customer.email} {customer.phone ? `· ${customer.phone}` : ''}
                                    </p>
                                </div>
                                <div className="grid gap-4 text-sm text-slate-600 sm:grid-cols-3 dark:text-slate-300">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                            Bookings
                                        </p>
                                        <p className="mt-2 font-display text-2xl text-slate-950 dark:text-white">
                                            {customer.bookings_count}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                            Spend
                                        </p>
                                        <p className="mt-2 font-display text-2xl text-slate-950 dark:text-white">
                                            {formatCurrency(customer.total_spend)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                            Joined
                                        </p>
                                        <p className="mt-2 font-display text-2xl text-slate-950 dark:text-white">
                                            {formatDate(customer.created_at, { month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

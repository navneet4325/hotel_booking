import { Head } from '@inertiajs/react';
import StatusPill from '@/components/status-pill';
import { formatCurrency, formatDate } from '@/lib/hotel';
import type { Payment } from '@/types';

type Props = {
    payments: Payment[];
};

export default function AdminPayments({ payments }: Props) {
    return (
        <>
            <Head title="Payments" />

            <section className="glass-panel rounded-[2.5rem] p-7 sm:p-9">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-300">
                    Payment tracking
                </p>
                <h1 className="mt-4 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                    Review every transaction and gateway reference.
                </h1>

                <div className="mt-8 space-y-4">
                    {payments.map((payment) => (
                        <div key={payment.id} className="neo-panel rounded-[1.85rem] px-5 py-5">
                            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                        {payment.booking?.booking_reference}
                                    </p>
                                    <h2 className="mt-3 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                        {payment.booking?.guest_name}
                                    </h2>
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                        {payment.booking?.room_type} · {payment.provider.toUpperCase()} · {payment.transaction_id || 'Awaiting transaction'}
                                    </p>
                                </div>
                                <div className="flex flex-col items-start gap-3 xl:items-end">
                                    <div className="flex flex-wrap gap-2">
                                        <StatusPill status={payment.payment_status} />
                                        <StatusPill status={payment.payment_method} />
                                    </div>
                                    <p className="text-lg font-semibold text-slate-950 dark:text-white">
                                        {formatCurrency(payment.amount, payment.currency)}
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-300">
                                        {formatDate(payment.paid_at || payment.created_at)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

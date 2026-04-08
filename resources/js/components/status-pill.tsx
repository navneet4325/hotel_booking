import { bookingStatusLabel, paymentStatusTone } from '@/lib/hotel';
import { cn } from '@/lib/utils';

export default function StatusPill({
    status,
    className,
}: {
    status: string;
    className?: string;
}) {
    const tone = paymentStatusTone(status);

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]',
                tone === 'success' &&
                    'bg-emerald-500/15 text-emerald-600 dark:bg-emerald-400/12 dark:text-emerald-200',
                tone === 'warning' &&
                    'bg-amber-500/15 text-amber-600 dark:bg-amber-400/12 dark:text-amber-200',
                tone === 'danger' &&
                    'bg-rose-500/15 text-rose-600 dark:bg-rose-400/12 dark:text-rose-200',
                className,
            )}
        >
            {bookingStatusLabel(status)}
        </span>
    );
}

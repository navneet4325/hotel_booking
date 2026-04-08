import { cn } from '@/lib/utils';

export default function BrandMark({
    compact = false,
    className,
}: {
    compact?: boolean;
    className?: string;
}) {
    return (
        <div className={cn('flex items-center gap-3', className)}>
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-secondary))] shadow-[0_16px_32px_-18px_rgba(30,58,138,0.6)]">
                <span className="relative font-[700] tracking-[0.28em] text-white">
                    AS
                </span>
            </div>
            {!compact && (
                <div className="leading-tight">
                    <p className="font-display text-lg font-semibold tracking-[0.16em] text-slate-950 dark:text-white">
                        AetherStay
                    </p>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-300">
                        Hotel Booking
                    </p>
                </div>
            )}
        </div>
    );
}

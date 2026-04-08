import { cn } from '@/lib/utils';

export default function MetricCard({
    label,
    value,
    detail,
    accent = 'cyan',
}: {
    label: string;
    value: string | number;
    detail?: string;
    accent?: 'cyan' | 'amber' | 'rose';
}) {
    return (
        <div className="glass-panel relative overflow-hidden rounded-2xl p-5">
            <div
                className={cn(
                    'absolute inset-x-6 top-0 h-px opacity-80',
                    accent === 'cyan' && 'bg-cyan-400/70',
                    accent === 'amber' && 'bg-amber-400/70',
                    accent === 'rose' && 'bg-rose-400/70',
                )}
            />
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                {label}
            </p>
            <p className="mt-4 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                {value}
            </p>
            {detail && (
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
                    {detail}
                </p>
            )}
        </div>
    );
}

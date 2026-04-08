import { cn } from '@/lib/utils';

export default function ChartBars({
    items,
    valueKey = 'revenue',
    className,
}: {
    items: Array<Record<string, string | number | undefined>>;
    valueKey?: string;
    className?: string;
}) {
    const max = Math.max(1, ...items.map((item) => Number(item[valueKey] || item.total || 0)));

    return (
        <div className={cn('grid gap-4', className)}>
            {items.map((item) => {
                const value = Number(item[valueKey] || item.total || 0);

                return (
                    <div key={`${item.label}-${value}`} className="grid gap-2">
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                            <span>{item.label}</span>
                            <span>{value.toLocaleString()}</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-slate-200/70 dark:bg-white/10">
                            <div
                                className="h-full rounded-full bg-[linear-gradient(90deg,rgba(34,211,238,0.95),rgba(251,191,36,0.9))] shadow-[0_10px_20px_-10px_rgba(8,145,178,0.9)] transition-all duration-700"
                                style={{ width: `${(value / max) * 100}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

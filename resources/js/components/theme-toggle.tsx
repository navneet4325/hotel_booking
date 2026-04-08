import { MoonStar, SunMedium } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';

export default function ThemeToggle() {
    const { resolvedAppearance, updateAppearance } = useAppearance();

    const isDark = resolvedAppearance === 'dark';

    return (
        <button
            type="button"
            onClick={() => updateAppearance(isDark ? 'light' : 'dark')}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition duration-300 hover:border-sky-200 hover:text-[color:var(--brand-primary)] dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:text-white"
        >
            {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            {isDark ? 'Light' : 'Dark'}
        </button>
    );
}

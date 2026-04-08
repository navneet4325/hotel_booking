import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: null,
    },
    {
        title: 'Security',
        href: editSecurity(),
        icon: null,
    },
    {
        title: 'Appearance',
        href: editAppearance(),
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="glass-panel rounded-[2rem] p-6">
            <div className="mb-8">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-300">
                    Settings
                </p>
                <h1 className="mt-4 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                    Profile and account controls
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-300">
                    Manage your personal details, password protection, and dark or light presentation preferences.
                </p>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row">
                <aside className="w-full lg:w-56">
                    <nav className="space-y-2" aria-label="Settings">
                        {sidebarNavItems.map((item, index) => (
                            <Link
                                key={`${toUrl(item.href)}-${index}`}
                                href={item.href}
                                className={cn(
                                    'block rounded-2xl px-4 py-3 text-sm font-medium transition',
                                    isCurrentOrParentUrl(item.href)
                                        ? 'bg-slate-950 text-white shadow-[0_24px_40px_-26px_rgba(15,23,42,1)] dark:bg-white dark:text-slate-950'
                                        : 'text-slate-600 hover:bg-white/70 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white',
                                )}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </nav>
                </aside>

                <div className="min-w-0 flex-1">
                    <section className="glass-panel rounded-[1.8rem] p-6">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}

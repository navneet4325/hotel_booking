import { Head, Link, usePage } from '@inertiajs/react';
import { BellRing, Compass, LayoutDashboard, LogOut, Settings2, Ticket } from 'lucide-react';
import BrandMark from '@/components/brand-mark';
import FlashBanner from '@/components/flash-banner';
import ThemeToggle from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import type { AppLayoutProps, User } from '@/types';

const nav = [
    { label: 'Overview', href: '/account', icon: LayoutDashboard },
    { label: 'Bookings', href: '/account/bookings', icon: Ticket },
    { label: 'Settings', href: '/settings/profile', icon: Settings2 },
];

export default function AppLayout({
    breadcrumbs = [],
    children,
}: AppLayoutProps) {
    const page = usePage();
    const user = page.props.auth.user as User | null;
    const currentPath = page.url;

    return (
        <div className="mesh-background min-h-screen">
            <Head />
            <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
                <header className="glass-panel sticky top-5 z-40 mb-6 rounded-[2rem] px-5 py-4">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-4">
                            <BrandMark compact={false} />
                            <span className="hidden h-8 w-px bg-slate-200/70 lg:block dark:bg-white/10" />
                            <p className="hidden max-w-sm text-sm text-slate-500 lg:block dark:text-slate-300">
                                Track bookings, manage preferences, and move through checkout with live availability.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <ThemeToggle />
                            <Link
                                href="/rooms"
                                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/50 bg-white/70 px-4 text-sm font-medium text-slate-700 shadow-[0_18px_34px_-22px_rgba(15,23,42,0.65)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:text-white"
                            >
                                <Compass className="h-4 w-4" />
                                Explore rooms
                            </Link>
                            {user?.role === 'admin' && (
                                <Link
                                    href="/admin"
                                    className="inline-flex h-11 items-center gap-2 rounded-full border border-cyan-300/60 bg-cyan-400/15 px-4 text-sm font-medium text-cyan-700 transition hover:-translate-y-0.5 dark:border-cyan-300/20 dark:bg-cyan-400/10 dark:text-cyan-200"
                                >
                                    <BellRing className="h-4 w-4" />
                                    Admin mode
                                </Link>
                            )}
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/50 bg-white/70 px-4 text-sm font-medium text-slate-700 shadow-[0_18px_34px_-22px_rgba(15,23,42,0.65)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:text-white"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign out
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="grid flex-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
                    <aside className="glass-panel rounded-[2rem] p-4">
                        <div className="rounded-[1.75rem] border border-white/40 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                                Signed in
                            </p>
                            <p className="mt-4 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                {user?.name}
                            </p>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                                {user?.email}
                            </p>
                        </div>

                        <nav className="mt-6 space-y-2">
                            {nav.map((item) => {
                                const active = item.href === '/account'
                                    ? currentPath === item.href
                                    : currentPath.startsWith(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                                            active
                                                ? 'bg-slate-950 text-white shadow-[0_24px_40px_-26px_rgba(15,23,42,1)] dark:bg-white dark:text-slate-950'
                                                : 'text-slate-600 hover:bg-white/70 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white',
                                        )}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {breadcrumbs.length > 0 && (
                            <div className="mt-8 rounded-[1.75rem] border border-white/40 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5">
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                                    Current trail
                                </p>
                                <div className="mt-4 space-y-2">
                                    {breadcrumbs.map((item) => (
                                        <Link
                                            key={String(item.href)}
                                            href={item.href}
                                            className="block text-sm text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                                        >
                                            {item.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>

                    <main className="space-y-6">
                        <FlashBanner />
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}

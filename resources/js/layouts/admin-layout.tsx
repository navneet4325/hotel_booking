import { Head, Link, usePage } from '@inertiajs/react';
import { BarChart3, CalendarRange, CreditCard, LayoutDashboard, LogOut, PlusCircle, Settings2, Users2 } from 'lucide-react';
import BrandMark from '@/components/brand-mark';
import FlashBanner from '@/components/flash-banner';
import ThemeToggle from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import type { AppLayoutProps } from '@/types';

const nav = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Rooms', href: '/admin/rooms', icon: Settings2 },
    { label: 'Bookings', href: '/admin/bookings', icon: CalendarRange },
    { label: 'Customers', href: '/admin/customers', icon: Users2 },
    { label: 'Payments', href: '/admin/payments', icon: CreditCard },
    { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
];

export default function AdminLayout({ children }: AppLayoutProps) {
    const page = usePage();
    const currentPath = page.url;

    return (
        <div className="mesh-background min-h-screen">
            <Head />
            <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
                <aside className="glass-panel rounded-[2rem] p-5">
                    <div className="flex items-center justify-between gap-3">
                        <BrandMark compact={false} />
                        <ThemeToggle />
                    </div>
                    <div className="mt-8 rounded-[1.75rem] border border-cyan-300/30 bg-[linear-gradient(145deg,rgba(6,182,212,0.18),rgba(251,191,36,0.14))] p-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-600 dark:text-slate-200">
                            Operations layer
                        </p>
                        <p className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-100">
                            Track occupancy, payments, customer activity, and live reservations from one surface.
                        </p>
                        <Link
                            href="/admin/rooms"
                            className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-medium text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
                        >
                            <PlusCircle className="h-4 w-4" />
                            Add room
                        </Link>
                    </div>
                    <nav className="mt-8 space-y-2">
                        {nav.map((item) => {
                            const active = item.href === '/admin'
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
                    <div className="mt-8 flex gap-3">
                        <Link
                            href="/account"
                            className="flex-1 rounded-full border border-white/50 bg-white/70 px-4 py-2 text-center text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:text-white"
                        >
                            Guest view
                        </Link>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="rounded-full border border-white/50 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:text-white"
                        >
                            <LogOut className="h-4 w-4" />
                        </Link>
                    </div>
                </aside>

                <main className="space-y-6">
                    <FlashBanner />
                    {children}
                </main>
            </div>
        </div>
    );
}

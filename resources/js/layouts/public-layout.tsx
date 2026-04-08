import { Head, Link, usePage } from '@inertiajs/react';
import BrandMark from '@/components/brand-mark';
import FlashBanner from '@/components/flash-banner';
import ThemeToggle from '@/components/theme-toggle';
import { publicNavigation } from '@/data/site-content';
import { cn } from '@/lib/utils';
import type { User } from '@/types';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const page = usePage();
    const user = usePage().props.auth.user as User | null;
    const currentPath = page.url.split('?')[0];

    return (
        <div className="mesh-background min-h-screen">
            <Head />
            <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
                <header className="glass-panel sticky top-4 z-40 rounded-[1.75rem] border border-slate-200/80 px-5 py-4 shadow-[0_18px_40px_-26px_rgba(15,23,42,0.28)]">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <BrandMark />
                        <nav className="flex flex-wrap items-center gap-2 text-sm">
                            {publicNavigation.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.label === 'My Bookings' ? (user ? item.href : '/login') : item.href}
                                    className={cn(
                                        'rounded-full px-4 py-2.5 font-medium transition',
                                        (item.label === 'My Bookings'
                                            ? currentPath.startsWith('/account/bookings')
                                            : currentPath === item.href)
                                            ? 'bg-[color:var(--brand-primary)] text-white shadow-[0_16px_30px_-18px_rgba(30,58,138,0.85)]'
                                            : 'text-slate-700 hover:bg-slate-100 hover:text-[color:var(--brand-primary)] dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white',
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <Link
                                href={user ? (user.role === 'admin' ? '/admin' : '/account') : '/login'}
                                className="rounded-full border border-slate-200 bg-white px-4 py-2.5 font-medium text-slate-700 shadow-sm transition hover:border-sky-200 hover:text-[color:var(--brand-primary)] dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                            >
                                {user ? (user.role === 'admin' ? 'Dashboard' : 'Dashboard') : 'Login'}
                            </Link>
                            {!user && (
                                <Link
                                    href="/register"
                                    className="rounded-full bg-[color:var(--brand-primary)] px-4 py-2.5 font-medium text-white shadow-[0_18px_34px_-20px_rgba(30,58,138,0.85)] transition hover:-translate-y-0.5"
                                >
                                    Signup
                                </Link>
                            )}
                            <ThemeToggle />
                        </nav>
                    </div>
                </header>

                <main className="flex-1 space-y-6 py-6">
                    <FlashBanner />
                    {children}
                </main>

                <footer className="glass-panel mt-4 rounded-[2rem] px-6 py-5 text-sm text-slate-500 dark:text-slate-300">
                    <div className="grid gap-5 lg:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))]">
                        <div>
                            <p className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                AetherStay
                            </p>
                            <p className="mt-2 leading-6">
                                A modern hotel website and booking engine with immersive media, room discovery, and management dashboards.
                            </p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.26em] text-slate-400 dark:text-slate-400">
                                Explore
                            </p>
                            <div className="mt-3 grid gap-2">
                                <Link href="/about" className="hover:text-slate-950 dark:hover:text-white">About</Link>
                                <Link href="/rooms" className="hover:text-slate-950 dark:hover:text-white">Rooms</Link>
                                <Link href="/gallery" className="hover:text-slate-950 dark:hover:text-white">Gallery</Link>
                                <Link href="/virtual-tour" className="hover:text-slate-950 dark:hover:text-white">Virtual Tour</Link>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.26em] text-slate-400 dark:text-slate-400">
                                Stay
                            </p>
                            <div className="mt-3 grid gap-2">
                                <Link href="/experiences" className="hover:text-slate-950 dark:hover:text-white">Experiences</Link>
                                <Link href="/dining" className="hover:text-slate-950 dark:hover:text-white">Dining</Link>
                                <Link href="/offers" className="hover:text-slate-950 dark:hover:text-white">Offers</Link>
                                <Link href="/reviews" className="hover:text-slate-950 dark:hover:text-white">Reviews</Link>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.26em] text-slate-400 dark:text-slate-400">
                                Contact
                            </p>
                            <div className="mt-3 grid gap-2">
                                <p>stay@aetherstay.com</p>
                                <p>+1 (800) 410 1188</p>
                                <Link href="/contact" className="hover:text-slate-950 dark:hover:text-white">Plan your stay</Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

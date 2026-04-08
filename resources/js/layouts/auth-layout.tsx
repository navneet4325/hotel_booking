export default function AuthLayout({
    title = '',
    description = '',
    children,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="mesh-background min-h-screen px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/50 bg-white/55 shadow-[0_32px_80px_-42px_rgba(15,23,42,0.85)] backdrop-blur-2xl lg:grid-cols-[1.1fr_minmax(0,0.9fr)] dark:border-white/10 dark:bg-white/8">
                <div className="relative hidden overflow-hidden p-10 lg:block">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.45),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.4),transparent_35%),linear-gradient(160deg,rgba(15,23,42,0.92),rgba(8,47,73,0.82))]" />
                    <div className="relative flex h-full flex-col justify-between text-white">
                        <div>
                            <p className="text-xs uppercase tracking-[0.42em] text-white/70">
                                Premium booking operations
                            </p>
                            <h1 className="mt-6 max-w-md font-display text-5xl font-semibold leading-tight">
                                Modern stays deserve a calmer control room.
                            </h1>
                            <p className="mt-6 max-w-lg text-base leading-7 text-white/75">
                                AetherStay blends live room discovery, polished guest flows, and hotel-grade admin tooling into one premium experience.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                                <p className="text-xs uppercase tracking-[0.28em] text-white/60">
                                    Live availability
                                </p>
                                <p className="mt-3 text-2xl font-semibold">Real-time</p>
                            </div>
                            <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                                <p className="text-xs uppercase tracking-[0.28em] text-white/60">
                                    Stripe checkout
                                </p>
                                <p className="mt-3 text-2xl font-semibold">Test-ready</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center px-5 py-10 sm:px-10">
                    <div className="w-full max-w-md">
                        <div className="mb-8">
                            <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-300">
                                AetherStay access
                            </p>
                            <h2 className="mt-4 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                                {title}
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-300">
                                {description}
                            </p>
                        </div>
                        <div className="rounded-[2rem] border border-white/50 bg-white/80 p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.8)] backdrop-blur-xl dark:border-white/10 dark:bg-white/6">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { usePage } from '@inertiajs/react';

export default function FlashBanner() {
    const { flash } = usePage().props as { flash?: { success?: string | null; error?: string | null } };

    if (!flash?.success && !flash?.error) {
        return null;
    }

    const tone = flash.error ? 'danger' : 'success';
    const message = flash.error || flash.success;

    return (
        <div
            className={`rounded-3xl border px-5 py-4 text-sm shadow-[0_20px_40px_-28px_rgba(15,23,42,0.8)] backdrop-blur-xl ${
                tone === 'danger'
                    ? 'border-rose-300/60 bg-rose-100/80 text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200'
                    : 'border-emerald-300/60 bg-emerald-100/80 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200'
            }`}
        >
            {message}
        </div>
    );
}

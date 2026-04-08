import type { Auth } from '@/types/auth';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            flash: {
                success?: string | null;
                error?: string | null;
            };
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}

declare global {
    interface Window {
        Razorpay?: new (options: {
            key: string;
            amount: number;
            currency: string;
            name: string;
            description: string;
            order_id: string;
            prefill?: {
                name?: string | null;
                email?: string | null;
                contact?: string | null;
            };
            notes?: Record<string, string>;
            theme?: {
                color?: string;
            };
            modal?: {
                ondismiss?: () => void;
            };
            handler?: (response: {
                razorpay_payment_id: string;
                razorpay_order_id: string;
                razorpay_signature: string;
            }) => void;
        }) => {
            open: () => void;
        };
    }
}

export {};

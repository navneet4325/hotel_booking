import type { User } from '@/types/auth';

export type AvailabilitySummary = {
    available: boolean;
    nights: number;
    total_price: number;
    nightly_rate: number;
};

export type Room = {
    id: number;
    slug: string;
    room_number: string;
    type: string;
    price: number;
    availability: boolean;
    rating: number;
    size: number;
    beds: number;
    bathrooms: number;
    capacity: number;
    floor?: string | null;
    view?: string | null;
    location?: string | null;
    short_description: string;
    description: string;
    image?: string | null;
    gallery: string[];
    amenities: string[];
    featured: boolean;
    availability_summary?: AvailabilitySummary | null;
};

export type Payment = {
    id: number;
    payment_method: string;
    payment_status: string;
    transaction_id?: string | null;
    provider: string;
    amount: number;
    currency: string;
    gateway_reference?: string | null;
    paid_at?: string | null;
    created_at?: string | null;
    booking?: {
        id: number;
        booking_reference: string;
        room_type?: string | null;
        guest_name?: string | null;
    };
};

export type Booking = {
    id: number;
    booking_reference: string;
    check_in: string;
    check_out: string;
    guests: number;
    nights: number;
    total_price: number;
    status: string;
    payment_status: string;
    special_requests?: string | null;
    cancellation_reason?: string | null;
    cancelled_at?: string | null;
    paid_at?: string | null;
    created_at?: string | null;
    room?: Room;
    payment?: Payment;
    user?: Pick<User, 'id' | 'name' | 'email'>;
};

export type Customer = User & {
    bookings_count: number;
    total_spend: number;
};

export type StatCard = {
    label: string;
    value: string | number;
    detail?: string;
};

export type ChartDatum = {
    label: string;
    total?: number;
    revenue?: number;
    bookings?: number;
};

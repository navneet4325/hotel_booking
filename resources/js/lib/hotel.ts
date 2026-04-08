import type { AvailabilitySummary, Booking, Payment, Room } from '@/types';

export function formatCurrency(value: number, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(value);
}

export function formatDate(value: string | null | undefined, options?: Intl.DateTimeFormatOptions) {
    if (!value) {
        return 'TBD';
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        ...options,
    }).format(new Date(value));
}

export function formatStayRange(booking: Pick<Booking, 'check_in' | 'check_out'>) {
    return `${formatDate(booking.check_in, { month: 'short', day: 'numeric' })} - ${formatDate(booking.check_out, { month: 'short', day: 'numeric', year: 'numeric' })}`;
}

export function roomLabel(room: Pick<Room, 'type' | 'room_number'>) {
    return `${room.type} · ${room.room_number}`;
}

export function roomLocation(room: Pick<Room, 'location' | 'floor' | 'view'>) {
    return room.location || room.floor || room.view || 'Oceanfront District';
}

export function availabilityLabel(summary?: AvailabilitySummary | null) {
    if (!summary) {
        return 'Select dates to check live availability';
    }

    return summary.available
        ? `${summary.nights} night${summary.nights > 1 ? 's' : ''} available`
        : 'Unavailable for selected dates';
}

export function paymentStatusTone(status: string) {
    const normalized = status.toLowerCase();

    if (['paid', 'confirmed', 'completed', 'available', 'featured', 'signature'].includes(normalized)) {
        return 'success';
    }

    if (['pending', 'standard'].includes(normalized)) {
        return 'warning';
    }

    return 'danger';
}

export function bookingStatusLabel(status: string) {
    return status.replace('_', ' ');
}

export function paymentMethodLabel(payment?: Payment | null) {
    if (!payment) {
        return 'Pending';
    }

    const provider = payment.provider.charAt(0).toUpperCase() + payment.provider.slice(1);
    const method = payment.payment_method.charAt(0).toUpperCase() + payment.payment_method.slice(1);

    return provider === method ? provider : `${provider} · ${method}`;
}

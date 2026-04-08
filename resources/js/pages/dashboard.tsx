import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-8 p-6 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-blue-900 mb-2">My Dashboard</h1>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* My Bookings */}
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow flex flex-col gap-2">
                        <h2 className="text-xl font-semibold text-blue-900 mb-1">My Bookings</h2>
                        <p className="text-blue-700 text-sm mb-2">View and manage your current and past hotel bookings.</p>
                        <a href="/bookings" className="inline-block mt-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition-all">View Bookings</a>
                    </div>
                    {/* Payment History */}
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow flex flex-col gap-2">
                        <h2 className="text-xl font-semibold text-blue-900 mb-1">Payment History</h2>
                        <p className="text-blue-700 text-sm mb-2">See all your past payments and download receipts.</p>
                        <a href="/payments" className="inline-block mt-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition-all">View Payments</a>
                    </div>
                    {/* Profile */}
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow flex flex-col gap-2">
                        <h2 className="text-xl font-semibold text-blue-900 mb-1">Profile</h2>
                        <p className="text-blue-700 text-sm mb-2">Update your personal information and preferences.</p>
                        <a href="/settings/profile" className="inline-block mt-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition-all">Edit Profile</a>
                    </div>
                    {/* Wishlist */}
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow flex flex-col gap-2">
                        <h2 className="text-xl font-semibold text-blue-900 mb-1">Wishlist</h2>
                        <p className="text-blue-700 text-sm mb-2">See your saved hotels and rooms for future trips.</p>
                        <a href="/wishlist" className="inline-block mt-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition-all">View Wishlist</a>
                    </div>
                    {/* Cancel Booking */}
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow flex flex-col gap-2">
                        <h2 className="text-xl font-semibold text-blue-900 mb-1">Cancel Booking</h2>
                        <p className="text-blue-700 text-sm mb-2">Cancel an upcoming booking easily and instantly.</p>
                        <a href="/bookings" className="inline-block mt-auto bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-4 py-2 rounded-lg shadow transition-all">Cancel Booking</a>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};

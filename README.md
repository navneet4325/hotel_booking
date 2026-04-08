# AetherStay Hotel Booking Management System

AetherStay is a full-stack hotel booking management system built with Laravel, React/Inertia, Tailwind CSS, and MySQL. It combines a premium, image-rich guest booking experience with an operations-focused admin dashboard for rooms, reservations, customers, payments, analytics, and calendar management.

## Highlights

- Secure authentication with Laravel Fortify
- Premium public booking UX with glassmorphism, animated cards, dark/light mode, hero search, floating booking panels, and cinematic media
- 10+ branded pages including Home, Stay, About, Gallery, Virtual Tour, Experiences, Dining, Offers, Reviews, Contact, Booking, guest dashboard, and admin dashboard
- Room search and filtering by price, type, rating, guests, availability, amenity, and view/zone
- Real-time availability checks through REST API endpoints
- Drag-based 360-style room tour, image galleries, room videos, and map embeds
- Booking creation with Razorpay-ready test checkout, Stripe fallback, and a built-in demo success mode
- Booking history, payment retry, and cancellation for guests
- Admin dashboard with room management, booking operations, customer insights, payment tracking, calendar view, and report summaries
- Laravel migrations, seeders, Eloquent models, middleware, validation, and feature tests

## Tech Stack

- Backend: Laravel 13 / PHP 8.4
- Frontend: React + Inertia.js + TypeScript
- Styling: Tailwind CSS 4
- Database: MySQL for application runtime
- Test database: SQLite in memory
- Authentication: Laravel Fortify
- Payments: Razorpay test mode support, Stripe fallback, and demo mode when keys are not configured

## Demo Credentials

- Admin: `admin@aetherstay.test` / `password`
- Guest: `maya@aetherstay.test` / `password`

These are created by the database seeder.

## Core Features

### Guest Features

- Register and log in
- Search rooms
- Filter by price, room type, rating, availability, amenity, and view
- View room gallery, room videos, 360-style room tour, amenities, map, and room specs
- Check availability in real time
- Create bookings with date selection
- Continue to checkout with Razorpay or Stripe
- View booking history
- Retry payment if checkout was interrupted
- Cancel bookings
- Manage profile, password, two-factor auth, and appearance settings

### Admin Features

- Admin-only dashboard
- Add, edit, and delete rooms
- Manage booking status
- Monitor customers
- Track payments
- See reports and analytics
- View reservation calendar

## Project Structure

```text
app/
bootstrap/
config/
database/
public/
resources/
routes/
storage/
tests/
.env.example
composer.json
package.json
README.md
DEPLOYMENT.md
```

## Setup

### 1. Install dependencies

```bash
composer install
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
php artisan key:generate
```

Update `.env` for MySQL:

```env
APP_NAME=AetherStay
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hotel_booking_system
DB_USERNAME=root
DB_PASSWORD=

STRIPE_KEY=
STRIPE_SECRET=
STRIPE_WEBHOOK_SECRET=
STRIPE_CURRENCY=usd

RAZORPAY_KEY=
RAZORPAY_SECRET=
RAZORPAY_CURRENCY=INR
```

### 3. Run migrations and seed demo data

```bash
php artisan migrate --seed
```

### 4. Start the app

In separate terminals:

```bash
php artisan serve
```

```bash
npm run dev
```

Or use the combined script:

```bash
composer run dev
```

## Payment Notes

- If `RAZORPAY_KEY` and `RAZORPAY_SECRET` are set, bookings can launch a Razorpay order flow with signature verification.
- If `STRIPE_KEY` and `STRIPE_SECRET` are set, bookings can also use Stripe Checkout.
- If payment keys are empty, AetherStay falls back to a built-in demo success flow so the app remains runnable for local review and portfolio/demo usage.

## Media Notes

- Public photography uses curated Unsplash image URLs for hotel, room, lifestyle, and destination sections.
- Embedded room and property films use public Vimeo and YouTube URLs.
- The virtual tour is implemented as a drag-based 360-style panorama experience built into the frontend.

## REST API Endpoints

- `GET /api/v1/rooms`
- `GET /api/v1/rooms/{room}`
- `GET /api/v1/availability?room_id={id}&check_in=YYYY-MM-DD&check_out=YYYY-MM-DD`
- `POST /api/v1/availability`

## Useful Commands

```bash
php artisan test
npm run build
php artisan route:list
php artisan migrate:fresh --seed
```

## Verification

The project was verified with:

- `npm run build`
- `php artisan test`
- `php artisan route:list`
- `DB_CONNECTION=sqlite DB_DATABASE=database/database.sqlite php artisan migrate:fresh --seed`

## Deployment

See [DEPLOYMENT.md](/Users/navneetsrivastav/Desktop/hotel_booking/DEPLOYMENT.md) for production deployment guidance.

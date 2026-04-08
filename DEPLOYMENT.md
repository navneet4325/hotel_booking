# Deployment Guide

## Production Stack

- PHP 8.4+
- MySQL 8+
- Node.js 20+
- Nginx or Apache
- Supervisor or systemd for queues if background jobs are added later

## 1. Install dependencies

```bash
composer install --no-dev --optimize-autoloader
npm install
npm run build
```

## 2. Configure environment

Create `.env` with production values:

```env
APP_NAME=AetherStay
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hotel_booking_system
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CURRENCY=usd

RAZORPAY_KEY=rzp_test_...
RAZORPAY_SECRET=your_test_secret
RAZORPAY_CURRENCY=INR
```

Generate the key if needed:

```bash
php artisan key:generate
```

## 3. Prepare the database

```bash
php artisan migrate --force
php artisan db:seed --force
```

If you do not want demo content in production, skip the seeder or replace it with your own data seeding strategy.

## 4. Optimize Laravel

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

## 5. Web server notes

Point your document root to:

```text
public/
```

For Nginx, route all non-file requests to `public/index.php`.

## 6. File and process permissions

Ensure the web server can write to:

```text
storage/
bootstrap/cache/
```

## 7. Payment production readiness

- Start with Razorpay test keys or Stripe test keys and validate success/cancel flows
- Razorpay uses server-side signature verification before marking the booking paid
- Add webhooks if you want asynchronous confirmation in addition to the current redirect/verification flow
- Rotate test credentials to live keys only when the checkout path is fully validated

## 8. Post-deploy checklist

- Confirm `/` loads the landing page
- Confirm `/rooms` search and filters work
- Confirm `/about`, `/gallery`, `/virtual-tour`, `/offers`, `/reviews`, and `/contact` load correctly
- Confirm guest registration and login work
- Confirm booking checkout launches for the configured gateway
- Confirm admin dashboard loads with seeded or production data
- Confirm `php artisan test` passes in CI before release

## Optional hardening

- Add HTTPS enforcement
- Add rate limiting for high-traffic booking endpoints
- Configure server-side backups for MySQL
- Add scheduled cleanup and reporting jobs through Laravel Scheduler

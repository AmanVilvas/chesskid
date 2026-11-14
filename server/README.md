# Thinking Academy API

Node.js / Express API for accounts, course enrollment, lesson progress, and protected course media. PostgreSQL stores accounts and course access; private media files live outside the Vite `public/` directory.

## Local setup

Requirements: Node.js 22.12+ and PostgreSQL.

1. Copy `.env.example` to `.env` and set a local `DATABASE_URL`. Set `APP_ORIGIN` to the Vite address you open (local Vite ports on `localhost`/`127.0.0.1` are allowed during development).
2. Install and prepare the API:

   ```sh
   npm install --prefix server
   npm run api:migrate
   npm run api:seed
   ```

3. In separate terminals, run `npm run dev:api` and `npm run dev`. Vite proxies `/api` to port 3001.
4. Open `/courses`, create an account, and enroll in the seeded free course. For paid enrollment, set `BEGINNER_COURSE_PRICE_PAISE` (for example, ₹4,999 is `499900`), configure Razorpay test credentials, and configure the Razorpay webhook at `/api/payments/webhook` for `payment.captured` and `refund.processed` events. Keep `RAZORPAY_WEBHOOK_SECRET` equal to the webhook secret configured in the Razorpay dashboard.

The seeded curriculum includes lesson metadata and current game practice references. The repository does not currently contain actual course video or worksheet files; the protected API reports missing media instead of simulating availability. Put only approved MP4/WebM files under the private asset directory and reference their generated storage key from the lesson record. Never serve that directory statically.

## Academy studio

The staff dashboard is available at `/admin`. An administrator can manage courses and lessons, publish courses, upload lesson videos and course resources, assign instructors, create discount codes, review orders, and manage staff roles. Instructors can edit courses assigned to them; only administrators can publish content or access revenue, learner, commerce, and team reports. Promote the first administrator with `npm run api:make-admin -- learner@example.com` after that account exists.

The overview reports database-backed enrollments, lesson completions, paid orders, INR revenue, activity, and course funnels. Coupon discounts are one-time purchase discounts; the current checkout does not apply coupons to recurring subscriptions. Subscription plans use Razorpay Subscriptions and webhook events to grant or end course access. Configure the subscription lifecycle events in Razorpay in addition to `payment.captured` and `refund.processed` before enabling recurring plans.

Uploads currently use the API's private local asset directory. This works for local development and persistent-disk deployments, but it is not durable on an ephemeral serverless/container filesystem. Before production uploads, replace or back the asset store with durable private object storage such as Cloudflare R2 and use signed upload/download access. The dashboard does not send learner data to a third-party analytics service.

## Security controls

- Argon2id password hashing, generic login errors, input validation, and rate limits on authentication and checkout.
- Random opaque server-side sessions; only SHA-256 session token hashes are stored. Cookies are `HttpOnly`, `SameSite=Strict`, and `Secure` in production.
- Double-submit CSRF tokens and strict request-origin checks for state-changing endpoints.
- Helmet headers, restrictive CORS, request body size limits, and safe JSON errors.
- PostgreSQL parameterized statements and constraints; no user-provided SQL or filesystem paths.
- Course lessons, progress, downloads, and video streams require server-verified enrollment.
- Razorpay Checkout handles payment details. The app stores only the Razorpay order/payment IDs; only a verified raw-body webhook can mark an order paid and enroll the learner. Webhook event IDs and checkout requests are idempotent. Course prices and payments are INR, stored as paise.
- Admin account roles can only be granted through the database operator command: `npm --prefix server run make-admin -- learner@example.com`.
- Admins can attach private MP4/WebM lesson videos with `POST /api/admin/lessons/:lessonId/video` and upload a PDF or supporting video with `POST /api/admin/courses/:courseSlug/resources` (multipart form field `file`; resources also require `title` and may take `lessonId`). Uploads have a 500 MB cap, opaque generated filenames, MIME plus file-signature checks, and remain outside the public web directory.

## Production deployment

Set `NODE_ENV=production`, a strong database URL over TLS (`DATABASE_SSL=true`), Razorpay live credentials and webhook secret, a positive course price in paise, the exact HTTPS `APP_ORIGIN`, and `TRUST_PROXY=1` only behind one trusted proxy. Terminate TLS at the edge. Keep secrets in the deployment secret manager. Configure persistent private object storage for media, backups, monitoring, and email verification/password reset before public launch. The built-in rate limiter is process-local; use a shared Redis-backed store when running multiple API instances. Set appropriate database network restrictions and regular backups.

Current authentication does not yet include email verification, password reset, or account deletion workflows; add these before opening registration to a broad public audience.

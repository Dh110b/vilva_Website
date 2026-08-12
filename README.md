# Vilva

Product showcase and enquiry site for **Vilva**, a MicroComputer Automatic Water Level Controller brand. Built with Next.js (App Router), Tailwind CSS, and Base UI, backed by Supabase (Postgres + Storage) — deployable to serverless hosts like Vercel.

## Features

- **Product catalog** — browsable `/products` page with search, sorting, and rich filters (price, rating, motor phase/starter/motor type, water source, timer/unit type, no. of motors, no. of overhead tanks).
- **Product detail pages** with image gallery, specs, reviews, and a "Send Enquiry" form.
- **Custom Product page** (`/custom-product`) — a standalone enquiry form for customers who need a controller outside the standard catalog.
- **Admin panel** (`/admin`, password + emailed OTP 2FA):
  - Manage products (create/edit/delete, images, demo file uploads, Motor & Pump compatibility specs).
  - Manage enquiries — filter/sort, view full details, and track status (New / Pending / Done / Cancelled).
  - **Send Enquiry form builder** (`/admin/enquiry-form`) — reorder, relabel, show/hide the Motor & Pump Details fields, and add/remove/reorder the dropdown values customers pick from, all without touching code.
  - Manage product reviews and replies.
- **Two-factor admin login** — password, then a one-time code emailed via [Resend](https://resend.com).
- **Underwater-themed UI** — animated background with glass/frosted panels throughout, built from the Vilva logo's color palette.
- Enquiry email notifications, contact page, and static about/privacy/terms pages.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- [React 19](https://react.dev)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Base UI](https://base-ui.com) primitives (Dialog, Select, etc.)
- [Resend](https://resend.com) for transactional email (enquiry notifications, admin OTP)
- [Supabase](https://supabase.com) — Postgres for all data, Storage for uploaded images (via `postgres` and `@supabase/supabase-js`)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in the values:

```bash
cp .env.local.example .env.local
```

| Variable | Required | Description |
| --- | --- | --- |
| `ADMIN_PASSWORD` | Yes | Password for the first step of admin login. |
| `RESEND_API_KEY` | For email | API key from [resend.com](https://resend.com). Without it, enquiry emails are skipped and the admin OTP is logged to the server console instead of emailed. |
| `ENQUIRY_NOTIFY_EMAIL` | For email | Where new enquiry notifications are sent. |
| `ENQUIRY_FROM_EMAIL` | No | Sender address for outgoing email (defaults to Resend's shared `onboarding@resend.dev`, which can only deliver to the address your Resend account is verified with unless you verify your own domain). |
| `ADMIN_OTP_EMAIL` | No | Where the admin login 2FA code is sent (defaults to `manjushreeenterprisesblr@gmail.com`). |
| `POSTGRES_URL` | Yes | Pooled Postgres connection string (from Supabase → Project Settings → Database). Used at runtime by the app. |
| `POSTGRES_URL_NON_POOLING` | For setup | Direct (non-pooled) connection string, used only by `scripts/migrate.mjs` to run schema migrations. |
| `SUPABASE_URL` | Yes | Your Supabase project URL, used for Storage (uploaded images). |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Service role key, used server-side to upload files and create the storage bucket. Keep secret — never expose client-side. |

Run the schema migration once against a fresh Supabase project:

```bash
node --env-file=.env.local scripts/migrate.mjs
node --env-file=.env.local scripts/create-bucket.mjs
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Sign in to the admin panel

Go to `/admin/login`, enter `ADMIN_PASSWORD`, then enter the 6-digit code sent to `ADMIN_OTP_EMAIL` (or printed to the terminal if Resend isn't configured).

## Data Storage

All content (products, enquiries, reviews, dropdown option lists, Send Enquiry form config, admin login OTPs) lives in Postgres tables (`products`, `enquiries`, `reviews`, `review_replies`, plus a generic `app_kv` key-value table for small config blobs) — see `scripts/migrate.mjs` for the schema. Uploaded images (product photos, review photos) go to a public Supabase Storage bucket named `uploads`.

## Project Structure

```
src/
  app/                     Routes (App Router)
    admin/                 Admin panel (protected by session cookie)
    api/                   Route handlers (products, enquiries, options, auth, uploads)
    products/               Public product listing & detail pages
    custom-product/         Custom controller enquiry page
  components/              UI components (forms, browsers/filters, admin tools)
  components/ui/           Base UI-driven design system primitives
  lib/                      Data access (Postgres), auth, mail, option/field config, Supabase client
  hooks/                    Client hooks for live option/field config
scripts/                    One-off setup scripts (schema migration, storage bucket creation)
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint with ESLint |

## Deployment

Since all state lives in Supabase (not the local filesystem), this deploys cleanly to serverless hosts like [Vercel](https://vercel.com). Set the environment variables from the table above in your hosting platform, run the schema migration and bucket-creation scripts once against your Supabase project (see above), then deploy as a standard Next.js app.

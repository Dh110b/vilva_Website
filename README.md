# Vilva

Product showcase and enquiry site for **Vilva**, a MicroComputer Automatic Water Level Controller brand. Built with Next.js (App Router), Tailwind CSS, and Base UI, with a JSON-file backed admin panel — no external database required.

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
- File-based JSON storage under `data/` (no database setup needed)

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

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Sign in to the admin panel

Go to `/admin/login`, enter `ADMIN_PASSWORD`, then enter the 6-digit code sent to `ADMIN_OTP_EMAIL` (or printed to the terminal if Resend isn't configured).

## Data Storage

All content (products, enquiries, reviews, dropdown option lists, Send Enquiry form config) is stored as JSON files under `data/`, created automatically on first write. This directory is gitignored — back it up separately in production, or swap `src/lib/data.ts` for a real database if you outgrow file storage.

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
  lib/                      Data access, auth, mail, option/field config
  hooks/                    Client hooks for live option/field config
data/                       JSON data files (gitignored, created at runtime)
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint with ESLint |

## Deployment

Deployable anywhere Next.js runs with a persistent filesystem (the JSON data store needs disk to survive restarts) — e.g. a VM, container, or Node host. Set the environment variables from the table above in your hosting platform before deploying.

# Sweet Crumb Bakery — Payload CMS Backend Setup

This guide walks you through setting up **Payload CMS 3.x** as the backend for the Next.js frontend in `frontend/`. By the end you'll have:

- Two collections: **Pastries** (the menu) and **Orders** (customer orders)
- Media upload for pastry photos
- An admin dashboard at `http://localhost:3001/admin`
- REST API endpoints the frontend already calls: `GET /api/pastries`, `POST /api/orders`

Payload 3 runs **inside a Next.js app** as a route handler, so the backend and frontend share one Next.js project. We'll keep them as separate folders for clarity, but the same steps work if you merge them into one repo.

---

## Step 1 — Scaffold the Payload project

```bash
npx create-payload-app@latest bakery-backend
# Choose: "blank" template
# Database: SQLite (local dev) — pick Postgres if you prefer
cd bakery-backend
```

The installer generates a Next.js app with Payload mounted on the `/api` route.

## Step 2 — Create the collections

Create `src/collections/Pastries.ts`:

```ts
import { CollectionConfig } from "payload";

export const Pastries: CollectionConfig = {
  slug: "pastries",
  access: {
    read: () => true, // public read — powers the storefront menu
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  admin: { useAsTitle: "name" },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "description", type: "textarea" },
    { name: "price", type: "number", required: true, admin: { description: "In USD" } },
    {
      name: "category",
      type: "select",
      options: [
        { label: "Cakes", value: "cakes" },
        { label: "Cookies", value: "cookies" },
        { label: "Breads", value: "breads" },
        { label: "Seasonal", value: "seasonal" },
      ],
      required: true,
    },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "inStock", type: "checkbox", defaultValue: true },
  ],
};
```

Create `src/collections/Orders.ts`:

```ts
import { CollectionConfig } from "payload";

export const Orders: CollectionConfig = {
  slug: "orders",
  access: {
    // Public can CREATE orders, but only admins can read them
    create: () => true,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    useAsTitle: "customerName",
    defaultColumns: ["customerName", "total", "pickupDate", "status", "createdAt"],
  },
  fields: [
    { name: "customerName", type: "text", required: true },
    { name: "customerEmail", type: "email", required: true },
    { name: "customerPhone", type: "text", required: true },
    { name: "pickupDate", type: "date", required: true },
    { name: "notes", type: "textarea" },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Baking", value: "baking" },
        { label: "Ready for Pickup", value: "ready" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
    {
      name: "items",
      type: "array",
      required: true,
      fields: [
        { name: "pastryId", type: "text", required: true },
        { name: "name", type: "text", required: true },
        { name: "unitPrice", type: "number", required: true },
        { name: "quantity", type: "number", required: true, min: 1 },
      ],
    },
    { name: "total", type: "number", required: true },
  ],
};
```

## Step 3 — Register collections in the Payload config

Edit `src/payload.config.ts`:

```ts
import { buildConfig } from "payload";
import { mongooseAdapter } from "@payloadcms/db-mongodb"; // or your DB adapter
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { Pastries } from "./collections/Pastries";
import { Orders } from "./collections/Orders";
import { Media } from "./collections/Media";

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001",
  admin: { user: "users" },
  collections: [Users, Media, Pastries, Orders], // Users comes with the blank template
  editor: lexicalEditor(),
  db: mongooseAdapter({ url: process.env.DATABASE_URI! }),
  upload: { limits: { fileSize: 5 * 1024 * 1024 } },
  cors: ["http://localhost:3000"], // your Next.js frontend origin
  csrf: ["http://localhost:3000"],
});
```

## Step 4 — Environment variables

Create `.env` in `bakery-backend/`:

```
DATABASE_URI=mongodb://localhost:27017/sweetcrumb   # or your Postgres URL
PAYLOAD_SECRET=generate-a-long-random-string-here
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
```

## Step 5 — Run it

```bash
npm run dev
# Admin:  http://localhost:3001/admin   ← create your first admin user here
# API:    http://localhost:3001/api/pastries
```

1. Open `/admin`, create your admin account.
2. Go to **Media** → upload pastry photos.
3. Go to **Pastries** → add items (name, slug like `chocolate-croissant`, price, category, image, inStock).
4. The storefront at `http://localhost:3000` picks them up automatically (it revalidates every 60s via Next.js ISR).

## Step 6 — Connect the frontend

In `frontend/.env.local`:

```
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3001
```

Then `cd frontend && npm install && npm run dev`.

---

## How the pieces talk

| Frontend action | Payload endpoint |
|---|---|
| Menu/home load | `GET /api/pastries?depth=1&where[status][equals]=published` |
| Place order | `POST /api/orders` with the order JSON |

> **Note on the `status` filter:** the starter filters `status=published`, but the Pastries collection above uses `inStock` instead. Either drop the `where` clause in `lib/payload.ts`, or add a `status: "published|draft"` select field to the collection. Simplest fix: remove `&where[status][equals]=published` from the fetch URL.

## Production notes

- **Postgres** for the DB (Render/Railway/Supabase all work), or MongoDB Atlas.
- **Storage**: use `@payloadcms/storage-s3` (or Vercel Blob plugin) so images survive deploys.
- **Email confirmations**: add a `payload-plugin-email` hook on `orders.afterOperation` to send the customer a receipt via Resend/SendGrid.
- **Payments**: add Stripe Checkout — create a `payments` collection, or use Payload's `stripe` plugin to sync products/prices.
- **Auth for customers** (order history, saved addresses): add a `customers` collection with `auth: true` and issue JWTs; protect `orders.read` to `req.user.id`.
- Deploy backend (e.g. Railway/Fly.io) and set the frontend env var to its URL; add that domain to `next.config.js` `images.remotePatterns`.

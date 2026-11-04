# NIZWA CAT

A bilingual Arabic/English cat-products storefront built with React + Vite + Supabase.

## Important project status

This project is prepared to run in **preview mode** before Supabase is configured. It uses sample products until valid Supabase environment variables are added. The exact existing database columns have not yet been inspected, so do not assume the connection is production-ready until the schema is checked and aligned.

## Run locally

1. Install Node.js on a computer.
2. In this folder run `npm install`.
3. Copy `.env.example` to `.env`.
4. Add the Supabase Project URL and the publishable/anon key.
5. Run `npm run dev`.
6. Run `npm run build` to verify the production build.

## Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_WHATSAPP_NUMBER` (optional; defaults to the NIZWA CAT WhatsApp number)

## Expected Supabase columns

The starter code expects these columns. Your existing tables must be inspected before connecting:

### categories
- `id` UUID primary key, default `gen_random_uuid()`
- `name_en` text
- `name_ar` text
- `created_at` timestamptz default now()

### products
- `id` UUID primary key, default `gen_random_uuid()`
- `category_id` UUID nullable, references categories(id)
- `name_en` text
- `name_ar` text
- `description_en` text nullable
- `description_ar` text nullable
- `price` numeric(10,3)
- `image_url` text nullable
- `featured` boolean default false
- `created_at` timestamptz default now()

The current storefront reads and writes the fields above. `orders` and `order_items` are not written by this starter because checkout is intentionally handed to WhatsApp, as requested. A future order-history workflow can be added after the real order schema is reviewed.

## Security

- Never put the Supabase `service_role` key in this project or any `VITE_` variable.
- The browser app uses only the publishable key (or legacy anon key).
- Admin access uses Supabase Auth email/password.
- Row Level Security must be enabled and policies must be applied. See `setup.sql`.
- Create your own admin user through Supabase Authentication. Do not make public sign-up part of the storefront.
- The included policies allow public read access to product/category data and authenticated users to write. For a single-owner store, restrict authenticated write policies further to your own admin user ID before going live.

## Image storage

The first version stores image URLs in `products.image_url`. The admin form accepts an image URL. Supabase Storage upload UI and image resizing can be added after the database and bucket are confirmed. This avoids pretending that an image-upload workflow is already configured.

## Notes

- Prices display in Omani Rial (OMR), with three decimal places.
- Delivery fee is not calculated or hard-coded. It is agreed separately based on order weight.
- There is no cash-on-delivery option.
- Checkout opens WhatsApp with product names, quantities, item prices and estimated subtotal.
- The two collection options are office collection and home delivery.
- Arabic uses RTL; English uses LTR.

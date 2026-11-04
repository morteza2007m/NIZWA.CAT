-- NIZWA CAT starter schema reference.
-- Do NOT run blindly over existing tables. First inspect your current columns.
-- This file is a reference for the expected products/categories fields only.

-- If you later confirm that these columns are missing, add them carefully:
-- alter table public.categories add column if not exists name_en text;
-- alter table public.categories add column if not exists name_ar text;
-- alter table public.products add column if not exists name_en text;
-- alter table public.products add column if not exists name_ar text;
-- alter table public.products add column if not exists description_en text;
-- alter table public.products add column if not exists description_ar text;
-- alter table public.products add column if not exists price numeric(10,3);
-- alter table public.products add column if not exists image_url text;
-- alter table public.products add column if not exists featured boolean not null default false;
-- alter table public.products add column if not exists created_at timestamptz not null default now();
-- alter table public.categories add column if not exists created_at timestamptz not null default now();

-- Enable RLS. Review existing policies before applying any new policy.
alter table public.products enable row level security;
alter table public.categories enable row level security;

-- Public storefront can read products and categories.
create policy "Public can read products" on public.products
for select to anon, authenticated using (true);

create policy "Public can read categories" on public.categories
for select to anon, authenticated using (true);

-- Starter write policies: any authenticated account can write.
-- IMPORTANT: before production, replace these with policies restricted to YOUR admin user UUID.
create policy "Authenticated users manage products" on public.products
for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);

create policy "Authenticated users manage categories" on public.categories
for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);

-- Create a private admin account in Supabase Dashboard > Authentication > Users.
-- Disable public signups in Supabase Auth settings.
-- For production, replace broad authenticated write policies with:
-- using (auth.uid() = 'YOUR-ADMIN-USER-UUID'::uuid)
-- with check (auth.uid() = 'YOUR-ADMIN-USER-UUID'::uuid)

-- Optional Storage setup (create bucket manually in Storage UI named: product-images).
-- Keep the bucket public only if product images should be publicly viewable.
-- Upload policies should be restricted to the admin user; do not make writes public.

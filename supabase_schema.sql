-- ==========================================
-- J3RACKS DATABASE SCHEMA & RLS POLICIES
-- ==========================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. CATEGORIES TABLE (Extra 1)
create table public.categories (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PRODUCTS TABLE
create table public.products (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    price numeric(10,2) not null,
    is_visible boolean default true not null,
    category_id uuid references public.categories(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. PRODUCT IMAGES TABLE
create table public.product_images (
    id uuid primary key default gen_random_uuid(),
    product_id uuid references public.products(id) on delete cascade not null,
    url text not null,
    label text,
    position integer default 0 not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Constraint of max 10 images per product trigger
create or replace function public.check_max_product_images()
returns trigger as $$
begin
    if (select count(*) from public.product_images where product_id = new.product_id) >= 10 then
        raise exception 'Un producto no puede tener más de 10 imágenes';
    end if;
    return new;
end;
$$ language plpgsql;

create trigger trg_check_max_product_images
before insert on public.product_images
for each row
execute function public.check_max_product_images();

-- 4. PROFILES TABLE
create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    first_name text not null,
    last_name text not null,
    phone text not null,
    email text not null,
    role text default 'customer'::text not null check (role in ('customer', 'admin')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. ORDERS TABLE (Extra 3)
create table public.orders (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles(id) on delete set null,
    items jsonb not null, -- Array of { id, name, price, quantity }
    total numeric(10,2) not null,
    whatsapp_sent_at timestamp with time zone default timezone('utc'::text, now()) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. SETTINGS TABLE
create table public.settings (
    key text primary key,
    value text not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Automatically handle profile creation on Auth SignUp
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, first_name, last_name, phone, email, role)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'first_name', 'Cliente'),
        coalesce(new.raw_user_meta_data->>'last_name', ''),
        coalesce(new.raw_user_meta_data->>'phone', ''),
        coalesce(new.email, 'sin-email@j3racks.com'),
        'customer'
    );
    return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();


-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS for all tables
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.settings enable row level security;

-- Helper: Check if user is Admin
create or replace function public.is_admin()
returns boolean as $$
begin
    return exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'admin'
    );
end;
$$ language plpgsql security definer;

-- --- CATEGORIES POLICIES ---
create policy "Allow public read on categories" on public.categories
    for select using (true);

create policy "Allow admins manage categories" on public.categories
    for all using (public.is_admin());

-- --- PRODUCTS POLICIES ---
create policy "Allow public read on visible products" on public.products
    for select using (is_visible = true or public.is_admin());

create policy "Allow admins manage products" on public.products
    for all using (public.is_admin());

-- --- PRODUCT IMAGES POLICIES ---
create policy "Allow public read on product images" on public.product_images
    for select using (true);

create policy "Allow admins manage product images" on public.product_images
    for all using (public.is_admin());

-- --- PROFILES POLICIES ---
create policy "Allow users to read their own profile" on public.profiles
    for select using (auth.uid() = id or public.is_admin());

create policy "Allow users to update their own profile" on public.profiles
    for update using (auth.uid() = id or public.is_admin());

create policy "Allow admins to read all profiles" on public.profiles
    for select using (public.is_admin());

-- --- ORDERS POLICIES ---
create policy "Allow users to view their own orders" on public.orders
    for select using (auth.uid() = user_id or public.is_admin());

create policy "Allow users and public to insert orders" on public.orders
    for insert with check (true);

create policy "Allow admins to manage all orders" on public.orders
    for all using (public.is_admin());

-- --- SETTINGS POLICIES ---
create policy "Allow public read on settings" on public.settings
    for select using (true);

create policy "Allow admins to manage settings" on public.settings
    for all using (public.is_admin());


-- ==========================================
-- STORAGE BUCKETS SETUP (product-images)
-- ==========================================
-- Ensure the storage bucket exists:
insert into storage.buckets (id, name, public) 
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Drop existing policies if any to avoid errors on re-run
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Admin control" on storage.objects;

-- 1. Allow public select:
create policy "Public Access" on storage.objects 
    for select 
    using (bucket_id = 'product-images');

-- 2. Allow admins full control:
create policy "Admin control" on storage.objects 
    for all 
    using (bucket_id = 'product-images' and public.is_admin());

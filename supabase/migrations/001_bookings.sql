-- Run this in Supabase SQL Editor (Dashboard → SQL Editor) to create the bookings table.

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_ref text not null unique,
  check_in date not null,
  check_out date not null,
  nights int not null,
  room_type text not null,
  guests int not null default 1,
  name text not null,
  email text not null,
  phone text not null,
  special_requests text,
  subtotal numeric not null,
  tax numeric not null,
  total numeric not null,
  payment_method text not null default 'manual' check (payment_method in ('manual', 'paystack')),
  status text not null default 'pending_confirmation' check (status in (
    'pending_confirmation', 'pending_payment', 'confirmed', 'paid', 'cancelled'
  )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_bookings_booking_ref on public.bookings(booking_ref);
create index if not exists idx_bookings_status on public.bookings(status);
create index if not exists idx_bookings_created_at on public.bookings(created_at desc);

-- Enable RLS so anon key cannot read/write. API uses service_role key which bypasses RLS.
alter table public.bookings enable row level security;

comment on table public.bookings is 'EBOMI Suites booking records';

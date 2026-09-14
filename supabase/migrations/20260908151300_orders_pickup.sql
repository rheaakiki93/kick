-- Switch orders from delivery (address/city/cap) to pickup (location + slot).
-- Old columns are kept and made nullable so historical delivery orders stay
-- intact; new orders fill pickup_location/pickup_date/pickup_time instead.

alter table public.orders
  alter column address drop not null,
  alter column city drop not null,
  alter column cap drop not null;

alter table public.orders
  add column pickup_location text,
  add column pickup_date date,
  add column pickup_time text;

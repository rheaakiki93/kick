-- Add a fulfillment method so an order is either picked up or self-delivered
-- by car. Delivery reuses the existing address/city/cap columns (nullable
-- since the pickup migration) instead of adding new ones.

alter table public.orders
  add column fulfillment_method text not null default 'pickup'
    check (fulfillment_method in ('pickup', 'delivery'));

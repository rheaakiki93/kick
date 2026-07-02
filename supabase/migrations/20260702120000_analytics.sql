-- Page-view tracking + logged-in read access for the private analytics page.

-- Anonymous, privacy-friendly page views (no personal data).
create table public.page_views (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  path text not null,
  referrer text,
  visitor_id text
);

alter table public.page_views enable row level security;

create policy "Anyone can insert page views"
  on public.page_views for insert to anon, authenticated with check (true);

create policy "Authenticated can read page views"
  on public.page_views for select to authenticated using (true);

-- Let the logged-in owner read orders (public/anon still blocked by the
-- existing "No public read access to orders" policy).
create policy "Authenticated can read orders"
  on public.orders for select to authenticated using (true);

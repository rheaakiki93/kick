-- Email signups from the "coming soon" shop page (Get notified when we
-- relaunch). Writes go through the notify-signup Edge Function using the
-- service role key, so there is no public insert policy here — only the
-- function can write. The owner can still read via the dashboard.

create table public.notify_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  confirmation_sent boolean not null default false
);

create unique index notify_signups_email_key on public.notify_signups (lower(email));

alter table public.notify_signups enable row level security;

create policy "Authenticated can read notify signups"
  on public.notify_signups for select to authenticated using (true);

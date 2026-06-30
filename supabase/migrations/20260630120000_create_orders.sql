-- Orders captured at checkout, before the customer is sent to Revolut to pay.
-- Mirrors the survey_responses security model: anonymous inserts allowed,
-- no public read (only you, via the Supabase dashboard / service role, can read).

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text NOT NULL DEFAULT 'Milano',
  cap text NOT NULL,
  notes text,
  pack_id text NOT NULL,
  pack_label text NOT NULL,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  status text NOT NULL DEFAULT 'pending_payment'
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "No public read access to orders"
  ON public.orders
  FOR SELECT
  USING (false);

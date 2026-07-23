-- Let the logged-in owner update order status (e.g. mark as paid after
-- confirming the payment landed in Revolut). Public/anon still cannot
-- update — only insert (existing policy) and the owner's own read/update.

create policy "Authenticated can update orders"
  on public.orders for update to authenticated using (true) with check (true);

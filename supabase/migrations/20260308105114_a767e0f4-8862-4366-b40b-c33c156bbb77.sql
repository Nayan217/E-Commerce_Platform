
-- Fix: Users can only cancel their own pending/paid orders, nothing else
DROP POLICY IF EXISTS "Users can update own pending orders" ON public.orders;
CREATE POLICY "Users can update own pending orders" ON public.orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status IN ('pending', 'paid'))
  WITH CHECK (auth.uid() = user_id AND status = 'cancelled');

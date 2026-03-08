-- Drop the existing overly permissive INSERT policy
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;

-- Create a tightened INSERT policy that enforces safe initial state
-- Users can only create orders with status='pending' and payment_status='unpaid'
CREATE POLICY "Users can insert own orders" ON public.orders
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND status = 'pending'
    AND payment_status = 'unpaid'
  );
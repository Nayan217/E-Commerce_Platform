
-- Fix 1: Replace RESTRICTIVE newsletter SELECT policy with PERMISSIVE admin-only
DROP POLICY IF EXISTS "Admins can read newsletter" ON public.newsletter;
CREATE POLICY "Admins can read newsletter"
  ON public.newsletter
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Make the INSERT policy PERMISSIVE so it actually works
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter;
CREATE POLICY "Anyone can subscribe"
  ON public.newsletter
  FOR INSERT
  WITH CHECK (email ~ '^[^@]+@[^@]+\.[^@]+$'::text);

-- Fix 2: Add scoped coupon read policy (lookup by code only, not list all)
-- Coupons are validated server-side via apply_coupon RPC, so no public SELECT needed.
-- Keep admin-only write policy as PERMISSIVE.
DROP POLICY IF EXISTS "Admins can write coupons" ON public.coupons;
CREATE POLICY "Admins can write coupons"
  ON public.coupons
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

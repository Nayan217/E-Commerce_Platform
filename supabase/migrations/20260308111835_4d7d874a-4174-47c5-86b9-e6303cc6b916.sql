-- Fix 1: Remove anonymous coupon read access (coupons validated server-side in create-order)
DROP POLICY IF EXISTS "Anyone can read active coupons" ON public.coupons;

-- Fix 2: Create atomic apply_coupon function to prevent race condition
CREATE OR REPLACE FUNCTION public.apply_coupon(
  _coupon_code TEXT,
  _order_subtotal NUMERIC
)
RETURNS TABLE(
  coupon_id UUID,
  discount_type TEXT,
  discount_value NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  UPDATE coupons c
  SET used_count = COALESCE(c.used_count, 0) + 1
  WHERE c.code = _coupon_code
    AND c.is_active = true
    AND (c.expires_at IS NULL OR c.expires_at > now())
    AND (c.max_uses IS NULL OR COALESCE(c.used_count, 0) < c.max_uses)
    AND _order_subtotal >= COALESCE(c.min_order_amount, 0)
  RETURNING c.id, c.discount_type, c.discount_value;
END;
$$;
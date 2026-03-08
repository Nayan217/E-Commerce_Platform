INSERT INTO coupons (code, discount_type, discount_value, is_active, max_uses, min_order_amount, expires_at)
VALUES
  ('WELCOME30', 'percentage', 30, true, 10000, 0, '2027-12-31T23:59:59Z'),
  ('LOYAL20', 'percentage', 20, true, NULL, 0, NULL)
ON CONFLICT DO NOTHING;
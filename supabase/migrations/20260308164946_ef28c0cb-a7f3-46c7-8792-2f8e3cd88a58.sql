
-- Drop all existing RESTRICTIVE policies and recreate as PERMISSIVE

-- addresses
DROP POLICY IF EXISTS "Users can CRUD own addresses" ON public.addresses;
CREATE POLICY "Users can CRUD own addresses" ON public.addresses FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- carts
DROP POLICY IF EXISTS "Users can CRUD own cart" ON public.carts;
CREATE POLICY "Users can CRUD own cart" ON public.carts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- categories
DROP POLICY IF EXISTS "Anyone can read categories" ON public.categories;
CREATE POLICY "Anyone can read categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can write categories" ON public.categories;
CREATE POLICY "Admins can write categories" ON public.categories FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- coupons
DROP POLICY IF EXISTS "Authenticated users can read active coupons" ON public.coupons;
CREATE POLICY "Authenticated users can read active coupons" ON public.coupons FOR SELECT TO authenticated USING (is_active = true);

DROP POLICY IF EXISTS "Admins can write coupons" ON public.coupons;
CREATE POLICY "Admins can write coupons" ON public.coupons FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- newsletter
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter;
CREATE POLICY "Anyone can subscribe" ON public.newsletter FOR INSERT WITH CHECK (email ~ '^[^@]+@[^@]+\.[^@]+$'::text);

DROP POLICY IF EXISTS "Admins can read newsletter" ON public.newsletter;
CREATE POLICY "Admins can read newsletter" ON public.newsletter FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- orders
DROP POLICY IF EXISTS "Users can read own orders" ON public.orders;
CREATE POLICY "Users can read own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can read all orders" ON public.orders;
CREATE POLICY "Admins can read all orders" ON public.orders FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id) AND (status = 'pending'::text) AND (payment_status = 'unpaid'::text));

DROP POLICY IF EXISTS "Users can update own pending orders" ON public.orders;
CREATE POLICY "Users can update own pending orders" ON public.orders FOR UPDATE TO authenticated USING ((auth.uid() = user_id) AND (status = ANY (ARRAY['pending'::text, 'paid'::text]))) WITH CHECK ((auth.uid() = user_id) AND (status = 'cancelled'::text));

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- products
DROP POLICY IF EXISTS "Anyone can read active products" ON public.products;
CREATE POLICY "Anyone can read active products" ON public.products FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can read all products" ON public.products;
CREATE POLICY "Admins can read all products" ON public.products FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can write products" ON public.products;
CREATE POLICY "Admins can write products" ON public.products FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- profiles
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Allow insert own profile" ON public.profiles;
CREATE POLICY "Allow insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- reviews
DROP POLICY IF EXISTS "Anyone can read reviews" ON public.reviews;
CREATE POLICY "Anyone can read reviews" ON public.reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated can insert own reviews" ON public.reviews;
CREATE POLICY "Authenticated can insert own reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own reviews" ON public.reviews;
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- user_roles
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can read all roles" ON public.user_roles;
CREATE POLICY "Admins can read all roles" ON public.user_roles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- wishlists
DROP POLICY IF EXISTS "Users can CRUD own wishlist" ON public.wishlists;
CREATE POLICY "Users can CRUD own wishlist" ON public.wishlists FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

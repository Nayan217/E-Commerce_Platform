
-- Fix WARN 1: Set search_path on update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix WARN 2: Newsletter insert policy - restrict to valid email format
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter;
CREATE POLICY "Anyone can subscribe" ON public.newsletter FOR INSERT TO anon, authenticated WITH CHECK (email ~ '^[^@]+@[^@]+\.[^@]+$');

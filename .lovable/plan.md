

# ShopFlow — Full-Stack Supabase Migration Plan

## Current State
- 11 pages already built with mock data and Redux state
- Supabase connected but database is empty (no tables)
- Auth uses localStorage-based Redux slice (no real auth)
- Cart persisted to localStorage only

## Security Concern: User Roles

The request places `role` on the `profiles` table. Per security best practices, **roles must be stored in a separate `user_roles` table** with a `security definer` function to prevent privilege escalation. The plan will use this pattern instead.

---

## Phase 1: Database Schema + RLS + Seed Data

Create all tables via a single migration:

**Tables:** `profiles`, `user_roles` (with `app_role` enum), `addresses`, `categories`, `products`, `reviews`, `carts`, `orders`, `coupons`, `wishlists`, `newsletter`

**Key differences from request:**
- `profiles.role` removed — replaced by `user_roles` table with `app_role` enum (`admin`, `customer`)
- `has_role()` security definer function for RLS checks
- Trigger `on_auth_user_created` auto-creates profile + assigns `customer` role

**RLS policies** on all tables using `has_role()` for admin checks.

**Seed data** (separate insert): 6 categories + 24 products (4 per category) with realistic Indian product names, variants, and picsum images.

---

## Phase 2: Auth Integration

- Replace Redux `authSlice` with Supabase Auth
- Create `useAuth` hook wrapping `onAuthStateChange` + `getSession`
- Refactor `Login` and `Register` pages to use `supabase.auth.signInWithPassword` / `signUp`
- Password strength indicator on Register
- Update `ProtectedRoute` to check Supabase session + `user_roles` table for admin
- Add forgot password flow with `/reset-password` page

---

## Phase 3: Edge Functions

### `create-order`
- Validates stock, calculates totals (18% tax, shipping tiers), applies coupon
- Generates `ORD-YYYY-XXXXX` order number
- Inserts order, returns order details

### `update-inventory`
- Decrements variant stock atomically after payment
- Updates order status to `paid`

### `apply-coupon`
- Validates coupon (active, not expired, min order, max uses)
- Returns discount info

### `get-order-stats`
- Admin-only: aggregates revenue, order counts, user counts

---

## Phase 4: Frontend Refactor

### Data Layer
- Replace `src/services/api.ts` mock API with direct Supabase client queries
- Create `src/services/supabase-api.ts` with typed query functions
- Update all React Query hooks to use Supabase queries with server-side filtering/pagination
- Products catalog: build Supabase query dynamically from URL params (category, brand, price range, rating, sort, page)

### State Management
- Keep Redux for cart (with Supabase sync for logged-in users)
- Add wishlist slice synced to `wishlists` table
- Auth state from Supabase session (not localStorage)

### Page Updates
All 11 pages refactored to read/write Supabase:

| Page | Key Changes |
|------|-------------|
| Home | Fetch categories + featured products from Supabase |
| Products | Server-side filtered queries with URL sync |
| Product Detail | Fetch product + reviews from Supabase, submit reviews |
| Cart | Sync to `carts` table for logged-in users |
| Checkout | Call `create-order` edge function, Stripe integration |
| Order Success | Fetch real order from Supabase |
| Orders | Query user's orders with status filtering |
| Order Detail | Real order data + cancel functionality |
| Login/Register | Supabase Auth |
| Admin | Query real stats, CRUD products/orders/inventory |

### New Components
- Search overlay (full-screen, debounced, queries Supabase)
- Wishlist integration on ProductCard
- Newsletter signup (inserts to `newsletter` table)

---

## Phase 5: Stripe Payment

- Enable Stripe via Lovable's Stripe integration tool
- Create `create-payment-intent` edge function
- Wire checkout Step 3 to real Stripe CardElement flow
- On success: call `update-inventory` → redirect to confirmation

---

## Implementation Order

1. **Database migration** — all tables, RLS, triggers, functions
2. **Seed data** — categories + 24 products via insert tool
3. **Auth** — Supabase auth + profile creation + protected routes
4. **Supabase API service** — replace mock data layer
5. **Edge functions** — create-order, update-inventory, apply-coupon, get-order-stats
6. **Page-by-page refactor** — Home → Catalog → Detail → Cart → Checkout → Orders → Admin
7. **Stripe** — enable and integrate

This is a very large scope. Due to message size limits, implementation will be done across multiple messages, starting with the database schema, seed data, and auth system.


# ShopFlow Enhancement Plan

This is a large set of changes. Due to message limits, I'll implement across multiple messages, starting with the highest-impact items.

---

## 1. Dark/Light Theme Toggle

- Create a `ThemeProvider` component using `next-themes` (already installed)
- Wrap `App` in `ThemeProvider` with `defaultTheme="system"` and `storageKey="shopflow-theme"`
- Add a Sun/Moon toggle button in the Navbar (both desktop and mobile nav)
- Dark theme CSS variables already exist in `index.css` — just need to activate the class-based switching

---

## 2. Mobile Responsiveness Fixes

Audit and fix across all pages:


| Area              | Issue                                              | Fix                                                        |
| ----------------- | -------------------------------------------------- | ---------------------------------------------------------- |
| **Navbar**        | Search dropdown overflows on small screens         | Make search full-width on mobile, max-w-[calc(100vw-2rem)] |
| **ProductCard**   | "Add to Cart" hover button not accessible on touch | Show always on mobile via `@media (hover: none)`           |
| **ProductDetail** | Image gallery + details cramped on small screens   | Stack vertically, thumbnail strip scrollable horizontal    |
| **Cart**          | Summary sidebar doesn't stack properly             | Already uses `lg:grid-cols`, verify spacing                |
| **Checkout**      | Two-column form fields too narrow on 320px         | Make grid-cols-2 → grid-cols-1 on mobile                   |
| **Admin tables**  | Overflow without scroll indicators                 | Add visual scroll hint                                     |
| **Orders list**   | Action buttons wrap poorly                         | Stack vertically on mobile                                 |


---

## 3. Test Users & Admin Accounts

Cannot create auth users via SQL. Will create them via Supabase Admin API (edge function) or instruct to register manually. **Plan:** Create a one-time seed edge function that:

- Creates 3 test users via `supabase.auth.admin.createUser()` ([admin@shopflow.com](mailto:admin@shopflow.com) already exists)
- Creates 2 customer users: `customer1@shopflow.com` (password: `Test@1234`), `customer2@shopflow.com` (password: `Test@1234`)
- Assigns admin role to admin user, customer role auto-assigned
- Populates addresses, reviews, wishlists, and sample orders for these users

Alternatively, since [admin@shopflow.com](mailto:admin@shopflow.com) already exists, I'll create the customers and seed their data.  
  
Currently unable to login using the admin user.

---

## 4. Sample Data Population

Fill all empty tables with realistic data:


| Table      | Current | Action                                      |
| ---------- | ------- | ------------------------------------------- |
| reviews    | 0       | Add 40-50 reviews across products           |
| addresses  | 0       | Add 2-3 addresses per test user             |
| wishlists  | 0       | Add 5-8 wishlist items per user             |
| orders     | 0       | Add 4-6 sample orders with various statuses |
| newsletter | unknown | Add 5 sample subscribers                    |


---

## 5. Welcome Coupon (30% off for New Users)

- Add a `WELCOME30` coupon (30% off, single use per user, no minimum)
- Update `handle_new_user` trigger to auto-assign this coupon to new users — need a `user_coupons` table or just show the code on the registration success screen
- **Simpler approach:** Add `WELCOME30` coupon to DB. After registration, show a toast/banner: "Use code WELCOME30 for 30% off your first order!" The coupon's `max_uses` will be high but each user ideally uses once.

---

## 6. Loyalty Discount (20% off After First Purchase)

- Add a `LOYAL20` coupon (20% off, unlimited uses)
- After first order completes, show the code on the OrderSuccess page
- Edge function: after order creation, check if this is user's first order → include `LOYAL20` code in response

---

## 7. GST-Inclusive Pricing

Currently prices are shown as base price + 18% GST added at cart/checkout. Change to:

- All displayed prices include GST (price × 1.18, rounded)
- Cart/checkout shows "Price inclusive of GST" instead of adding tax line
- **Alternative (better):** Keep DB prices as-is but display "incl. GST" on all price displays. At checkout, show tax breakup but total remains same.
- Update: ProductCard, ProductDetail, Cart, CartDrawer, Checkout, OrderDetail — append "(incl. GST)" or show "All prices include GST" banner

---

## 8. Orders Section & Support Section on Homepage/Account

- Add "My Orders" quick-access section on homepage for logged-in users (recent 3 orders)
- Add a `/support` page with FAQ, contact form, and order lookup
- Add Support link in Navbar user menu and Footer
- Add route in App.tsx

---

## Implementation Order (across messages)

**Message 1 (this one):**

1. Theme provider + dark mode toggle
2. Mobile responsiveness fixes across all pages
3. GST-inclusive pricing display
4. Welcome coupon (WELCOME30) + loyalty coupon (LOYAL20)
5. Orders & Support sections

**Message 2:**

1. Seed edge function to create test users + sample data
2. Populate reviews, addresses, wishlists, orders
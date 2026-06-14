## Decision: What "every nth order" means

**Context:** After reading the assignment, the first thing I wasn't sure about was what "nth order" actually meant. Does it apply to every nth order across the whole store, or every nth order for a particular customer?

**Options Considered:**

* **Option A:** Every nth order globally. The 3rd, 6th, 9th order overall gets the discount, regardless of who placed it.
* **Option B:** Every nth order per customer. Each customer has their own order count, so their 3rd, 6th, 9th orders qualify independently.

**Choice:** Per customer (Option B)

**Why:** From a product perspective, this made more sense to me. A per-customer approach encourages repeat purchases and builds loyalty. The global approach felt more like a lucky draw, where one customer could miss out simply because someone else happened to place the qualifying order first.

**Trade-offs:** The global approach is simpler and can work well for promotional campaigns. The per-customer approach requires tracking order counts per user, but it creates a more predictable and fair experience for the customer.

**Future Considerations:** If the business wanted to run more campaign-style promotions, the implementation could be switched to use the total order count instead. That could be positioned as a "lucky winner" mechanic where every 100th or 1000th order across the platform wins a reward. In that scenario, the unpredictability becomes part of the promotion rather than a drawback.

---

## Decision: When and how to apply discounts at checkout

**Context:** The second question I had was how discounts should work during checkout. Do we automatically calculate and show eligible discounts upfront, or do we validate a discount code only after the user enters it?

**Options Considered:**

* **Option A:** Automatically calculate and display discounts during checkout.
* **Option B:** Let the user enter a discount code, validate it, and then show the updated totals.

**Choice:** User-entered code with validation first (Option B)

**Why:** The assignment specifically mentions validating discount codes before applying them. Because of that, it didn't feel right to show a discount before a code had been entered and confirmed as eligible.

**Trade-offs:** Automatically applying discounts would provide a smoother user experience. Validating first adds an extra step for the user, but it stays closer to the assignment requirements and keeps the responsibilities clearer.

**Future Considerations:** If the business later decides to surface eligible discounts automatically, the same validation logic can still be reused behind the scenes without changing how discounts are actually determined.

---

## Decision: Reuse one discount code vs generate a new one each time

**Context:** For nth-order discounts, I chose not to generate a unique code every time a customer became eligible. Instead, the admin creates a code once and the same code is reused.

**Options Considered:**

* **Option A:** Generate a new discount code for every eligible customer or qualifying order.
* **Option B:** Create the code once and reuse it, relying on validation to determine eligibility.

**Choice:** One shared code with validation (Option B)

**Why:** The code itself doesn't grant the discount. The validation does. Even if another user knows the code, the backend still checks whether the customer actually qualifies for it. Since the assignment only defines one discount condition, generating a new code every time felt like unnecessary complexity.

**Trade-offs:** Unique codes provide better tracking and isolation, but they introduce more moving parts. A shared code is simpler to manage, but it depends heavily on robust validation.

**Future Considerations:** If additional promotion types are introduced, such as referral rewards, item-based discounts, customer-specific campaigns, or one-time offers, generating unique codes per use case would make more sense. At that point, the added complexity would be justified by the flexibility it provides.

---

## Decision: How to check if the current checkout is the nth order

**Context:** When validating an nth-order discount, I needed a way to figure out whether the order being placed right now is the qualifying one. One approach is to create an order up front and track its status with something like an enum (pending, completed, etc.). The other is to look at how many orders the customer already has, add one, and treat that as the order about to be placed without creating an order entity yet.

**Options Considered:**

* **Option A:** Create an order entity early and use a status enum (e.g. pending) to represent the checkout in progress.
* **Option B:** Fetch the customer's existing order count, add one, and use that as the next order number using it in the preview checkout. Only create the order entity when checkout is confirmed.

**Choice:** Count existing orders and add one (Option B)

**Why:** It was a lot simpler to implement for this project. I didn't need a new status field, enum, or lifecycle to manage. At preview/validation time I just ask "how many orders does this customer have?" and check if the next one hits the nth-order rule.

**Trade-offs:** The pending-order approach gives you a real record of an in-progress checkout, which can help if you need to reserve a slot or handle abandoned checkouts. Counting and adding one is lighter, but it assumes the order only "exists" once checkout completes. If two requests ran at the exact same time, you could theoretically get a race on the order count, though that's unlikely in a small assignment scope.

**Future Considerations:** If checkout grew into multiple steps (payment pending, hold inventory, retry flows), creating a pending order with a status would probably make more sense. You'd want something to represent "this checkout is in flight" before it's finalized. For what we have now, the count-plus-one approach was enough.

---

## Decision: One cart per user vs a new cart every checkout

**Context:** Another question was what happens to the cart after checkout. Do we create a fresh cart each time someone checks out, or do we keep one cart per user and reuse it?

**Options Considered:**

* **Option A:** Create a new cart on every checkout. Each order gets its own cart lifecycle.
* **Option B:** One cart per customer. Reuse the same cart, clear the items after checkout, and let them build it up again.

**Choice:** One cart per customer (Option B)

**Why:** It just felt simpler and made more sense for this project. One user, one cart. After checkout I clear the items but the cart itself stays. No need to spin up a new cart entity every time.

**Trade-offs:** Creating a new cart per checkout can be useful if you want to keep a history of abandoned carts or in-progress sessions. A single reusable cart is less to manage, but you lose that per-session trail unless you add it elsewhere.

**Future Considerations:** If we needed saved carts, guest checkout, or multiple active carts (e.g. wishlist vs cart), the one-to-one model would probably need to change. For a straightforward shopping flow, reusing one cart was enough.

---

## Decision: Duplicate cart item rows vs a quantity column

**Context:** When the same product gets added to the cart more than once, do we store two separate cart item rows for the same product, or one row with a quantity that we increment?

**Options Considered:**

* **Option A:** Insert a new cart item row every time the user adds the same product. Two of the same product means two rows.
* **Option B:** One row per product per cart, with a quantity column. Adding the same product again just bumps the quantity.

**Choice:** One row per product with quantity (Option B)

**Why:** I didn't want duplicate rows for the same product sitting in the table. With quantity, fetching the cart is straightforward: one row per product, multiply price by quantity, done. No need to group or aggregate duplicate entries every time we query.

**Trade-offs:** Duplicate rows are simpler to write on add (always insert), but reads get messier because you have to collapse rows by product ID. A quantity column means a bit more logic on add/update, but the cart stays clean and totals are easy to compute.

**Future Considerations:** If cart items ever needed per-line metadata (different sizes, gift messages, bundle components), separate rows per add might make sense again. For identical products with no variants, quantity on a single row is the right fit.

---

## Decision: Admin access — authentication and UI

**Context:** Admin endpoints (stats, discount management) need protection, and admins need a way to manage the store. I had to decide how to secure those APIs and where the admin UI should live.

**Options Considered:**

* **Option A:** Full JWT-based auth with roles, login flow, and an access control layer on admin endpoints — plus a dedicated internal admin app or dashboard, deployed separately.
* **Option B:** A single shared admin token passed via a request header (`X-ADMIN-KEY`), validated on the backend and hardcoded in the frontend config — plus an `/admin` route in the existing React app that anyone can navigate to if they know the URL.

**Choice:** Shared admin token and `/admin` route in the main app (Option B)

**Why:** This is an assignment, and I wanted to keep scope manageable. A JWT system with login, token refresh, role checks, and a separate internal tool would be the right call in production, but it wasn't the focus here. One token on both sides — backend validates it in `AdminAuth`, frontend sends it on every admin request — plus a single `/admin` route in the same app was enough to show that admin functionality exists and is gated, without pulling in a whole auth stack or a second deployable.

**Trade-offs:** A shared secret and a hidden route are simple to wire up, but they're not real security. Anyone who knows the key (or finds it in the frontend bundle) can hit the admin APIs. Anyone who types `/admin` can load the admin page — only the API calls fail without the key. There's no per-user identity, no expiry, and no audit trail of who made a change. JWT + roles and a separate internal tool would give proper access control, keep admin code out of the customer bundle, and make network-level lockdown (VPN, IP allowlist) easier.

**Future Considerations:** For anything beyond a demo, I'd replace the static key with proper auth (login, issued tokens, server-side role checks) and split admin out into its own app or subdomain — ideally keeping secrets out of the client entirely. The current `AdminAuth.validate()` hook and the `/admin` route with `Admin.jsx` are reasonable starting points to migrate from.

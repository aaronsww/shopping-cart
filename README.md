# Ecommerce Assignment

A monorepo with a Spring Boot backend and a React frontend for an ecommerce store. Customers can browse products, manage a cart, and checkout with optional discount codes. Admin endpoints support discount management and store statistics.

## Project Structure

```
shopping-cart/
├── backend/           # Spring Boot API (Java 21, H2 in-memory)
├── frontend/          # React + Vite shopping cart UI
├── README.md
└── .gitignore
```

## Prerequisites

- **Backend:** Java 21+
- **Frontend:** Node.js 18+

## Quick Start

Run the backend and frontend in separate terminals.

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

The API runs at `http://localhost:8080`.

On startup, sample products are seeded automatically. Data is stored in an in-memory H2 database and resets when the server restarts.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

The frontend is configured to call the backend at `http://localhost:8080` with a demo customer ID of `1`. See `frontend/src/config/constants.js` to change these values.

## Running Tests

From the `backend` directory:

```bash
./mvnw test
```

Unit tests cover core business logic in `CartService`, `CheckoutService`, and `DiscountService`.

## Admin Authentication

Admin endpoints require the `X-ADMIN-KEY` header.

| Setting | Value        |
|---------|--------------|
| Header  | `X-ADMIN-KEY` |
| Key     | `secret123`   |

Example:

```bash
curl -H "X-ADMIN-KEY: secret123" http://localhost:8080/api/admin/stats
```

The frontend Admin page uses the same key from `frontend/src/config/constants.js`.

## API Reference

Base URL: `http://localhost:8080`

### Products

| Method | Endpoint         | Description        |
|--------|------------------|--------------------|
| GET    | `/api/products`  | List all products  |

### Cart

| Method | Endpoint                              | Description                    |
|--------|---------------------------------------|--------------------------------|
| GET    | `/api/cart/{customerId}`              | Get cart for a customer        |
| POST   | `/api/cart/add`                         | Add item to cart               |
| DELETE | `/api/cart/{customerId}/item/{productId}` | Remove one unit of a product |
| DELETE | `/api/cart/{customerId}/clear`          | Clear the cart                 |

**Add to cart** — `POST /api/cart/add`

```json
{
  "customerId": 1,
  "productId": 1,
  "quantity": 2
}
```

### Checkout

| Method | Endpoint                 | Description                          |
|--------|--------------------------|--------------------------------------|
| POST   | `/api/checkout/preview`  | Preview totals with optional discount |
| POST   | `/api/checkout/confirm`  | Place order and clear cart           |

**Checkout** — `POST /api/checkout/preview` or `POST /api/checkout/confirm`

```json
{
  "customerId": 1,
  "discountCode": "SAVE10"
}
```

Omit `discountCode` or pass `null` to checkout without a discount. When a code is provided, it is validated against active discount codes in the system.

### Admin — Discounts

All admin discount routes require the `X-ADMIN-KEY` header.

| Method | Endpoint                              | Description                          |
|--------|---------------------------------------|--------------------------------------|
| POST   | `/api/admin/discounts`                | Create a discount code               |
| GET    | `/api/admin/discounts`                | List all discount codes              |
| PUT    | `/api/admin/discounts/activate/{code}`   | Activate a discount code          |
| PUT    | `/api/admin/discounts/deactivate/{code}` | Deactivate a discount code        |

**Create discount** — `POST /api/admin/discounts`

```json
{
  "code": "SAVE10",
  "percentage": 10,
  "everyNthOrder": null
}
```

Set `everyNthOrder` (e.g. `3`) to create a loyalty discount that applies on every customer's 3rd, 6th, 9th order, etc. Leave it `null` for a manual code usable at any time.

### Admin — Stats

| Method | Endpoint            | Description                                      |
|--------|---------------------|--------------------------------------------------|
| GET    | `/api/admin/stats`  | Revenue, orders, items sold, total discounts     |

Requires the `X-ADMIN-KEY` header.

## Scripts

| Location   | Command                    | Description              |
|------------|----------------------------|--------------------------|
| `backend`  | `./mvnw spring-boot:run`   | Start backend server     |
| `backend`  | `./mvnw test`              | Run unit tests           |
| `frontend` | `npm run dev`              | Start development server |
| `frontend` | `npm run build`            | Production build         |
| `frontend` | `npm run preview`          | Preview production build |

## Frontend

The frontend is a React application built with Vite, Tailwind CSS, and React Router. It includes product browsing, cart management, checkout with discount preview, and an admin dashboard.

See [frontend/README.md](frontend/README.md) for feature details and screenshots.

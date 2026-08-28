# KFPL B2B Marketplace — Backend API Handoff

This document describes the API contract expected by the current frontend. The frontend should start with empty collections and populate Zustand stores from these endpoints. All endpoints below are examples under `/api/v1`.

## 1. Common conventions

- Authentication: `Authorization: Bearer <accessToken>`
- JSON requests and responses: `Content-Type: application/json`
- Dates: ISO 8601 UTC strings, for example `2026-08-22T10:30:00Z`
- Money: return integer minor units plus currency, or agree on decimal major units globally. The current UI displays INR/USD.
- List response:

```json
{
  "data": [],
  "meta": { "page": 1, "limit": 20, "total": 0, "hasNext": false }
}
```

- Error response:

```json
{
  "error": { "code": "VALIDATION_ERROR", "message": "Readable message", "fields": { "email": "Invalid email" } }
}
```

Recommended status codes: `200` read/update, `201` create, `204` delete, `400` validation, `401` unauthenticated, `403` forbidden, `404` missing, `409` conflict, `422` business rule failure.

## 2. Authentication and onboarding

### OTP login

`POST /auth/otp/request`

```json
{ "phone": "+919876543210", "channel": "sms" }
```

`POST /auth/otp/verify`

```json
{ "phone": "+919876543210", "otp": "123456" }
```

Response:

```json
{ "data": { "accessToken": "jwt", "refreshToken": "token", "expiresIn": 3600, "user": {} } }
```

`POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me`

`PATCH /users/me` updates onboarding/profile fields: name, email, company name, business type, GST, address, avatar, language, and active role.

### Roles and permissions

`GET /users/me/permissions`

User roles: `BUYER`, `SUPPLIER`, `BUYER_SUPPLIER`. Admin roles should be permission-based, for example `catalog.read`, `catalog.write`, `orders.update`, `payments.read`, `support.resolve`, `analytics.read`.

## 3. User, buyer, and supplier management

`GET /users?role=&status=&search=&page=&limit=`

`GET /users/:userId`

`PATCH /users/:userId/status` body: `{ "status": "ACTIVE" | "SUSPENDED" }`

`GET /buyers`, `GET /buyers/:buyerId`, `GET /buyers/:buyerId/activity`

`GET /suppliers?status=&search=`

`GET /suppliers/:supplierId`

`GET /supplier-applications?status=`

`POST /supplier-applications`

`POST /supplier-applications/:id/approve` and `POST /supplier-applications/:id/reject` with optional `{ "notes": "..." }`.

## 4. Catalog and inventory

`GET /categories`

`POST /categories` body: `{ "name": "Industrial Machinery", "icon": "Cpu", "commissionRate": 2.5, "subcategories": [] }`

`GET /categories/:id`, `PATCH /categories/:id`, `DELETE /categories/:id`

`GET /products?query=&category=&supplierId=&verifiedOnly=&gstOnly=&sort=&page=&limit=`

Product response should include: `id`, `title`, `category`, `brand`, `images`, `description`, `moq`, `unit`, `tierPricing`, `supplierId`, `supplierName`, `supplierLocation`, `supplierRating`, `isGstVerified`, `verifiedSupplier`, `specifications`, `stock`, `status`, `createdAt`.

`POST /products`, `GET /products/:id`, `PATCH /products/:id`, `DELETE /products/:id`

`GET /product-approvals?status=`

`POST /product-approvals/:id/approve`, `POST /product-approvals/:id/reject`

`GET /inventory?warehouseId=&status=&query=&page=&limit=`

`PATCH /inventory/:id/stock` body: `{ "availableStock": 120, "reason": "Physical count" }`

Inventory item fields: product, SKU, category, supplier, warehouse location, available stock, reserved stock, reorder level, unit, and status `IN_STOCK | LOW_STOCK | CRITICAL`.

## 5. Buyer RFQ and supplier quotation flow

1. Buyer creates an RFQ: `POST /rfqs`.

```json
{
  "productTitle": "CNC machine",
  "category": "Industrial Machinery",
  "quantity": 10,
  "unit": "Units",
  "targetPrice": 250000,
  "expectedDeliveryDate": "2026-09-30",
  "description": "Required specifications",
  "attachments": []
}
```

2. Buyer lists RFQs: `GET /rfqs?mine=true&status=&search=&page=&limit=`.

3. Supplier views eligible RFQs: `GET /rfqs/marketplace?category=&location=`.

4. Supplier submits quotation: `POST /rfqs/:rfqId/quotations`.

```json
{
  "unitPrice": 240000,
  "totalPrice": 2400000,
  "moq": 10,
  "estimatedDeliveryDays": 30,
  "shippingCost": 50000,
  "gstPercent": 18,
  "notes": "Warranty included",
  "validUntil": "2026-09-01"
}
```

5. Buyer compares quotes: `GET /rfqs/:rfqId/quotations`.

6. Buyer accepts a quote: `POST /quotations/:quotationId/accept`. Backend must atomically mark the selected quote `ACCEPTED`, other quotes for that RFQ `REJECTED`, and RFQ `ACCEPTED`.

7. Supplier/buyer can reject or withdraw where permitted: `POST /quotations/:id/reject`, `POST /rfqs/:id/close`.

## 6. Orders, delivery, and escrow

`POST /orders` creates an order from an accepted quotation.

```json
{ "quotationId": "quote_id", "deliveryAddress": { "line1": "...", "city": "...", "state": "...", "postalCode": "...", "country": "IN" } }
```

`GET /orders?role=buyer|supplier&status=&page=&limit=`

`GET /orders/:id`

`PATCH /orders/:id/status` body: `{ "status": "CONFIRMED|PROCESSING|SHIPPED|DELIVERED|CANCELLED", "trackingNumber": "..." }`

Order transitions should be validated server-side. When status becomes `DELIVERED`, payment/escrow may move to `PAID` only after delivery confirmation and any dispute window rules.

### Payments

`POST /payments/orders/:orderId/checkout`

`GET /payments/transactions?status=&page=&limit=`

`GET /payments/transactions/:id`

`POST /payments/transactions/:id/release-escrow`

`POST /payments/transactions/:id/refund`

`GET /payments/settlements`, `GET /payments/reconciliation/export`

Payment fields: transaction reference, order reference, gross amount, platform fee, net payout, escrow status, payout status, currency, gateway reference, and timestamps. Never trust client-calculated totals or fees.

## 7. Chat and attachments

`GET /conversations`

`POST /conversations` body: `{ "participantId": "user_id" }`

`GET /conversations/:id/messages?cursor=&limit=`

`POST /conversations/:id/messages` body: `{ "text": "...", "type": "TEXT|PRODUCT_CARD|QUOTATION_CARD|IMAGE|DOCUMENT", "payload": {} }`

`POST /uploads/presign` and `POST /conversations/:id/read`

Recommended realtime channel: WebSocket/SSE event `message.created`, `conversation.updated`, `notification.created`.

## 8. Reviews and ratings

`POST /orders/:orderId/reviews` body: `{ "rating": 1, "comment": "...", "targetType": "PRODUCT|SUPPLIER" }`

`GET /reviews?status=&rating=&productId=&supplierId=&page=&limit=`

Admin moderation:

- `POST /reviews/:id/publish`
- `POST /reviews/:id/hide`
- `POST /reviews/:id/flag`

Return review status as `PUBLISHED | FLAGGED | HIDDEN`, plus author, target, rating, comment, and dates.

## 9. Customer support and disputes

`POST /support/tickets` body: `{ "subject": "...", "category": "ORDER|PAYMENT|DELIVERY|PRODUCT|OTHER", "description": "...", "priority": "LOW|MEDIUM|HIGH", "attachments": [] }`

`GET /support/tickets?status=&priority=&assigneeId=&page=&limit=`

`GET /support/tickets/:id`

`POST /support/tickets/:id/messages`

`PATCH /support/tickets/:id/priority`

`POST /support/tickets/:id/assign`

`POST /support/tickets/:id/resolve`

Keep a ticket audit trail containing actor, old value, new value, timestamp, and note.

## 10. Notifications and broadcasts

`GET /notifications?unreadOnly=&page=&limit=`

`POST /notifications/:id/read`, `POST /notifications/read-all`

Admin broadcast:

`POST /admin/broadcasts`

```json
{
  "title": "Platform maintenance",
  "message": "Scheduled maintenance at 22:00 UTC.",
  "targetAudience": "ALL|BUYERS|SELLERS",
  "channel": "PUSH_AND_EMAIL|IN_APP_ONLY"
}
```

`GET /admin/broadcasts?audience=&page=&limit=`

Return delivery status, sent time, channels, recipient count, and failure count.

## 11. Admin analytics

`GET /admin/analytics/summary?from=&to=`


Response should include total GMV, conversion rate, average settlement days, supplier retention, order counts, and revenue change.

`GET /admin/analytics/revenue?from=&to=&groupBy=day|week|month`

`GET /admin/analytics/categories?from=&to=`

`GET /admin/analytics/top-products?from=&to=&limit=`

`GET /admin/analytics/export?from=&to=&format=csv`

Analytics must be calculated from server-side orders/payments, not frontend totals.

## 12. Frontend integration sequence

1. App boot: call `/auth/me`; if `401`, show sign-in. Do not seed local records.
2. After login: call `/users/me`, `/users/me/permissions`, and notification unread count.
3. On each screen mount: request that screen’s list endpoint with query, filters, pagination, and abort stale requests.
4. On create/update/delete: call the mutation endpoint, then update the store from the returned canonical record.
5. On status mutations: invalidate/refetch related resources. Example: accepting a quotation refreshes RFQ, quotations, orders, and notifications.
6. On `401`: refresh token once, then logout if refresh fails.
7. On `403`: show an access-denied state and do not render mutation controls.
8. On `422`: map `error.fields` to form controls.
9. Use WebSocket/SSE for chat, notifications, order status, payment status, and support updates.

## 13. Backend priorities

### Phase 1 — required for basic product flow

Auth/OTP, profile, products, categories, RFQs, quotations, orders, and file upload.

### Phase 2 — operations

Inventory, payments/escrow, supplier applications, product approvals, reviews, support tickets, and notifications.

### Phase 3 — admin intelligence

Admin permissions, settlement reconciliation, audit logs, analytics, exports, and realtime events.

## 14. Audit additions and remaining API requirements

The following flows are present in the frontend and must be included in the backend implementation.

### Supplier dashboard and leads

`GET /suppliers/me/dashboard?from=&to=`

Return `todayLeads`, `todayRevenue`, `todayOrders`, `todayVisitors`, `performanceScore`, `salesHistory`, and `topProducts`.

`GET /suppliers/me/leads?status=&search=&page=&limit=`

`GET /suppliers/me/leads/:id`

`PATCH /suppliers/me/leads/:id` for supplier lead status, notes, and follow-up date.

`GET /suppliers/me/products` and `POST/PATCH/DELETE /suppliers/me/products/:id` should enforce supplier ownership.

### Wishlist

`GET /users/me/wishlist`

`POST /users/me/wishlist/:productId`

`DELETE /users/me/wishlist/:productId`

The current frontend has wishlist toggle behavior, so the backend should persist it per user rather than keep it in browser memory.

### Global search

`GET /search?q=&types=products,buyers,orders,rfqs&limit=`

Return grouped results:

```json
{
  "data": {
    "products": [],
    "buyers": [],
    "orders": [],
    "rfqs": []
  }
}
```

### Brands and catalog attributes

`GET /brands?search=&page=&limit=`

`POST /brands`, `PATCH /brands/:id`, `DELETE /brands/:id`

`GET /catalog/attributes`, `POST /catalog/attributes`, `PATCH /catalog/attributes/:id`, `DELETE /catalog/attributes/:id`

### Admin users and permissions

`GET /admin/users?role=&status=&search=&page=&limit=`

`POST /admin/users` with name, email, role, department, and permissions.

`PATCH /admin/users/:id`, `PATCH /admin/users/:id/status`, `DELETE /admin/users/:id`

`GET /admin/roles`, `POST /admin/roles`, `PATCH /admin/roles/:id`, `DELETE /admin/roles/:id`

The Admin Users & Roles tab was removed from the visible UI, but these endpoints are still required if role administration is re-enabled later.

### Order disputes and invoices

`POST /orders/:orderId/disputes` body: `{ "reason": "...", "description": "...", "attachments": [] }`

`GET /orders/:orderId/disputes`

`POST /orders/:orderId/invoice`

`GET /orders/:orderId/invoice/download`

### Payment provider integration

`POST /payments/webhooks/:provider` must verify the provider signature and be idempotent.

`GET /payments/methods`

`POST /payments/orders/:orderId/intent`

`POST /payments/orders/:orderId/confirm`

The frontend should receive a payment intent/client secret and must never calculate or mark a payment successful by itself.

### Profile preferences and verification

`PATCH /users/me/preferences` body: `{ "language": "en-IN", "locationPermission": true, "activeRole": "BUYER" }`

`POST /users/me/avatar/presign`

`POST /users/me/kyc/submit`

`GET /users/me/kyc/status`

`POST /users/me/gst/verify`

### Notification preferences

`GET /users/me/notification-preferences`

`PATCH /users/me/notification-preferences` body should support email, SMS, push, order, RFQ, payment, and marketing preferences.

### Admin settings and audit log

`GET /admin/settings`

`PATCH /admin/settings` for currency display, platform commission, notification defaults, and operational settings.

`GET /admin/audit-log?actorId=&entityType=&from=&to=&page=&limit=`

All sensitive mutations—role changes, approvals, payment releases, refunds, stock adjustments, review moderation, and ticket resolution—should create an audit record.

### API gaps found during frontend audit

The following should be removed from the frontend before API integration:

- Dashboard fallback values such as `rfqs.length || 86` and hardcoded growth percentages.
- Onboarding default phone, OTP, company, and GST values.
- Any client-generated order identity, buyer identity, supplier identity, payment status, or delivery address fallback.
- Voice-search simulation values and any hardcoded export rows.

All values shown in dashboard cards, analytics, tables, and profile screens should come from API responses or explicit empty states.

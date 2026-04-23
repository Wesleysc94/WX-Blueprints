# Firestore Schema — WX Blueprints

Database: Firebase project `wx-blueprints` (named DB optional via `FIREBASE_DATABASE_ID`).
All server writes use Firebase Admin SDK and bypass rules. Client reads are limited to own user doc (see `firestore.rules`).

## Collections

### `users/{uid}`

One doc per Firebase Auth user. Created on first sign-in by `POST /api/auth/sync`.

| Field | Type | Notes |
|---|---|---|
| `uid` | string | Firebase Auth UID (matches doc id). |
| `email` | string | Lowercased. |
| `name` | string? | Display name, from Google profile or sign-up form. |
| `cpf` | string? | Digits only, set at checkout. |
| `phone` | string? | Digits only (BR without +55). |
| `plan` | `PlanId` | `"free" \| "premium_monthly" \| "premium_yearly" \| "founding_lifetime"`. |
| `planActivatedAt` | ISO string? | First activation timestamp. |
| `planExpiresAt` | ISO string? | Access expiration for non-lifetime plans; absent for lifetime. |
| `subscriptionStatus` | `SubscriptionStatus` | `"none" \| "pending" \| "active" \| "overdue" \| "blocked" \| "canceled" \| "expired" \| "lifetime"`. |
| `locale` | `"pt-BR" \| "en"` | Last known UI locale. |
| `billing` | `UserBilling` | Nested — see below. |
| `createdAt` | ISO string | |
| `updatedAt` | ISO string | Touched on every server write. |

#### `users/{uid}.billing` (subfield, Asaas state)

| Field | Purpose |
|---|---|
| `asaasCustomerId` | Customer id from Asaas — reused on repeat checkouts. |
| `asaasSubscriptionId` | Active subscription id (monthly/yearly). |
| `asaasSubscriptionStatus` | Raw status from Asaas. |
| `subscriptionPlan` | `PlanId` currently being billed. |
| `subscriptionValue` | Amount in BRL. |
| `nextSubscriptionDueDate` | ISO string. |
| `pendingCheckoutId` / `pendingCheckoutPlan` / `pendingCheckoutUrl` / `pendingCheckoutCreatedAt` | Checkout session in flight. |
| `lastEventId` | Most recent Asaas webhook event id applied to this user. |
| `lastPaymentId` / `lastPaymentEvent` / `lastPaymentAt` / `lastPaymentDueDate` | Last payment snapshot. |
| `lastCheckoutStatus` / `lastCheckoutPaidAt` | Checkout outcome mirror. |
| `lastActivatedPaymentId` | Payment id that most recently flipped `subscriptionStatus` to `active`/`lifetime`. |
| `lifetimePurchasedAt` | ISO string, set when founding lifetime confirms. |
| `foundingSeatNumber` | 1-based seat assigned at lifetime purchase. |

### `asaasEvents/{eventId}`

Idempotency store for webhook payloads. `eventId` is the Asaas event id.

| Field | Type |
|---|---|
| `eventId` | string |
| `event` | string — Asaas event name |
| `processedAt` | ISO string |
| `userId` | string? — resolved uid (if any) |
| `paymentId` | string? |
| `subscriptionId` | string? |
| `checkoutId` | string? |
| `raw` | object — full payload for audit |

Server writes only. Rules deny all client access.

### `asaasPayments/{paymentId}`

One doc per Asaas payment id. Mirrors latest status transitions.

| Field | Type |
|---|---|
| `paymentId` | string |
| `userId` | string |
| `subscriptionId` | string? |
| `checkoutId` | string? |
| `plan` | `PlanId` |
| `status` | string — Asaas status |
| `value` | number |
| `netValue` | number? |
| `billingType` | string? |
| `dueDate` | ISO string |
| `paidAt` | ISO string? |
| `lastEvent` | string |
| `updatedAt` | ISO string |

### `foundingSeats/singleton`

Global counter for the 100 founding lifetime seats.

| Field | Type |
|---|---|
| `totalSeats` | number — 100 |
| `seatsTaken` | number — incremented atomically when a lifetime payment activates |
| `seatsRemaining` | number — derived mirror for fast reads |
| `lastAssignedAt` | ISO string? |
| `lastAssignedUserId` | string? |

Transactional increments guarantee no seat is assigned twice. Client reads allowed (to display remaining count); writes server-only.

### `coupons/{couponId}` (future)

Reserved for promo codes. No client access yet.

## Composite indexes

None required for v1. All lookups are by doc id or single-field equality.

Add later if admin dashboards need sorted lists (e.g. `asaasPayments` by `updatedAt desc` for an admin view).

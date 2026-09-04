# Implementation Plan B — Tourist Bookings
### Branch: `feature/bookings`

Person B owns this branch entirely. Person A's branch (`feature/auth-destinations`) touches **zero** of these files, so there will be no merge conflicts.

---

## Files Owned by Person B

```
models/
  Booking.js                ← [B] You write this
  User.js                   ← [A] Do NOT touch — belongs to Person A
  Destination.js            ← [A] Do NOT touch — belongs to Person A

services/
  bookingService.js         ← [B] You write this
  authService.js            ← [A] Do NOT touch
  destinationService.js     ← [A] Do NOT touch

controllers/
  bookingController.js      ← [B] You write this
  authController.js         ← [A] Do NOT touch
  destinationController.js  ← [A] Do NOT touch

routes/
  bookingRoutes.js          ← [B] You write this
  authRoutes.js             ← [A] Do NOT touch
  destinationRoutes.js      ← [A] Do NOT touch

server.js                   ← [SHARED — already done upfront, nobody edits]
middleware/                 ← [A] Do NOT touch — auth.js and requireAdmin.js belong to Person A
.env.example                ← [SHARED — already done upfront, nobody edits]
package.json                ← [SHARED — already done upfront, nobody edits]
```

---

## Important — Dependency on Person A

Your `bookingService.js` will import `Destination` and reference `User`.
These models are written by Person A.

**To work locally without waiting for Person A:**
- Pull from `main` first (after Person A pushes their models)
- Or create minimal stub versions of `User.js` and `Destination.js` locally for testing, then delete them before merging

---

## Branch Setup

```bash
git checkout -b feature/bookings
```

Work only on this branch. When done, open a Pull Request into `main`.

---

## Step 1 — `models/Booking.js`

Mongoose schema for a tourist trip booking.

| Field                   | Type               | Rules                                                     |
|-------------------------|--------------------|-----------------------------------------------------------|
| `userId`                | ObjectId (ref User) | required — set from `req.user.id`, never from client body |
| `touristName`           | String             | required, trim                                            |
| `email`                 | String             | required, lowercase, trim                                 |
| `phone`                 | String             | required, trim                                            |
| `startDate`             | Date               | required                                                  |
| `endDate`               | Date               | required, must be after startDate (validated in controller) |
| `travelers`             | Number             | required, min: 1                                          |
| `destinationIds`        | [ObjectId] (ref Destination) | required, min 1 element                        |
| `totalDays`             | Number             | set server-side only — never accepted from client         |
| `estimatedTotalCostLKR` | Number             | set server-side only — never accepted from client         |
| `status`                | String             | enum: `["Pending","Confirmed","Cancelled"]`, default `"Pending"` |
| `notes`                 | String             | optional, default `""`                                    |
| `bookingRef`            | String             | unique, auto-generated 6-char alphanumeric (server-side)  |
| `createdAt` / `updatedAt` | Date             | auto via `{ timestamps: true }`                           |

---

## Step 2 — `services/bookingService.js`

Contains all DB queries and business logic for bookings. No `req` or `res` here.

### Cost Calculation Formula

```
totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))

estimatedTotalCostLKR = sum over each destination of:
    (destination.estimatedDailyCostLKR × totalDays × travelers)
  + (destination.entryFeeLKR × travelers)
```

Destinations are always fetched fresh from DB using the provided `destinationIds` — the client never sends price data.

### bookingRef Generation

```
Generate a random 6-character string using letters + digits (e.g. "A3F9KL")
Check if it already exists in the DB
If it does, generate again (loop until unique)
```

### Functions to implement

| Function | Does what |
|---|---|
| `createBooking(data, userId)` | Fetches destinations, calculates cost, generates bookingRef, saves Booking, returns it |
| `getMyBookings(userId)` | Finds all bookings where `userId` matches, populates `destinationIds` with `name`, `district`, `estimatedDailyCostLKR`, `entryFeeLKR` |
| `getBookingById(bookingId)` | Finds one booking, populates destinations |
| `updateBooking(bookingId, data)` | Re-fetches destinations if changed, recalculates cost, saves update |
| `cancelBooking(bookingId)` | Sets `status` to `"Cancelled"`, saves |

---

## Step 3 — `controllers/bookingController.js`

Each function: validates input → calls service → sends response.

### `createBooking` — POST /api/bookings

**Client sends:**
```json
{
  "touristName": "Nimal Perera",
  "email": "nimal@example.com",
  "phone": "0771234567",
  "startDate": "2024-12-01",
  "endDate": "2024-12-05",
  "travelers": 2,
  "destinationIds": ["<id1>", "<id2>"],
  "notes": "Vegetarian meals preferred"
}
```

**Validation checks (return 400 if fails):**
- `touristName`, `email`, `phone`, `startDate`, `endDate`, `travelers`, `destinationIds` — all required
- `destinationIds` must be an array with at least 1 element
- `endDate` must be after `startDate`
- `travelers` must be ≥ 1
- `phone` must contain digits only (use regex: `/^\d{10}$/`)
- Never accept `totalDays`, `estimatedTotalCostLKR`, `bookingRef`, `status`, or `userId` from the client body

**Server sets:** `userId = req.user.id` (from JWT middleware)

**Success:** `201` + full booking object

---

### `getMyBookings` — GET /api/bookings/mine

No body needed. Uses `req.user.id` to filter.

**Success:** `200` + array of booking objects (with destinations populated)

---

### `getBookingById` — GET /api/bookings/:id

**Ownership check:** The booking's `userId` must equal `req.user.id`, OR `req.user.role === "admin"`.

**Errors:**
- `404` if booking not found
- `403 { error: "You are not allowed to view this booking" }` if not owner and not admin

---

### `updateBooking` — PUT /api/bookings/:id

**Ownership check:** `booking.userId` must equal `req.user.id` (only owner can edit — admins cannot edit via this route)

**Status check:** Booking `status` must be `"Pending"` — return `400 { error: "Only Pending bookings can be edited" }` otherwise

**Re-validate and recalculate:** If `destinationIds`, `startDate`, `endDate`, or `travelers` are changed, recalculate `totalDays` and `estimatedTotalCostLKR` server-side.

**Errors:**
- `403 { error: "You can only edit your own bookings" }`
- `400 { error: "Only Pending bookings can be edited" }`

---

### `cancelBooking` — DELETE /api/bookings/:id (soft delete)

Does **not** delete the document. Sets `status` to `"Cancelled"` and saves.

**Ownership check:** `booking.userId` must equal `req.user.id`

**Errors:**
- `403 { error: "You can only cancel your own bookings" }`
- `400 { error: "This booking is already cancelled" }`

**Success:** `200 { message: "Booking cancelled", booking: { ...updated doc } }`

---

## Step 4 — `routes/bookingRoutes.js`

> [!IMPORTANT]
> `/mine` **must** be registered BEFORE `/:id`. If `/:id` comes first, Express treats the string `"mine"` as a MongoDB ObjectId and throws a cast error.

```
GET    /api/bookings/mine   →  verifyToken, bookingController.getMyBookings
POST   /api/bookings        →  verifyToken, bookingController.createBooking
GET    /api/bookings/:id    →  verifyToken, bookingController.getBookingById
PUT    /api/bookings/:id    →  verifyToken, bookingController.updateBooking
DELETE /api/bookings/:id    →  verifyToken, bookingController.cancelBooking
```

`verifyToken` is imported from `../middleware/auth` — written by Person A. It will be available in `main` when you pull.

---

## API Endpoints Summary

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/bookings` | 🔐 Logged-in | Create a new booking |
| GET | `/api/bookings/mine` | 🔐 Logged-in | Get all my bookings |
| GET | `/api/bookings/:id` | 🔐 Logged-in | Get one booking (owner or admin) |
| PUT | `/api/bookings/:id` | 🔐 Logged-in | Update booking (owner, Pending only) |
| DELETE | `/api/bookings/:id` | 🔐 Logged-in | Soft-cancel booking (owner only) |

---

## Validation Error Response Shape

Always return:
```json
{ "error": "human-readable message" }
```
With appropriate HTTP status: `400` (bad input), `401` (auth), `403` (forbidden), `404` (not found), `500` (server error).

Wrap every controller function in `try/catch`. Log real error to console, never send stack trace to client.

---

## Merge Instructions (when done)

1. Push your branch: `git push -u origin feature/bookings`
2. Open a Pull Request into `main`
3. Coordinate with Person A — merge both PRs together

> [!IMPORTANT]
> **Never edit `authRoutes.js`, `destinationRoutes.js`, `authController.js`, `destinationController.js`, `authService.js`, `destinationService.js`, `models/User.js`, or `models/Destination.js`** — those are Person A's files. Editing them will cause merge conflicts.

> [!WARNING]
> **Do not edit `server.js`** — it is set up upfront with all routes pre-mounted. Your `bookingRoutes.js` is already imported and mounted there. Just fill in your route file.

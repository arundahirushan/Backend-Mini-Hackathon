# Frontend Implementation Plan B — Tourist Bookings
### Branch: `Kaveesha` (Frontend Repo)

Person B owns this branch entirely. Person A's branch (`Arunda`) touches **zero** of these files, avoiding merge conflicts.

---

## Files Owned by Person B

```
client/src/
├── services/
│   ├── bookingApi.js         ← [B] You write this
│   ├── api.js                ← [A] Do NOT touch (Use this helper for fetch calls)
│   └── authApi.js            ← [A] Do NOT touch
│
└── pages/
    └── bookings/             ← [B] You own this entire folder
        ├── MyBookings.jsx    ← [B] List user's bookings
        ├── CreateBooking.jsx ← [B] Form to make a new booking
        └── EditBooking.jsx   ← [B] Form to edit a pending booking
```

> [!IMPORTANT]
> **Wait for Person A to push first.** You depend on `services/api.js` and `services/destinationApi.js` which Person A creates. Without them, `bookingApi.js` and `CreateBooking.jsx` cannot work.
> 
> `App.jsx` will also be pre-wired with your booking routes by Person A — you **do not touch it at all**.

---

## Step 1 — `client/src/services/bookingApi.js`

You will use the `api.js` helper created by Person A (which automatically attaches the auth token). 

Implement these API calls matching your backend endpoints:
1. `createBooking(data)` -> `POST /api/bookings`
2. `getMyBookings()` -> `GET /api/bookings/mine`
3. `getBookingById(id)` -> `GET /api/bookings/:id`
4. `updateBooking(id, data)` -> `PUT /api/bookings/:id`
5. `cancelBooking(id)` -> `DELETE /api/bookings/:id`

---

## Step 2 — `client/src/pages/bookings/CreateBooking.jsx`

**Route:** `/bookings/new`
- A form allowing a logged-in tourist to book a trip.
- Inputs needed: `touristName`, `email`, `phone`, `startDate`, `endDate`, `travelers`, `notes`.
- Destination Selection: Fetch all destinations using Person A's `destinationApi.js`, and allow the user to select one or more destinations (e.g., via checkboxes).
- On Submit: Call `bookingApi.createBooking()`. Handle errors (e.g., end date before start date). On success, navigate to `/bookings`.

---

## Step 3 — `client/src/pages/bookings/MyBookings.jsx`

**Route:** `/bookings`
- Call `bookingApi.getMyBookings()` on mount.
- Display a list/table of the user's bookings.
- Show booking status prominently (Pending, Confirmed, Cancelled).
- Include an "Edit" button for bookings that are "Pending" (links to `/bookings/edit/:id`).
- Include a "Cancel" button to soft-delete the booking (prompts for confirmation, then calls `bookingApi.cancelBooking()`).

---

## Step 4 — `client/src/pages/bookings/EditBooking.jsx`

**Route:** `/bookings/edit/:id`
- Fetch the booking details on mount using `bookingApi.getBookingById(id)`.
- Pre-fill the form with existing data.
- Allow changes to dates, travelers, and destinations.
- On Submit: Call `bookingApi.updateBooking()`. Navigate back to `/bookings` on success.

---

## Merge Instructions (when done)
1. Push branch `Kaveesha` to the frontend repo.
2. Open Pull Request to `main`.
3. Coordinate with Person A to merge simultaneously.

> [!IMPORTANT]  
> **Do not edit `App.jsx`, `AuthContext.jsx`, or anything outside `pages/bookings/` and `services/bookingApi.js`.** Doing so will cause merge conflicts with Person A.

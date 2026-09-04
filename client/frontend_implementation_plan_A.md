# Frontend Implementation Plan A — Architecture, Auth & Destinations
### Branch: `Arunda` (Frontend Repo)

Person A owns this branch entirely. Person B's branch (`Kaveesha`) touches **zero** of these files, avoiding merge conflicts.

---

## Architecture & Setup (Owned by Person A)

- **Framework:** React + Vite (`npm create vite@latest . -- --template react`)
- **Routing:** `react-router-dom`
- **Styling:** Plain CSS (no Tailwind, per instructions)
- **State Management:** React Context (`AuthContext` for user state)
- **API Calls:** `fetch` API

## Files Owned by Person A

```
client/src/
├── App.jsx                   ← [A] Written by Person A upfront & FINAL — no one else edits this
├── main.jsx                  ← [A] Setup React + Context
├── index.css                 ← [A] Global styles
│
├── context/
│   └── AuthContext.jsx       ← [A] Manages token, login, logout, user role
│
├── services/
│   ├── api.js                ← [A] Base fetch wrapper (adds Authorization header)
│   ├── authApi.js            ← [A] Login/Register API calls
│   ├── destinationApi.js     ← [A] Destinations CRUD API calls
│   └── bookingApi.js         ← [B] Do NOT touch
│
├── components/
│   ├── Navbar.jsx            ← [A] Top navigation (links change based on auth/role)
│   ├── ProtectedRoute.jsx    ← [A] Wrapper for logged-in only routes
│   └── AdminRoute.jsx        ← [A] Wrapper for admin-only routes
│
└── pages/
    ├── Home.jsx              ← [A] Landing page
    ├── Login.jsx             ← [A] Login form
    ├── Register.jsx          ← [A] Registration form
    ├── DestinationsList.jsx  ← [A] Public list of destinations + filters
    ├── DestinationDetail.jsx ← [A] View single destination details
    ├── AdminDashboard.jsx    ← [A] Admin table to manage destinations
    ├── DestinationForm.jsx   ← [A] Create/Edit destination (Admin)
    │
    └── bookings/             ← [B] Do NOT touch — belongs to Person B
        ├── MyBookings.jsx    
        ├── CreateBooking.jsx 
        └── EditBooking.jsx   
```

---

## Step 1 — Setup & Config
1. Initialize Vite project.
2. Install `react-router-dom`.
3. Set up `.env` with `VITE_API_URL=http://localhost:5000`.

## Step 2 — `client/src/services/api.js`
Create a helper function for `fetch` that automatically reads the JWT token from `localStorage` and adds it to the `Authorization: Bearer <token>` header for every request.

## Step 3 — `client/src/context/AuthContext.jsx`
- State: `user` (decoded JWT payload or null), `token`.
- Methods: `login(token, user)`, `logout()`.
- Use `useEffect` to initialize state from `localStorage` on load.

## Step 4 — Route Wrappers
- **`ProtectedRoute.jsx`**: If no `user`, redirect to `/login`.
- **`AdminRoute.jsx`**: If `user.role !== "admin"`, redirect to `/`.

## Step 5 — `client/src/App.jsx` (Write this FIRST & mark it FINAL)

> [!IMPORTANT]
> Write ALL routes here upfront — including Person B's booking routes — so Person B **never needs to touch this file**. This is the same strategy as `server.js` in the backend.

All routes to pre-wire:
```
/                    → Home.jsx
/login               → Login.jsx
/register            → Register.jsx
/destinations        → DestinationsList.jsx
/destinations/:id    → DestinationDetail.jsx
/admin               → AdminRoute → AdminDashboard.jsx
/admin/destinations/new    → AdminRoute → DestinationForm.jsx
/admin/destinations/:id/edit → AdminRoute → DestinationForm.jsx
/bookings            → ProtectedRoute → pages/bookings/MyBookings.jsx
/bookings/new        → ProtectedRoute → pages/bookings/CreateBooking.jsx
/bookings/edit/:id   → ProtectedRoute → pages/bookings/EditBooking.jsx
```

## Step 6 — Pages & UI
1. **Navbar**: Links to Home, Destinations. If logged in: "My Bookings" (route for Person B) & Logout. If admin: "Admin Dashboard".
2. **Auth Pages**: Forms for Register & Login. On success, call `AuthContext.login` and navigate to `/`.
3. **Destinations**:
   - Public List: Fetch from `GET /api/destinations`. Display as cards with district/category filters.
   - Admin CRUD: Table view. Forms to POST/PUT/DELETE to backend.

---

## Merge Instructions (when done)
1. Push branch `Arunda` to the frontend repo.
2. Open Pull Request to `main`.
3. Coordinate with Person B to merge simultaneously.

> [!IMPORTANT]  
> **Do not create or edit anything in the `pages/bookings/` folder or `services/bookingApi.js`.** These belong to Person B.

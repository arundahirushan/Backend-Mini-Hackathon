# 🌴 Sri Lanka Trip Planner

> A full-stack web application for discovering tourist destinations in Sri Lanka and managing personalized trip bookings with dynamic cost calculation.

---

## 📌 1. Project Title
**Sri Lanka Trip Planner** (Backend & Frontend Mini-Hackathon Project)

---

## ❓ 2. The Selected Problem
Tourism management platforms often struggle with transparent cost calculation, reliable booking workflows, and role-based operational management. Tourists face difficulties estimating overall trip costs across multiple Sri Lankan destinations (including entry fees and daily expenses), while administrative teams lack clear tools to manage destination catalogs. 

From a development perspective during a fast-paced mini-hackathon, team collaboration often suffers from merge conflicts when multiple developers work across shared files and routes simultaneously.

---

## 💡 3. The Proposed Solution
**Sri Lanka Trip Planner** offers a modular full-stack solution featuring:
- **Client-Server Architecture**: Node.js/Express REST API backend with a React (Vite) frontend.
- **Server-Side Financial Security**: Automated trip cost calculation on the server to prevent client-side price tampering.
- **Role-Based Security**: Decoupled access control dividing permissions between **Tourists** (browsing & booking) and **Admins** (destination management).
- **Conflict-Free Development Strategy**: Strict domain separation between Person A (Auth & Destinations) and Person B (Bookings) using upfront file scaffolding.

---

## ⭐ 4. Main Features

### 👤 Authentication & Access Control
- User Registration & Secure Login using **JWT** (JSON Web Tokens) and **Bcrypt** password hashing.
- Role-based permissions (**Tourist** vs **Admin**).
- Session persistence via React Context API (`AuthContext`) and local storage token management.

### 🏝️ Destination Management
- Public catalog of Sri Lankan destinations filterable by district and category.
- Comprehensive destination profiles showing daily costs (LKR), entry fees (LKR), and description.
- **Admin Dashboard**: Full CRUD (Create, Read, Update, Delete) capabilities to manage destination listings.

### 📅 Tourist Booking Engine
- Multi-destination trip booking allowing users to pick several destinations for a single itinerary.
- **Dynamic Server-Side Price Calculation**:
  $$\text{Total Cost} = \sum_{\text{destinations}} \left( (\text{Daily Cost} \times \text{Total Days} \times \text{Travelers}) + (\text{Entry Fee} \times \text{Travelers}) \right)$$
- Auto-generation of unique 6-character alphanumeric booking reference codes (e.g., `A3F9KL`).
- **Booking Management**: View personal bookings ("My Bookings"), update pending bookings, and soft-cancel existing reservations.

---

## 🛠️ 5. Technologies Used

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: `jsonwebtoken` (JWT), `bcryptjs`
- **Utilities**: `dotenv`, `cors`, `nodemon`

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM (v6)
- **State Management**: React Context API
- **Styling**: Vanilla CSS (Modern aesthetic, custom variables, responsive grid/flexbox)

---

## 🤖 6. AI Tools Used
- **Gemini 3.6 Flash**: Used for architectural planning, step-by-step implementation blueprints, API schema design, cost calculation validation, and documentation generation.

---

---

## ⚙️ 8. Installation & Execution Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)
- Git

---

### 🚀 1. Backend Setup

```bash
# 1. Navigate to the server directory
cd server

# 2. Install dependencies
npm install

# 3. Create a .env file from the template
cp .env.example .env
```

Configure your `.env` file in `server/`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/srilanka_trip_planner
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:5173
```

```bash
# 4. (Optional) Seed initial sample destinations & admin user
npm run seed

# 5. Start the development server
npm run dev
```
*The backend API will start running at `http://localhost:5000`.*

---

### 💻 2. Frontend Setup

```bash
# 1. Navigate to the client directory
cd ../client

# 2. Install dependencies
npm install

# 3. Create a .env file from the template
cp .env.example .env
```

Configure your `.env` file in `client/`:
```env
VITE_API_URL=http://localhost:5000
```

```bash
# 4. Start the frontend development server
npm run dev
```
*The React web app will start running at `http://localhost:5173`.*

---

## 📡 API Endpoints Summary

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & get JWT token |
| `GET` | `/api/destinations` | Public | Fetch list of all tourist destinations |
| `POST` | `/api/destinations` | Admin | Create a new destination entry |
| `PUT` | `/api/destinations/:id` | Admin | Update a destination entry |
| `DELETE`| `/api/destinations/:id` | Admin | Delete a destination entry |
| `POST` | `/api/bookings` | Logged-in | Create a new trip booking |
| `GET` | `/api/bookings/mine` | Logged-in | Retrieve user's booking history |
| `GET` | `/api/bookings/:id` | Owner/Admin | View detailed booking information |
| `PUT` | `/api/bookings/:id` | Owner (Pending) | Update an existing pending booking |
| `DELETE`| `/api/bookings/:id` | Owner | Soft-cancel a booking |

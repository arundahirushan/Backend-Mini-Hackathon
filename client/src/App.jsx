import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// ── Person A pages ─────────────────────────────────────────────────────────────
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DestinationsList from './pages/DestinationsList';
import DestinationDetail from './pages/DestinationDetail';
import AdminDashboard from './pages/AdminDashboard';
import DestinationForm from './pages/DestinationForm';

// ── Person B pages (do NOT edit these imports or routes) ──────────────────────
import MyBookings from './pages/bookings/MyBookings';
import CreateBooking from './pages/bookings/CreateBooking';
import EditBooking from './pages/bookings/EditBooking';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* ── Public routes ─────────────────────────────────────────────── */}
            <Route path="/"                element={<Home />} />
            <Route path="/login"           element={<Login />} />
            <Route path="/register"        element={<Register />} />
            <Route path="/destinations"    element={<DestinationsList />} />
            <Route path="/destinations/:id" element={<DestinationDetail />} />

            {/* ── Admin routes ──────────────────────────────────────────────── */}
            <Route path="/admin" element={
              <AdminRoute><AdminDashboard /></AdminRoute>
            } />
            <Route path="/admin/destinations/new" element={
              <AdminRoute><DestinationForm /></AdminRoute>
            } />
            <Route path="/admin/destinations/:id/edit" element={
              <AdminRoute><DestinationForm /></AdminRoute>
            } />

            {/* ── Person B's booking routes (pre-wired — do NOT touch) ───────── */}
            <Route path="/bookings" element={
              <ProtectedRoute><MyBookings /></ProtectedRoute>
            } />
            <Route path="/bookings/new" element={
              <ProtectedRoute><CreateBooking /></ProtectedRoute>
            } />
            <Route path="/bookings/edit/:id" element={
              <ProtectedRoute><EditBooking /></ProtectedRoute>
            } />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

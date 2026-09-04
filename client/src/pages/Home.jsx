import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon: '🏖️', title: 'Stunning Beaches',    desc: 'Explore pristine shores from Mirissa to Arugam Bay.' },
  { icon: '🐘', title: 'Wildlife Encounters', desc: 'Spot elephants, leopards, and whales up close.' },
  { icon: '🏯', title: 'Ancient Temples',     desc: 'Discover UNESCO heritage sites and sacred shrines.' },
  { icon: '🌿', title: 'Hill Country',        desc: 'Trek through emerald tea estates and misty mountains.' },
];

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="hero">
        <h1>🌴 Explore Sri Lanka</h1>
        <p>Discover paradise islands, ancient temples, and endless wildlife adventures.</p>
        <div className="hero-actions">
          <Link to="/destinations" className="btn btn-hero-primary btn">
            Browse Destinations
          </Link>
          {user ? (
            <Link to="/bookings/new" className="btn btn-hero-outline">
              Book a Trip
            </Link>
          ) : (
            <button
              onClick={() => navigate('/register')}
              className="btn-hero-outline"
            >
              Get Started
            </button>
          )}
        </div>
      </div>

      {/* ── Feature Cards ─────────────────────────────────────────────────── */}
      <h2 className="section-title">Why Sri Lanka?</h2>
      <div className="features-grid">
        {FEATURES.map(f => (
          <div key={f.title} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <h2 className="section-title">Ready to plan your trip?</h2>
        <Link to="/destinations" className="btn btn-primary btn" style={{ marginRight: '1rem' }}>
          View All Destinations
        </Link>
        {!user && (
          <Link to="/register" className="btn btn-outline btn">
            Create Free Account
          </Link>
        )}
      </div>
    </>
  );
}

export default Home;

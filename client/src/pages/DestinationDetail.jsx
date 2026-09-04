import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDestinationById } from '../services/destinationApi';
import { useAuth } from '../context/AuthContext';

function DestinationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dest, setDest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getDestinationById(id);
        setDest(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [id]);

  if (loading) return <div className="loading">Loading…</div>;
  if (error)   return <div className="alert alert-error">{error}</div>;
  if (!dest)   return null;

  return (
    <div className="dest-detail">
      <Link to="/destinations" className="back-link">← Back to Destinations</Link>

      {dest.imageUrl ? (
        <img src={dest.imageUrl} alt={dest.name} className="dest-detail-img" />
      ) : (
        <div className="dest-card-img-placeholder" style={{ height: 320, marginBottom: '1.5rem', borderRadius: 'var(--radius)' }}>
          🌿
        </div>
      )}

      <h1>{dest.name}</h1>
      <p className="dest-detail-meta">
        📍 {dest.district} &nbsp;·&nbsp;
        <span className="badge badge-green">{dest.category}</span>
        {dest.bestSeasonMonths && (
          <> &nbsp;·&nbsp; 🗓️ Best season: {dest.bestSeasonMonths}</>
        )}
      </p>

      <p className="dest-detail-desc">{dest.description}</p>

      {/* ── Stats Grid ─────────────────────────────────────────────────────── */}
      <div className="detail-grid">
        <div className="detail-stat">
          <div className="detail-stat-label">Entry Fee</div>
          <div className="detail-stat-value">
            {dest.entryFeeLKR ? `LKR ${dest.entryFeeLKR.toLocaleString()}` : 'Free'}
          </div>
        </div>
        <div className="detail-stat">
          <div className="detail-stat-label">Recommended Stay</div>
          <div className="detail-stat-value">
            {dest.recommendedDays} day{dest.recommendedDays !== 1 ? 's' : ''}
          </div>
        </div>
        <div className="detail-stat">
          <div className="detail-stat-label">Est. Daily Cost</div>
          <div className="detail-stat-value">
            {dest.estimatedDailyCostLKR
              ? `LKR ${dest.estimatedDailyCostLKR.toLocaleString()}`
              : '—'}
          </div>
        </div>
      </div>

      {/* ── Travel Tip ─────────────────────────────────────────────────────── */}
      {dest.travelTip && (
        <div className="detail-tip">
          💡 <strong>Travel Tip:</strong> {dest.travelTip}
        </div>
      )}

      {/* ── Actions ────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {user ? (
          <Link to="/bookings/new" className="btn btn-primary btn">
            Book This Destination
          </Link>
        ) : (
          <Link to="/login" className="btn btn-primary btn">
            Login to Book
          </Link>
        )}
        {user?.role === 'admin' && (
          <button
            onClick={() => navigate(`/admin/destinations/${id}/edit`)}
            className="btn btn-outline btn"
          >
            Edit Destination
          </button>
        )}
        <Link to="/destinations" className="btn btn-secondary btn">
          Back to List
        </Link>
      </div>
    </div>
  );
}

export default DestinationDetail;

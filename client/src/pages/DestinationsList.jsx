import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllDestinations } from '../services/destinationApi';

const CATEGORIES = ['Beach', 'Hill Country', 'Wildlife', 'Cultural', 'Adventure', 'Religious'];

function DestinationsList() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter state
  const [district, setDistrict] = useState('');
  const [category, setCategory] = useState('');

  // Unique districts derived from loaded data
  const [districts, setDistricts] = useState([]);

  async function fetchDestinations() {
    setLoading(true);
    setError('');
    try {
      const data = await getAllDestinations({ district: district.trim(), category });
      setDestinations(data);

      // Build district list from full fetch (only on first load)
      if (!district && !category && data.length) {
        const unique = [...new Set(data.map(d => d.district))].sort();
        setDistricts(unique);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Fetch on mount and whenever filters change
  useEffect(() => {
    fetchDestinations();
  }, [district, category]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleReset() {
    setDistrict('');
    setCategory('');
  }

  return (
    <>
      <div className="page-header">
        <h1>Destinations</h1>
        <p>Find your perfect Sri Lankan adventure.</p>
      </div>

      {/* ── Filters ───────────────────────────────────────────────────────── */}
      <div className="filter-bar">
        <div className="form-group">
          <label htmlFor="district-filter">District</label>
          <select
            id="district-filter"
            value={district}
            onChange={e => setDistrict(e.target.value)}
          >
            <option value="">All Districts</option>
            {districts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="category-filter">Category</label>
          <select
            id="category-filter"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {(district || category) && (
          <button onClick={handleReset} className="btn btn-secondary btn-sm">
            Clear Filters
          </button>
        )}
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      {loading && <div className="loading">Loading destinations…</div>}
      {error   && <div className="alert alert-error">{error}</div>}

      {!loading && !error && destinations.length === 0 && (
        <div className="empty-state">
          <p>No destinations found for the selected filters.</p>
          <button onClick={handleReset} className="btn btn-outline">Clear Filters</button>
        </div>
      )}

      {!loading && !error && destinations.length > 0 && (
        <>
          <p style={{ color: 'var(--gray-500)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {destinations.length} destination{destinations.length !== 1 ? 's' : ''} found
          </p>
          <div className="card-grid">
            {destinations.map(dest => (
              <DestinationCard key={dest._id} dest={dest} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

function DestinationCard({ dest }) {
  return (
    <div className="dest-card">
      {dest.imageUrl ? (
        <img src={dest.imageUrl} alt={dest.name} className="dest-card-img" />
      ) : (
        <div className="dest-card-img-placeholder">🌿</div>
      )}
      <div className="dest-card-body">
        <h3>{dest.name}</h3>
        <div className="dest-card-meta">
          📍 {dest.district} &nbsp;·&nbsp;
          <span className="badge badge-green">{dest.category}</span>
        </div>
        <p className="dest-card-desc">{dest.description}</p>
      </div>
      <div className="dest-card-footer">
        <Link to={`/destinations/${dest._id}`} className="btn btn-primary btn-sm btn">
          View Details
        </Link>
        <Link to="/bookings/new" className="btn btn-outline btn-sm btn">
          Book
        </Link>
      </div>
    </div>
  );
}

export default DestinationsList;

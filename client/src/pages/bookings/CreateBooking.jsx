import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../../services/bookingApi';
import { getAllDestinations } from '../../services/destinationApi';
import { AuthContext } from '../../context/AuthContext';

export default function CreateBooking() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState([]);
  const [destLoading, setDestLoading] = useState(true);

  const [form, setForm] = useState({
    touristName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    notes: '',
  });
  const [selectedDests, setSelectedDests] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getAllDestinations()
      .then(setDestinations)
      .catch(() => setDestinations([]))
      .finally(() => setDestLoading(false));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function toggleDestination(id) {
    setSelectedDests(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (selectedDests.length === 0) {
      return setError('Please select at least one destination.');
    }
    if (new Date(form.endDate) <= new Date(form.startDate)) {
      return setError('End date must be after start date.');
    }
    if (Number(form.travelers) < 1) {
      return setError('Travelers must be at least 1.');
    }
    if (!/^\d{10}$/.test(form.phone)) {
      return setError('Phone number must be exactly 10 digits.');
    }

    setSubmitting(true);
    try {
      await createBooking({
        ...form,
        travelers: Number(form.travelers),
        destinationIds: selectedDests,
      });
      navigate('/bookings');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <a href="/bookings" className="back-link" onClick={e => { e.preventDefault(); navigate('/bookings'); }}>
        ← Back to My Bookings
      </a>

      <div className="form-card-wide">
        <h2>📅 Create New Booking</h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Personal Info */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="touristName">Full Name</label>
              <input
                id="touristName"
                name="touristName"
                type="text"
                value={form.touristName}
                onChange={handleChange}
                placeholder="Nimal Perera"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="nimal@example.com"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone (10 digits)</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="0771234567"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="travelers">Number of Travelers</label>
              <input
                id="travelers"
                name="travelers"
                type="number"
                min="1"
                value={form.travelers}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Dates */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Destination Selection */}
          <div className="form-group">
            <label>Select Destinations</label>
            {destLoading ? (
              <p style={{ color: '#9e9e9e', fontSize: '0.9rem' }}>Loading destinations…</p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '0.6rem',
                marginTop: '0.4rem',
                maxHeight: '260px',
                overflowY: 'auto',
                border: '1.5px solid #e0e0e0',
                borderRadius: '8px',
                padding: '0.8rem',
                background: '#fafafa',
              }}>
                {destinations.map(dest => (
                  <label
                    key={dest._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      padding: '0.5rem 0.6rem',
                      borderRadius: '6px',
                      background: selectedDests.includes(dest._id) ? '#e8f5ee' : 'white',
                      border: selectedDests.includes(dest._id) ? '1.5px solid #2e8b57' : '1.5px solid #e0e0e0',
                      transition: 'all 0.15s',
                      fontSize: '0.88rem',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedDests.includes(dest._id)}
                      onChange={() => toggleDestination(dest._id)}
                      style={{ accentColor: '#1a6b3a' }}
                    />
                    <span>
                      <strong style={{ display: 'block', fontSize: '0.88rem' }}>{dest.name}</strong>
                      <small style={{ color: '#9e9e9e' }}>{dest.district} · Rs. {dest.estimatedDailyCostLKR?.toLocaleString()}/day</small>
                    </span>
                  </label>
                ))}
              </div>
            )}
            {selectedDests.length > 0 && (
              <p style={{ fontSize: '0.82rem', color: '#2e8b57', marginTop: '0.4rem' }}>
                ✓ {selectedDests.length} destination{selectedDests.length > 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="form-group">
            <label htmlFor="notes">Notes (optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Any special requests or preferences…"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/bookings')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Creating Booking…' : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

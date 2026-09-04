import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyBookings, cancelBooking } from '../../services/bookingApi';

// Status badge styles
const statusStyle = {
  Pending:   { background: '#fff8e1', color: '#f57f17', border: '1px solid #ffe082' },
  Confirmed: { background: '#e8f5ee', color: '#1a6b3a', border: '1px solid #b2dfdb' },
  Cancelled: { background: '#fdecea', color: '#c62828', border: '1px solid #f5c6cb' },
};

function StatusBadge({ status }) {
  const style = statusStyle[status] || {};
  return (
    <span style={{
      ...style,
      display: 'inline-block',
      padding: '0.18rem 0.65rem',
      borderRadius: '99px',
      fontSize: '0.78rem',
      fontWeight: 700,
      letterSpacing: '0.03em',
    }}>
      {status}
    </span>
  );
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(bookingId, bookingRef) {
    if (!window.confirm(`Are you sure you want to cancel booking #${bookingRef}? This cannot be undone.`)) return;
    setCancellingId(bookingId);
    try {
      await cancelBooking(bookingId);
      // Update status locally — no need to re-fetch
      setBookings(prev =>
        prev.map(b => b._id === bookingId ? { ...b, status: 'Cancelled' } : b)
      );
    } catch (err) {
      alert(`Failed to cancel booking: ${err.message}`);
    } finally {
      setCancellingId(null);
    }
  }

  if (loading) return <div className="loading">Loading your bookings…</div>;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>My Bookings</h1>
          <p>Manage your Sri Lanka trip bookings</p>
        </div>
        <Link to="/bookings/new" className="btn btn-primary">+ New Booking</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {bookings.length === 0 && !error ? (
        <div className="empty-state">
          <p>You have no bookings yet.</p>
          <Link to="/bookings/new" className="btn btn-primary">Create your first booking</Link>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Ref</th>
                <th>Destinations</th>
                <th>Dates</th>
                <th>Travelers</th>
                <th>Total Cost (LKR)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id}>
                  <td><strong>{b.bookingRef}</strong></td>
                  <td>
                    {b.destinationIds?.length > 0
                      ? b.destinationIds.map(d => d.name || d).join(', ')
                      : '—'}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {new Date(b.startDate).toLocaleDateString()} →{' '}
                    {new Date(b.endDate).toLocaleDateString()}
                    <br />
                    <small style={{ color: '#9e9e9e' }}>{b.totalDays} day{b.totalDays !== 1 ? 's' : ''}</small>
                  </td>
                  <td>{b.travelers}</td>
                  <td>Rs. {b.estimatedTotalCostLKR?.toLocaleString()}</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td>
                    <div className="td-actions">
                      {b.status === 'Pending' && (
                        <>
                          <Link
                            to={`/bookings/edit/${b._id}`}
                            className="btn btn-outline btn-sm"
                          >
                            Edit
                          </Link>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleCancel(b._id, b.bookingRef)}
                            disabled={cancellingId === b._id}
                          >
                            {cancellingId === b._id ? 'Cancelling…' : 'Cancel'}
                          </button>
                        </>
                      )}
                      {b.status !== 'Pending' && (
                        <span style={{ color: '#9e9e9e', fontSize: '0.85rem' }}>—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

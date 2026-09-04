import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllDestinations, deleteDestination } from '../services/destinationApi';

function AdminDashboard() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  async function loadDestinations() {
    setLoading(true);
    setError('');
    try {
      const data = await getAllDestinations();
      setDestinations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadDestinations(); }, []);

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await deleteDestination(id);
      setDestinations(prev => prev.filter(d => d._id !== id));
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage all destinations.</p>
        </div>
        <Link to="/admin/destinations/new" className="btn btn-primary btn">
          + Add Destination
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Loading destinations…</div>
      ) : destinations.length === 0 ? (
        <div className="empty-state">
          <p>No destinations yet.</p>
          <Link to="/admin/destinations/new" className="btn btn-primary btn">Add First Destination</Link>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>District</th>
                <th>Category</th>
                <th>Entry Fee (LKR)</th>
                <th>Rec. Days</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {destinations.map(dest => (
                <tr key={dest._id}>
                  <td><strong>{dest.name}</strong></td>
                  <td>{dest.district}</td>
                  <td><span className="badge badge-green">{dest.category}</span></td>
                  <td>{dest.entryFeeLKR ? dest.entryFeeLKR.toLocaleString() : '—'}</td>
                  <td>{dest.recommendedDays}</td>
                  <td>
                    <div className="td-actions">
                      <button
                        onClick={() => navigate(`/destinations/${dest._id}`)}
                        className="btn btn-secondary btn-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/admin/destinations/${dest._id}/edit`)}
                        className="btn btn-outline btn-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(dest._id, dest.name)}
                        className="btn btn-danger btn-sm"
                        disabled={deletingId === dest._id}
                      >
                        {deletingId === dest._id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default AdminDashboard;

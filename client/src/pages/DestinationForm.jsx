import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getDestinationById,
  createDestination,
  updateDestination,
} from '../services/destinationApi';

const CATEGORIES = ['Beach', 'Hill Country', 'Wildlife', 'Cultural', 'Adventure', 'Religious'];

const EMPTY_FORM = {
  name: '',
  district: '',
  category: '',
  description: '',
  imageUrl: '',
  entryFeeLKR: '',
  recommendedDays: '',
  bestSeasonMonths: '',
  travelTip: '',
  estimatedDailyCostLKR: '',
};

function DestinationForm() {
  const { id } = useParams();           // present on edit, absent on create
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit); // load existing data if editing
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Load existing destination when editing
  useEffect(() => {
    if (!isEdit) return;
    async function load() {
      try {
        const data = await getDestinationById(id);
        setForm({
          name:                   data.name                   || '',
          district:               data.district               || '',
          category:               data.category               || '',
          description:            data.description            || '',
          imageUrl:               data.imageUrl               || '',
          entryFeeLKR:            data.entryFeeLKR            ?? '',
          recommendedDays:        data.recommendedDays        ?? '',
          bestSeasonMonths:       data.bestSeasonMonths       || '',
          travelTip:              data.travelTip              || '',
          estimatedDailyCostLKR:  data.estimatedDailyCostLKR  ?? '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isEdit]);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);

    // Build payload — convert numeric fields, omit empty optionals
    const payload = {
      name:        form.name.trim(),
      district:    form.district.trim(),
      category:    form.category,
      description: form.description.trim(),
    };
    if (form.imageUrl.trim())               payload.imageUrl               = form.imageUrl.trim();
    if (form.entryFeeLKR !== '')            payload.entryFeeLKR            = Number(form.entryFeeLKR);
    if (form.recommendedDays !== '')        payload.recommendedDays        = Number(form.recommendedDays);
    if (form.bestSeasonMonths.trim())       payload.bestSeasonMonths       = form.bestSeasonMonths.trim();
    if (form.travelTip.trim())              payload.travelTip              = form.travelTip.trim();
    if (form.estimatedDailyCostLKR !== '') payload.estimatedDailyCostLKR  = Number(form.estimatedDailyCostLKR);

    try {
      if (isEdit) {
        await updateDestination(id, payload);
      } else {
        await createDestination(payload);
      }
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="loading">Loading destination…</div>;

  return (
    <div className="form-card-wide">
      <Link to="/admin" className="back-link">← Back to Dashboard</Link>
      <h2>{isEdit ? 'Edit Destination' : 'Add New Destination'}</h2>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* ── Required Fields ──────────────────────────────────────────────── */}
        <div className="form-group">
          <label>Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Sigiriya Rock Fortress"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>District *</label>
            <input
              name="district"
              value={form.district}
              onChange={handleChange}
              placeholder="e.g. Matale"
              required
            />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={form.category} onChange={handleChange} required>
              <option value="">Select category</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe this destination…"
            required
          />
        </div>

        {/* ── Optional Fields ──────────────────────────────────────────────── */}
        <div className="form-group">
          <label>Image URL <span style={{ color: 'var(--gray-500)', fontWeight: 400 }}>(optional)</span></label>
          <input
            name="imageUrl"
            type="url"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://…"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Entry Fee (LKR)</label>
            <input
              name="entryFeeLKR"
              type="number"
              min="0"
              value={form.entryFeeLKR}
              onChange={handleChange}
              placeholder="0"
            />
          </div>
          <div className="form-group">
            <label>Recommended Days</label>
            <input
              name="recommendedDays"
              type="number"
              min="1"
              value={form.recommendedDays}
              onChange={handleChange}
              placeholder="1"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Est. Daily Cost (LKR)</label>
            <input
              name="estimatedDailyCostLKR"
              type="number"
              min="0"
              value={form.estimatedDailyCostLKR}
              onChange={handleChange}
              placeholder="0"
            />
          </div>
          <div className="form-group">
            <label>Best Season Months</label>
            <input
              name="bestSeasonMonths"
              value={form.bestSeasonMonths}
              onChange={handleChange}
              placeholder="e.g. December – April"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Travel Tip</label>
          <textarea
            name="travelTip"
            value={form.travelTip}
            onChange={handleChange}
            placeholder="Useful tip for travellers…"
          />
        </div>

        {/* ── Actions ──────────────────────────────────────────────────────── */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Destination'}
          </button>
          <Link to="/admin" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default DestinationForm;

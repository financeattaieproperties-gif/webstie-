import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, type PropertyInput } from '../api';
import ImageUpload from '../components/ImageUpload';

const S = {
  title:    { fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' } as const,
  card:     { background: '#fff', borderRadius: 12, padding: '2rem', boxShadow: '0 1px 4px rgba(0,0,0,.08)', maxWidth: 700 } as const,
  grid:     { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' } as const,
  full:     { gridColumn: '1 / -1' } as const,
  label:    { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' } as const,
  input:    { width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.9rem' } as const,
  select:   { width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.9rem' } as const,
  textarea: { width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.9rem', minHeight: 100, resize: 'vertical' as const } as const,
  row:      { display: 'flex', gap: '1rem', marginTop: '1.5rem' } as const,
  save:     { padding: '0.7rem 1.5rem', background: '#b8960c', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' } as const,
  cancel:   { padding: '0.7rem 1.5rem', background: '#e2e8f0', color: '#334155', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' } as const,
};

const blank: PropertyInput = {
  title: '', price: 0, location: '', beds: null, baths: null,
  area: null, floor: null, status: 'available', type: 'Villa',
  listing_type: 'sale', image_url: null, description: null,
};

export default function PropertyForm() {
  const { id }    = useParams<{ id: string }>();
  const navigate  = useNavigate();
  const isEdit    = Boolean(id);
  const [form, setForm]       = useState<PropertyInput>(blank);
  const [busy, setBusy]       = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    api.getProperties().then(list => {
      const found = list.find(p => p.id === Number(id));
      if (found) {
        const { id: _id, created_at: _ca, ...rest } = found;
        setForm(rest);
      }
    }).finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = (k: keyof PropertyInput, v: unknown) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (isEdit) await api.updateProperty({ ...form, id: Number(id) });
      else await api.createProperty(form);
      navigate('/properties');
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h1 style={S.title}>{isEdit ? 'Edit Property' : 'New Property'}</h1>
      <div style={S.card}>
        <form onSubmit={submit}>
          <div style={S.grid}>
            <div style={S.full}>
              <label style={S.label}>Title *</label>
              <input style={S.input} value={form.title} onChange={e => set('title', e.target.value)} required />
            </div>
            <div>
              <label style={S.label}>Price *</label>
              <input style={S.input} type="number" value={form.price} onChange={e => set('price', Number(e.target.value))} required />
            </div>
            <div>
              <label style={S.label}>Listing Type</label>
              <select style={S.select} value={form.listing_type} onChange={e => set('listing_type', e.target.value)}>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <div style={S.full}>
              <label style={S.label}>Location *</label>
              <input style={S.input} value={form.location} onChange={e => set('location', e.target.value)} required />
            </div>
            <div>
              <label style={S.label}>Property Type</label>
              <select style={S.select} value={form.type} onChange={e => set('type', e.target.value as PropertyInput['type'])}>
                {(['Villa', 'Apartment', 'House', 'Commercial'] as const).map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={S.label}>Status</label>
              <select style={S.select} value={form.status} onChange={e => set('status', e.target.value as PropertyInput['status'])}>
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
              </select>
            </div>
            <div>
              <label style={S.label}>Beds</label>
              <input style={S.input} type="number" value={form.beds ?? ''} onChange={e => set('beds', e.target.value ? Number(e.target.value) : null)} />
            </div>
            <div>
              <label style={S.label}>Baths</label>
              <input style={S.input} type="number" value={form.baths ?? ''} onChange={e => set('baths', e.target.value ? Number(e.target.value) : null)} />
            </div>
            <div>
              <label style={S.label}>Area (m²)</label>
              <input style={S.input} type="number" value={form.area ?? ''} onChange={e => set('area', e.target.value ? Number(e.target.value) : null)} />
            </div>
            <div>
              <label style={S.label}>Floor</label>
              <input style={S.input} type="number" value={form.floor ?? ''} onChange={e => set('floor', e.target.value ? Number(e.target.value) : null)} />
            </div>
            <div style={S.full}>
              <label style={S.label}>Description</label>
              <textarea style={S.textarea} value={form.description ?? ''} onChange={e => set('description', e.target.value || null)} />
            </div>
            <div style={S.full}>
              <ImageUpload value={form.image_url} onChange={url => set('image_url', url)} />
            </div>
          </div>
          <div style={S.row}>
            <button type="submit" style={S.save} disabled={busy}>{busy ? 'Saving…' : 'Save Property'}</button>
            <button type="button" style={S.cancel} onClick={() => navigate('/properties')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, type ProjectInput } from '../api';
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

const blank: ProjectInput = {
  name: '', location: '', delivery_date: null,
  status: 'Under Construction', available_units: 0,
  total_units: 0, image_url: null, description: null,
};

export default function ProjectForm() {
  const { id }    = useParams<{ id: string }>();
  const navigate  = useNavigate();
  const isEdit    = Boolean(id);
  const [form, setForm]       = useState<ProjectInput>(blank);
  const [busy, setBusy]       = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    api.getProjects().then(list => {
      const found = list.find(p => p.id === Number(id));
      if (found) {
        const { id: _id, created_at: _ca, ...rest } = found;
        setForm(rest);
      }
    }).finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = (k: keyof ProjectInput, v: unknown) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (isEdit) await api.updateProject({ ...form, id: Number(id) });
      else await api.createProject(form);
      navigate('/projects');
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h1 style={S.title}>{isEdit ? 'Edit Project' : 'New Project'}</h1>
      <div style={S.card}>
        <form onSubmit={submit}>
          <div style={S.grid}>
            <div style={S.full}>
              <label style={S.label}>Project Name *</label>
              <input style={S.input} value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div style={S.full}>
              <label style={S.label}>Location *</label>
              <input style={S.input} value={form.location} onChange={e => set('location', e.target.value)} required />
            </div>
            <div>
              <label style={S.label}>Status</label>
              <select style={S.select} value={form.status} onChange={e => set('status', e.target.value as ProjectInput['status'])}>
                <option>Under Construction</option>
                <option>Ready</option>
                <option>Sold Out</option>
              </select>
            </div>
            <div>
              <label style={S.label}>Delivery Date (e.g. Q2 2027)</label>
              <input style={S.input} value={form.delivery_date ?? ''} onChange={e => set('delivery_date', e.target.value || null)} />
            </div>
            <div>
              <label style={S.label}>Available Units</label>
              <input style={S.input} type="number" value={form.available_units} onChange={e => set('available_units', Number(e.target.value))} />
            </div>
            <div>
              <label style={S.label}>Total Units</label>
              <input style={S.input} type="number" value={form.total_units} onChange={e => set('total_units', Number(e.target.value))} />
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
            <button type="submit" style={S.save} disabled={busy}>{busy ? 'Saving…' : 'Save Project'}</button>
            <button type="button" style={S.cancel} onClick={() => navigate('/projects')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

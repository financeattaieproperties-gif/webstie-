import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, type ProjectInput } from '../api';
import ImageUpload from '../components/ImageUpload';

const S = {
  page:     { maxWidth: 760 } as const,
  topBar:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' } as const,
  title:    { fontSize: '1.5rem', fontWeight: 700, margin: 0 } as const,
  card:     { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,.08)', overflow: 'hidden' } as const,
  section:  { padding: '1.5rem 2rem' } as const,
  divider:  { borderTop: '1px solid #f1f5f9' } as const,
  secTitle: { fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: '1rem' } as const,
  grid:     { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' } as const,
  full:     { gridColumn: '1 / -1' } as const,
  label:    { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' } as const,
  input:    { width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' as const } as const,
  select:   { width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.9rem', outline: 'none', background: '#fff', boxSizing: 'border-box' as const } as const,
  textarea: { width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.9rem', minHeight: 120, resize: 'vertical' as const, outline: 'none', boxSizing: 'border-box' as const } as const,
  footer:   { padding: '1.25rem 2rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '0.75rem', alignItems: 'center' } as const,
  save:     { padding: '0.7rem 1.8rem', background: '#b8960c', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' } as const,
  cancel:   { padding: '0.7rem 1.4rem', background: '#e2e8f0', color: '#334155', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' } as const,
  toast:    (ok: boolean): React.CSSProperties => ({
    padding: '0.65rem 1rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600,
    background: ok ? '#d1fae5' : '#fee2e2',
    color:      ok ? '#065f46' : '#dc2626',
  }),
};

const blank: ProjectInput = {
  name: '', location: '', delivery_date: null,
  status: 'Under Construction', available_units: 0,
  total_units: 0, image_url: null, description: null,
};

export default function ProjectForm() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit   = Boolean(id);

  const [form, setForm]       = useState<ProjectInput>(blank);
  const [busy, setBusy]       = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [toast, setToast]     = useState<{ ok: boolean; msg: string } | null>(null);

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

  const showToast = (ok: boolean, msg: string) => {
    setToast({ ok, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (isEdit) await api.updateProject({ ...form, id: Number(id) });
      else await api.createProject(form);
      const msg = isEdit ? 'Project updated.' : 'Project created.';
      showToast(true, msg);
      window.electronAPI?.notify('Attaie Admin', msg).catch(() => {});
      if (!isEdit) setTimeout(() => navigate('/projects'), 1200);
    } catch (err) {
      showToast(false, (err as Error).message || 'Save failed.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>Loading…</p>;

  return (
    <div style={S.page}>
      <div style={S.topBar}>
        <h1 style={S.title}>{isEdit ? 'Edit Project' : 'New Project'}</h1>
        <button type="button" style={{ ...S.cancel, padding: '0.5rem 1rem' }} onClick={() => navigate('/projects')}>
          ← Back to list
        </button>
      </div>

      <form onSubmit={submit}>
        <div style={S.card}>

          {/* Cover image — first for visual prominence */}
          <div style={S.section}>
            <p style={S.secTitle}>Cover Image</p>
            <ImageUpload
              value={form.image_url}
              onChange={url => set('image_url', url)}
            />
          </div>

          {/* Core details */}
          <div style={{ ...S.section, ...S.divider }}>
            <p style={S.secTitle}>Core Details</p>
            <div style={S.grid}>
              <div style={S.full}>
                <label style={S.label}>Project Name *</label>
                <input style={S.input} value={form.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. Aria Residences" />
              </div>
              <div style={S.full}>
                <label style={S.label}>Location *</label>
                <input style={S.input} value={form.location} onChange={e => set('location', e.target.value)} required placeholder="e.g. Macroyan, Kabul" />
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
                <label style={S.label}>Delivery Date</label>
                <input style={S.input} value={form.delivery_date ?? ''} onChange={e => set('delivery_date', e.target.value || null)} placeholder="e.g. Q2 2027" />
              </div>
            </div>
          </div>

          {/* Units */}
          <div style={{ ...S.section, ...S.divider }}>
            <p style={S.secTitle}>Unit Count</p>
            <div style={S.grid}>
              <div>
                <label style={S.label}>Available Units</label>
                <input style={S.input} type="number" min={0} value={form.available_units} onChange={e => set('available_units', Number(e.target.value))} />
              </div>
              <div>
                <label style={S.label}>Total Units</label>
                <input style={S.input} type="number" min={0} value={form.total_units} onChange={e => set('total_units', Number(e.target.value))} />
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ ...S.section, ...S.divider }}>
            <p style={S.secTitle}>Description</p>
            <textarea
              style={S.textarea}
              value={form.description ?? ''}
              onChange={e => set('description', e.target.value || null)}
              placeholder="Describe the project, highlights, amenities, location advantages…"
            />
          </div>

          {/* Footer */}
          <div style={S.footer}>
            <button type="submit" style={S.save} disabled={busy}>
              {busy ? 'Saving…' : isEdit ? '✓ Save Changes' : '+ Create Project'}
            </button>
            <button type="button" style={S.cancel} onClick={() => navigate('/projects')}>
              Cancel
            </button>
            {toast && <span style={S.toast(toast.ok)}>{toast.msg}</span>}
          </div>

        </div>
      </form>
    </div>
  );
}

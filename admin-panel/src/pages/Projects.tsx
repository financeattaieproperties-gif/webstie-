import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, type Project } from '../api';

const S = {
  header:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' } as const,
  title:   { fontSize: '1.5rem', fontWeight: 700 } as const,
  btn:     { padding: '0.6rem 1.2rem', background: '#b8960c', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' } as const,
  table:   { width: '100%', borderCollapse: 'collapse' as const, background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.08)' },
  th:      { padding: '0.75rem 1rem', background: '#f8fafc', textAlign: 'left' as const, fontSize: '0.8rem', fontWeight: 700, color: '#64748b', borderBottom: '1px solid #e2e8f0' },
  td:      { padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' },
  actions: { display: 'flex', gap: '0.5rem' } as const,
  editBtn: { padding: '0.3rem 0.8rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem' } as const,
  delBtn:  { padding: '0.3rem 0.8rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem' } as const,
};

export default function Projects() {
  const navigate = useNavigate();
  const [items, setItems]     = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProjects().then(setItems).finally(() => setLoading(false));
  }, []);

  const remove = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await api.deleteProject(id);
    setItems(prev => prev.filter(p => p.id !== id));
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <div style={S.header}>
        <h1 style={S.title}>Projects ({items.length})</h1>
        <button style={S.btn} onClick={() => navigate('/projects/new')}>+ Add Project</button>
      </div>
      <table style={S.table}>
        <thead>
          <tr>{['Name', 'Location', 'Status', 'Units', 'Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {items.map(p => (
            <tr key={p.id}>
              <td style={S.td}>{p.name}</td>
              <td style={S.td}>{p.location}</td>
              <td style={S.td}>{p.status}</td>
              <td style={S.td}>{p.available_units} / {p.total_units}</td>
              <td style={S.td}>
                <div style={S.actions}>
                  <button style={S.editBtn} onClick={() => navigate(`/projects/${p.id}/edit`)}>Edit</button>
                  <button style={S.delBtn}  onClick={() => remove(p.id, p.name)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={5} style={{ ...S.td, textAlign: 'center', color: '#94a3b8' }}>No projects yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

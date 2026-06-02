import { type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const S = {
  shell:     { display: 'flex', minHeight: '100vh' } as const,
  sidebar:   { width: 220, background: '#0f172a', color: '#fff', display: 'flex', flexDirection: 'column' as const, padding: '1.5rem 0' },
  logo:      { padding: '0 1.5rem 2rem', fontWeight: 800, fontSize: '1.1rem', color: '#f0c040', letterSpacing: 1 },
  link:      { display: 'block', padding: '0.7rem 1.5rem', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600, transition: 'background .15s' },
  active:    { background: '#1e293b', color: '#f0c040' },
  main:      { flex: 1, padding: '2rem', overflowY: 'auto' as const },
  logoutWrap: { marginTop: 'auto', padding: '0 1.5rem' } as const,
  logoutBtn: { width: '100%', padding: '0.6rem', background: '#dc2626', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' } as const,
};

const navItems = [
  { to: '/properties', label: 'Properties' },
  { to: '/projects',   label: 'Projects'   },
  { to: '/leads',      label: 'Leads'      },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const navigate   = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div style={S.shell}>
      <nav style={S.sidebar}>
        <div style={S.logo}>ATTAIE ADMIN</div>
        {navItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({ ...S.link, ...(isActive ? S.active : {}) })}
          >
            {label}
          </NavLink>
        ))}
        <div style={S.logoutWrap}>
          <button style={S.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <main style={S.main}>{children}</main>
    </div>
  );
}

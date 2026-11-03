import { type ReactNode, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const S = {
  shell:      { display: 'flex', flex: 1, overflow: 'hidden' } as const,
  sidebar:    {
    width: 220, background: '#ffffff', color: '#1A2335',
    display: 'flex', flexDirection: 'column' as const,
    borderRight: '1px solid #E5E7EB', flexShrink: 0, overflowY: 'auto' as const,
  } as const,
  logoWrap:   { padding: '1.25rem 1.5rem 1rem', borderBottom: '1px solid #F3F4F6' } as const,
  logo:       { fontWeight: 800, fontSize: '1rem', color: '#1A2335', letterSpacing: 0.5, display: 'block' } as const,
  logoGold:   { color: '#B8944A' } as const,
  navSection: { padding: '0.75rem 0' } as const,
  navLabel:   { padding: '0.4rem 1.5rem', fontSize: '0.65rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' as const, letterSpacing: 1.2 } as const,
  link:       { display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1.5rem', color: '#6B7280', fontSize: '0.875rem', fontWeight: 600, transition: 'all .15s', borderLeft: '3px solid transparent', textDecoration: 'none' } as const,
  active:     { background: '#FFF8EE', color: '#B8944A', borderLeft: '3px solid #B8944A' } as const,
  main:       { flex: 1, padding: '2rem', overflowY: 'auto' as const, minWidth: 0 } as const,
  footer:     { marginTop: 'auto', borderTop: '1px solid #F3F4F6', padding: '1rem 1.5rem' } as const,
  footerText: { fontSize: '0.72rem', color: '#9CA3AF' } as const,
  logoutBtn:  { width: '100%', padding: '0.55rem', background: 'transparent', border: '1.5px solid #FCA5A5', borderRadius: 8, color: '#DC2626', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem', marginTop: '0.5rem', transition: 'all .15s' } as const,
  topBar:     { display: 'flex', alignItems: 'center', padding: '0.75rem 1rem', background: '#ffffff', borderBottom: '1px solid #E5E7EB', gap: '1rem', flexShrink: 0 } as const,
  hamburger:  { background: 'none', border: 'none', color: '#B8944A', cursor: 'pointer', fontSize: '1.3rem', lineHeight: 1, padding: '0.2rem' } as const,
  overlay:    { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 40 } as const,
  mobileSidebar: {
    position: 'fixed' as const, top: 0, left: 0, bottom: 0, width: 240, zIndex: 50,
    background: '#ffffff', color: '#1A2335', display: 'flex', flexDirection: 'column' as const,
    boxShadow: '4px 0 24px rgba(0,0,0,0.1)', overflowY: 'auto' as const,
  } as const,
};

const navItems = [
  { to: '/properties', label: 'Properties', icon: '🏠' },
  { to: '/projects',   label: 'Projects',   icon: '🏗' },
  { to: '/leads',      label: 'Leads',      icon: '📋' },
  { to: '/visits',     label: 'Visits',     icon: '📅' },
  { to: '/agents',     label: 'Agents & Employees', icon: '👥' },
  { to: '/branches',   label: 'Branches',   icon: '📍' },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const navigate   = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [menuOpen, setMenuOpen] = useState(false);
  const [version, setVersion]   = useState('');

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    window.electronAPI?.getVersion().then(setVersion).catch(() => {});
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const SidebarContent = ({ onNav }: { onNav?: () => void }) => (
    <>
      <div style={S.logoWrap}>
        <span style={S.logo}>ATTAIE <span style={S.logoGold}>ADMIN</span></span>
      </div>

      <div style={S.navSection}>
        <div style={S.navLabel}>Management</div>
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({ ...S.link, ...(isActive ? S.active : {}) })}
            onClick={onNav}
          >
            <span>{icon}</span> {label}
          </NavLink>
        ))}
      </div>

      <div style={{ padding: '0 0 0.25rem' }}>
        <div style={S.navLabel}>System</div>
        <NavLink
          to="/seo"
          style={({ isActive }) => ({ ...S.link, ...(isActive ? S.active : {}) })}
          onClick={onNav}
        >
          <span>🔍</span> SEO & Metadata
        </NavLink>
        <NavLink
          to="/settings"
          style={({ isActive }) => ({ ...S.link, ...(isActive ? S.active : {}) })}
          onClick={onNav}
        >
          <span>⚙</span> Settings
        </NavLink>
      </div>

      <div style={S.footer}>
        {version && <p style={S.footerText}>v{version}</p>}
        <p style={S.footerText}>Attaie Properties</p>
        <button style={S.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={S.topBar}>
          <button style={S.hamburger} onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            {menuOpen ? '✕' : '☰'}
          </button>
          <span style={{ ...S.logo, fontSize: '0.95rem' }}>
            ATTAIE <span style={S.logoGold}>ADMIN</span>
          </span>
        </div>

        {menuOpen && (
          <>
            <div style={S.overlay} onClick={() => setMenuOpen(false)} />
            <nav style={S.mobileSidebar}>
              <SidebarContent onNav={() => setMenuOpen(false)} />
            </nav>
          </>
        )}

        <main style={{ flex: 1, padding: '1.25rem', overflowY: 'auto' }}>{children}</main>
      </div>
    );
  }

  return (
    <div style={S.shell}>
      <nav style={S.sidebar}>
        <SidebarContent />
      </nav>
      <main style={S.main}>{children}</main>
    </div>
  );
}

import { useApp } from '../context';

interface SidebarProps {
  activeSection: string;
  onSection: (s: string) => void;
  items: { key: string; label: string; icon: string }[];
  title: string;
  subtitle: string;
}

export default function Sidebar({ activeSection, onSection, items, title, subtitle }: SidebarProps) {
  const { currentUser, logout } = useApp();

  return (
    <div style={{
      width: '240px', minWidth: '240px', background: '#892E00', display: 'flex',
      flexDirection: 'column', minHeight: '100vh', position: 'sticky', top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(236,228,143,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <div style={{ width: '34px', height: '34px', background: '#ECE48F', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: '#892E00', fontWeight: 800, fontSize: '16px', fontFamily: 'Fraunces, serif' }}>H</span>
          </div>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: 600, color: '#ECE48F' }}>HiveStay</span>
        </div>
        <p style={{ color: 'rgba(236,228,143,0.55)', fontSize: '11px', marginLeft: '44px', fontFamily: 'Outfit, sans-serif' }}>{subtitle}</p>
      </div>

      {/* Section label */}
      <div style={{ padding: '16px 20px 8px' }}>
        <p style={{ color: 'rgba(236,228,143,0.45)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', fontFamily: 'Outfit, sans-serif', textTransform: 'uppercase' }}>{title}</p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
        {items.map(item => (
          <div
            key={item.key}
            className={`sidebar-item${activeSection === item.key ? ' active' : ''}`}
            onClick={() => onSection(item.key)}
          >
            <span style={{ fontSize: '16px', flexShrink: 0 }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* User + logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(236,228,143,0.15)' }}>
        <div style={{ padding: '10px 14px', marginBottom: '8px' }}>
          <p style={{ color: '#ECE48F', fontSize: '13px', fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>{currentUser?.name}</p>
          <p style={{ color: 'rgba(236,228,143,0.5)', fontSize: '11px', fontFamily: 'Outfit, sans-serif', textTransform: 'capitalize' }}>{currentUser?.role}</p>
        </div>
        <button
          onClick={logout}
          style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(236,228,143,0.25)', color: '#ECE48F', padding: '9px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.18)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; }}
        >
          <span>⬡</span> Log Out
        </button>
      </div>
    </div>
  );
}

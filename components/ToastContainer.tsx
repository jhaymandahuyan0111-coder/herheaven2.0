import { useApp } from '../context';

const iconMap = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const colorMap = {
  success: { bg: '#F0FDF4', border: '#86EFAC', color: '#166534', icon: '#22C55E' },
  error: { bg: '#FEF2F2', border: '#FCA5A5', color: '#991B1B', icon: '#EF4444' },
  warning: { bg: '#FFFBEB', border: '#FCD34D', color: '#92400E', icon: '#F59E0B' },
  info: { bg: '#EFF6FF', border: '#93C5FD', color: '#1E40AF', icon: '#3B82F6' },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 200, maxWidth: '360px' }}>
      {toasts.map(toast => {
        const c = colorMap[toast.type];
        return (
          <div key={toast.id} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', animation: 'slideIn 0.3s ease' }}>
            <span style={{ color: c.icon, fontSize: '16px', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>{iconMap[toast.type]}</span>
            <span style={{ flex: 1, color: c.color, fontSize: '14px', lineHeight: 1.5, fontFamily: 'Outfit, sans-serif' }}>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} style={{ background: 'none', border: 'none', color: c.color, cursor: 'pointer', fontSize: '16px', opacity: 0.6, padding: '0', flexShrink: 0 }}>×</button>
          </div>
        );
      })}
      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </div>
  );
}

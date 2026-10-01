import { useState } from 'react';
import { useApp } from '../context';

export default function ResidentLoginPage() {
  const { users, setCurrentUser, setPage, addToast } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const user = users.find(u => u.username === username && u.password === password);

      if (!user) {
        setError('Username and Password are invalid.');
        setLoading(false);
        return;
      }

      if (user.role !== 'resident') {
        setError('This account is not authorized for this portal.');
        setLoading(false);
        return;
      }

      setCurrentUser(user);
      addToast('success', `Welcome home, ${user.name}!`);
      setPage('resident-dashboard');
    }, 700);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Outfit, sans-serif' }}>
      {/* Left panel */}
      <div style={{ width: '420px', minWidth: '420px', background: 'linear-gradient(160deg, #3D1400 0%, #892E00 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '56px' }}>
          <div style={{ width: '38px', height: '38px', background: '#ECE48F', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#892E00', fontWeight: 800, fontSize: '18px', fontFamily: 'Fraunces, serif' }}>H</span>
          </div>
          <span style={{ color: '#ECE48F', fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: 600 }}>HiveStay</span>
        </div>

        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '40px', fontWeight: 700, color: 'white', lineHeight: 1.1, marginBottom: '18px' }}>
          Resident<br />Portal
        </h1>
        <p style={{ color: 'rgba(236,228,143,0.82)', fontSize: '15px', lineHeight: 1.7, marginBottom: '40px' }}>
          Access your dashboard to manage your bed booking, lease, bills, and assistance requests.
        </p>

        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px 22px', border: '1px solid rgba(255,255,255,0.2)' }}>
          <p style={{ color: '#ECE48F', fontSize: '12px', marginBottom: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Demo Credentials</p>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', marginBottom: '4px' }}>maria_s / res123</p>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', marginBottom: '4px' }}>juan_d / res456</p>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>ana_r / res789</p>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: '#FFFDF0' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <button
            onClick={() => setPage('select-role')}
            style={{ background: 'none', border: 'none', color: '#BA5304', cursor: 'pointer', fontSize: '14px', marginBottom: '36px', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
          >
            ← Back to Role Selection
          </button>

          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', fontWeight: 600, color: '#3D1400', marginBottom: '8px' }}>Welcome back</h2>
          <p style={{ color: '#8A4520', fontSize: '15px', marginBottom: '32px' }}>Sign in to your resident account</p>

          {error && (
            <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '9px', padding: '12px 16px', marginBottom: '20px', color: '#991B1B', fontSize: '14px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ flexShrink: 0 }}>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label className="label">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" className="hs-input" required />
            </div>
            <div style={{ marginBottom: '28px' }}>
              <label className="label">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" className="hs-input" required />
            </div>
            <button type="submit" disabled={loading} className="hs-btn-primary" style={{ width: '100%', padding: '13px' }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <span style={{ color: '#8A4520', fontSize: '14px' }}>Don't have an account? </span>
            <button
              onClick={() => setPage('resident-signup')}
              style={{ background: 'none', border: 'none', color: '#E17D12', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

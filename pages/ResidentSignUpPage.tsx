import { useState } from 'react';
import { useApp } from '../context';

type Step = 'email' | 'otp' | 'credentials';

export default function ResidentSignUpPage() {
  const { users, setUsers, setPage, addToast } = useApp();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const existing = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    if (existing) {
      setError('That account already exists. Please log in instead.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const code = generateOtp();
      setGeneratedOtp(code);
      setLoading(false);
      setStep('otp');
    }, 600);
  }

  function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (otp !== generatedOtp) {
      setError('Incorrect OTP. Please try again or request a new one.');
      return;
    }
    setStep('credentials');
  }

  function requestNewOtp() {
    const code = generateOtp();
    setGeneratedOtp(code);
    setOtp('');
    setError('');
    addToast('info', 'A new OTP has been generated.');
  }

  function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const existingUsername = users.find(u => u.username === username);
    if (existingUsername) {
      setError('That account already exists. Please choose a different username.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newUser = {
        id: `res-${Date.now()}`,
        username,
        password,
        name: username.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        role: 'resident' as const,
        email,
        active: true,
      };
      setUsers(prev => [...prev, newUser]);
      addToast('success', 'Your resident account has been created successfully!');
      setLoading(false);
      setPage('resident-login');
    }, 700);
  }

  const stepLabels = ['Email', 'Verify OTP', 'Create Password'];
  const stepIndex = step === 'email' ? 0 : step === 'otp' ? 1 : 2;

  return (
    <div style={{ minHeight: '100vh', background: '#FFFDF0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <button
          onClick={() => step === 'email' ? setPage('select-role') : step === 'otp' ? setStep('email') : setStep('otp')}
          style={{ background: 'none', border: 'none', color: '#BA5304', cursor: 'pointer', fontSize: '14px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}
        >
          ← {step === 'email' ? 'Back to Role Selection' : 'Back'}
        </button>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <div style={{ width: '36px', height: '36px', background: '#E17D12', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '16px', fontFamily: 'Fraunces, serif' }}>H</span>
          </div>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: 600, color: '#3D1400' }}>HiveStay</span>
        </div>

        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '30px', fontWeight: 600, color: '#3D1400', marginBottom: '8px' }}>Create your account</h2>
        <p style={{ color: '#8A4520', fontSize: '15px', marginBottom: '28px' }}>Join HiveStay as a resident</p>

        {/* Steps indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '36px' }}>
          {stepLabels.map((label, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : undefined }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', background: i <= stepIndex ? '#E17D12' : '#E7D4B8', color: i <= stepIndex ? 'white' : '#8A6040', transition: 'all 0.3s', flexShrink: 0 }}>
                  {i < stepIndex ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: '11px', fontWeight: 500, color: i <= stepIndex ? '#E17D12' : '#B89070', whiteSpace: 'nowrap' }}>{label}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: '2px', background: i < stepIndex ? '#E17D12' : '#E7D4B8', margin: '0 8px', marginBottom: '20px', transition: 'all 0.3s' }} />}
            </div>
          ))}
        </div>

        {/* Main card */}
        <div className="hs-card">
          {error && (
            <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '8px', padding: '11px 14px', marginBottom: '20px', color: '#991B1B', fontSize: '14px', display: 'flex', gap: '8px' }}>
              <span>⚠️</span> {error}
            </div>
          )}

          {step === 'email' && (
            <form onSubmit={handleEmailSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label className="label">Gmail Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@gmail.com" className="hs-input" required />
                <p style={{ color: '#8A4520', fontSize: '12px', marginTop: '6px' }}>We'll send an OTP to verify your email address.</p>
              </div>
              <button type="submit" disabled={loading} className="hs-btn-primary" style={{ width: '100%', padding: '12px' }}>
                {loading ? 'Checking…' : 'Continue'}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit}>
              <div style={{ background: '#FFF7E6', border: '1px solid #F5C842', borderRadius: '10px', padding: '14px 16px', marginBottom: '24px' }}>
                <p style={{ fontSize: '13px', color: '#7A4400', marginBottom: '4px' }}>OTP sent to <strong>{email}</strong></p>
                <p style={{ fontSize: '13px', color: '#7A4400' }}>
                  Demo OTP: <strong style={{ fontFamily: 'monospace', fontSize: '18px', color: '#E17D12', letterSpacing: '0.15em' }}>{generatedOtp}</strong>
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="label">Enter OTP</label>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit OTP" className="hs-input" maxLength={6} style={{ fontFamily: 'monospace', fontSize: '20px', letterSpacing: '0.2em', textAlign: 'center' }} required />
              </div>

              <button type="submit" className="hs-btn-primary" style={{ width: '100%', padding: '12px', marginBottom: '12px' }}>
                Verify OTP
              </button>
              <button type="button" onClick={requestNewOtp} style={{ width: '100%', background: 'transparent', border: 'none', color: '#8A4520', cursor: 'pointer', fontSize: '14px', padding: '8px', fontFamily: 'Outfit, sans-serif' }}>
                Request new OTP
              </button>
            </form>
          )}

          {step === 'credentials' && (
            <form onSubmit={handleCredentialsSubmit}>
              <div style={{ marginBottom: '18px' }}>
                <label className="label">Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value.replace(/\s/g, '_'))} placeholder="Choose a username" className="hs-input" required minLength={3} />
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label className="label">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" className="hs-input" required minLength={6} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label className="label">Re-enter Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm your password" className="hs-input" required />
                {confirmPassword && password !== confirmPassword && (
                  <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '5px' }}>Passwords do not match</p>
                )}
              </div>
              <button type="submit" disabled={loading} className="hs-btn-primary" style={{ width: '100%', padding: '12px' }}>
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#8A4520', marginTop: '20px' }}>
          Already have an account?{' '}
          <button onClick={() => setPage('resident-login')} style={{ background: 'none', border: 'none', color: '#E17D12', cursor: 'pointer', fontWeight: 600, fontFamily: 'Outfit, sans-serif', fontSize: '14px' }}>
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}

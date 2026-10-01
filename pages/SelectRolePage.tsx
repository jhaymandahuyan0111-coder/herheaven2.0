import { useApp } from '../context';

export default function SelectRolePage() {
  const { setPage } = useApp();

  const Card = ({ icon, title, desc, children }: { icon: string; title: string; desc: string; children: React.ReactNode }) => (
    <div style={{ background: 'white', borderRadius: '18px', padding: '36px 28px', border: '2px solid rgba(231,177,46,0.25)', boxShadow: '0 4px 24px rgba(137,46,0,0.07)', textAlign: 'center', transition: 'all 0.25s', display: 'flex', flexDirection: 'column' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E17D12'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(137,46,0,0.14)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(231,177,46,0.25)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(137,46,0,0.07)'; }}
    >
      <div style={{ fontSize: '60px', marginBottom: '20px' }}>{icon}</div>
      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', fontWeight: 600, color: '#3D1400', marginBottom: '12px' }}>{title}</h2>
      <p style={{ color: '#8A4520', fontSize: '14px', lineHeight: 1.65, marginBottom: '28px', flex: 1 }}>{desc}</p>
      {children}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#FFFDF0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative' }}>
      <button
        onClick={() => setPage('home')}
        style={{ position: 'absolute', top: '24px', left: '24px', background: 'none', border: 'none', color: '#BA5304', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
      >
        ← Back to Home
      </button>

      <div style={{ maxWidth: '960px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '44px', height: '44px', background: '#E17D12', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 800, fontSize: '20px', fontFamily: 'Fraunces, serif' }}>H</span>
            </div>
            <span style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', fontWeight: 600, color: '#3D1400' }}>HiveStay</span>
          </div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '40px', fontWeight: 700, color: '#3D1400', marginBottom: '12px' }}>Select Your Role</h1>
          <p style={{ color: '#8A4520', fontSize: '16px' }}>Choose how you'd like to access the HiveStay portal</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <Card
            icon="🛡️"
            title="Admin / Staff"
            desc="Access the management portal for administrators and staff members. Manage residents, rooms, leases, billing and more."
          >
            <button
              onClick={() => setPage('admin-login')}
              className="hs-btn-primary"
              style={{ width: '100%' }}
            >
              Admin / Staff Login
            </button>
          </Card>

          <Card
            icon="🏡"
            title="Resident"
            desc="Already a HiveStay resident? Log in to manage your bed, view your lease, pay bills, and request assistance."
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => setPage('resident-login')}
                style={{ background: '#892E00', color: 'white', padding: '11px', borderRadius: '9px', fontWeight: 600, fontSize: '15px', border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#6A1F00'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#892E00'; }}
              >
                Resident Login
              </button>
              <button
                onClick={() => setPage('resident-signup')}
                style={{ background: 'transparent', color: '#892E00', padding: '11px', borderRadius: '9px', fontWeight: 600, fontSize: '15px', border: '2px solid #892E00', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#892E00'; (e.currentTarget as HTMLElement).style.color = 'white'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#892E00'; }}
              >
                Sign Up as Resident
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

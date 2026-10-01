import { useState } from 'react';
import { useApp } from '../context';

export default function HomePage() {
  const { setPage } = useApp();
  const [showExit, setShowExit] = useState(false);

  const features = [
    { icon: '🏠', title: 'Flexible Bed Booking', desc: 'Browse available beds across Standard, Premium, and Studio rooms at competitive monthly rates.' },
    { icon: '📋', title: 'Lease Management', desc: 'View lease details, accommodation info, and manage your stay with complete transparency.' },
    { icon: '💳', title: 'Bills & Payments', desc: 'Track monthly bills, utility consumption, and payment status all in one dashboard.' },
    { icon: '🔧', title: 'Request Assistance', desc: 'Submit room-related or general concerns and receive timely responses from our team.' },
    { icon: '👥', title: 'Staff Support', desc: 'Dedicated staff monitors residents\' needs, room availability, and billing assistance.' },
    { icon: '📊', title: 'Admin Reports', desc: 'Comprehensive reporting for occupancy rates, overdue invoices, and utility analytics.' },
  ];

  return (
    <div style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #892E00 0%, #BA5304 50%, #E17D12 100%)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', background: '#ECE48F', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#892E00', fontWeight: 800, fontSize: '18px', fontFamily: 'Fraunces, serif' }}>H</span>
            </div>
            <span style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: 600, color: '#ECE48F', letterSpacing: '-0.01em' }}>HiveStay</span>
          </div>
          <button
            onClick={() => setShowExit(true)}
            style={{ color: 'rgba(236,228,143,0.75)', fontSize: '13px', background: 'transparent', border: '1px solid rgba(236,228,143,0.35)', padding: '7px 18px', borderRadius: '7px', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s' }}
          >
            Exit
          </button>
        </nav>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px 80px', textAlign: 'center' }}>
          <div style={{ background: 'rgba(236,228,143,0.15)', border: '1px solid rgba(236,228,143,0.3)', borderRadius: '20px', padding: '5px 18px', marginBottom: '28px', display: 'inline-block' }}>
            <span style={{ color: '#ECE48F', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Youth Co-Living & Micro-Housing</span>
          </div>

          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(44px, 8vw, 88px)', fontWeight: 700, color: 'white', lineHeight: 1.05, marginBottom: '24px', maxWidth: '820px' }}>
            Find your <span style={{ color: '#ECE48F' }}>hive</span>,<br />find your people.
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: '18px', maxWidth: '540px', lineHeight: 1.7, marginBottom: '44px' }}>
            HiveStay connects young residents with affordable, community-driven co-living spaces and micro-housing across the metro.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => setPage('select-role')}
              style={{ background: '#ECE48F', color: '#892E00', padding: '14px 44px', borderRadius: '10px', fontWeight: 700, fontSize: '16px', border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#E7B12E'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#ECE48F'; }}
            >
              Get Started →
            </button>
            <button
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              style={{ background: 'transparent', color: '#ECE48F', padding: '14px 44px', borderRadius: '10px', fontWeight: 600, fontSize: '16px', border: '2px solid rgba(236,228,143,0.55)', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}
            >
              Keep Browsing
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ background: '#FFFDF0', padding: '80px 32px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '38px', fontWeight: 600, color: '#3D1400', textAlign: 'center', marginBottom: '14px' }}>
            Built for modern urban living
          </h2>
          <p style={{ color: '#8A4520', textAlign: 'center', fontSize: '16px', marginBottom: '56px' }}>
            Everything you need to manage or live in a co-living space.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {features.map(({ icon, title, desc }) => (
              <div key={title} style={{ background: 'white', borderRadius: '14px', padding: '28px', border: '1px solid rgba(231,177,46,0.22)', boxShadow: '0 2px 12px rgba(137,46,0,0.06)', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(137,46,0,0.12)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(137,46,0,0.06)'; }}
              >
                <div style={{ fontSize: '34px', marginBottom: '16px' }}>{icon}</div>
                <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: 600, color: '#3D1400', marginBottom: '10px' }}>{title}</h3>
                <p style={{ color: '#8A4520', fontSize: '14px', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '56px' }}>
            <button
              onClick={() => setPage('select-role')}
              style={{ background: '#E17D12', color: 'white', padding: '14px 48px', borderRadius: '10px', fontWeight: 700, fontSize: '16px', border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#BA5304'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#E17D12'; }}
            >
              Get Started Now
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#3D1400', padding: '28px 32px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(236,228,143,0.5)', fontSize: '13px', fontFamily: 'Outfit, sans-serif' }}>
          © 2024 HiveStay — Youth Co-Living & Micro-Housing. All rights reserved.
        </p>
      </div>

      {/* Exit modal */}
      {showExit && (
        <div className="modal-overlay" onClick={() => setShowExit(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ textAlign: 'center', maxWidth: '380px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👋</div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '26px', color: '#3D1400', marginBottom: '10px' }}>Leaving so soon?</h2>
            <p style={{ color: '#8A4520', fontSize: '15px', lineHeight: 1.6, marginBottom: '28px' }}>Are you sure you want to leave the HiveStay portal?</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setPage('goodbye')} style={{ background: '#E17D12', color: 'white', padding: '11px 28px', borderRadius: '9px', fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Yes, Exit</button>
              <button onClick={() => setShowExit(false)} style={{ background: 'transparent', color: '#E17D12', padding: '11px 28px', borderRadius: '9px', fontWeight: 600, border: '2px solid #E17D12', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Keep Browsing</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

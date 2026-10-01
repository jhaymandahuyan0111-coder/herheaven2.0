import { useState } from 'react';
import { useApp } from '../context';
import Sidebar from '../components/Sidebar';
import type { Request } from '../types';

type Section = 'overview' | 'available-beds' | 'my-lease' | 'my-bills' | 'request-assistance';

const sidebarItems = [
  { key: 'overview', label: 'My Dashboard', icon: '🏠' },
  { key: 'available-beds', label: 'Available Beds', icon: '🛏️' },
  { key: 'my-lease', label: 'My Lease', icon: '📋' },
  { key: 'my-bills', label: 'My Bills', icon: '💳' },
  { key: 'request-assistance', label: 'Request Assistance', icon: '🔔' },
];

export default function ResidentDashboard() {
  const [section, setSection] = useState<Section>('overview');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Outfit, sans-serif' }}>
      <Sidebar activeSection={section} onSection={s => setSection(s as Section)} items={sidebarItems} title="Resident Portal" subtitle="Resident Dashboard" />
      <div style={{ flex: 1, overflow: 'auto', background: '#FFFDF0' }}>
        {section === 'overview' && <ResidentOverview onSection={s => setSection(s as Section)} />}
        {section === 'available-beds' && <AvailableBeds />}
        {section === 'my-lease' && <MyLease />}
        {section === 'my-bills' && <MyBills />}
        {section === 'request-assistance' && <RequestAssistance />}
      </div>
    </div>
  );
}

function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ padding: '32px 32px 20px', borderBottom: '1px solid rgba(231,177,46,0.2)' }}>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', fontWeight: 600, color: '#3D1400', marginBottom: subtitle ? '4px' : '0' }}>{title}</h1>
      {subtitle && <p style={{ color: '#8A4520', fontSize: '14px' }}>{subtitle}</p>}
    </div>
  );
}

function ResidentOverview({ onSection }: { onSection: (s: string) => void }) {
  const { currentUser, leases, bills, requests, beds, rooms } = useApp();
  const myLease = leases.find(l => l.residentId === currentUser?.id && l.status === 'active');
  const myBed = myLease ? beds.find(b => b.id === myLease.bedId) : null;
  const myRoom = myLease ? rooms.find(r => r.id === myLease.roomId) : null;
  const myBills = bills.filter(b => b.residentId === currentUser?.id);
  const unpaidBills = myBills.filter(b => b.status === 'unpaid');
  const myRequests = requests.filter(r => r.residentId === currentUser?.id);
  const pendingRequests = myRequests.filter(r => r.status === 'pending');

  return (
    <div style={{ paddingBottom: '40px' }}>
      <PageHeader title={`Welcome, ${currentUser?.name?.split(' ')[0]}! 👋`} subtitle="HiveStay: Youth Co-Living and Micro-Housing" />
      <div style={{ padding: '28px 32px' }}>
        {/* Current accommodation */}
        {myLease && myRoom && myBed ? (
          <div style={{ background: 'linear-gradient(135deg, #892E00 0%, #E17D12 100%)', borderRadius: '16px', padding: '28px 32px', marginBottom: '28px', color: 'white' }}>
            <p style={{ color: 'rgba(236,228,143,0.7)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Your Accommodation</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', fontWeight: 600, marginBottom: '4px' }}>Room {myRoom.number} — {myBed.label}</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>{myRoom.category} Room · ₱{myRoom.rentPerBed.toLocaleString()}/month</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: 'rgba(236,228,143,0.7)', fontSize: '12px', marginBottom: '4px' }}>Lease Period</p>
                <p style={{ color: '#ECE48F', fontWeight: 600 }}>{myLease.startDate} → {myLease.endDate}</p>
                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 12px', borderRadius: '12px', fontSize: '12px', display: 'inline-block', marginTop: '6px' }}>{myLease.status}</span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: '#FEF3C7', borderRadius: '12px', padding: '20px 24px', marginBottom: '28px', border: '1px solid #FCD34D', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: 600, color: '#92400E', marginBottom: '4px', fontSize: '15px' }}>No active lease</p>
              <p style={{ color: '#92400E', fontSize: '13px' }}>Book an available bed to get started.</p>
            </div>
            <button onClick={() => onSection('available-beds')} className="hs-btn-sm" style={{ background: '#E17D12' }}>Browse Beds</button>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Unpaid Bills', value: unpaidBills.length, icon: '💳', color: unpaidBills.length > 0 ? '#FEE2E2' : '#D1FAE5', textColor: unpaidBills.length > 0 ? '#991B1B' : '#065F46', action: 'my-bills' },
            { label: 'Pending Requests', value: pendingRequests.length, icon: '🔔', color: '#FEF3C7', textColor: '#92400E', action: 'request-assistance' },
            { label: 'Total Bills', value: myBills.length, icon: '📄', color: '#DBEAFE', textColor: '#1E40AF', action: 'my-bills' },
            { label: 'My Requests', value: myRequests.length, icon: '📋', color: 'rgba(225,125,18,0.1)', textColor: '#5C1A00', action: 'request-assistance' },
          ].map(({ label, value, icon, color, textColor, action }) => (
            <div key={label} className="hs-card" style={{ textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', background: color }}
              onClick={() => onSection(action)}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', fontWeight: 600, color: textColor, marginBottom: '4px' }}>{value}</p>
              <p style={{ fontSize: '12px', color: textColor, opacity: 0.8 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="hs-card">
          <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', color: '#3D1400', marginBottom: '16px' }}>Quick Actions</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {sidebarItems.slice(1).map(item => (
              <button key={item.key} onClick={() => onSection(item.key)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: 'rgba(231,177,46,0.1)', border: '1px solid rgba(231,177,46,0.2)', borderRadius: '9px', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: '#5C1A00', fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(225,125,18,0.15)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(231,177,46,0.1)'; }}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AvailableBeds() {
  const { currentUser, beds, rooms, leases, setLeases, setBeds, setBookings, bookings, addToast } = useApp();
  const availableBeds = beds.filter(b => b.status === 'available');
  const [selected, setSelected] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [confirmed, setConfirmed] = useState<string | null>(null);

  const hasActiveLease = leases.some(l => l.residentId === currentUser?.id && l.status === 'active');

  function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !currentUser) return;
    if (hasActiveLease) { addToast('error', 'You already have an active lease.'); return; }

    const bed = beds.find(b => b.id === selected);
    if (!bed) return;

    const newLease = { id: `lease-${Date.now()}`, residentId: currentUser.id, bedId: selected, roomId: bed.roomId, startDate, endDate, status: 'active' as const };
    const newBooking = { id: `booking-${Date.now()}`, residentId: currentUser.id, bedId: selected, roomId: bed.roomId, startDate, endDate, status: 'confirmed' as const };

    setLeases(prev => [...prev, newLease]);
    setBeds(prev => prev.map(b => b.id === selected ? { ...b, status: 'occupied' as const, residentId: currentUser.id } : b));
    setBookings(prev => [...prev, newBooking]);
    setConfirmed(selected);
    addToast('success', 'Booking confirmed! Your lease has been created.');
    setSelected(null);
    setStartDate('');
    setEndDate('');
  }

  if (confirmed) {
    const bed = beds.find(b => b.id === confirmed);
    const room = rooms.find(r => r.id === bed?.roomId);
    return (
      <div style={{ paddingBottom: '40px' }}>
        <PageHeader title="Available Beds" subtitle="Browse and book your accommodation" />
        <div style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', color: '#3D1400', marginBottom: '12px' }}>Booking Confirmed!</h2>
          <p style={{ color: '#8A4520', fontSize: '16px', marginBottom: '28px' }}>You've successfully booked Bed {bed?.label} in Room {room?.number}.</p>
          <button onClick={() => setConfirmed(null)} className="hs-btn-outline">Book Another / Return</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '40px' }}>
      <PageHeader title="Available Beds" subtitle="Browse and book your accommodation" />
      <div style={{ padding: '24px 32px' }}>
        {hasActiveLease && (
          <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px', color: '#92400E', fontSize: '14px' }}>
            ⚠️ You already have an active lease. Cancel it first before booking a new bed.
          </div>
        )}

        <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ background: '#D1FAE5', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, color: '#065F46' }}>
            ✓ {availableBeds.length} Beds Available
          </div>
        </div>

        {availableBeds.length === 0 ? (
          <div className="hs-card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '40px', marginBottom: '16px' }}>😔</p>
            <p style={{ color: '#8A4520', fontSize: '16px' }}>No beds available at the moment. Please check back later.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {availableBeds.map(bed => {
              const room = rooms.find(r => r.id === bed.roomId);
              const isSelected = selected === bed.id;
              return (
                <div key={bed.id}
                  style={{ background: 'white', borderRadius: '14px', padding: '22px', border: `2px solid ${isSelected ? '#E17D12' : 'rgba(231,177,46,0.25)'}`, cursor: hasActiveLease ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: hasActiveLease ? 0.7 : 1, transform: isSelected ? 'translateY(-2px)' : 'none', boxShadow: isSelected ? '0 8px 24px rgba(225,125,18,0.18)' : '0 2px 8px rgba(137,46,0,0.06)' }}
                  onClick={() => !hasActiveLease && setSelected(isSelected ? null : bed.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div>
                      <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: 600, color: '#3D1400', marginBottom: '2px' }}>{bed.label}</h3>
                      <p style={{ color: '#8A4520', fontSize: '13px' }}>Room {room?.number}</p>
                    </div>
                    <span className="badge badge-green">available</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                    {[['Category', room?.category], ['Capacity', `${room?.capacity} beds`]].map(([k, v]) => (
                      <div key={k as string} style={{ background: '#FFFDF0', borderRadius: '7px', padding: '8px 10px' }}>
                        <p style={{ fontSize: '10px', color: '#8A4520', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</p>
                        <p style={{ fontSize: '13px', color: '#3D1400', fontWeight: 500 }}>{v}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: 600, color: '#E17D12' }}>₱{room?.rentPerBed.toLocaleString()}<span style={{ fontSize: '13px', fontFamily: 'Outfit, sans-serif', fontWeight: 400, color: '#8A4520' }}>/month</span></p>
                  {isSelected && <div style={{ marginTop: '10px', padding: '6px 12px', background: '#E17D12', borderRadius: '6px', textAlign: 'center', color: 'white', fontSize: '12px', fontWeight: 600 }}>✓ Selected</div>}
                </div>
              );
            })}
          </div>
        )}

        {selected && !hasActiveLease && (
          <div className="hs-card" style={{ marginTop: '24px', maxWidth: '480px' }}>
            <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', color: '#3D1400', marginBottom: '20px' }}>Confirm Booking — {beds.find(b => b.id === selected)?.label}</h3>
            <form onSubmit={handleBook}>
              <div style={{ marginBottom: '16px' }}>
                <label className="label">Desired Start Date</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="hs-input" required min={new Date().toISOString().split('T')[0]} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label className="label">Desired End Date</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="hs-input" required min={startDate || new Date().toISOString().split('T')[0]} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="hs-btn-primary">Confirm Booking</button>
                <button type="button" onClick={() => setSelected(null)} className="hs-btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function MyLease() {
  const { currentUser, leases, beds, rooms } = useApp();
  const myLease = leases.find(l => l.residentId === currentUser?.id && l.status === 'active');
  const myBed = myLease ? beds.find(b => b.id === myLease.bedId) : null;
  const myRoom = myLease ? rooms.find(r => r.id === myLease.roomId) : null;

  return (
    <div style={{ paddingBottom: '40px' }}>
      <PageHeader title="My Lease" subtitle="View your lease information and accommodation details" />
      <div style={{ padding: '24px 32px' }}>
        {myLease && myRoom && myBed ? (
          <>
            <div style={{ background: 'linear-gradient(135deg, #892E00 0%, #E17D12 100%)', borderRadius: '16px', padding: '32px', marginBottom: '24px', color: 'white' }}>
              <p style={{ color: 'rgba(236,228,143,0.7)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Active Lease</p>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', fontWeight: 600, marginBottom: '8px' }}>Room {myRoom.number} — {myBed.label}</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>{myRoom.category} Room</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              {[
                ['Room Number', `Room ${myRoom.number}`],
                ['Room Category', myRoom.category],
                ['Bed Assignment', myBed.label],
                ['Monthly Rent', `₱${myRoom.rentPerBed.toLocaleString()}`],
                ['Lease Start', myLease.startDate],
                ['Lease End', myLease.endDate],
                ['Lease Status', myLease.status],
                ['Room Capacity', `${myRoom.capacity} beds`],
              ].map(([k, v]) => (
                <div key={k as string} className="hs-card" style={{ padding: '18px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#8A4520', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{k}</p>
                  <p style={{ fontSize: '15px', color: '#3D1400', fontWeight: 500, textTransform: 'capitalize' }}>{v}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="hs-card" style={{ textAlign: 'center', padding: '48px' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>📋</p>
            <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: '#3D1400', marginBottom: '10px' }}>No Active Lease</h3>
            <p style={{ color: '#8A4520', fontSize: '15px' }}>You don't have an active lease yet. Book a bed from the Available Beds section.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MyBills() {
  const { currentUser, bills } = useApp();
  const myBills = bills.filter(b => b.residentId === currentUser?.id);
  const unpaid = myBills.filter(b => b.status === 'unpaid');
  const paid = myBills.filter(b => b.status === 'paid');
  const totalPaid = paid.reduce((s, b) => s + b.amount, 0);
  const totalUnpaid = unpaid.reduce((s, b) => s + b.amount, 0);

  return (
    <div style={{ paddingBottom: '40px' }}>
      <PageHeader title="My Bills" subtitle="View your billing history and amount due" />
      <div style={{ padding: '24px 32px' }}>
        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '28px' }}>
          <div style={{ background: '#FEE2E2', borderRadius: '12px', padding: '20px', border: '1px solid #FECACA', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '26px', fontWeight: 600, color: '#991B1B', marginBottom: '4px' }}>₱{totalUnpaid.toLocaleString()}</p>
            <p style={{ fontSize: '12px', color: '#991B1B' }}>Total Amount Due</p>
          </div>
          <div style={{ background: '#D1FAE5', borderRadius: '12px', padding: '20px', border: '1px solid #86EFAC', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '26px', fontWeight: 600, color: '#065F46', marginBottom: '4px' }}>₱{totalPaid.toLocaleString()}</p>
            <p style={{ fontSize: '12px', color: '#065F46' }}>Total Paid</p>
          </div>
          <div style={{ background: 'rgba(225,125,18,0.1)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(225,125,18,0.25)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '26px', fontWeight: 600, color: '#5C1A00', marginBottom: '4px' }}>{myBills.length}</p>
            <p style={{ fontSize: '12px', color: '#8A4520' }}>Total Bills</p>
          </div>
        </div>

        {myBills.length === 0 ? (
          <div className="hs-card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '40px', marginBottom: '16px' }}>💳</p>
            <p style={{ color: '#8A4520', fontSize: '15px' }}>No bills on record yet.</p>
          </div>
        ) : (
          <>
            {unpaid.length > 0 && (
              <>
                <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', color: '#3D1400', marginBottom: '14px' }}>⚠️ Unpaid Bills</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                  {unpaid.map(bill => (
                    <div key={bill.id} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '2px solid #FECACA', boxShadow: '0 2px 8px rgba(239,68,68,0.1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <h4 style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', color: '#3D1400', marginBottom: '2px' }}>{bill.billingPeriod}</h4>
                          <p style={{ fontSize: '13px', color: '#8A4520' }}>{bill.essentialBills}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: 600, color: '#DC2626' }}>₱{bill.amount.toLocaleString()}</p>
                          <span className="badge badge-red">unpaid</span>
                        </div>
                      </div>
                      {bill.utilityConsumption && <p style={{ fontSize: '12px', color: '#8A4520', background: '#FEF3C7', borderRadius: '6px', padding: '6px 10px', display: 'inline-block' }}>⚡ {bill.utilityConsumption}</p>}
                    </div>
                  ))}
                </div>
              </>
            )}

            <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', color: '#3D1400', marginBottom: '14px' }}>✓ Payment History</h3>
            <div className="hs-card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="hs-table">
                <thead><tr><th>Period</th><th>Amount</th><th>Essential Bills</th><th>Utility</th><th>Status</th></tr></thead>
                <tbody>
                  {myBills.map((bill, i) => (
                    <tr key={bill.id} style={{ background: i % 2 === 1 ? 'rgba(236,228,143,0.06)' : 'white' }}>
                      <td style={{ fontWeight: 500 }}>{bill.billingPeriod}</td>
                      <td style={{ fontWeight: 600 }}>₱{bill.amount.toLocaleString()}</td>
                      <td style={{ fontSize: '12px', color: '#8A4520' }}>{bill.essentialBills}</td>
                      <td style={{ fontSize: '12px' }}>{bill.utilityConsumption || '—'}</td>
                      <td><span className={`badge ${bill.status === 'paid' ? 'badge-green' : 'badge-red'}`}>{bill.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function RequestAssistance() {
  const { currentUser, requests, setRequests, addToast } = useApp();
  const myRequests = requests.filter(r => r.residentId === currentUser?.id);
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<'room-related' | 'general'>('room-related');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser) return;
    const newReq: Request = {
      id: `req-${Date.now()}`,
      residentId: currentUser.id,
      type,
      description,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setRequests(prev => [...prev, newReq]);
    addToast('success', 'Your request has been submitted and added to the queue.');
    setDescription('');
    setShowForm(false);
    setSubmitted(true);
  }

  return (
    <div style={{ paddingBottom: '40px' }}>
      <PageHeader title="Request Assistance" subtitle="Submit concerns and track responses from staff" />
      <div style={{ padding: '24px 32px' }}>
        {submitted && (
          <div style={{ background: '#D1FAE5', border: '1px solid #86EFAC', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px', color: '#065F46', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>✓ Request submitted successfully and added to the queue.</span>
            <button onClick={() => setSubmitted(false)} style={{ background: 'none', border: 'none', color: '#065F46', cursor: 'pointer', fontSize: '18px' }}>×</button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button onClick={() => { setShowForm(true); setSubmitted(false); }} className="hs-btn-primary">+ New Request</button>
        </div>

        {myRequests.length === 0 ? (
          <div className="hs-card" style={{ textAlign: 'center', padding: '48px' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔔</p>
            <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: '#3D1400', marginBottom: '10px' }}>No Requests Yet</h3>
            <p style={{ color: '#8A4520', fontSize: '15px', marginBottom: '20px' }}>Need help with something? Submit a request and our staff will assist you.</p>
            <button onClick={() => setShowForm(true)} className="hs-btn-primary">Submit Your First Request</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {myRequests.map(req => (
              <div key={req.id} className="hs-card" style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>{req.type === 'room-related' ? '🚪' : '💬'}</span>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#3D1400', marginBottom: '2px', textTransform: 'capitalize' }}>{req.type.replace('-', ' ')} Concern</p>
                      <p style={{ fontSize: '12px', color: '#B89070' }}>Submitted: {req.createdAt}</p>
                    </div>
                  </div>
                  <span className={`badge ${req.status === 'responded' ? 'badge-green' : 'badge-yellow'}`}>{req.status}</span>
                </div>

                <div style={{ background: '#FFFDF0', borderRadius: '8px', padding: '12px 14px', marginBottom: req.response ? '12px' : '0', border: '1px solid rgba(231,177,46,0.15)' }}>
                  <p style={{ fontSize: '14px', color: '#3D1400', lineHeight: 1.6 }}>{req.description}</p>
                </div>

                {req.response && (
                  <div style={{ background: '#D1FAE5', borderRadius: '8px', padding: '12px 14px', border: '1px solid #86EFAC' }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '5px' }}>Staff Response</p>
                    <p style={{ fontSize: '14px', color: '#065F46', lineHeight: 1.6 }}>{req.response}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: '#3D1400', marginBottom: '20px' }}>Submit Assistance Request</h2>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '18px' }}>
                  <label className="label">Request Type</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {([['room-related', '🚪 Room-Related Concern'], ['general', '💬 General Concern']] as const).map(([val, label]) => (
                      <button key={val} type="button" onClick={() => setType(val)}
                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '2px solid', borderColor: type === val ? '#E17D12' : 'rgba(231,177,46,0.3)', background: type === val ? 'rgba(225,125,18,0.08)' : 'white', color: type === val ? '#E17D12' : '#8A4520', cursor: 'pointer', fontSize: '13px', fontWeight: 500, fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s' }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label className="label">Describe your concern or request</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Please describe your concern in detail…"
                    required
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E7B12E', borderRadius: '8px', background: 'white', color: '#3D1400', fontFamily: 'Outfit, sans-serif', fontSize: '14px', resize: 'vertical', minHeight: '120px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="hs-btn-primary">Submit Request</button>
                  <button type="button" onClick={() => setShowForm(false)} className="hs-btn-outline">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

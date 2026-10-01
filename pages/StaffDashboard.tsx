import { useState } from 'react';
import { useApp } from '../context';
import Sidebar from '../components/Sidebar';
import type { Request, Booking } from '../types';

type Section = 'overview' | 'assistance' | 'room-monitoring' | 'lease-info' | 'billing' | 'transactions';

const sidebarItems = [
  { key: 'overview', label: 'Dashboard', icon: '🏠' },
  { key: 'assistance', label: 'Resident Assistance', icon: '🔔' },
  { key: 'room-monitoring', label: 'Room & Bed Monitoring', icon: '🛏️' },
  { key: 'lease-info', label: 'Lease Information', icon: '📋' },
  { key: 'billing', label: 'Billing Assistance', icon: '💳' },
  { key: 'transactions', label: 'Transaction Monitoring', icon: '🔄' },
];

export default function StaffDashboard() {
  const [section, setSection] = useState<Section>('overview');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Outfit, sans-serif' }}>
      <Sidebar activeSection={section} onSection={s => setSection(s as Section)} items={sidebarItems} title="Staff Portal" subtitle="Staff Dashboard" />
      <div style={{ flex: 1, overflow: 'auto', background: '#FFFDF0' }}>
        {section === 'overview' && <StaffOverview onSection={s => setSection(s as Section)} />}
        {section === 'assistance' && <ResidentAssistance />}
        {section === 'room-monitoring' && <RoomBedMonitoring />}
        {section === 'lease-info' && <LeaseInformation />}
        {section === 'billing' && <BillingAssistance />}
        {section === 'transactions' && <TransactionMonitoring />}
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

function StaffOverview({ onSection }: { onSection: (s: string) => void }) {
  const { requests, beds, leases, bills, users } = useApp();
  const pending = requests.filter(r => r.status === 'pending');
  const available = beds.filter(b => b.status === 'available');
  const occupied = beds.filter(b => b.status === 'occupied');
  const unpaid = bills.filter(b => b.status === 'unpaid');
  const activeLeases = leases.filter(l => l.status === 'active');

  return (
    <div style={{ paddingBottom: '40px' }}>
      <PageHeader title="Staff Dashboard" subtitle="HiveStay: Youth Co-Living and Micro-Housing" />
      <div style={{ padding: '28px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Pending Requests', value: pending.length, icon: '🔔', color: 'rgba(245,158,11,0.12)', action: 'assistance' },
            { label: 'Available Beds', value: available.length, icon: '🛏️', color: 'rgba(34,197,94,0.12)', action: 'room-monitoring' },
            { label: 'Occupied Beds', value: occupied.length, icon: '🏠', color: 'rgba(59,130,246,0.12)', action: 'room-monitoring' },
            { label: 'Unpaid Bills', value: unpaid.length, icon: '💳', color: 'rgba(239,68,68,0.12)', action: 'billing' },
            { label: 'Active Leases', value: activeLeases.length, icon: '📋', color: 'rgba(225,125,18,0.12)', action: 'lease-info' },
          ].map(({ label, value, icon, color, action }) => (
            <div key={label} className="hs-card" style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => onSection(action)}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '10px' }}>{icon}</div>
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', fontWeight: 600, color: '#3D1400', marginBottom: '4px' }}>{value}</p>
              <p style={{ fontSize: '12px', color: '#8A4520' }}>{label}</p>
            </div>
          ))}
        </div>

        <div className="hs-card">
          <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', color: '#3D1400', marginBottom: '16px' }}>Pending Assistance Requests</h3>
          {pending.length === 0 ? (
            <p style={{ color: '#8A4520', fontSize: '14px' }}>No pending requests. All caught up! ✓</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pending.slice(0, 3).map(req => {
                const resident = users.find(u => u.id === req.residentId);
                return (
                  <div key={req.id} style={{ background: '#FFFDF0', borderRadius: '8px', padding: '12px 16px', border: '1px solid rgba(231,177,46,0.2)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ fontSize: '18px' }}>{req.type === 'room-related' ? '🚪' : '💬'}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#3D1400', marginBottom: '2px' }}>{resident?.name}</p>
                      <p style={{ fontSize: '13px', color: '#8A4520', lineHeight: 1.4 }}>{req.description}</p>
                    </div>
                    <span className="badge badge-yellow">pending</span>
                  </div>
                );
              })}
              {pending.length > 3 && (
                <button onClick={() => onSection('assistance')} style={{ background: 'none', border: 'none', color: '#E17D12', cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'Outfit, sans-serif', textAlign: 'left' }}>
                  View all {pending.length} requests →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResidentAssistance() {
  const { requests, setRequests, users, addToast } = useApp();
  const [selectedReq, setSelectedReq] = useState<Request | null>(null);
  const [responseText, setResponseText] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'responded'>('all');

  const filtered = requests.filter(r => filter === 'all' ? true : r.status === filter);

  function handleRespond(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedReq) return;
    setRequests(prev => prev.map(r => r.id === selectedReq.id ? { ...r, status: 'responded' as const, response: responseText } : r));
    setSelectedReq(prev => prev ? { ...prev, status: 'responded', response: responseText } : null);
    addToast('success', 'Response recorded and added to queue.');
    setResponseText('');
  }

  return (
    <div style={{ paddingBottom: '40px' }}>
      <PageHeader title="Resident Assistance" subtitle="View and respond to resident requests" />
      <div style={{ padding: '24px 32px', display: 'flex', gap: '24px' }}>
        {/* List */}
        <div style={{ flex: '0 0 320px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            {(['all', 'pending', 'responded'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '6px 14px', borderRadius: '7px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', background: filter === f ? '#E17D12' : '#F5E8C8', color: filter === f ? 'white' : '#8A4520', textTransform: 'capitalize' }}
              >{f}</button>
            ))}
          </div>

          <div className="hs-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ maxHeight: '560px', overflowY: 'auto' }}>
              {filtered.map(req => {
                const resident = users.find(u => u.id === req.residentId);
                return (
                  <div key={req.id} onClick={() => { setSelectedReq(req); setResponseText(''); }}
                    style={{ padding: '14px 16px', borderBottom: '1px solid rgba(231,177,46,0.1)', cursor: 'pointer', background: selectedReq?.id === req.id ? 'rgba(225,125,18,0.06)' : 'white', borderLeft: selectedReq?.id === req.id ? '3px solid #E17D12' : '3px solid transparent' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#3D1400' }}>{resident?.name}</span>
                      <span className={`badge ${req.status === 'pending' ? 'badge-yellow' : 'badge-green'}`}>{req.status}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#8A4520', lineHeight: 1.4 }}>{req.description.slice(0, 60)}…</p>
                    <p style={{ fontSize: '11px', color: '#B89070', marginTop: '4px' }}>{req.createdAt} · {req.type}</p>
                  </div>
                );
              })}
              {filtered.length === 0 && <p style={{ padding: '20px', color: '#8A4520', fontSize: '14px' }}>No requests found.</p>}
            </div>
          </div>
        </div>

        {/* Detail */}
        <div style={{ flex: 1 }}>
          {selectedReq ? (
            <div className="hs-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', color: '#3D1400', marginBottom: '4px' }}>
                    {users.find(u => u.id === selectedReq.residentId)?.name}'s Request
                  </h2>
                  <p style={{ fontSize: '13px', color: '#8A4520' }}>{selectedReq.createdAt} · <span style={{ textTransform: 'capitalize' }}>{selectedReq.type.replace('-', ' ')}</span></p>
                </div>
                <span className={`badge ${selectedReq.status === 'pending' ? 'badge-yellow' : 'badge-green'}`}>{selectedReq.status}</span>
              </div>

              <div style={{ background: '#FFFDF0', borderRadius: '10px', padding: '16px', border: '1px solid rgba(231,177,46,0.2)', marginBottom: '20px' }}>
                <p style={{ fontSize: '14px', color: '#3D1400', lineHeight: 1.65 }}>{selectedReq.description}</p>
              </div>

              {selectedReq.response && (
                <div style={{ background: '#D1FAE5', borderRadius: '10px', padding: '16px', border: '1px solid #86EFAC', marginBottom: '20px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: '#065F46', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Staff Response</p>
                  <p style={{ fontSize: '14px', color: '#065F46', lineHeight: 1.65 }}>{selectedReq.response}</p>
                </div>
              )}

              {selectedReq.status === 'pending' && (
                <form onSubmit={handleRespond}>
                  <label className="label">Record Response / Resolution</label>
                  <textarea
                    value={responseText}
                    onChange={e => setResponseText(e.target.value)}
                    placeholder="Type the response or resolution here…"
                    required
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E7B12E', borderRadius: '8px', background: 'white', color: '#3D1400', fontFamily: 'Outfit, sans-serif', fontSize: '14px', resize: 'vertical', minHeight: '100px', outline: 'none', boxSizing: 'border-box' }}
                  />
                  <button type="submit" className="hs-btn-primary" style={{ marginTop: '12px' }}>Submit Response</button>
                </form>
              )}
            </div>
          ) : (
            <div className="hs-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
              <p style={{ color: '#8A4520', fontSize: '15px' }}>Select a request to view and respond</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RoomBedMonitoring() {
  const { beds, rooms, users } = useApp();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const filteredBeds = selectedRoom ? beds.filter(b => b.roomId === selectedRoom) : beds;

  return (
    <div style={{ paddingBottom: '40px' }}>
      <PageHeader title="Room & Bed Monitoring" subtitle="Check room and bed availability and occupancy" />
      <div style={{ padding: '24px 32px' }}>
        {/* Room filter */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button onClick={() => setSelectedRoom(null)} style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', background: !selectedRoom ? '#E17D12' : '#F5E8C8', color: !selectedRoom ? 'white' : '#8A4520' }}>All Rooms</button>
          {rooms.map(room => (
            <button key={room.id} onClick={() => setSelectedRoom(room.id)} style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', background: selectedRoom === room.id ? '#E17D12' : '#F5E8C8', color: selectedRoom === room.id ? 'white' : '#8A4520' }}>
              Room {room.number}
            </button>
          ))}
        </div>

        {/* Summary */}
        <div style={{ display: 'flex', gap: '14px', marginBottom: '20px' }}>
          <div style={{ background: '#D1FAE5', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, color: '#065F46' }}>
            ✓ {filteredBeds.filter(b => b.status === 'available').length} Available
          </div>
          <div style={{ background: '#DBEAFE', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, color: '#1E40AF' }}>
            ● {filteredBeds.filter(b => b.status === 'occupied').length} Occupied
          </div>
        </div>

        <div className="hs-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="hs-table">
            <thead><tr><th>Bed</th><th>Room</th><th>Category</th><th>Rent/mo</th><th>Status</th><th>Resident</th></tr></thead>
            <tbody>
              {filteredBeds.map((bed, i) => {
                const room = rooms.find(r => r.id === bed.roomId);
                const resident = bed.residentId ? users.find(u => u.id === bed.residentId) : null;
                return (
                  <tr key={bed.id} style={{ background: i % 2 === 1 ? 'rgba(236,228,143,0.06)' : 'white' }}>
                    <td style={{ fontWeight: 600 }}>{bed.label}</td>
                    <td>Room {room?.number}</td>
                    <td>{room?.category}</td>
                    <td>₱{room?.rentPerBed?.toLocaleString()}</td>
                    <td><span className={`badge ${bed.status === 'available' ? 'badge-green' : 'badge-blue'}`}>{bed.status}</span></td>
                    <td style={{ color: '#8A4520', fontSize: '13px' }}>{resident?.name || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function LeaseInformation() {
  const { leases, users, beds, rooms } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'terminated'>('all');

  const filtered = leases.filter(l => {
    const resident = users.find(u => u.id === l.residentId);
    const nameMatch = resident?.name.toLowerCase().includes(search.toLowerCase()) || !search;
    const statusMatch = filterStatus === 'all' || l.status === filterStatus;
    return nameMatch && statusMatch;
  });

  return (
    <div style={{ paddingBottom: '40px' }}>
      <PageHeader title="Lease Information" subtitle="View resident lease details and status" />
      <div style={{ padding: '24px 32px' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search resident…" className="hs-input" style={{ maxWidth: '240px' }} />
          {(['all', 'active', 'terminated'] as const).map(f => (
            <button key={f} onClick={() => setFilterStatus(f)} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', background: filterStatus === f ? '#E17D12' : '#F5E8C8', color: filterStatus === f ? 'white' : '#8A4520', textTransform: 'capitalize' }}>{f}</button>
          ))}
        </div>

        <div className="hs-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="hs-table">
            <thead><tr><th>Resident</th><th>Email</th><th>Room</th><th>Bed</th><th>Start</th><th>End</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map((lease, i) => {
                const resident = users.find(u => u.id === lease.residentId);
                const bed = beds.find(b => b.id === lease.bedId);
                const room = rooms.find(r => r.id === lease.roomId);
                return (
                  <tr key={lease.id} style={{ background: i % 2 === 1 ? 'rgba(236,228,143,0.06)' : 'white' }}>
                    <td style={{ fontWeight: 500 }}>{resident?.name}</td>
                    <td style={{ fontSize: '13px', color: '#8A4520' }}>{resident?.email}</td>
                    <td>Room {room?.number}</td>
                    <td>{bed?.label}</td>
                    <td>{lease.startDate}</td>
                    <td>{lease.endDate}</td>
                    <td><span className={`badge ${lease.status === 'active' ? 'badge-green' : 'badge-red'}`}>{lease.status}</span></td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: '#8A4520', padding: '20px' }}>No leases found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function BillingAssistance() {
  const { bills, setBills, users, addToast } = useApp();
  const [selectedBill, setSelectedBill] = useState<string | null>(null);

  function markPaid(id: string) {
    setBills(prev => prev.map(b => b.id === id ? { ...b, status: 'paid' as const } : b));
    addToast('success', 'Bill marked as paid.');
    setSelectedBill(null);
  }

  const unpaid = bills.filter(b => b.status === 'unpaid');
  const paid = bills.filter(b => b.status === 'paid');

  return (
    <div style={{ paddingBottom: '40px' }}>
      <PageHeader title="Billing Assistance" subtitle="Assist residents with billing concerns and view payment records" />
      <div style={{ padding: '24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#FEE2E2', borderRadius: '10px', padding: '16px 20px', border: '1px solid #FECACA' }}>
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', fontWeight: 600, color: '#991B1B', marginBottom: '4px' }}>{unpaid.length}</p>
            <p style={{ fontSize: '13px', color: '#991B1B' }}>Unpaid Bills</p>
          </div>
          <div style={{ background: '#D1FAE5', borderRadius: '10px', padding: '16px 20px', border: '1px solid #86EFAC' }}>
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', fontWeight: 600, color: '#065F46', marginBottom: '4px' }}>{paid.length}</p>
            <p style={{ fontSize: '13px', color: '#065F46' }}>Paid Bills</p>
          </div>
        </div>

        <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', color: '#3D1400', marginBottom: '14px' }}>Unpaid Bills — Require Assistance</h3>
        {unpaid.length === 0 ? (
          <div className="hs-card" style={{ textAlign: 'center' }}>
            <p style={{ color: '#8A4520', fontSize: '15px' }}>No unpaid bills. 🎉</p>
          </div>
        ) : (
          <div className="hs-card" style={{ padding: 0, overflow: 'hidden', marginBottom: '24px' }}>
            <table className="hs-table">
              <thead><tr><th>Resident</th><th>Period</th><th>Amount Due</th><th>Essential Bills</th><th>Action</th></tr></thead>
              <tbody>
                {unpaid.map((bill, i) => {
                  const resident = users.find(u => u.id === bill.residentId);
                  return (
                    <tr key={bill.id} style={{ background: i % 2 === 1 ? 'rgba(236,228,143,0.06)' : 'white' }}>
                      <td style={{ fontWeight: 500 }}>{resident?.name}</td>
                      <td>{bill.billingPeriod}</td>
                      <td style={{ fontWeight: 700, color: '#DC2626' }}>₱{bill.amount.toLocaleString()}</td>
                      <td style={{ fontSize: '12px', color: '#8A4520' }}>{bill.essentialBills}</td>
                      <td>
                        <button onClick={() => markPaid(bill.id)} style={{ background: '#D1FAE5', color: '#065F46', padding: '4px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, fontFamily: 'Outfit, sans-serif' }}>
                          Mark Paid
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', color: '#3D1400', marginBottom: '14px' }}>Billing/Payment Records</h3>
        <div className="hs-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="hs-table">
            <thead><tr><th>Resident</th><th>Period</th><th>Amount</th><th>Utility</th><th>Status</th></tr></thead>
            <tbody>
              {bills.map((bill, i) => {
                const resident = users.find(u => u.id === bill.residentId);
                return (
                  <tr key={bill.id} style={{ background: i % 2 === 1 ? 'rgba(236,228,143,0.06)' : 'white' }}>
                    <td style={{ fontWeight: 500 }}>{resident?.name}</td>
                    <td>{bill.billingPeriod}</td>
                    <td style={{ fontWeight: 600 }}>₱{bill.amount.toLocaleString()}</td>
                    <td style={{ fontSize: '12px' }}>{bill.utilityConsumption || '—'}</td>
                    <td><span className={`badge ${bill.status === 'paid' ? 'badge-green' : 'badge-red'}`}>{bill.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TransactionMonitoring() {
  const { bookings, users, beds, rooms, leases } = useApp();
  const [selected, setSelected] = useState<Booking | null>(null);

  return (
    <div style={{ paddingBottom: '40px' }}>
      <PageHeader title="Transaction Monitoring" subtitle="View booking, accommodation, and resident transaction details" />
      <div style={{ padding: '24px 32px', display: 'flex', gap: '24px' }}>
        <div style={{ flex: '0 0 340px' }}>
          <div className="hs-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', background: 'rgba(231,177,46,0.1)', borderBottom: '1px solid rgba(231,177,46,0.2)' }}>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', color: '#3D1400' }}>Transactions ({bookings.length})</h3>
            </div>
            <div style={{ maxHeight: '560px', overflowY: 'auto' }}>
              {bookings.map(booking => {
                const resident = users.find(u => u.id === booking.residentId);
                const bed = beds.find(b => b.id === booking.bedId);
                const room = rooms.find(r => r.id === booking.roomId);
                return (
                  <div key={booking.id} onClick={() => setSelected(booking)}
                    style={{ padding: '14px 18px', borderBottom: '1px solid rgba(231,177,46,0.1)', cursor: 'pointer', background: selected?.id === booking.id ? 'rgba(225,125,18,0.06)' : 'white', borderLeft: selected?.id === booking.id ? '3px solid #E17D12' : '3px solid transparent' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#3D1400' }}>{resident?.name}</span>
                      <span className={`badge ${booking.status === 'confirmed' ? 'badge-green' : 'badge-red'}`}>{booking.status}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#8A4520' }}>Room {room?.number} · {bed?.label}</p>
                    <p style={{ fontSize: '11px', color: '#B89070', marginTop: '2px' }}>{booking.startDate} → {booking.endDate}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          {selected ? (() => {
            const resident = users.find(u => u.id === selected.residentId);
            const bed = beds.find(b => b.id === selected.bedId);
            const room = rooms.find(r => r.id === selected.roomId);
            const lease = leases.find(l => l.residentId === selected.residentId && l.status === 'active');
            return (
              <div className="hs-card">
                <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: '#3D1400', marginBottom: '20px' }}>Booking / Transaction Details</h2>

                <div style={{ background: 'rgba(231,177,46,0.1)', borderRadius: '10px', padding: '16px 20px', marginBottom: '20px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#5C1A00', marginBottom: '12px' }}>Resident Information</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {[['Name', resident?.name], ['Username', `@${resident?.username}`], ['Email', resident?.email], ['Role', 'Resident']].map(([k, v]) => (
                      <div key={k}><p style={{ fontSize: '11px', color: '#8A4520', marginBottom: '2px' }}>{k}</p><p style={{ fontSize: '14px', color: '#3D1400', fontWeight: 500 }}>{v}</p></div>
                    ))}
                  </div>
                </div>

                <div style={{ background: '#FFFDF0', borderRadius: '10px', padding: '16px 20px', marginBottom: '20px', border: '1px solid rgba(231,177,46,0.2)' }}>
                  <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#5C1A00', marginBottom: '12px' }}>Accommodation Details</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {[['Room', `Room ${room?.number}`], ['Category', room?.category], ['Bed', bed?.label], ['Rent/mo', `₱${room?.rentPerBed?.toLocaleString()}`], ['Check-in', selected.startDate], ['Check-out', selected.endDate]].map(([k, v]) => (
                      <div key={k}><p style={{ fontSize: '11px', color: '#8A4520', marginBottom: '2px' }}>{k}</p><p style={{ fontSize: '14px', color: '#3D1400', fontWeight: 500 }}>{v}</p></div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#8A4520' }}>Booking Status:</span>
                  <span className={`badge ${selected.status === 'confirmed' ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '13px' }}>{selected.status}</span>
                  {lease && <span className="badge badge-blue" style={{ fontSize: '13px' }}>Lease: {lease.status}</span>}
                </div>
              </div>
            );
          })() : (
            <div className="hs-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
              <p style={{ color: '#8A4520', fontSize: '15px' }}>Select a transaction to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

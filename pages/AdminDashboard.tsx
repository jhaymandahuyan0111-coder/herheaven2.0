import { useState } from 'react';
import { useApp } from '../context';
import Sidebar from '../components/Sidebar';
import type { User, Room, Bed, Lease, Bill } from '../types';

type Section = 'overview' | 'residents' | 'staff' | 'rooms' | 'beds' | 'leases' | 'billing' | 'reports';

const sidebarItems = [
  { key: 'overview', label: 'Dashboard', icon: '🏠' },
  { key: 'residents', label: 'Resident Management', icon: '👤' },
  { key: 'staff', label: 'Staff Management', icon: '🛡️' },
  { key: 'rooms', label: 'Room Management', icon: '🚪' },
  { key: 'beds', label: 'Bed Management', icon: '🛏️' },
  { key: 'leases', label: 'Lease Management', icon: '📋' },
  { key: 'billing', label: 'Utility Billing', icon: '💳' },
  { key: 'reports', label: 'Reports', icon: '📊' },
];

export default function AdminDashboard() {
  const [section, setSection] = useState<Section>('overview');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Outfit, sans-serif' }}>
      <Sidebar activeSection={section} onSection={s => setSection(s as Section)} items={sidebarItems} title="Administration" subtitle="Admin Dashboard" />
      <div style={{ flex: 1, overflow: 'auto', background: '#FFFDF0' }}>
        {section === 'overview' && <AdminOverview onSection={s => setSection(s as Section)} />}
        {section === 'residents' && <ResidentManagement />}
        {section === 'staff' && <StaffManagement />}
        {section === 'rooms' && <RoomManagement />}
        {section === 'beds' && <BedManagement />}
        {section === 'leases' && <LeaseManagement />}
        {section === 'billing' && <UtilityBilling />}
        {section === 'reports' && <Reports />}
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

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  return (
    <div className="hs-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{icon}</div>
      <div>
        <p style={{ fontFamily: 'Fraunces, serif', fontSize: '26px', fontWeight: 600, color: '#3D1400' }}>{value}</p>
        <p style={{ fontSize: '13px', color: '#8A4520' }}>{label}</p>
      </div>
    </div>
  );
}

function AdminOverview({ onSection }: { onSection: (s: string) => void }) {
  const { users, rooms, beds, leases, bills, requests } = useApp();
  const residents = users.filter(u => u.role === 'resident');
  const staff = users.filter(u => u.role === 'staff');
  const availableBeds = beds.filter(b => b.status === 'available');
  const occupiedBeds = beds.filter(b => b.status === 'occupied');
  const unpaidBills = bills.filter(b => b.status === 'unpaid');
  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <div style={{ padding: '0 0 40px' }}>
      <PageHeader title="Admin Dashboard" subtitle="HiveStay: Youth Co-Living and Micro-Housing" />
      <div style={{ padding: '28px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <StatCard label="Total Residents" value={residents.length} icon="👤" color="rgba(225,125,18,0.15)" />
          <StatCard label="Active Staff" value={staff.filter(s => s.active !== false).length} icon="🛡️" color="rgba(186,83,4,0.12)" />
          <StatCard label="Available Beds" value={availableBeds.length} icon="🛏️" color="rgba(34,197,94,0.12)" />
          <StatCard label="Occupied Beds" value={occupiedBeds.length} icon="🏠" color="rgba(59,130,246,0.12)" />
          <StatCard label="Unpaid Bills" value={unpaidBills.length} icon="💳" color="rgba(239,68,68,0.12)" />
          <StatCard label="Pending Requests" value={pendingRequests.length} icon="🔔" color="rgba(245,158,11,0.12)" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="hs-card">
            <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', color: '#3D1400', marginBottom: '16px' }}>Quick Navigation</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {sidebarItems.slice(1).map(item => (
                <button key={item.key} onClick={() => onSection(item.key)}
                  style={{ background: 'rgba(231,177,46,0.1)', border: '1px solid rgba(231,177,46,0.25)', borderRadius: '9px', padding: '12px 14px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500, color: '#5C1A00', fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(225,125,18,0.12)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(231,177,46,0.1)'; }}
                >
                  <span>{item.icon}</span> {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hs-card">
            <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', color: '#3D1400', marginBottom: '16px' }}>Room Occupancy</h3>
            {rooms.map(room => {
              const roomBeds = beds.filter(b => b.roomId === room.id);
              const occ = roomBeds.filter(b => b.status === 'occupied').length;
              const pct = roomBeds.length > 0 ? Math.round((occ / roomBeds.length) * 100) : 0;
              return (
                <div key={room.id} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '13px' }}>
                    <span style={{ fontWeight: 500, color: '#3D1400' }}>Room {room.number} <span style={{ color: '#8A4520', fontWeight: 400 }}>({room.category})</span></span>
                    <span style={{ color: '#8A4520' }}>{occ}/{roomBeds.length} beds</span>
                  </div>
                  <div style={{ height: '8px', background: '#F5E8C8', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: pct >= 80 ? '#DC2626' : pct >= 50 ? '#E17D12' : '#22C55E', borderRadius: '4px', transition: 'width 0.5s' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResidentManagement() {
  const { users, leases, beds, rooms, addToast } = useApp();
  const residents = users.filter(u => u.role === 'resident');
  const [selectedResident, setSelectedResident] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editContact, setEditContact] = useState('');

  function openResident(r: User) {
    setSelectedResident(r);
    setEditMode(false);
    setEditName(r.name);
    setEditContact(r.contact || '');
  }

  function getResidentLease(id: string) {
    return leases.find(l => l.residentId === id && l.status === 'active');
  }

  function getResidentBed(lease: Lease | undefined) {
    if (!lease) return null;
    return beds.find(b => b.id === lease.bedId);
  }

  function getRoom(lease: Lease | undefined) {
    if (!lease) return null;
    return rooms.find(r => r.id === lease.roomId);
  }

  const { setUsers } = useApp();

  function handleSave() {
    if (!selectedResident) return;
    setUsers(prev => prev.map(u => u.id === selectedResident.id ? { ...u, name: editName, contact: editContact } : u));
    setSelectedResident(prev => prev ? { ...prev, name: editName, contact: editContact } : null);
    setEditMode(false);
    addToast('success', 'Resident information updated.');
  }

  return (
    <div style={{ paddingBottom: '40px' }}>
      <PageHeader title="Resident Management" subtitle="View and manage all resident accounts" />
      <div style={{ padding: '24px 32px', display: 'flex', gap: '24px' }}>
        {/* List */}
        <div style={{ flex: '0 0 340px' }}>
          <div className="hs-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(231,177,46,0.2)', background: 'rgba(231,177,46,0.08)' }}>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', color: '#3D1400' }}>Resident List ({residents.length})</h3>
            </div>
            <div style={{ maxHeight: '560px', overflowY: 'auto' }}>
              {residents.map(r => {
                const lease = getResidentLease(r.id);
                return (
                  <div key={r.id} onClick={() => openResident(r)}
                    style={{ padding: '14px 20px', borderBottom: '1px solid rgba(231,177,46,0.1)', cursor: 'pointer', background: selectedResident?.id === r.id ? 'rgba(225,125,18,0.08)' : 'white', borderLeft: selectedResident?.id === r.id ? '3px solid #E17D12' : '3px solid transparent', transition: 'all 0.15s' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E17D12', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
                        {r.name.charAt(0)}
                      </div>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#3D1400' }}>{r.name}</p>
                        <p style={{ fontSize: '12px', color: '#8A4520' }}>{lease ? `Room ${rooms.find(rm => rm.id === lease.roomId)?.number}` : 'No active lease'}</p>
                      </div>
                      <span className={`badge ${lease ? 'badge-green' : 'badge-yellow'}`} style={{ marginLeft: 'auto' }}>
                        {lease ? 'Active' : 'No Lease'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detail */}
        <div style={{ flex: 1 }}>
          {selectedResident ? (
            <div className="hs-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: '#3D1400', marginBottom: '4px' }}>{selectedResident.name}</h2>
                  <p style={{ color: '#8A4520', fontSize: '14px' }}>@{selectedResident.username}</p>
                </div>
                {!editMode && (
                  <button onClick={() => setEditMode(true)} className="hs-btn-sm">Edit Info</button>
                )}
              </div>

              {!editMode ? (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    {[
                      ['Email', selectedResident.email || '—'],
                      ['Username', selectedResident.username],
                      ['Contact', selectedResident.contact || '—'],
                      ['Status', 'Active'],
                    ].map(([k, v]) => (
                      <div key={k} style={{ background: '#FFFDF0', borderRadius: '8px', padding: '12px 14px', border: '1px solid rgba(231,177,46,0.2)' }}>
                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#8A4520', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{k}</p>
                        <p style={{ fontSize: '14px', color: '#3D1400', fontWeight: 500 }}>{v}</p>
                      </div>
                    ))}
                  </div>

                  {(() => {
                    const lease = getResidentLease(selectedResident.id);
                    const bed = getResidentBed(lease);
                    const room = getRoom(lease);
                    return lease ? (
                      <div style={{ background: 'rgba(231,177,46,0.1)', borderRadius: '10px', padding: '16px 20px', border: '1px solid rgba(231,177,46,0.25)' }}>
                        <p style={{ fontWeight: 700, fontSize: '13px', color: '#5C1A00', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Active Lease & Booking</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          {[
                            ['Room', `Room ${room?.number} (${room?.category})`],
                            ['Bed', bed?.label || '—'],
                            ['Start Date', lease.startDate],
                            ['End Date', lease.endDate],
                            ['Rent / bed', `₱${room?.rentPerBed?.toLocaleString()}/mo`],
                            ['Lease Status', lease.status],
                          ].map(([k, v]) => (
                            <div key={k}>
                              <p style={{ fontSize: '11px', color: '#8A4520', marginBottom: '2px' }}>{k}</p>
                              <p style={{ fontSize: '14px', color: '#3D1400', fontWeight: 500, textTransform: 'capitalize' }}>{v}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div style={{ background: '#FEF3C7', borderRadius: '10px', padding: '16px 20px', border: '1px solid #FCD34D' }}>
                        <p style={{ color: '#92400E', fontSize: '14px' }}>No active lease or booking found for this resident.</p>
                      </div>
                    );
                  })()}
                </>
              ) : (
                <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                  <div style={{ marginBottom: '16px' }}>
                    <label className="label">Full Name</label>
                    <input value={editName} onChange={e => setEditName(e.target.value)} className="hs-input" required />
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <label className="label">Contact Number</label>
                    <input value={editContact} onChange={e => setEditContact(e.target.value)} className="hs-input" placeholder="09XXXXXXXXX" />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="hs-btn-primary">Save Changes</button>
                    <button type="button" onClick={() => setEditMode(false)} className="hs-btn-outline">Cancel</button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="hs-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
              <p style={{ color: '#8A4520', fontSize: '15px' }}>Select a resident to view their details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StaffManagement() {
  const { users, setUsers, addToast } = useApp();
  const staffUsers = users.filter(u => u.role === 'staff');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', alias: '', contact: '', email: '', username: '', password: '' });
  const [formError, setFormError] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<User | null>(null);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    const existing = users.find(u => u.username === form.username);
    if (existing) { setFormError('Username already exists.'); return; }
    const newStaff: User = { id: `staff-${Date.now()}`, username: form.username, password: form.password, name: form.name, role: 'staff', email: form.email, alias: form.alias, contact: form.contact, active: true };
    setUsers(prev => [...prev, newStaff]);
    addToast('success', `Staff account for ${form.name} created.`);
    setForm({ name: '', alias: '', contact: '', email: '', username: '', password: '' });
    setShowForm(false);
  }

  function toggleActive(id: string, current: boolean | undefined) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !current } : u));
    addToast('success', current ? 'Staff account deactivated.' : 'Staff account activated.');
    if (selectedStaff?.id === id) setSelectedStaff(prev => prev ? { ...prev, active: !current } : null);
  }

  return (
    <div style={{ paddingBottom: '40px' }}>
      <PageHeader title="Staff Management" subtitle="Manage staff accounts and permissions" />
      <div style={{ padding: '24px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button onClick={() => setShowForm(true)} className="hs-btn-primary">+ Add Staff Account</button>
        </div>

        <div className="hs-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="hs-table">
            <thead><tr><th>Name</th><th>Username</th><th>Alias</th><th>Contact</th><th>Email</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {staffUsers.map((s, i) => (
                <tr key={s.id} style={{ background: i % 2 === 1 ? 'rgba(236,228,143,0.06)' : 'white' }}>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td style={{ color: '#8A4520' }}>{s.username}</td>
                  <td>{s.alias || '—'}</td>
                  <td>{s.contact || '—'}</td>
                  <td style={{ fontSize: '13px' }}>{s.email || '—'}</td>
                  <td><span className={`badge ${s.active !== false ? 'badge-green' : 'badge-red'}`}>{s.active !== false ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <button onClick={() => toggleActive(s.id, s.active !== false)}
                      style={{ background: s.active !== false ? '#FEE2E2' : '#D1FAE5', color: s.active !== false ? '#991B1B' : '#065F46', padding: '4px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, fontFamily: 'Outfit, sans-serif' }}>
                      {s.active !== false ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: '#3D1400', marginBottom: '20px' }}>Add Staff Account</h2>
              {formError && <div style={{ background: '#FEE2E2', padding: '10px 14px', borderRadius: '8px', color: '#991B1B', fontSize: '14px', marginBottom: '16px' }}>{formError}</div>}
              <form onSubmit={handleCreate}>
                {[
                  { label: 'Full Name', key: 'name', placeholder: 'Enter full name' },
                  { label: 'Alias', key: 'alias', placeholder: 'Short alias (e.g. jcruz)' },
                  { label: 'Contact Number', key: 'contact', placeholder: '09XXXXXXXXX' },
                  { label: 'Email Address', key: 'email', placeholder: 'staff@hivestay.com' },
                  { label: 'Username', key: 'username', placeholder: 'Login username' },
                  { label: 'Password', key: 'password', placeholder: 'Set password', type: 'password' },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: '14px' }}>
                    <label className="label">{f.label}</label>
                    <input type={f.type || 'text'} value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder} className="hs-input" required />
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button type="submit" className="hs-btn-primary">Create Account</button>
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

function RoomManagement() {
  const { rooms, setRooms, beds, addToast } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ number: '', capacity: '', rentPerBed: '', category: 'Standard' });
  const [formError, setFormError] = useState('');
  const { setBeds } = useApp();

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    if (rooms.find(r => r.number === form.number)) { setFormError('Room number already exists.'); return; }
    const cap = parseInt(form.capacity);
    const newRoom: Room = { id: `room-${Date.now()}`, number: form.number, capacity: cap, rentPerBed: parseInt(form.rentPerBed), category: form.category };
    const newBeds: Bed[] = Array.from({ length: cap }, (_, i) => ({
      id: `bed-${Date.now()}-${i}`, roomId: newRoom.id, label: `${form.number}-${String.fromCharCode(65 + i)}`, status: 'available' as const,
    }));
    setRooms(prev => [...prev, newRoom]);
    setBeds(prev => [...prev, ...newBeds]);
    addToast('success', `Room ${form.number} created with ${cap} beds.`);
    setForm({ number: '', capacity: '', rentPerBed: '', category: 'Standard' });
    setShowForm(false);
  }

  return (
    <div style={{ paddingBottom: '40px' }}>
      <PageHeader title="Room Management" subtitle="Manage all rooms and bed configurations" />
      <div style={{ padding: '24px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button onClick={() => setShowForm(true)} className="hs-btn-primary">+ Add Room</button>
        </div>

        <div className="hs-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="hs-table">
            <thead><tr><th>Room No.</th><th>Category</th><th>Capacity</th><th>Rent / Bed</th><th>Available</th><th>Occupied</th></tr></thead>
            <tbody>
              {rooms.map((room, i) => {
                const roomBeds = beds.filter(b => b.roomId === room.id);
                const avail = roomBeds.filter(b => b.status === 'available').length;
                const occ = roomBeds.filter(b => b.status === 'occupied').length;
                return (
                  <tr key={room.id} style={{ background: i % 2 === 1 ? 'rgba(236,228,143,0.06)' : 'white' }}>
                    <td style={{ fontWeight: 600 }}>Room {room.number}</td>
                    <td><span className="badge badge-orange">{room.category}</span></td>
                    <td>{room.capacity} beds</td>
                    <td>₱{room.rentPerBed.toLocaleString()}/mo</td>
                    <td><span className="badge badge-green">{avail} available</span></td>
                    <td><span className={`badge ${occ > 0 ? 'badge-blue' : 'badge-yellow'}`}>{occ} occupied</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: '#3D1400', marginBottom: '20px' }}>Add New Room</h2>
              {formError && <div style={{ background: '#FEE2E2', padding: '10px 14px', borderRadius: '8px', color: '#991B1B', fontSize: '14px', marginBottom: '16px' }}>{formError}</div>}
              <form onSubmit={handleCreate}>
                <div style={{ marginBottom: '14px' }}><label className="label">Room Number</label><input value={form.number} onChange={e => setForm(p => ({ ...p, number: e.target.value }))} className="hs-input" placeholder="e.g. 303" required /></div>
                <div style={{ marginBottom: '14px' }}><label className="label">Capacity (beds)</label><input type="number" min={1} max={10} value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))} className="hs-input" required /></div>
                <div style={{ marginBottom: '14px' }}><label className="label">Rent per Bed (₱/month)</label><input type="number" min={1000} value={form.rentPerBed} onChange={e => setForm(p => ({ ...p, rentPerBed: e.target.value }))} className="hs-input" required /></div>
                <div style={{ marginBottom: '20px' }}>
                  <label className="label">Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="hs-input">
                    <option>Standard</option><option>Premium</option><option>Studio</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="hs-btn-primary">Save Room</button>
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

function BedManagement() {
  const { beds, rooms, users } = useApp();

  return (
    <div style={{ paddingBottom: '40px' }}>
      <PageHeader title="Bed Management" subtitle="View availability and occupancy status of all beds" />
      <div style={{ padding: '24px 32px' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <div style={{ background: '#D1FAE5', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: 600, color: '#065F46' }}>
            ✓ {beds.filter(b => b.status === 'available').length} Available
          </div>
          <div style={{ background: '#DBEAFE', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: 600, color: '#1E40AF' }}>
            ● {beds.filter(b => b.status === 'occupied').length} Occupied
          </div>
        </div>

        <div className="hs-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="hs-table">
            <thead><tr><th>Bed Label</th><th>Room</th><th>Category</th><th>Rent/mo</th><th>Status</th><th>Resident</th></tr></thead>
            <tbody>
              {beds.map((bed, i) => {
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

function LeaseManagement() {
  const { leases, setLeases, users, beds, setBeds, rooms, addToast } = useApp();

  function terminateLease(id: string, bedId: string) {
    setLeases(prev => prev.map(l => l.id === id ? { ...l, status: 'terminated' as const } : l));
    setBeds(prev => prev.map(b => b.id === bedId ? { ...b, status: 'available' as const, residentId: undefined } : b));
    addToast('success', 'Lease terminated successfully.');
  }

  return (
    <div style={{ paddingBottom: '40px' }}>
      <PageHeader title="Lease Management" subtitle="View and manage resident leases" />
      <div style={{ padding: '24px 32px' }}>
        <div className="hs-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="hs-table">
            <thead><tr><th>Resident</th><th>Room / Bed</th><th>Start Date</th><th>End Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {leases.map((lease, i) => {
                const resident = users.find(u => u.id === lease.residentId);
                const bed = beds.find(b => b.id === lease.bedId);
                const room = rooms.find(r => r.id === lease.roomId);
                return (
                  <tr key={lease.id} style={{ background: i % 2 === 1 ? 'rgba(236,228,143,0.06)' : 'white' }}>
                    <td style={{ fontWeight: 500 }}>{resident?.name || '—'}</td>
                    <td>Room {room?.number} / {bed?.label}</td>
                    <td>{lease.startDate}</td>
                    <td>{lease.endDate}</td>
                    <td><span className={`badge ${lease.status === 'active' ? 'badge-green' : 'badge-red'}`}>{lease.status}</span></td>
                    <td>
                      {lease.status === 'active' && (
                        <button onClick={() => terminateLease(lease.id, lease.bedId)} className="hs-btn-danger">Terminate</button>
                      )}
                    </td>
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

function UtilityBilling() {
  const { bills, setBills, users, rooms, beds, addToast } = useApp();
  const residents = users.filter(u => u.role === 'resident');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ residentId: '', roomId: '', bedId: '', billingPeriod: '', amount: '', status: 'unpaid', essentialBills: '', utilityConsumption: '' });

  const residentBeds = form.residentId ? beds.filter(b => b.residentId === form.residentId) : [];
  const roomsForResident = residentBeds.map(b => rooms.find(r => r.id === b.roomId)).filter(Boolean) as Room[];

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const newBill: Bill = { id: `bill-${Date.now()}`, ...form, amount: parseFloat(form.amount), status: form.status as 'paid' | 'unpaid' };
    setBills(prev => [...prev, newBill]);
    addToast('success', 'Bill added successfully.');
    setForm({ residentId: '', roomId: '', bedId: '', billingPeriod: '', amount: '', status: 'unpaid', essentialBills: '', utilityConsumption: '' });
    setShowForm(false);
  }

  return (
    <div style={{ paddingBottom: '40px' }}>
      <PageHeader title="Utility Billing" subtitle="Manage resident bills and utilities" />
      <div style={{ padding: '24px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button onClick={() => setShowForm(true)} className="hs-btn-primary">+ Add Bill</button>
        </div>

        <div className="hs-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="hs-table">
            <thead><tr><th>Resident</th><th>Period</th><th>Amount</th><th>Essential Bills</th><th>Utility</th><th>Status</th></tr></thead>
            <tbody>
              {bills.map((bill, i) => {
                const resident = users.find(u => u.id === bill.residentId);
                return (
                  <tr key={bill.id} style={{ background: i % 2 === 1 ? 'rgba(236,228,143,0.06)' : 'white' }}>
                    <td style={{ fontWeight: 500 }}>{resident?.name || '—'}</td>
                    <td>{bill.billingPeriod}</td>
                    <td style={{ fontWeight: 600 }}>₱{bill.amount.toLocaleString()}</td>
                    <td style={{ fontSize: '12px', color: '#8A4520', maxWidth: '180px' }}>{bill.essentialBills}</td>
                    <td style={{ fontSize: '12px' }}>{bill.utilityConsumption || '—'}</td>
                    <td><span className={`badge ${bill.status === 'paid' ? 'badge-green' : 'badge-red'}`}>{bill.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: '#3D1400', marginBottom: '20px' }}>Add New Bill</h2>
              <form onSubmit={handleCreate}>
                <div style={{ marginBottom: '14px' }}>
                  <label className="label">Resident</label>
                  <select value={form.residentId} onChange={e => setForm(p => ({ ...p, residentId: e.target.value, bedId: '', roomId: '' }))} className="hs-input" required>
                    <option value="">Select resident</option>
                    {residents.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <label className="label">Bed</label>
                  <select value={form.bedId} onChange={e => { const bed = beds.find(b => b.id === e.target.value); setForm(p => ({ ...p, bedId: e.target.value, roomId: bed?.roomId || '' })); }} className="hs-input" required disabled={!form.residentId}>
                    <option value="">Select bed</option>
                    {residentBeds.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: '14px' }}><label className="label">Billing Period</label><input value={form.billingPeriod} onChange={e => setForm(p => ({ ...p, billingPeriod: e.target.value }))} className="hs-input" placeholder="e.g. March 2024" required /></div>
                <div style={{ marginBottom: '14px' }}><label className="label">Amount (₱)</label><input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} className="hs-input" required /></div>
                <div style={{ marginBottom: '14px' }}><label className="label">Essential Bills</label><input value={form.essentialBills} onChange={e => setForm(p => ({ ...p, essentialBills: e.target.value }))} className="hs-input" placeholder="e.g. Electricity: ₱500, Water: ₱200" /></div>
                <div style={{ marginBottom: '14px' }}><label className="label">Utility Consumption</label><input value={form.utilityConsumption} onChange={e => setForm(p => ({ ...p, utilityConsumption: e.target.value }))} className="hs-input" placeholder="e.g. 45 kWh" /></div>
                <div style={{ marginBottom: '20px' }}>
                  <label className="label">Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="hs-input">
                    <option value="unpaid">Unpaid</option><option value="paid">Paid</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="hs-btn-primary">Save Bill</button>
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

function Reports() {
  const { beds, rooms, bills, users, leases } = useApp();
  const residents = users.filter(u => u.role === 'resident');
  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(b => b.status === 'occupied').length;
  const unpaidBills = bills.filter(b => b.status === 'unpaid');
  const unpaidTotal = unpaidBills.reduce((s, b) => s + b.amount, 0);
  const activeLeases = leases.filter(l => l.status === 'active').length;

  const utilityByRoom = rooms.map(room => {
    const roomBills = bills.filter(b => b.roomId === room.id);
    const totalKwh = roomBills.reduce((s, b) => {
      const match = b.utilityConsumption?.match(/(\d+)/);
      return s + (match ? parseInt(match[1]) : 0);
    }, 0);
    return { room, totalKwh };
  }).sort((a, b) => b.totalKwh - a.totalKwh);

  return (
    <div style={{ paddingBottom: '40px' }}>
      <PageHeader title="Reports" subtitle="Analytics and operational insights" />
      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Occupancy */}
        <div className="hs-card">
          <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', color: '#3D1400', marginBottom: '20px' }}>Room Occupancy Report</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Total Beds', value: totalBeds, color: '#DBEAFE', text: '#1E40AF' },
              { label: 'Occupied', value: occupiedBeds, color: '#D1FAE5', text: '#065F46' },
              { label: 'Available', value: totalBeds - occupiedBeds, color: '#FEF3C7', text: '#92400E' },
              { label: 'Occupancy Rate', value: `${Math.round((occupiedBeds / totalBeds) * 100)}%`, color: 'rgba(225,125,18,0.12)', text: '#5C1A00' },
              { label: 'Active Leases', value: activeLeases, color: '#F0FDF4', text: '#166534' },
              { label: 'Residents', value: residents.length, color: '#FFEDD5', text: '#9A3412' },
            ].map(({ label, value, color, text }) => (
              <div key={label} style={{ background: color, borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                <p style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', fontWeight: 600, color: text, marginBottom: '4px' }}>{value}</p>
                <p style={{ fontSize: '12px', color: text, opacity: 0.8 }}>{label}</p>
              </div>
            ))}
          </div>

          <h4 style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', color: '#3D1400', marginBottom: '14px' }}>Per-Room Occupancy</h4>
          {rooms.map(room => {
            const rb = beds.filter(b => b.roomId === room.id);
            const occ = rb.filter(b => b.status === 'occupied').length;
            const pct = rb.length ? Math.round((occ / rb.length) * 100) : 0;
            return (
              <div key={room.id} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '90px', fontSize: '13px', fontWeight: 500, color: '#3D1400', flexShrink: 0 }}>Room {room.number}</span>
                <div style={{ flex: 1, height: '10px', background: '#F5E8C8', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: pct >= 80 ? '#DC2626' : pct >= 50 ? '#E17D12' : '#22C55E', borderRadius: '5px' }} />
                </div>
                <span style={{ fontSize: '12px', color: '#8A4520', width: '60px', textAlign: 'right', flexShrink: 0 }}>{occ}/{rb.length} ({pct}%)</span>
              </div>
            );
          })}
        </div>

        {/* Unpaid bills */}
        <div className="hs-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', color: '#3D1400' }}>Unpaid/Overdue Invoices</h3>
            <span style={{ background: '#FEE2E2', color: '#991B1B', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
              Total: ₱{unpaidTotal.toLocaleString()}
            </span>
          </div>
          {unpaidBills.length === 0 ? (
            <p style={{ color: '#8A4520', fontSize: '14px' }}>No unpaid invoices. 🎉</p>
          ) : (
            <table className="hs-table">
              <thead><tr><th>Resident</th><th>Period</th><th>Amount Due</th><th>Essential Bills</th></tr></thead>
              <tbody>
                {unpaidBills.map((bill, i) => {
                  const resident = users.find(u => u.id === bill.residentId);
                  return (
                    <tr key={bill.id} style={{ background: i % 2 === 1 ? 'rgba(254,226,226,0.3)' : 'white' }}>
                      <td style={{ fontWeight: 500 }}>{resident?.name}</td>
                      <td>{bill.billingPeriod}</td>
                      <td style={{ fontWeight: 700, color: '#DC2626' }}>₱{bill.amount.toLocaleString()}</td>
                      <td style={{ fontSize: '12px', color: '#8A4520' }}>{bill.essentialBills}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Utility rankings */}
        <div className="hs-card">
          <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', color: '#3D1400', marginBottom: '20px' }}>Utility Consumption Rankings</h3>
          {utilityByRoom.map(({ room, totalKwh }, i) => (
            <div key={room.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px', padding: '12px 16px', background: i === 0 ? 'rgba(225,125,18,0.08)' : '#FFFDF0', borderRadius: '8px', border: '1px solid rgba(231,177,46,0.15)' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: i === 0 ? '#E17D12' : '#E7D4B8', color: i === 0 ? 'white' : '#8A4520', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', flexShrink: 0 }}>#{i + 1}</span>
              <span style={{ flex: 1, fontWeight: 500, color: '#3D1400', fontSize: '14px' }}>Room {room.number} ({room.category})</span>
              <span style={{ color: '#8A4520', fontSize: '13px', fontWeight: 600 }}>{totalKwh} kWh total</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

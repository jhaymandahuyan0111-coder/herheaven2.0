import { AppProvider, useApp } from './context';
import ToastContainer from './components/ToastContainer';
import HomePage from './pages/HomePage';
import SelectRolePage from './pages/SelectRolePage';
import AdminLoginPage from './pages/AdminLoginPage';
import ResidentLoginPage from './pages/ResidentLoginPage';
import ResidentSignUpPage from './pages/ResidentSignUpPage';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import ResidentDashboard from './pages/ResidentDashboard';

function GoodbyePage() {
  const { setPage } = useApp();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #892E00 0%, #E17D12 100%)', fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: '72px', marginBottom: '20px' }}>🏠</div>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '52px', fontWeight: 700, marginBottom: '16px', color: '#ECE48F' }}>Thank you for visiting</h1>
        <p style={{ fontSize: '18px', opacity: 0.85, marginBottom: '36px' }}>HiveStay — Youth Co-Living &amp; Micro-Housing</p>
        <button
          onClick={() => setPage('home')}
          style={{ background: '#ECE48F', color: '#892E00', padding: '13px 36px', borderRadius: '10px', fontWeight: 700, fontSize: '16px', border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}

function Router() {
  const { page } = useApp();
  return (
    <>
      {page === 'home' && <HomePage />}
      {page === 'select-role' && <SelectRolePage />}
      {page === 'admin-login' && <AdminLoginPage />}
      {page === 'resident-login' && <ResidentLoginPage />}
      {page === 'resident-signup' && <ResidentSignUpPage />}
      {page === 'admin-dashboard' && <AdminDashboard />}
      {page === 'staff-dashboard' && <StaffDashboard />}
      {page === 'resident-dashboard' && <ResidentDashboard />}
      {page === 'goodbye' && <GoodbyePage />}
      <ToastContainer />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}

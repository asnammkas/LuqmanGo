import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../config/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { User, Package, MapPin, CreditCard, Bell, HelpCircle, ShieldCheck, LogOut, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const ProfileDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [addressCount, setAddressCount] = useState(0);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'users', currentUser.uid, 'addresses'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAddressCount(snapshot.docs.length);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const user = {
    name: currentUser?.displayName || 'LuqmanGo Member',
    email: currentUser?.email || '',
    initials: (currentUser?.displayName || 'U').split(' ').map(n => n[0]).join('').toUpperCase(),
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--color-bg-main)', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <div style={{ 
              width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#001d04', 
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.2rem', fontWeight: 400, border: '3px solid #FAF8F5', boxShadow: '0 8px 25px rgba(0,29,4,0.06)'
            }}>
              <User size={40} strokeWidth={1.5} />
            </div>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#001d04', marginBottom: '0', letterSpacing: '-0.02em' }}>{user.name}</h1>
        </div>

        {/* Account Management Menu */}
        <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', color: '#706F65', marginBottom: '0.8rem', marginLeft: '0.6rem' }}>
          ACCOUNT MANAGEMENT
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '0.4rem', boxShadow: '0 8px 30px rgba(0,0,0,0.02)', marginBottom: '2.5rem', border: '1px solid rgba(0,0,0,0.03)' }}>
          
          <button onClick={() => navigate('/profile/orders')} style={{ width: '100%', background: 'none', border: 'none', display: 'flex', alignItems: 'center', padding: '1rem', cursor: 'pointer', borderBottom: '1px solid #F3F2EE', transition: 'background-color 0.2s', borderRadius: '16px 16px 0 0' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#FBF5EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
              <Package size={18} color="#001d04" />
            </div>
            <div style={{ flexGrow: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 700, color: '#001d04', fontSize: '0.95rem', marginBottom: '0.1rem' }}>My Orders</div>
              <div style={{ fontSize: '0.75rem', color: '#706F65', fontWeight: 400 }}>History and tracking</div>
            </div>
            <ChevronRight size={16} color="#C5BBB0" />
          </button>

          <button onClick={() => navigate('/profile/addresses')} style={{ width: '100%', background: 'none', border: 'none', display: 'flex', alignItems: 'center', padding: '1rem', cursor: 'pointer', borderBottom: '1px solid #F3F2EE', transition: 'background-color 0.2s' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#FBF5EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
              <MapPin size={18} color="#001d04" />
            </div>
            <div style={{ flexGrow: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 700, color: '#001d04', fontSize: '0.95rem', marginBottom: '0.1rem' }}>Shipping Addresses</div>
              <div style={{ fontSize: '0.75rem', color: '#706F65', fontWeight: 400 }}>{addressCount} saved location{addressCount !== 1 ? 's' : ''}</div>
            </div>
            <ChevronRight size={16} color="#C5BBB0" />
          </button>

          <button onClick={() => navigate('/profile/payments')} style={{ width: '100%', background: 'none', border: 'none', display: 'flex', alignItems: 'center', padding: '1rem', cursor: 'pointer', borderBottom: '1px solid #F3F2EE', transition: 'background-color 0.2s' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#FBF5EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
              <CreditCard size={18} color="#001d04" />
            </div>
            <div style={{ flexGrow: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 700, color: '#001d04', fontSize: '0.95rem', marginBottom: '0.1rem' }}>Payment Methods</div>
              <div style={{ fontSize: '0.75rem', color: '#706F65', fontWeight: 400 }}>Coming soon</div>
            </div>
            <ChevronRight size={16} color="#C5BBB0" />
          </button>

          <button onClick={() => navigate('/profile/settings')} style={{ width: '100%', background: 'none', border: 'none', display: 'flex', alignItems: 'center', padding: '1rem', cursor: 'pointer', borderBottom: '1px solid #F3F2EE', transition: 'background-color 0.2s' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#FBF5EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
              <User size={18} color="#001d04" />
            </div>
            <div style={{ flexGrow: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 700, color: '#001d04', fontSize: '0.95rem', marginBottom: '0.1rem' }}>Personal Information</div>
              <div style={{ fontSize: '0.75rem', color: '#706F65', fontWeight: 400 }}>Identity and contact</div>
            </div>
            <ChevronRight size={16} color="#C5BBB0" />
          </button>

          <button onClick={() => navigate('/profile/notifications')} style={{ width: '100%', background: 'none', border: 'none', display: 'flex', alignItems: 'center', padding: '1rem', cursor: 'pointer', borderRadius: '0 0 16px 16px', transition: 'background-color 0.2s' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#FBF5EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
              <Bell size={18} color="#001d04" />
            </div>
            <div style={{ flexGrow: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 700, color: '#001d04', fontSize: '0.95rem', marginBottom: '0.1rem' }}>Notifications</div>
              <div style={{ fontSize: '0.75rem', color: '#706F65', fontWeight: 400 }}>Email and SMS alerts</div>
            </div>
            <ChevronRight size={16} color="#C5BBB0" />
          </button>

        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2.5rem', padding: '0 1rem' }}>
          <button onClick={() => navigate('/profile/help')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', color: '#001d04', fontWeight: 600, fontSize: '0.9rem', transition: 'opacity 0.2s', ':hover': { opacity: 0.7 } }}>
            <HelpCircle size={18} /> Help Center
          </button>
          <button onClick={() => navigate('/profile/privacy')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', color: '#001d04', fontWeight: 600, fontSize: '0.9rem', transition: 'opacity 0.2s', ':hover': { opacity: 0.7 } }}>
            <ShieldCheck size={18} /> Privacy Policy
          </button>
        </div>

        {/* Logout Button */}
        <button onClick={handleLogout} className="btn" style={{ width: '100%', backgroundColor: '#001d04', color: 'white', borderRadius: '16px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', fontSize: '0.9rem', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 8px 25px rgba(0,29,4,0.1)' }}>
          <LogOut size={18} /> Sign Out
        </button>

      </div>
    </div>
  );
};

export default ProfileDashboard;

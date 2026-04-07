import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { db } from '../../../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { ArrowLeft, Bell, Star, TreePine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileSettings = () => {
  const { currentUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    notifications: {
      orderStatus: true,
      exclusiveOffers: false,
      planetImpact: true
    }
  });

  useEffect(() => {
    if (!currentUser) return;
    
    const fetchProfile = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'users', currentUser.uid));
        if (docSnap.exists()) {
          setProfileData(prev => ({ ...prev, ...docSnap.data() }));
        }
      } catch (err) { console.error(err); }
    };
    fetchProfile();
  }, [currentUser]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (profileData.name !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName: DOMPurify.sanitize(profileData.name) });
      }

      await setDoc(doc(db, 'users', currentUser.uid), {
        name: DOMPurify.sanitize(profileData.name),
        phone: DOMPurify.sanitize(profileData.phone),
        updatedAt: new Date().toISOString()
      }, { merge: true });

      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleNotification = async (key) => {
    if (!currentUser) return;
    const newVal = !profileData.notifications[key];
    const updatedNotifications = { ...profileData.notifications, [key]: newVal };
    setProfileData({ ...profileData, notifications: updatedNotifications });
    
    try {
      await setDoc(doc(db, 'users', currentUser.uid), {
        notifications: updatedNotifications
      }, { merge: true });
    } catch (err) {
      console.error("Error updating notifications:", err);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0.8rem 1.2rem 5rem', maxWidth: '1280px', margin: '0 auto', minHeight: '100vh', backgroundColor: 'var(--color-bg-main)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem' }}>
        <button 
          onClick={() => navigate('/profile')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#001d04', padding: '0.3rem', marginLeft: '-0.3rem' }}
        >
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04' }}>Account Settings</span>
      </div>
      
      <p style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: '1.6', fontWeight: 400, marginTop: '-0.3rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        Manage your identity and how we connect with you. Keep your personal information secure and up to date.
      </p>

      {/* Personal Info Section */}
      <div style={{ backgroundColor: '#EAE1D3', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(0,0,0,0.02)', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#001d04', marginBottom: '1.5rem' }}>Personal Details</h3>
        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label className="label" style={{ fontSize: '0.7rem', fontWeight: 800, color: '#706F65', marginBottom: '0.4rem', display: 'block', letterSpacing: '0.05em' }}>FULL NAME</label>
            <input 
              type="text" className="input" required
              value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              style={{ backgroundColor: '#FBF5EC', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '12px', padding: '1rem', width: '100%', fontSize: '0.95rem', fontWeight: 500 }} 
            />
          </div>
          <div>
            <label className="label" style={{ fontSize: '0.7rem', fontWeight: 800, color: '#706F65', marginBottom: '0.4rem', display: 'block', letterSpacing: '0.05em' }}>EMAIL ADDRESS</label>
            <input 
              type="email" className="input" disabled
              value={profileData.email} 
              style={{ backgroundColor: '#F3F2EE', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '12px', padding: '1rem', width: '100%', fontSize: '0.95rem', fontWeight: 500, opacity: 0.7, cursor: 'not-allowed' }} 
            />
          </div>
          <div>
            <label className="label" style={{ fontSize: '0.7rem', fontWeight: 800, color: '#706F65', marginBottom: '0.4rem', display: 'block', letterSpacing: '0.05em' }}>PHONE NUMBER</label>
            <input 
              type="tel" className="input" placeholder="+94 77 123 4567"
              value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              style={{ backgroundColor: '#FBF5EC', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '12px', padding: '1rem', width: '100%', fontSize: '0.95rem', fontWeight: 500 }} 
            />
          </div>
          <button 
            type="submit" disabled={loading} className="btn btn-primary" 
            style={{ 
              backgroundColor: '#001d04', color: 'white', border: 'none', padding: '1rem', width: '100%', 
              borderRadius: '12px', marginTop: '0.5rem', fontWeight: 700, fontSize: '0.95rem', 
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
              boxShadow: '0 8px 25px rgba(0,29,4,0.1)' 
            }}
          >
            {loading ? 'Updating...' : 'Update Details'}
          </button>
        </form>
      </div>

      {/* Notifications Section */}
      <div style={{ backgroundColor: '#EAE1D3', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '0.8rem', maxWidth: '600px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#001d04', marginBottom: '0.5rem' }}>Notification Preferences</h3>
        {[
          { key: 'orderStatus', icon: <Bell size={16} />, title: 'Order Status', desc: 'Real-time updates on delivery' },
          { key: 'exclusiveOffers', icon: <Star size={16} />, title: 'Exclusive Offers', desc: 'Discounts and curated drops' },
          { key: 'planetImpact', icon: <TreePine size={16} />, title: 'Planet Impact', desc: 'Monthly contribution reports' }
        ].map((item, idx) => (
          <div key={idx} style={{ padding: '1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: idx !== 2 ? '1px solid #F3F2EE' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#FBF5EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#001d04', fontSize: '0.9rem' }}>{item.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#706F65' }}>{item.desc}</div>
              </div>
            </div>
            <div 
              onClick={() => toggleNotification(item.key)}
              style={{ width: '40px', height: '22px', backgroundColor: profileData.notifications?.[item.key] ? '#436132' : '#C5BBB0', borderRadius: '20px', padding: '2px', position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s' }}
            >
               <div style={{ 
                 width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', 
                 position: 'absolute', 
                 right: profileData.notifications?.[item.key] ? '2px' : 'auto', 
                 left: profileData.notifications?.[item.key] ? 'auto' : '2px', 
                 transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
               }} />
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default ProfileSettings;

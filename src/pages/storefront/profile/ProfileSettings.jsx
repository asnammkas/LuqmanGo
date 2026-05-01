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
  const { currentUser, userProfile, updateUserProfile, deleteAccount } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || '',
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
          const data = docSnap.data();
          setProfileData(prev => ({ 
            ...prev, 
            ...data,
            phone: data.phone || userProfile?.phone || '',
            address: data.address || userProfile?.address || ''
          }));
        }
      } catch (err) { console.error(err); }
    };
    fetchProfile();
  }, [currentUser, userProfile]);

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
        address: DOMPurify.sanitize(profileData.address),
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // Sync to AuthContext so checkout auto-fills immediately
      updateUserProfile({ 
        phone: DOMPurify.sanitize(profileData.phone), 
        address: DOMPurify.sanitize(profileData.address) 
      });

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

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      toast.warning('Please type DELETE to confirm');
      return;
    }

    setLoading(true);
    try {
      await deleteAccount();
      toast.success('Your account has been permanently deleted.');
      navigate('/');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/requires-recent-login') {
        toast.error('For security reasons, you must log out and log back in before deleting your account.');
      } else {
        toast.error('Failed to delete account. Please try again later.');
      }
    } finally {
      setLoading(false);
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
            <label className="label" htmlFor="settings-name" style={{ fontSize: '0.7rem', fontWeight: 800, color: '#706F65', marginBottom: '0.4rem', display: 'block', letterSpacing: '0.05em' }}>FULL NAME</label>
            <input 
              id="settings-name"
              aria-label="Update Full Name"
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
            <label className="label" htmlFor="settings-phone" style={{ fontSize: '0.7rem', fontWeight: 800, color: '#706F65', marginBottom: '0.4rem', display: 'block', letterSpacing: '0.05em' }}>PHONE NUMBER</label>
            <input 
              id="settings-phone"
              aria-label="Update Phone Number"
              type="tel" className="input" placeholder="+94 77 123 4567"
              value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              style={{ backgroundColor: '#FBF5EC', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '12px', padding: '1rem', width: '100%', fontSize: '0.95rem', fontWeight: 500 }} 
            />
          </div>
          <div>
            <label className="label" htmlFor="settings-address" style={{ fontSize: '0.7rem', fontWeight: 800, color: '#706F65', marginBottom: '0.4rem', display: 'block', letterSpacing: '0.05em' }}>DELIVERY ADDRESS</label>
            <textarea 
              id="settings-address"
              aria-label="Update Delivery Address"
              className="input" placeholder="Building, Street, City, Pin Code"
              rows={3}
              value={profileData.address || ''} onChange={(e) => setProfileData({...profileData, address: e.target.value})}
              style={{ backgroundColor: '#FBF5EC', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '12px', padding: '1rem', width: '100%', fontSize: '0.95rem', fontWeight: 500, resize: 'none', fontFamily: 'inherit' }} 
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

      {/* Danger Zone Section */}
      <div style={{ backgroundColor: '#FBF5EC', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(239, 68, 68, 0.1)', maxWidth: '600px', margin: '2.5rem auto 0' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#EF4444', marginBottom: '1rem' }}>Danger Zone</h3>
        <p style={{ fontSize: '0.85rem', color: '#706F65', marginBottom: '1.5rem' }}>
          Deleting your account is permanent. This will erase all your profile data and saved addresses. Orders history remains for regulatory bookkeeping.
        </p>
        
        {!isDeleting ? (
          <button 
            onClick={() => setIsDeleting(true)}
            style={{ 
              backgroundColor: 'transparent', color: '#EF4444', border: '1px solid #EF4444', 
              padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Delete My Account
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#001d04' }}>Type "DELETE" to confirm:</label>
            <input 
              type="text" value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #EF4444', outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={handleDeleteAccount}
                disabled={loading || deleteConfirm !== 'DELETE'}
                style={{ backgroundColor: '#EF4444', color: 'white', border: 'none', padding: '0.8rem 1.2rem', borderRadius: '10px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: deleteConfirm === 'DELETE' ? 1 : 0.5, flex: 1 }}
              >
                Permanently Delete
              </button>
              <button 
                onClick={() => { setIsDeleting(false); setDeleteConfirm(''); }}
                style={{ backgroundColor: '#C5BBB0', color: 'white', border: 'none', padding: '0.8rem 1.2rem', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default ProfileSettings;

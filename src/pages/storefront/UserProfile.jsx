import { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db } from '../../config/firebase';
import { 
  User, Package, Settings, LogOut, ChevronRight, MapPin, CreditCard, Bell, HelpCircle, ShieldCheck, ArrowLeft, TreePine, Star,
  Truck, ChevronDown, FileText, PackageCheck, RefreshCw
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { orders } = useShop();
  const { currentUser, logout } = useAuth();
  const toast = useToast();
  const myOrders = orders.slice(0, 2);
  const [currentView, setCurrentView] = useState('main');
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  // Address Form State
  const [addressForm, setAddressForm] = useState({
    title: '',
    addressLine1: '',
    city: '',
    pinCode: '',
    isDefault: false
  });

  // Form states
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

  // Fetch extra profile data & Addresses
  useEffect(() => {
    if (!currentUser) return;
    
    // 1. Fetch Profile Info
    const fetchProfile = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'users', currentUser.uid));
        if (docSnap.exists()) {
          setProfileData(prev => ({ ...prev, ...docSnap.data() }));
        }
      } catch (err) { console.error(err); }
    };
    fetchProfile();

    // 2. Real-time Addresses
    const q = query(collection(db, 'users', currentUser.uid, 'addresses'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const addrList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAddresses(addrList);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingAddress) {
        // Update Existing
        await updateDoc(doc(db, 'users', currentUser.uid, 'addresses', editingAddress.id), {
          ...addressForm,
          updatedAt: serverTimestamp()
        });
      } else {
        // Create New
        await addDoc(collection(db, 'users', currentUser.uid, 'addresses'), {
          ...addressForm,
          createdAt: serverTimestamp()
        });
      }
      setCurrentView('addresses');
      setEditingAddress(null);
      setAddressForm({ title: '', addressLine1: '', city: '', pinCode: '', isDefault: false });
    } catch (err) {
      console.error(err);
      toast.error('Failed to save address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to remove this location?")) return;
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'addresses', id));
      setCurrentView('addresses');
    } catch (err) {
      console.error(err);
    }
  };

  const openEditAddress = (addr) => {
    setEditingAddress(addr);
    setAddressForm({
      title: addr.title,
      addressLine1: addr.addressLine1,
      city: addr.city,
      pinCode: addr.pinCode,
      isDefault: addr.isDefault || false
    });
    setCurrentView('edit-address');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // 1. Update Firebase Auth Profile (Name)
      if (profileData.name !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName: profileData.name });
      }

      // 2. Update Firestore Document (Phone & metadata)
      await setDoc(doc(db, 'users', currentUser.uid), {
        name: profileData.name, // Keep in sync
        phone: profileData.phone,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      toast.success('Profile updated successfully!');
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
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

  // Use real authenticated user data
  const user = {
    name: currentUser?.displayName || 'LuqmanGo Member',
    email: currentUser?.email || '',
    initials: (currentUser?.displayName || 'U').split(' ').map(n => n[0]).join('').toUpperCase(),
    points: '2,450',
    trees: 12,
    ordersInTransit: 3
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const BackButton = ({ title }) => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: title ? '1.5rem' : '0.5rem', padding: '0' }}>
      <button 
        onClick={() => setCurrentView('main')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.4rem', marginRight: '0.5rem', color: '#001d04', marginLeft: '-0.4rem', transition: 'transform 0.2s' }}
      >
        <ArrowLeft size={20} strokeWidth={2} />
      </button>
      {title && <h1 style={{ fontSize: '1.2rem', fontWeight: 500, color: '#001d04', margin: 0, letterSpacing: '-0.01em' }}>{title}</h1>}
    </div>
  );

  // --- Sub-Views Components ---
  const PersonalInfoView = () => (
    <div className="animate-fade-in" style={{ padding: '0.8rem 1.2rem 5rem', maxWidth: '1280px', margin: '0 auto', minHeight: '100vh', backgroundColor: 'var(--color-bg-main)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem' }}>
        <button 
          onClick={() => setCurrentView('main')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#001d04', padding: '0.3rem', marginLeft: '-0.3rem' }}
        >
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04' }}>Profile Details</span>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: '1.6', fontWeight: 400, marginTop: '-0.3rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        Manage your identity and how we connect with you. Keep your personal information secure and up to date.
      </p>
      <div style={{ backgroundColor: '#EAE1D3', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(0,0,0,0.02)', maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {message.text && (
            <div style={{ 
              padding: '1rem', 
              borderRadius: '12px', 
              backgroundColor: message.type === 'success' ? '#E4EDDB' : '#FDE8E8',
              color: message.type === 'success' ? '#436132' : '#C81E1E',
              fontSize: '0.85rem',
              fontWeight: 600,
              textAlign: 'center'
            }}>
              {message.text}
            </div>
          )}
          <div>
            <label className="label" style={{ fontSize: '0.7rem', fontWeight: 800, color: '#706F65', marginBottom: '0.4rem', display: 'block', letterSpacing: '0.05em' }}>FULL NAME</label>
            <input 
              type="text" 
              className="input" 
              value={profileData.name} 
              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              style={{ backgroundColor: '#FBF5EC', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '12px', padding: '1rem', width: '100%', fontSize: '0.95rem', fontWeight: 500 }} 
              required
            />
          </div>
          <div>
            <label className="label" style={{ fontSize: '0.7rem', fontWeight: 800, color: '#706F65', marginBottom: '0.4rem', display: 'block', letterSpacing: '0.05em' }}>EMAIL ADDRESS</label>
            <input 
              type="email" 
              className="input" 
              value={profileData.email} 
              disabled
              style={{ backgroundColor: '#F3F2EE', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '12px', padding: '1rem', width: '100%', fontSize: '0.95rem', fontWeight: 500, opacity: 0.7, cursor: 'not-allowed' }} 
            />
          </div>
          <div>
            <label className="label" style={{ fontSize: '0.7rem', fontWeight: 800, color: '#706F65', marginBottom: '0.4rem', display: 'block', letterSpacing: '0.05em' }}>PHONE NUMBER</label>
            <input 
              type="tel" 
              className="input" 
              value={profileData.phone} 
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              placeholder="+94 77 123 4567"
              style={{ backgroundColor: '#FBF5EC', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '12px', padding: '1rem', width: '100%', fontSize: '0.95rem', fontWeight: 500 }} 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary" 
            style={{ 
              backgroundColor: '#001d04', color: 'white', border: 'none', padding: '1rem', width: '100%', 
              borderRadius: '12px', marginTop: '0.5rem', fontWeight: 700, fontSize: '0.95rem', 
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
              boxShadow: '0 8px 25px rgba(0,29,4,0.1)' 
            }}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );

  const AddressesView = () => (
    <div className="animate-fade-in" style={{ padding: '0.8rem 1.2rem 5rem', maxWidth: '1280px', margin: '0 auto', minHeight: '100vh', backgroundColor: 'var(--color-bg-main)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem' }}>
        <button 
          onClick={() => setCurrentView('main')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#001d04', padding: '0.3rem', marginLeft: '-0.3rem' }}
        >
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
      <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04' }}>Saved Locations</span>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: '1.6', fontWeight: 400, marginTop: '-0.3rem', marginBottom: '2.5rem', maxWidth: '700px' }}>
        Your curated network of delivery destinations. Add, edit, or remove your frequent stops for faster checkouts.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {addresses.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#EAE1D3', borderRadius: '24px', opacity: 0.6 }}>
            <p style={{ fontSize: '0.85rem' }}>No addresses saved yet.</p>
          </div>
        )}
        {addresses.map(addr => (
          <div key={addr.id} style={{ backgroundColor: '#EAE1D3', borderRadius: '24px', padding: '1.5rem', border: addr.isDefault ? '1px solid #001d04' : '1px solid rgba(0,0,0,0.05)', position: 'relative' }}>
            {addr.isDefault && <div style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', backgroundColor: '#E4EDDB', color: '#436132', fontSize: '0.6rem', fontWeight: 800, padding: '0.3rem 0.6rem', borderRadius: '6px' }}>DEFAULT</div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
               <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#FBF5EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={16} color="#001d04" />
               </div>
               <span style={{ fontWeight: 700, color: '#001d04', fontSize: '1rem' }}>{addr.title}</span>
            </div>
            <p style={{ color: '#706F65', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.2rem', fontWeight: 400 }}>
              {addr.addressLine1}<br/>
              {addr.city}, {addr.pinCode}
            </p>
            <button 
              onClick={() => openEditAddress(addr)}
              style={{ color: '#001d04', background: 'transparent', border: '1px solid #001d04', padding: '0.4rem 1.2rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Modify Details
            </button>
          </div>
        ))}
        <button 
          onClick={() => { setAddressForm({ title: '', addressLine1: '', city: '', pinCode: '', isDefault: false }); setEditingAddress(null); setCurrentView('add-address'); }}
          style={{ backgroundColor: '#001d04', border: 'none', color: 'white', padding: '1.5rem', borderRadius: '24px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', boxShadow: '0 8px 25px rgba(0,29,4,0.1)' }}
        >
          + Add New Address
        </button>
      </div>
    </div>
  );
  
  const AddAddressView = () => (
    <div className="animate-fade-in" style={{ padding: '0.8rem 1.2rem 5rem', maxWidth: '1280px', margin: '0 auto', minHeight: '100vh', backgroundColor: 'var(--color-bg-main)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem' }}>
        <button 
          onClick={() => setCurrentView('addresses')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#001d04', padding: '0.3rem', marginLeft: '-0.3rem' }}
        >
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04' }}>Add New Address</span>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: '1.6', fontWeight: 400, marginTop: '-0.3rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        Provide your shipping details below. We deliver to your doorstep with zero-carbon logistics.
      </p>
      
      <div style={{ backgroundColor: '#EAE1D3', borderRadius: '32px', padding: '2.2rem', border: '1px solid rgba(0,0,0,0.02)', maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={handleSaveAddress} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label className="label" style={{ fontSize: '0.7rem', fontWeight: 800, color: '#706F65', marginBottom: '0.4rem', display: 'block', letterSpacing: '0.05em' }}>ADDRESS TITLE (E.G. OFFICE)</label>
            <input 
              type="text" className="input" placeholder="Home / Work / Other" required
              value={addressForm.title} onChange={(e) => setAddressForm({...addressForm, title: e.target.value})}
              style={{ backgroundColor: '#FBF5EC', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '1rem', width: '100%', fontSize: '0.95rem', fontWeight: 500 }} 
            />
          </div>
          <div>
            <label className="label" style={{ fontSize: '0.7rem', fontWeight: 800, color: '#706F65', marginBottom: '0.4rem', display: 'block', letterSpacing: '0.05em' }}>ADDRESS LINE 1</label>
            <input 
              type="text" className="input" placeholder="Building, Street Name" required
              value={addressForm.addressLine1} onChange={(e) => setAddressForm({...addressForm, addressLine1: e.target.value})}
              style={{ backgroundColor: '#FBF5EC', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '1rem', width: '100%', fontSize: '0.95rem', fontWeight: 500 }} 
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="label" style={{ fontSize: '0.7rem', fontWeight: 800, color: '#706F65', marginBottom: '0.4rem', display: 'block', letterSpacing: '0.05em' }}>CITY</label>
              <input 
                type="text" className="input" placeholder="Kochi" required
                value={addressForm.city} onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                style={{ backgroundColor: '#FBF5EC', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '1rem', width: '100%', fontSize: '0.95rem', fontWeight: 500 }} 
              />
            </div>
            <div>
              <label className="label" style={{ fontSize: '0.7rem', fontWeight: 800, color: '#706F65', marginBottom: '0.4rem', display: 'block', letterSpacing: '0.05em' }}>PIN CODE</label>
              <input 
                type="text" className="input" placeholder="682001" required
                value={addressForm.pinCode} onChange={(e) => setAddressForm({...addressForm, pinCode: e.target.value})}
                style={{ backgroundColor: '#FBF5EC', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '1rem', width: '100%', fontSize: '0.95rem', fontWeight: 500 }} 
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary" 
            style={{ 
              backgroundColor: '#001d04', color: 'white', border: 'none', padding: '1.2rem', width: '100%', 
              borderRadius: '16px', marginTop: '1rem', fontWeight: 700, fontSize: '0.95rem', 
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
              boxShadow: '0 8px 25_px rgba(0,29,4,0.1)' 
            }}
          >
            {loading ? 'Saving...' : 'Save Address'}
          </button>
        </form>
      </div>
    </div>
  );

  const EditAddressView = () => (
    <div className="animate-fade-in" style={{ padding: '0.8rem 1.2rem 5rem', maxWidth: '1280px', margin: '0 auto', minHeight: '100vh', backgroundColor: 'var(--color-bg-main)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem' }}>
        <button 
          onClick={() => setCurrentView('addresses')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#001d04', padding: '0.3rem', marginLeft: '-0.3rem' }}
        >
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04' }}>Edit Saved Location</span>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: '1.6', fontWeight: 400, marginTop: '-0.3rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        Refine your delivery details below. Ensure your sustainable journey reaches the right destination.
      </p>
      
      <div style={{ backgroundColor: '#EAE1D3', borderRadius: '32px', padding: '2.2rem', border: '1px solid rgba(0,0,0,0.02)', maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={handleSaveAddress} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label className="label" style={{ fontSize: '0.7rem', fontWeight: 800, color: '#706F65', marginBottom: '0.4rem', display: 'block', letterSpacing: '0.05em' }}>ADDRESS TITLE</label>
            <input 
              type="text" className="input" placeholder="Home" required
              value={addressForm.title} onChange={(e) => setAddressForm({...addressForm, title: e.target.value})}
              style={{ backgroundColor: '#FBF5EC', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '1rem', width: '100%', fontSize: '0.95rem', fontWeight: 500 }} 
            />
          </div>
          <div>
            <label className="label" style={{ fontSize: '0.7rem', fontWeight: 800, color: '#706F65', marginBottom: '0.4rem', display: 'block', letterSpacing: '0.05em' }}>ADDRESS LINE 1</label>
            <input 
              type="text" className="input" placeholder="Flat 402, ..." required
              value={addressForm.addressLine1} onChange={(e) => setAddressForm({...addressForm, addressLine1: e.target.value})}
              style={{ backgroundColor: '#FBF5EC', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '1rem', width: '100%', fontSize: '0.95rem', fontWeight: 500 }} 
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="label" style={{ fontSize: '0.7rem', fontWeight: 800, color: '#706F65', marginBottom: '0.4rem', display: 'block', letterSpacing: '0.05em' }}>CITY</label>
              <input 
                type="text" className="input" placeholder="Kochi" required
                value={addressForm.city} onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                style={{ backgroundColor: '#FBF5EC', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '1rem', width: '100%', fontSize: '0.95rem', fontWeight: 500 }} 
              />
            </div>
            <div>
              <label className="label" style={{ fontSize: '0.7rem', fontWeight: 800, color: '#706F65', marginBottom: '0.4rem', display: 'block', letterSpacing: '0.05em' }}>PIN CODE</label>
              <input 
                type="text" className="input" placeholder="682001" required
                value={addressForm.pinCode} onChange={(e) => setAddressForm({...addressForm, pinCode: e.target.value})}
                style={{ backgroundColor: '#FBF5EC', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '1rem', width: '100%', fontSize: '0.95rem', fontWeight: 500 }} 
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary" 
            style={{ 
              backgroundColor: '#001d04', color: 'white', border: 'none', padding: '1.2rem', width: '100%', 
              borderRadius: '16px', marginTop: '1rem', fontWeight: 700, fontSize: '0.95rem', 
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
              boxShadow: '0 8px 25_px rgba(0,29,4,0.1)' 
            }}
          >
            {loading ? 'Updating...' : 'Update Location'}
          </button>
        </form>
      </div>
      <button 
        onClick={() => handleDeleteAddress(editingAddress.id)}
        style={{ width: '100%', maxWidth: '600px', margin: '0 auto', display: 'block', padding: '1rem', marginTop: '1.5rem', color: '#E53E3E', background: 'none', border: 'none', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
      >
        Delete Location
      </button>
    </div>
  );

  const PaymentsView = () => (
    <div className="animate-fade-in" style={{ padding: '0.8rem 1.2rem 5rem', maxWidth: '1280px', margin: '0 auto', minHeight: '100vh', backgroundColor: 'var(--color-bg-main)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem' }}>
        <button 
          onClick={() => setCurrentView('main')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#001d04', padding: '0.3rem', marginLeft: '-0.3rem' }}
        >
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04' }}>Payments</span>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: '1.6', fontWeight: 400, marginTop: '-0.3rem', marginBottom: '2.5rem', maxWidth: '700px' }}>
        Securely manage your preferred payment methods. Your financial integrity is our primary commitment.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        <div style={{ 
          backgroundColor: '#EAE1D3', 
          color: '#001d04', borderRadius: '24px', padding: '1.5rem 1.8rem', 
          border: '1px solid rgba(0,0,0,0.05)',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.05 }}>
             <CreditCard size={150} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, letterSpacing: '0.15em', fontStyle: 'italic', fontSize: '1.1rem' }}>VISA</span>
            <div style={{ padding: '0.2rem 0.6rem', backgroundColor: '#001d04', color: 'white', borderRadius: '6px', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.05em' }}>DEFAULT</div>
          </div>
          <div style={{ fontSize: '1.2rem', letterSpacing: '0.2em', marginBottom: '1.5rem', fontFamily: 'monospace', fontWeight: 700 }}>**** **** **** 4242</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
               <span style={{ fontSize: '0.55rem', fontWeight: 900 }}>CARD HOLDER</span>
               <span style={{ fontWeight: 700 }}>{user.name}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', textAlign: 'right' }}>
               <span style={{ fontSize: '0.55rem', fontWeight: 900 }}>EXPIRES</span>
               <span style={{ fontWeight: 700 }}>12 / 28</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setCurrentView('add-payment')}
          style={{ backgroundColor: '#001d04', border: 'none', color: 'white', padding: '1.5rem', borderRadius: '24px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', boxShadow: '0 8px 25px rgba(0,29,4,0.1)' }}
        >
          + Register New Card
        </button>
      </div>
    </div>
  );

  const AddPaymentView = () => (
    <div className="animate-fade-in" style={{ padding: '0.8rem 1.2rem 5rem', maxWidth: '1280px', margin: '0 auto', minHeight: '100vh', backgroundColor: 'var(--color-bg-main)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem' }}>
        <button 
          onClick={() => setCurrentView('payments')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#001d04', padding: '0.3rem', marginLeft: '-0.3rem' }}
        >
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04' }}>Register New Card</span>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: '1.6', fontWeight: 400, marginTop: '-0.3rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        Add a secure payment method for your next curated purchase. Built with industry-standard integrity.
      </p>
      
      <div style={{ backgroundColor: '#EAE1D3', borderRadius: '32px', padding: '2.2rem', border: '1px solid rgba(0,0,0,0.02)', maxWidth: '600px', margin: '0 auto' }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label className="label" style={{ fontSize: '0.7rem', fontWeight: 800, color: '#706F65', marginBottom: '0.4rem', display: 'block', letterSpacing: '0.05em' }}>CARDHOLDER NAME</label>
            <input type="text" className="input" placeholder="ASNAM SANAF" style={{ backgroundColor: '#FBF5EC', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '1rem', width: '100%', fontSize: '0.95rem', fontWeight: 500 }} />
          </div>
          <div>
            <label className="label" style={{ fontSize: '0.7rem', fontWeight: 800, color: '#706F65', marginBottom: '0.4rem', display: 'block', letterSpacing: '0.05em' }}>CARD NUMBER</label>
            <input type="text" className="input" placeholder="0000 0000 0000 0000" style={{ backgroundColor: '#FBF5EC', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '1rem', width: '100%', fontSize: '0.95rem', fontWeight: 500 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="label" style={{ fontSize: '0.7rem', fontWeight: 800, color: '#706F65', marginBottom: '0.4rem', display: 'block', letterSpacing: '0.05em' }}>EXPIRY DATE</label>
              <input type="text" className="input" placeholder="MM / YY" style={{ backgroundColor: '#FBF5EC', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '1rem', width: '100%', fontSize: '0.95rem', fontWeight: 500 }} />
            </div>
            <div>
              <label className="label" style={{ fontSize: '0.7rem', fontWeight: 800, color: '#706F65', marginBottom: '0.4rem', display: 'block', letterSpacing: '0.05em' }}>CVV</label>
              <input type="password" size="3" className="input" placeholder="***" style={{ backgroundColor: '#FBF5EC', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '1rem', width: '100%', fontSize: '0.95rem', fontWeight: 500 }} />
            </div>
          </div>
          <button type="button" onClick={() => setCurrentView('payments')} className="btn btn-primary" style={{ backgroundColor: '#001d04', color: 'white', border: 'none', padding: '1.2rem', width: '100%', borderRadius: '16px', marginTop: '1rem', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 8px 25px rgba(0,29,4,0.1)' }}>
            Register Card
          </button>
        </form>
      </div>
    </div>
  );

  const NotificationsView = () => (
    <div className="animate-fade-in" style={{ padding: '0.8rem 1.2rem 5rem', maxWidth: '1280px', margin: '0 auto', minHeight: '100vh', backgroundColor: 'var(--color-bg-main)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem' }}>
        <button 
          onClick={() => setCurrentView('main')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#001d04', padding: '0.3rem', marginLeft: '-0.3rem' }}
        >
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04' }}>Connectivity</span>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: '1.6', fontWeight: 400, marginTop: '-0.3rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        Tailor your LuqmanGo experience. Choose how and when you receive updates on orders, curated drops, and exclusive offers.
      </p>
      <div style={{ backgroundColor: '#EAE1D3', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '0.8rem', maxWidth: '600px', margin: '0 auto' }}>
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

  const OrdersView = () => {
    const [selectedYear, setSelectedYear] = useState('All');
    const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
    const [activeInvoice, setActiveInvoice] = useState(null);
    const years = ['All', '2023', '2022', '2021'];

    const inTransitOrders = [
      { id: 'LG-99281', name: 'Handcrafted Glass Vessel', status: 'ARRIVING BY', date: '10 Oct 2023', year: '2023', image: '/images/products/glass-vessel.jpg' },
      { id: 'LG-99245', name: 'Organic Fiber Tote', status: 'ARRIVING BY', date: '12 Oct 2023', year: '2023', image: '/images/products/tote.jpg' }
    ];

    const allPastOrders = [
      { id: 'LG-88712', name: 'Teak Wood Servers & 2 others', status: 'DELIVERED', date: '15 SEP 2023', year: '2023', price: 142.00, items: [{ name: 'Teak Wood Servers', qty: 1, price: 68.00 }, { name: 'Organic Linen Napkins', qty: 2, price: 24.00 }, { name: 'Olive Oil Dispenser', qty: 1, price: 50.00 }] },
      { id: 'LG-85600', name: 'Cedarwood Soy Candle', status: 'DELIVERED', date: '02 AUG 2023', year: '2023', price: 32.00, items: [{ name: 'Cedarwood Soy Candle', qty: 1, price: 32.00 }] },
      { id: 'LG-82199', name: 'Sculptural Bone Vase', status: 'DELIVERED', date: '28 JUL 2023', year: '2023', price: 89.00, items: [{ name: 'Sculptural Bone Vase', qty: 1, price: 89.00 }] },
      { id: 'LG-72100', name: 'Handwoven Jute Rug', status: 'DELIVERED', date: '12 NOV 2022', year: '2022', price: 215.00, items: [{ name: 'Handwoven Jute Rug', qty: 1, price: 215.00 }] },
      { id: 'LG-68400', name: 'Artisan Ceramic Set', status: 'DELIVERED', date: '05 MAR 2022', year: '2022', price: 76.00, items: [{ name: 'Artisan Ceramic Bowl', qty: 2, price: 38.00 }] }
    ];

    const pastOrders = selectedYear === 'All' ? allPastOrders : allPastOrders.filter(o => o.year === selectedYear);

    // Invoice Detail View
    if (activeInvoice) {
      const order = allPastOrders.find(o => o.id === activeInvoice);
      if (!order) { setActiveInvoice(null); return null; }
      return (
        <div className="animate-fade-in" style={{ padding: '0.8rem 1.2rem 5rem', maxWidth: '1280px', margin: '0 auto', minHeight: '100vh', backgroundColor: 'var(--color-bg-main)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem' }}>
            <button 
              onClick={() => setActiveInvoice(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#001d04', padding: '0.3rem', marginLeft: '-0.3rem' }}
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
            </button>
            <span style={{ fontSize: '1rem', fontWeight: 600, color: '#001d04', letterSpacing: '0.02em' }}>Order Receipt</span>
          </div>
          
          <div style={{ 
            backgroundColor: '#EAE1D3', 
            borderRadius: '32px', 
            padding: '2.5rem 2rem', maxWidth: '600px', margin: '0 auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.02)',
            position: 'relative'
          }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.15em', color: '#706F65', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Invoice</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#001d04', letterSpacing: '-0.01em' }}>#{order.id}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.15em', color: '#706F65', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Date</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#001d04' }}>{order.date}</div>
              </div>
            </div>

            {/* Delivery Status */}
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              backgroundColor: 'white', 
              color: '#436132', 
              padding: '0.4rem 0.8rem', 
              borderRadius: '100px', 
              fontSize: '0.65rem', 
              fontWeight: 700, 
              letterSpacing: '0.05em', 
              marginBottom: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              border: '1px solid rgba(67, 97, 50, 0.1)'
            }}>
              <PackageCheck size={14} strokeWidth={2.5} /> {order.status}
            </div>

            {/* Line Items Label */}
            <div style={{ 
              fontSize: '0.6rem', 
              fontWeight: 800, 
              letterSpacing: '0.15em', 
              color: '#706F65', 
              marginBottom: '0.8rem', 
              textTransform: 'uppercase',
              borderBottom: '1px solid rgba(0,0,0,0.05)',
              paddingBottom: '0.6rem'
            }}>
              Items
            </div>

            {/* Items List */}
            <div style={{ marginBottom: '1.2rem' }}>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.8rem 0' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#001d04', lineHeight: 1.3 }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#706F65', marginTop: '0.2rem', fontWeight: 400 }}>Qty: {item.qty}</div>
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#001d04', marginLeft: '1rem' }}>
                    ${item.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Billing Summary */}
            <div style={{ 
              borderTop: '1.5px solid rgba(0,0,0,0.06)', 
              paddingTop: '1.2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#706F65', fontWeight: 400 }}>
                <span>Subtotal</span>
                <span style={{ color: '#001d04', fontWeight: 500 }}>${order.price.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#706F65', fontWeight: 400 }}>
                <span>Shipping</span>
                <span style={{ color: '#436132', fontWeight: 700, letterSpacing: '0.05em' }}>COMPLIMENTARY</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginTop: '0.8rem', 
                paddingTop: '1rem', 
                borderTop: '1.5px solid rgba(0,0,0,0.05)', 
                fontSize: '1.2rem', 
                fontWeight: 700, 
                color: '#001d04',
                letterSpacing: '-0.02em'
              }}>
                <span>Total</span>
                <span>${order.price.toFixed(2)}</span>
              </div>
            </div>

            {/* Brand Signature */}
            <div style={{ 
              marginTop: '2rem', 
              textAlign: 'center', 
              borderTop: '1px solid rgba(0,0,0,0.03)', 
              paddingTop: '1.5rem',
              opacity: 0.6
            }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#001d04', letterSpacing: '0.05em', fontStyle: 'italic' }}>
                  Thank you for curating with LuqmanGo
                </div>
                <div style={{ fontSize: '0.6rem', marginTop: '0.4rem', letterSpacing: '0.1em', fontWeight: 400 }}>
                  WWW.LUQMANGO.COM
                </div>
            </div>
          </div>

          {/* Shipping Address Section - Improved Design */}
          <div style={{ 
            marginTop: '1.5rem', 
            backgroundColor: '#E4EDDB', 
            borderRadius: '24px', 
            padding: '1.75rem', 
            border: '1px solid rgba(67, 97, 50, 0.1)'
          }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', color: '#706F65', marginBottom: '1rem', textTransform: 'uppercase' }}>Shipped To</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#001d04', marginBottom: '0.4rem' }}>Asnam Sanaf</div>
            <div style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: 1.6, fontWeight: 400 }}>
              Flat 402, Sylvan Heights<br/>
              Central District, Luqman Street<br/>
              Kochi, Kerala 682001
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="animate-fade-in" style={{ padding: '0.8rem 1.2rem 5rem', maxWidth: '1280px', margin: '0 auto', minHeight: '100vh', backgroundColor: 'var(--color-bg-main)' }}>
        <div style={{ padding: '0' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem' }}>
            <button 
              onClick={() => setCurrentView('main')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#001d04', padding: '0.3rem', marginLeft: '-0.3rem' }}
            >
              <ArrowLeft size={18} strokeWidth={2} />
            </button>
            <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04' }}>My Orders</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: '1.6', fontWeight: 400, marginTop: '-0.3rem', marginBottom: '1.5rem' }}>
            A curated history of your sustainable journeys. Track your ongoing deliveries or revisit past eco-friendly purchases.
          </p>

          {/* In Transit */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
              <Truck size={18} color="#436132" fill="#436132" fillOpacity={0.2} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#001d04' }}>In Transit</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {inTransitOrders.map((order, idx) => (
                <div key={idx} style={{ 
                  backgroundColor: '#EAE1D3', 
                  borderRadius: '16px', padding: '1.2rem', 
                  display: 'flex', gap: '1.2rem',
                  border: '1px solid rgba(0,0,0,0.02)'
                }}>
                  <div style={{ width: '70px', height: '70px', borderRadius: '10px', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.4)' }}>
                    <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0,29,4,0.05)' }}></div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#001d04', marginBottom: '0.2rem' }}>{order.name}</h4>
                    <div style={{ fontSize: '0.8rem', color: '#706F65', marginBottom: '0.8rem' }}>Order #{order.id}</div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#436132', letterSpacing: '0.06em' }}>{order.status}</span>
                      <span style={{ fontWeight: 700, color: '#001d04', fontSize: '0.9rem' }}>{order.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order History */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#001d04' }}>Order History</h3>
              
              {/* Year Filter Dropdown */}
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.3rem', 
                    color: '#706F65', fontSize: '0.8rem', fontWeight: 600,
                    background: 'none', border: '1px solid rgba(0,0,0,0.08)', 
                    padding: '0.4rem 0.8rem', borderRadius: '10px', cursor: 'pointer',
                    backgroundColor: yearDropdownOpen ? '#EAE1D3' : 'transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  {selectedYear === 'All' ? 'Filter by Year' : selectedYear} <ChevronDown size={14} style={{ transform: yearDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                </button>
                {yearDropdownOpen && (
                  <div style={{ 
                    position: 'absolute', top: '100%', right: 0, marginTop: '0.4rem',
                    backgroundColor: 'white', borderRadius: '14px', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.04)',
                    overflow: 'hidden', zIndex: 20, minWidth: '130px'
                  }}>
                    {years.map(year => (
                      <button 
                        key={year}
                        onClick={() => { setSelectedYear(year); setYearDropdownOpen(false); }}
                        style={{ 
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '0.7rem 1rem', border: 'none', cursor: 'pointer',
                          fontSize: '0.85rem', fontWeight: selectedYear === year ? 700 : 500,
                          color: selectedYear === year ? '#001d04' : '#706F65',
                          backgroundColor: selectedYear === year ? '#FBF5EC' : 'transparent',
                          transition: 'background-color 0.15s'
                        }}
                        onMouseOver={(e) => { if (selectedYear !== year) e.currentTarget.style.backgroundColor = '#FAF8F5'; }}
                        onMouseOut={(e) => { if (selectedYear !== year) e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        {year === 'All' ? 'All Years' : year}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {pastOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#706F65', fontSize: '0.9rem' }}>
                No orders found for {selectedYear}.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2.5rem' }}>
                {pastOrders.map((order, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1.2rem' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#EAE1D3' }}>
                      <div style={{ width: '100%', height: '100%', backgroundColor: '#D4CFC5' }}></div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#706F65', marginBottom: '0.3rem' }}>
                        {order.status} • {order.date}
                      </div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#001d04', marginBottom: '0.2rem' }}>{order.name}</h4>
                      <div style={{ fontSize: '0.75rem', color: '#706F65', marginBottom: '0.8rem' }}>Order #{order.id} • ${order.price.toFixed(2)}</div>
                      
                      <div style={{ display: 'flex', gap: '0.8rem' }}>
                        <button 
                          onClick={() => setActiveInvoice(order.id)}
                          style={{ 
                            backgroundColor: 'white', border: '1px solid #D4CFC5', 
                            color: '#001d04', padding: '0.4rem 1rem', 
                            borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.borderColor = '#001d04'}
                          onMouseOut={(e) => e.currentTarget.style.borderColor = '#D4CFC5'}
                        >
                          <FileText size={13} /> Invoice
                        </button>
                        <button 
                          onClick={() => navigate('/')}
                          style={{ 
                            backgroundColor: '#001d04', border: 'none', 
                            color: 'white', padding: '0.4rem 1rem', 
                            borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.opacity = '0.85'}
                          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                        >
                          <RefreshCw size={13} /> Buy Again
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const HelpCenterView = () => (
    <div className="animate-fade-in" style={{ padding: '0.8rem 1.2rem 5rem', maxWidth: '1280px', margin: '0 auto', minHeight: '100vh', backgroundColor: 'var(--color-bg-main)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem' }}>
        <button 
          onClick={() => setCurrentView('main')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#001d04', padding: '0.3rem', marginLeft: '-0.3rem' }}
        >
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04' }}>Curator Support</span>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: '1.6', fontWeight: 400, marginTop: '-0.3rem', marginBottom: '2.5rem' }}>
        Your direct line to the LuqmanGo concierge. We’re here 24/7 to ensure your journey is effortless and sustainable.
      </p>
      <div style={{ marginBottom: '2rem' }}>
         <div style={{ backgroundColor: '#EAE1D3', borderRadius: '16px', padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', border: '1px solid rgba(0,0,0,0.03)' }}>
            <Link to="#" style={{ color: '#D4CFC5' }}><ChevronRight size={18} style={{ transform: 'rotate(90deg)' }} /></Link>
            <input type="text" placeholder="Search for guidance..." style={{ border: 'none', width: '100%', fontSize: '0.95rem', outline: 'none', color: '#001d04', backgroundColor: 'transparent' }} />
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Orders', count: '12 articles' },
          { label: 'Returns', count: '8 articles' },
          { label: 'Shipping', count: '5 articles' },
          { label: 'Account', count: '10 articles' }
        ].map((cat, idx) => (
          <div key={idx} style={{ backgroundColor: 'white', padding: '1.5rem 1.2rem', borderRadius: '20px', cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
             <h4 style={{ fontWeight: 700, color: '#001d04', marginBottom: '0.2rem', fontSize: '1rem' }}>{cat.label}</h4>
             <p style={{ fontSize: '0.7rem', color: '#706F65', fontWeight: 500 }}>{cat.count}</p>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: '#001d04', borderRadius: '32px', padding: '2.2rem 1.8rem', color: '#F7F3ED', textAlign: 'center', boxShadow: '0 15px 35px rgba(0,29,4,0.15)' }}>
         <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.8rem', color: '#FFFFFF' }}>Need direct assistance?</h4>
         <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '1.8rem', fontWeight: 400, color: '#F7F3ED', lineHeight: 1.5 }}>Our concierge team is available 24/7 for our gold members.</p>
         
         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
           <button className="btn" style={{ backgroundColor: '#FFFFFF', color: '#001d04', width: '100%', borderRadius: '14px', padding: '1rem', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer' }}>
             Connect via Live Chat
           </button>
           
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
             <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', borderRadius: '14px', padding: '0.85rem', fontWeight: 700, fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
               WhatsApp
             </a>
             <a href="mailto:curator@luqmango.com" style={{ textDecoration: 'none', backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', borderRadius: '14px', padding: '0.85rem', fontWeight: 700, fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
               Email Us
             </a>
           </div>
         </div>
      </div>
    </div>
  );

  const PrivacyPolicyView = () => (
    <div className="animate-fade-in" style={{ padding: '0.8rem 1.2rem 5rem', maxWidth: '1280px', margin: '0 auto', minHeight: '100vh', backgroundColor: 'var(--color-bg-main)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem' }}>
        <button 
          onClick={() => setCurrentView('main')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#001d04', padding: '0.3rem', marginLeft: '-0.3rem' }}
        >
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04' }}>Legal & Integrity</span>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: '1.6', fontWeight: 400, marginTop: '-0.3rem', marginBottom: '2.5rem' }}>
        Committed to transparency and your digital safety. Review our policies, terms, and how we protect your information.
      </p>
      <div style={{ backgroundColor: '#EAE1D3', borderRadius: '24px', padding: '2rem 1.5rem', color: '#001d04', border: '1px solid rgba(0,0,0,0.02)' }}>
         <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#706F65', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>UPDATED MARCH 2024</div>
         
         {[
           { h: "Commitment to Privacy", p: "We treat your data with the same respect we treat our artisans. This policy outlines how we source, use, and protect your identity." },
           { h: "Data Sourcing", p: "We only collect information essential for your delivery experience: shipping coordination, secure gateways, and preferred metrics." },
           { h: "Zero-Leads Policy", p: "We never sell your data to third-party advertisers. Your browsing history remains private perfectly." }
         ].map((section, idx) => (
           <div key={idx} style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem', letterSpacing: '-0.01em' }}>{section.h}</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: '#706F65', fontWeight: 400 }}>{section.p}</p>
           </div>
         ))}

         <div style={{ marginTop: '2.5rem', padding: '1.2rem', backgroundColor: '#FBF5EC', borderRadius: '16px' }}>
            <p style={{ fontSize: '0.8rem', color: '#706F65', margin: 0, fontStyle: 'italic', fontWeight: 500 }}>Questions? Concierge is at privacy@luqmango.com</p>
         </div>
      </div>
    </div>
  );

  // Render Sub-view if not main
  if (currentView === 'personal') return <PersonalInfoView />;
  if (currentView === 'addresses') return <AddressesView />;
  if (currentView === 'add-address') return <AddAddressView />;
  if (currentView === 'edit-address') return <EditAddressView />;
  if (currentView === 'payments') return <PaymentsView />;
  if (currentView === 'add-payment') return <AddPaymentView />;
  if (currentView === 'notifications') return <NotificationsView />;
  if (currentView === 'orders') return <OrdersView />;
  if (currentView === 'help') return <HelpCenterView />;
  if (currentView === 'privacy') return <PrivacyPolicyView />;

  // --- Main Dashboard View ---
  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--color-bg-main)', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            {/* Avatar container */}
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
          
          <button onClick={() => setCurrentView('orders')} style={{ width: '100%', background: 'none', border: 'none', display: 'flex', alignItems: 'center', padding: '1rem', cursor: 'pointer', borderBottom: '1px solid #F3F2EE', transition: 'background-color 0.2s', borderRadius: '16px 16px 0 0' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#FBF5EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
              <Package size={18} color="#001d04" />
            </div>
            <div style={{ flexGrow: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 700, color: '#001d04', fontSize: '0.95rem', marginBottom: '0.1rem' }}>My Orders</div>
              <div style={{ fontSize: '0.75rem', color: '#706F65', fontWeight: 400 }}>History and tracking</div>
            </div>
            <ChevronRight size={16} color="#C5BBB0" />
          </button>

          <button onClick={() => setCurrentView('addresses')} style={{ width: '100%', background: 'none', border: 'none', display: 'flex', alignItems: 'center', padding: '1rem', cursor: 'pointer', borderBottom: '1px solid #F3F2EE', transition: 'background-color 0.2s' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#FBF5EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
              <MapPin size={18} color="#001d04" />
            </div>
            <div style={{ flexGrow: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 700, color: '#001d04', fontSize: '0.95rem', marginBottom: '0.1rem' }}>Shipping Addresses</div>
              <div style={{ fontSize: '0.75rem', color: '#706F65', fontWeight: 400 }}>2 saved locations</div>
            </div>
            <ChevronRight size={16} color="#C5BBB0" />
          </button>

          <button onClick={() => setCurrentView('payments')} style={{ width: '100%', background: 'none', border: 'none', display: 'flex', alignItems: 'center', padding: '1rem', cursor: 'pointer', borderBottom: '1px solid #F3F2EE', transition: 'background-color 0.2s' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#FBF5EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
              <CreditCard size={18} color="#001d04" />
            </div>
            <div style={{ flexGrow: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 700, color: '#001d04', fontSize: '0.95rem', marginBottom: '0.1rem' }}>Payment Methods</div>
              <div style={{ fontSize: '0.75rem', color: '#706F65', fontWeight: 400 }}>Visa ending in 4242</div>
            </div>
            <ChevronRight size={16} color="#C5BBB0" />
          </button>

          <button onClick={() => setCurrentView('personal')} style={{ width: '100%', background: 'none', border: 'none', display: 'flex', alignItems: 'center', padding: '1rem', cursor: 'pointer', borderBottom: '1px solid #F3F2EE', transition: 'background-color 0.2s' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#FBF5EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
              <User size={18} color="#001d04" />
            </div>
            <div style={{ flexGrow: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 700, color: '#001d04', fontSize: '0.95rem', marginBottom: '0.1rem' }}>Personal Information</div>
              <div style={{ fontSize: '0.75rem', color: '#706F65', fontWeight: 400 }}>Identity and contact</div>
            </div>
            <ChevronRight size={16} color="#C5BBB0" />
          </button>

          <button onClick={() => setCurrentView('notifications')} style={{ width: '100%', background: 'none', border: 'none', display: 'flex', alignItems: 'center', padding: '1rem', cursor: 'pointer', borderRadius: '0 0 16px 16px', transition: 'background-color 0.2s' }}>
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
          <button onClick={() => setCurrentView('help')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', color: '#001d04', fontWeight: 600, fontSize: '0.9rem', transition: 'opacity 0.2s', ':hover': { opacity: 0.7 } }}>
            <HelpCircle size={18} /> Help Center
          </button>
          <button onClick={() => setCurrentView('privacy')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', color: '#001d04', fontWeight: 600, fontSize: '0.9rem', transition: 'opacity 0.2s', ':hover': { opacity: 0.7 } }}>
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

export default UserProfile;

import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { db } from '../../../config/firebase';
import { collection, query, orderBy, onSnapshot, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { MapPin, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileAddresses = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addressView, setAddressView] = useState('list'); // 'list', 'add', 'edit'
  const [editingAddress, setEditingAddress] = useState(null);

  const [addressForm, setAddressForm] = useState({
    title: '',
    addressLine1: '',
    city: '',
    pinCode: '',
    isDefault: false
  });

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'users', currentUser.uid, 'addresses'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const addrList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setAddresses(addrList);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const sanitizedAddressForm = {
        title: DOMPurify.sanitize(addressForm.title),
        addressLine1: DOMPurify.sanitize(addressForm.addressLine1),
        city: DOMPurify.sanitize(addressForm.city),
        pinCode: DOMPurify.sanitize(addressForm.pinCode),
        isDefault: addressForm.isDefault
      };

      if (editingAddress) {
        await updateDoc(doc(db, 'users', currentUser.uid, 'addresses', editingAddress.id), {
          ...sanitizedAddressForm,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'users', currentUser.uid, 'addresses'), {
          ...sanitizedAddressForm,
          createdAt: serverTimestamp()
        });
      }
      setAddressView('list');
      setEditingAddress(null);
      setAddressForm({ title: '', addressLine1: '', city: '', pinCode: '', isDefault: false });

      // If this is the default address, sync it to the main profile for checkout auto-fill
      if (sanitizedAddressForm.isDefault) {
        const fullAddress = `${sanitizedAddressForm.addressLine1}, ${sanitizedAddressForm.city}, ${sanitizedAddressForm.pinCode}`;
        updateUserProfile({ address: fullAddress });
      }
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
      setAddressView('list');
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
    setAddressView('edit');
  };

  if (addressView === 'add' || addressView === 'edit') {
    return (
      <div className="animate-fade-in" style={{ padding: '0.8rem 1.2rem 5rem', maxWidth: '1280px', margin: '0 auto', minHeight: '100vh', backgroundColor: 'var(--color-bg-main)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem' }}>
          <button 
            onClick={() => setAddressView('list')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#001d04', padding: '0.3rem', marginLeft: '-0.3rem' }}
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </button>
          <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04' }}>{addressView === 'add' ? 'Add New Address' : 'Edit Saved Location'}</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: '1.6', fontWeight: 400, marginTop: '-0.3rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          {addressView === 'add' ? 'Provide your shipping details below. We deliver to your doorstep with zero-carbon logistics.' : 'Refine your delivery details below. Ensure your sustainable journey reaches the right destination.'}
        </p>
        
        <div style={{ backgroundColor: '#EAE1D3', borderRadius: '32px', padding: '2.2rem', border: '1px solid rgba(0,0,0,0.02)', maxWidth: '600px', margin: '0 auto' }}>
          <form onSubmit={handleSaveAddress} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label className="label" style={{ fontSize: '0.7rem', fontWeight: 800, color: '#706F65', marginBottom: '0.4rem', display: 'block', letterSpacing: '0.05em' }}>ADDRESS TITLE {addressView === 'add' && '(E.G. OFFICE)'}</label>
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
                boxShadow: '0 8px 25px rgba(0,29,4,0.1)' 
              }}
            >
              {loading ? (addressView === 'add' ? 'Saving...' : 'Updating...') : (addressView === 'add' ? 'Save Address' : 'Update Location')}
            </button>
          </form>
        </div>
        {addressView === 'edit' && (
          <button 
            onClick={() => handleDeleteAddress(editingAddress.id)}
            style={{ width: '100%', maxWidth: '600px', margin: '0 auto', display: 'block', padding: '1rem', marginTop: '1.5rem', color: '#E53E3E', background: 'none', border: 'none', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
          >
            Delete Location
          </button>
        )}
      </div>
    );
  }

  // List View
  return (
    <div className="animate-fade-in" style={{ padding: '0.8rem 1.2rem 5rem', maxWidth: '1280px', margin: '0 auto', minHeight: '100vh', backgroundColor: 'var(--color-bg-main)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem' }}>
        <button 
          onClick={() => navigate('/profile')}
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
          onClick={() => { setAddressForm({ title: '', addressLine1: '', city: '', pinCode: '', isDefault: false }); setEditingAddress(null); setAddressView('add'); }}
          style={{ backgroundColor: '#001d04', border: 'none', color: 'white', padding: '1.5rem', borderRadius: '24px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', boxShadow: '0 8px 25px rgba(0,29,4,0.1)' }}
        >
          + Add New Address
        </button>
      </div>
    </div>
  );
};

export default ProfileAddresses;

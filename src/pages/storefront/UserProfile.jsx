import { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  User, Package, Settings, LogOut, ChevronRight, MapPin, CreditCard, Bell, HelpCircle, ShieldCheck, ArrowLeft, TreePine, Star
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { orders } = useShop();
  const myOrders = orders.slice(0, 2); 
  const [currentView, setCurrentView] = useState('main'); // 'main', 'orders', 'addresses', 'payments', 'personal', 'notifications'
  const navigate = useNavigate();

  // Mock User Data
  const user = {
    name: "Asnam Sanaf",
    email: "alex.sylvan@curator.studio",
    initials: "AS",
    points: "2,450",
    trees: 12,
    ordersInTransit: 3
  };

  const handleLogout = () => {
    // In a real app, clear auth state here
    navigate('/');
  };

  const BackButton = ({ title }) => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', padding: '0 0.5rem' }}>
      <button 
        onClick={() => setCurrentView('main')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.5rem', marginRight: '0.5rem', color: '#001d04', marginLeft: '-0.5rem' }}
      >
        <ArrowLeft size={24} />
      </button>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#001d04', margin: 0 }}>{title}</h1>
    </div>
  );

  // --- Sub-Views Components ---
  const PersonalInfoView = () => (
    <div className="animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '600px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#F9F8F4' }}>
      <BackButton title="Personal Information" />
      <div style={{ backgroundColor: 'white', borderRadius: '32px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="label" style={{ fontSize: '0.8rem', color: '#706F65' }}>Full Name</label>
            <input type="text" className="input" defaultValue={user.name} style={{ backgroundColor: '#FBF5EC', border: '1px solid var(--color-border)', borderRadius: '12px' }} />
          </div>
          <div>
            <label className="label" style={{ fontSize: '0.8rem', color: '#706F65' }}>Email Address</label>
            <input type="email" className="input" defaultValue={user.email} style={{ backgroundColor: '#FBF5EC', border: '1px solid var(--color-border)', borderRadius: '12px' }} />
          </div>
          <div>
            <label className="label" style={{ fontSize: '0.8rem', color: '#706F65' }}>Phone Number</label>
            <input type="tel" className="input" defaultValue="+1 234 567 8900" style={{ backgroundColor: '#FBF5EC', border: '1px solid var(--color-border)', borderRadius: '12px' }} />
          </div>
          <button type="button" className="btn" style={{ backgroundColor: '#001d04', color: 'white', padding: '1.2rem', width: '100%', borderRadius: '16px', marginTop: '1rem', fontWeight: 600 }}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );

  const AddressesView = () => (
    <div className="animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '600px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#F9F8F4' }}>
      <BackButton title="Shipping Addresses" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '1.5rem', border: '2px solid #001d04', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 600, color: '#001d04' }}>Home (Default)</span>
            <button style={{ color: '#5C7444', background: 'none', border: 'none', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Edit</button>
          </div>
          <p style={{ color: '#706F65', fontSize: '0.9rem', lineHeight: 1.6 }}>
            123 Curator Studio<br/>
            Design District, CA 90210<br/>
            United States
          </p>
        </div>
        <button style={{ backgroundColor: 'transparent', border: '2px dashed #D4CFC5', color: '#706F65', padding: '1.5rem', borderRadius: '24px', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s', ':hover': { backgroundColor: 'rgba(0,0,0,0.02)' } }}>
          + Add New Address
        </button>
      </div>
    </div>
  );

  const PaymentsView = () => (
    <div className="animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '600px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#F9F8F4' }}>
      <BackButton title="Payment Methods" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ backgroundColor: '#001d04', color: 'white', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 10px 25px rgba(0,29,4,0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
            <span style={{ fontWeight: 700, letterSpacing: '0.15em', fontStyle: 'italic' }}>VISA</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.8, backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>Default</span>
          </div>
          <div style={{ fontSize: '1.3rem', letterSpacing: '0.25em', marginBottom: '1.5rem', fontFamily: 'monospace' }}>**** **** **** 4242</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <span>Expires 12/28</span>
            <span>{user.name}</span>
          </div>
        </div>
        <button style={{ backgroundColor: 'transparent', border: '2px dashed #D4CFC5', color: '#706F65', padding: '1.5rem', borderRadius: '24px', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s', ':hover': { backgroundColor: 'rgba(0,0,0,0.02)' } }}>
          + Add Payment Method
        </button>
      </div>
    </div>
  );

  const NotificationsView = () => (
    <div className="animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '600px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#F9F8F4' }}>
      <BackButton title="Notifications" />
      <div style={{ backgroundColor: 'white', borderRadius: '32px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, color: '#001d04', marginBottom: '0.25rem' }}>Email Order Updates</div>
            <div style={{ fontSize: '0.85rem', color: '#706F65' }}>Receive receipts and tracking info</div>
          </div>
          <input type="checkbox" defaultChecked style={{ width: '1.5rem', height: '1.5rem', accentColor: '#001d04', cursor: 'pointer' }} />
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: 0 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, color: '#001d04', marginBottom: '0.25rem' }}>SMS Alerts</div>
            <div style={{ fontSize: '0.85rem', color: '#706F65' }}>Out for delivery text messages</div>
          </div>
          <input type="checkbox" defaultChecked style={{ width: '1.5rem', height: '1.5rem', accentColor: '#001d04', cursor: 'pointer' }} />
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: 0 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, color: '#001d04', marginBottom: '0.25rem' }}>Promotional Offers</div>
            <div style={{ fontSize: '0.85rem', color: '#706F65' }}>Exclusive deals and new arrivals</div>
          </div>
          <input type="checkbox" style={{ width: '1.5rem', height: '1.5rem', accentColor: '#001d04', cursor: 'pointer' }} />
        </div>
      </div>
    </div>
  );

  const OrdersView = () => (
    <div className="animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '600px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#F9F8F4' }}>
      <BackButton title="Order History" />
      {myOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#706F65' }}>
          <Package size={48} opacity={0.2} style={{ margin: '0 auto 1rem auto' }} />
          <p>No orders yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {myOrders.map((order, idx) => (
            <div key={order.id} style={{ backgroundColor: 'white', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#001d04', marginBottom: '0.2rem' }}>Order #{order.id.substring(0, 8)}</div>
                  <div style={{ fontSize: '0.85rem', color: '#706F65' }}>{new Date(order.date).toLocaleDateString()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, color: '#001d04', marginBottom: '0.3rem', fontSize: '1.1rem' }}>${order.total.toFixed(2)}</div>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.3rem 0.6rem', backgroundColor: order.status === 'Processing' ? '#FBF5EC' : '#e2ecd6', color: order.status === 'Processing' ? '#706F65' : '#436132', borderRadius: '12px', fontWeight: 600, display: 'inline-block' }}>{order.status}</div>
                </div>
              </div>
              <button style={{ width: '100%', background: 'none', border: '1.5px solid var(--color-border)', borderRadius: '16px', padding: '1rem', color: '#001d04', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s', ':hover': { backgroundColor: 'rgba(0,0,0,0.02)' } }}>
                Track Order
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );


  // Render Sub-view if not main
  if (currentView === 'personal') return <PersonalInfoView />;
  if (currentView === 'addresses') return <AddressesView />;
  if (currentView === 'payments') return <PaymentsView />;
  if (currentView === 'notifications') return <NotificationsView />;
  if (currentView === 'orders') return <OrdersView />;

  // --- Main Dashboard View ---
  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#FAF8F5', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            {/* Avatar image replaced with initials for now, styled precisely to match ref */}
            <div style={{ 
              width: '110px', height: '110px', borderRadius: '50%', backgroundColor: '#001d04', 
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.8rem', fontWeight: 400, border: '4px solid #FAF8F5', boxShadow: '0 0 0 2px rgba(0,0,0,0.1)'
            }}>
              <User size={50} strokeWidth={1} />
            </div>
          </div>
          
          <h1 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#001d04', marginBottom: '0.2rem', letterSpacing: '-0.02em' }}>{user.name}</h1>
        </div>


        {/* Account Management Menu */}
        <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', color: '#706F65', marginBottom: '1rem', marginLeft: '0.5rem' }}>
          ACCOUNT MANAGEMENT
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '32px', padding: '0.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', marginBottom: '2.5rem' }}>
          
          <button onClick={() => setCurrentView('orders')} style={{ width: '100%', background: 'none', border: 'none', display: 'flex', alignItems: 'center', padding: '1.25rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FBF5EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
              <Package size={18} color="#001d04" />
            </div>
            <div style={{ flexGrow: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 600, color: '#001d04', fontSize: '0.9rem', marginBottom: '0.1rem' }}>My Orders</div>
              <div style={{ fontSize: '0.75rem', color: '#706F65', fontWeight: 300 }}>History and tracking</div>
            </div>
            <ChevronRight size={16} color="#D4CFC5" />
          </button>

          <button onClick={() => setCurrentView('addresses')} style={{ width: '100%', background: 'none', border: 'none', display: 'flex', alignItems: 'center', padding: '1.25rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FBF5EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
              <MapPin size={18} color="#001d04" />
            </div>
            <div style={{ flexGrow: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 600, color: '#001d04', fontSize: '0.9rem', marginBottom: '0.1rem' }}>Shipping Addresses</div>
              <div style={{ fontSize: '0.75rem', color: '#706F65', fontWeight: 300 }}>2 saved locations</div>
            </div>
            <ChevronRight size={16} color="#D4CFC5" />
          </button>

          <button onClick={() => setCurrentView('payments')} style={{ width: '100%', background: 'none', border: 'none', display: 'flex', alignItems: 'center', padding: '1.25rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FBF5EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
              <CreditCard size={18} color="#001d04" />
            </div>
            <div style={{ flexGrow: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 600, color: '#001d04', fontSize: '0.9rem', marginBottom: '0.1rem' }}>Payment Methods</div>
              <div style={{ fontSize: '0.75rem', color: '#706F65', fontWeight: 300 }}>Visa ending in 4242</div>
            </div>
            <ChevronRight size={16} color="#D4CFC5" />
          </button>

          <button onClick={() => setCurrentView('personal')} style={{ width: '100%', background: 'none', border: 'none', display: 'flex', alignItems: 'center', padding: '1.25rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FBF5EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
              <User size={18} color="#001d04" />
            </div>
            <div style={{ flexGrow: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 600, color: '#001d04', fontSize: '0.9rem', marginBottom: '0.1rem' }}>Personal Information</div>
              <div style={{ fontSize: '0.75rem', color: '#706F65', fontWeight: 300 }}>Identity and contact</div>
            </div>
            <ChevronRight size={16} color="#D4CFC5" />
          </button>

          <button onClick={() => setCurrentView('notifications')} style={{ width: '100%', background: 'none', border: 'none', display: 'flex', alignItems: 'center', padding: '1.25rem 1rem', cursor: 'pointer' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FBF5EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
              <Bell size={18} color="#001d04" />
            </div>
            <div style={{ flexGrow: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 600, color: '#001d04', fontSize: '0.9rem', marginBottom: '0.1rem' }}>Notifications</div>
              <div style={{ fontSize: '0.75rem', color: '#706F65', fontWeight: 300 }}>Email and SMS alerts</div>
            </div>
            <ChevronRight size={16} color="#D4CFC5" />
          </button>

        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem', padding: '0 1rem' }}>
          <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', color: '#001d04', fontWeight: 500, fontSize: '0.85rem' }}>
            <HelpCircle size={16} /> Help Center
          </button>
          <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', color: '#001d04', fontWeight: 500, fontSize: '0.85rem' }}>
            <ShieldCheck size={16} /> Privacy Policy
          </button>
        </div>

        {/* Logout Button */}
        <button onClick={handleLogout} style={{ width: '100%', backgroundColor: '#001d04', color: 'white', borderRadius: '24px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', fontSize: '0.95rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          <LogOut size={18} /> Logout
        </button>

      </div>
    </div>
  );
};

export default UserProfile;

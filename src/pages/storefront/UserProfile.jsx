import { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { User, Package, Settings, LogOut, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const { orders } = useShop();
  // Filter mock orders to pretend some belong to the logged-in user
  const myOrders = orders.slice(0, 2); 
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="container sidebar-layout animate-fade-in user-profile-container" style={{ padding: '4rem 1.5rem' }}>
      
      {/* Sidebar Profile Nav */}
      <div className="card profile-sidebar" style={{ padding: '2rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', fontSize: '2rem', fontWeight: 600 }}>
            JD
          </div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>John Doe</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>john@example.com</p>
        </div>

        <nav className="profile-nav" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}`} 
            style={{ width: '100%', justifyContent: 'flex-start', padding: '0.75rem 1rem', border: activeTab === 'orders' ? 'none' : '1px solid transparent' }}
            onClick={() => setActiveTab('orders')}
          >
            <Package size={18} /> My Orders
          </button>
          <button 
            className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-outline'}`} 
            style={{ width: '100%', justifyContent: 'flex-start', padding: '0.75rem 1rem', border: activeTab === 'settings' ? 'none' : '1px solid transparent' }}
            onClick={() => setActiveTab('settings')}
          >
            <Package size={18} /> Account Settings
          </button>
          <hr className="hide-on-mobile" style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '1rem 0' }} />
          <Link to="/" className="btn btn-outline profile-signout" style={{ width: '100%', justifyContent: 'flex-start', padding: '0.75rem 1rem', color: '#EF4444', borderColor: 'transparent' }}>
            <LogOut size={18} /> Sign Out
          </Link>
        </nav>
      </div>

      {/* Main Content Area */}
      <div>
        {activeTab === 'orders' && (
          <div className="animate-fade-in profile-content">
            <h1 className="profile-content-title" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Order History</h1>
            {myOrders.length === 0 ? (
              <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <Package size={48} opacity={0.2} style={{ margin: '0 auto 1rem auto', display: 'block' }} />
                <p>You haven't placed any orders yet.</p>
                <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Start Shopping</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {myOrders.map(order => (
                  <div key={order.id} className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                      <div>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Order #{order.id.substring(0, 8)}</p>
                        <p style={{ fontWeight: 600 }}>{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className={`badge ${order.status === 'Processing' ? 'badge-primary' : 'badge-secondary'}`} style={{ marginBottom: '0.25rem', display: 'inline-block' }}>
                          {order.status}
                        </span>
                        <p style={{ fontWeight: 700, color: 'var(--color-primary)' }}>${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                    {/* Mock Item List */}
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                      <p>View receipt details via your email inbox.</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-fade-in card profile-content" style={{ padding: '2rem' }}>
            <h1 className="profile-content-title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Account Settings</h1>
            
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
              <div>
                <label className="label">Full Name</label>
                <input type="text" className="input" defaultValue="John Doe" />
              </div>
              <div>
                <label className="label">Email Address</label>
                <input type="email" className="input" defaultValue="john@example.com" />
              </div>
              <div>
                <label className="label">Default Shipping Address</label>
                <textarea className="input" rows="3" defaultValue="123 Shopping Ave, Commerce City, TX 75001"></textarea>
              </div>
              
              <button type="button" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '0.75rem 2rem', gap: '0.5rem' }}>
                <Edit2 size={18} /> Save Changes
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
};

export default UserProfile;

import { useOrders } from '../../../context/OrderContext';
import { Package, Truck, PackageCheck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileOrders = () => {
  const { orders } = useOrders();
  const navigate = useNavigate();

  const processingOrders = orders.filter(o => o.status === 'Processing' || o.status === 'Shipped');
  const completedOrders = orders.filter(o => o.status === 'Delivered' || o.status === 'Cancelled');

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Delivered':  return { bg: '#DCFCE7', color: '#15803D' };
      case 'Processing': return { bg: '#FEF9C3', color: '#A16207' };
      case 'Shipped':    return { bg: '#DBEAFE', color: '#1D4ED8' };
      case 'Cancelled':  return { bg: '#FEE2E2', color: '#B91C1C' };
      default:           return { bg: '#F3F4F6', color: '#374151' };
    }
  };

  const OrderCard = ({ order }) => {
    const sc = getStatusConfig(order.status);
    const itemCount = order.items?.length || 0;
    const firstItem = order.items?.[0];
    const orderName = firstItem 
      ? (itemCount > 1 ? `${firstItem.title || firstItem.name} & ${itemCount - 1} other${itemCount > 2 ? 's' : ''}` : (firstItem.title || firstItem.name))
      : 'Order';

    return (
      <div style={{ 
        backgroundColor: '#EAE1D3', borderRadius: '20px', padding: '1.2rem',
        border: '1px solid rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#001d04', marginBottom: '0.2rem' }}>{orderName}</h4>
            <div style={{ fontSize: '0.75rem', color: '#706F65' }}>Order #{order.id?.substring(0, 8)}</div>
          </div>
          <span style={{
            fontSize: '0.6rem', fontWeight: 700, padding: '0.25rem 0.6rem',
            borderRadius: '100px', backgroundColor: sc.bg, color: sc.color,
            letterSpacing: '0.05em', textTransform: 'uppercase', flexShrink: 0
          }}>
            {order.status}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.6rem', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.15rem' }}>
            <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#706F65' }}>LKR</span>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#001d04' }}>{Math.round(order.total).toLocaleString()}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#706F65' }}>
            {order.date && order.date.toDate ? order.date.toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0.8rem 1.2rem 5rem', maxWidth: '1280px', margin: '0 auto', minHeight: '100vh', backgroundColor: 'var(--color-bg-main)' }}>
      <div style={{ padding: '0' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem' }}>
          <button 
            onClick={() => navigate('/profile')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#001d04', padding: '0.3rem', marginLeft: '-0.3rem' }}
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </button>
          <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04' }}>My Orders</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: '1.6', fontWeight: 400, marginTop: '-0.3rem', marginBottom: '1.5rem' }}>
          Track your ongoing deliveries or revisit past purchases.
        </p>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#EAE1D3', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Package size={32} color="#706F65" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#001d04', marginBottom: '0.6rem' }}>No Orders Yet</h3>
            <p style={{ fontSize: '0.88rem', color: '#706F65', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto 2rem' }}>
              Your orders will appear here once you start shopping.
            </p>
            <button 
              onClick={() => navigate('/')}
              style={{ backgroundColor: '#001d04', color: 'white', border: 'none', padding: '0.9rem 2rem', borderRadius: '14px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Active Orders */}
            {processingOrders.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
                  <Truck size={18} color="#436132" fill="#436132" fillOpacity={0.2} />
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#001d04' }}>Active ({processingOrders.length})</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  {processingOrders.map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Orders */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
                <PackageCheck size={18} color="#436132" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#001d04' }}>Completed ({completedOrders.length})</h3>
              </div>
              {completedOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#706F65', fontSize: '0.85rem', backgroundColor: '#EAE1D3', borderRadius: '16px' }}>
                  No completed orders yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  {completedOrders.map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileOrders;

import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import useDocumentMeta from '../../hooks/useDocumentMeta';
import {
  Package, ShoppingBag, TrendingUp, Clock, Plus, Eye,
  Store, ChevronRight, Calendar, User, BarChart2, Zap
} from 'lucide-react';

const AdminDashboard = () => {
  const { products, orders } = useShop();
  useDocumentMeta('Admin Dashboard', 'LuqmanGo admin panel — manage products, orders, and store health.');


  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Processing').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 5).length;

  const fulfillmentRate = orders.length > 0
    ? Math.round((deliveredOrders / orders.length) * 100)
    : 0;

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Delivered':  return { bg: '#DCFCE7', color: '#15803D', bar: '#22C55E', borderColor: '#22C55E' };
      case 'Processing': return { bg: '#FEF9C3', color: '#A16207', bar: '#EAB308', borderColor: '#EAB308' };
      case 'Shipped':    return { bg: '#DBEAFE', color: '#1D4ED8', bar: '#3B82F6', borderColor: '#3B82F6' };
      case 'Cancelled':  return { bg: '#FEE2E2', color: '#B91C1C', bar: '#EF4444', borderColor: '#EF4444' };
      default:           return { bg: '#F3F4F6', color: '#374151', bar: '#9CA3AF', borderColor: '#9CA3AF' };
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F3ED', paddingBottom: '6rem' }}>

      {/* ── Dark Navy Header ── */}
      <div style={{
        background: 'linear-gradient(160deg, #1E2A3A 0%, #162030 100%)',
        padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1.2rem, 3vw, 2rem)',
        paddingTop: 'clamp(1.5rem, 4vw, 2.5rem)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ambient glow orb */}
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '220px', height: '220px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(67,97,50,0.25) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '10px',
              background: 'rgba(67,97,50,0.3)', border: '1px solid rgba(67,97,50,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <BarChart2 size={16} color="#7FC67E" />
            </div>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>
              Admin Panel
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.9rem, 5vw, 2.6rem)', fontWeight: 800, margin: '0 0 0.3rem', letterSpacing: '-0.03em', color: 'white' }}>
            Dashboard
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', margin: 0, fontWeight: 400 }}>
            Welcome back — here's your store at a glance.
          </p>

          {/* Navigation Pills */}
          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.8rem', flexWrap: 'wrap' }}>
            {[
              { to: '/admin/products', icon: <Package size={14} />, label: 'Products' },
              { to: '/admin/orders',   icon: <ShoppingBag size={14} />, label: 'Orders' },
              { to: '/',              icon: <Store size={14} />, label: 'Storefront' },
            ].map(({ to, icon, label }) => (
              <Link key={to} to={to} style={{
                display: 'flex', alignItems: 'center', gap: '0.45rem',
                padding: '0.55rem 1.1rem',
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '100px',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.8rem', fontWeight: 600,
                textDecoration: 'none',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s ease',
              }}>
                {icon} {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── White Rounded Content Panel ── */}
      <div style={{
        backgroundColor: '#F7F3ED',
        borderRadius: '28px 28px 0 0',
        padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1.2rem, 3vw, 2rem)',
        marginTop: '-1.5rem',
        position: 'relative',
        zIndex: 2,
      }}>

        {/* ── Stat Grid 2×2 ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem', marginBottom: '2rem' }}>
          <StatCard
            icon={<TrendingUp size={20} />}
            label="Revenue"
            value={`$${totalRevenue.toFixed(0)}`}
            sub="total earned"
            accentColor="#436132"
            index={0}
          />
          <StatCard
            icon={<Package size={20} />}
            label="Products"
            value={products.length}
            sub="in catalog"
            accentColor="#436132"
            index={1}
          />
          <StatCard
            icon={<ShoppingBag size={20} />}
            label="Orders"
            value={orders.length}
            sub="all time"
            accentColor="#3B82F6"
            index={2}
          />
          <StatCard
            icon={<Clock size={20} />}
            label="Pending"
            value={pendingOrders}
            sub="processing"
            accentColor="#EAB308"
            index={3}
          />
        </div>

        {/* ── Store Health Strip ── */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '1.2rem 1.4rem',
          marginBottom: '2rem',
          border: '1px solid rgba(0,0,0,0.04)',
          animation: 'cardEntrance 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s backwards'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Zap size={14} color="#436132" />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: '#706F65', textTransform: 'uppercase' }}>
              Store Health
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <HealthBar label="Fulfillment Rate" value={fulfillmentRate} color="#436132" />
            <HealthBar
              label="Stock Health"
              value={products.length > 0 ? Math.round(((products.length - lowStockProducts) / products.length) * 100) : 100}
              color="#3B82F6"
            />
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <SectionHeader title="Quick Actions" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
          <QuickAction icon={<Plus size={18} />}    label="Add New Product"     sub="Publish to catalog"        to="/admin/products" accentColor="#436132" index={0} />
          <QuickAction icon={<Eye size={18} />}     label="Manage Orders"       sub={`${pendingOrders} pending`} to="/admin/orders"   accentColor="#EAB308" index={1} />
          <QuickAction icon={<Store size={18} />}   label="Visit Storefront"    sub="Open customer view"        to="/"               accentColor="#3B82F6" index={2} />
        </div>

        {/* ── Recent Orders ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <SectionHeader title="Recent Orders" noMargin />
          <Link to="/admin/orders" style={{
            fontSize: '0.78rem', fontWeight: 600, color: '#436132',
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem'
          }}>
            View All <ChevronRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {orders.length === 0 ? (
            <EmptyState icon={<ShoppingBag size={36} strokeWidth={1} style={{ opacity: 0.25 }} />}
              title="No orders yet"
              sub="Orders will appear here once customers start purchasing."
            />
          ) : (
            orders.slice(0, 5).map((order, index) => {
              const sc = getStatusConfig(order.status);
              return (
                <div
                  key={order.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '18px',
                    padding: '1.1rem 1.3rem',
                    border: '1px solid rgba(0,0,0,0.04)',
                    borderLeft: `3.5px solid ${sc.borderColor}`,
                    animation: `cardEntrance 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) ${0.25 + index * 0.06}s backwards`,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.7rem' }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E2A3A', letterSpacing: '-0.01em' }}>
                        #{order.id.substring(0, 8)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                        <User size={12} color="#706F65" />
                        <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#706F65' }}>{order.customer.name}</span>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 700, padding: '0.28rem 0.7rem',
                      borderRadius: '100px', backgroundColor: sc.bg, color: sc.color,
                      letterSpacing: '0.05em', textTransform: 'uppercase', flexShrink: 0
                    }}>
                      {order.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.6rem', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#436132', letterSpacing: '-0.02em' }}>
                      ${order.total.toFixed(2)}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#9CA3AF' }}>
                      <Calendar size={11} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Sub Components ─── */

const StatCard = ({ icon, label, value, sub, accentColor, index }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '1.15rem',
    border: '1px solid rgba(0,0,0,0.04)',
    animation: `cardEntrance 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) ${index * 0.07}s backwards`,
    transition: 'transform 0.22s ease, box-shadow 0.22s ease',
    cursor: 'default',
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
  >
    <div style={{
      width: '40px', height: '40px', borderRadius: '12px',
      backgroundColor: `${accentColor}14`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: '0.8rem', color: accentColor,
    }}>
      {icon}
    </div>
    <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#706F65', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
      {label}
    </div>
    <div style={{ fontSize: 'clamp(1.5rem, 4.5vw, 1.9rem)', fontWeight: 800, color: '#1E2A3A', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
      {value}
    </div>
    <div style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 400, marginTop: '0.2rem' }}>{sub}</div>
  </div>
);

const HealthBar = ({ label, value, color }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
      <span style={{ fontSize: '0.78rem', fontWeight: 500, color: '#706F65' }}>{label}</span>
      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1E2A3A' }}>{value}%</span>
    </div>
    <div style={{ height: '5px', borderRadius: '99px', backgroundColor: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: '99px',
        backgroundColor: color,
        width: `${value}%`,
        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
      }} />
    </div>
  </div>
);

const SectionHeader = ({ title, noMargin }) => (
  <h2 style={{
    fontSize: '1.1rem', fontWeight: 700, color: '#1E2A3A',
    letterSpacing: '-0.01em', margin: noMargin ? 0 : '0 0 0.9rem',
  }}>
    {title}
  </h2>
);

const QuickAction = ({ icon, label, sub, to, accentColor, index }) => (
  <Link to={to} style={{
    display: 'flex', alignItems: 'center', gap: '1rem',
    padding: '1rem 1.2rem',
    backgroundColor: 'white',
    borderRadius: '18px',
    border: '1px solid rgba(0,0,0,0.04)',
    textDecoration: 'none',
    animation: `cardEntrance 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) ${0.1 + index * 0.06}s backwards`,
    transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.07)'; e.currentTarget.style.borderColor = `${accentColor}30`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.04)'; }}
  >
    <div style={{
      width: '40px', height: '40px', borderRadius: '13px',
      backgroundColor: `${accentColor}12`, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: accentColor,
    }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#1E2A3A' }}>{label}</div>
      <div style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 400, marginTop: '0.1rem' }}>{sub}</div>
    </div>
    <ChevronRight size={16} color="#9CA3AF" />
  </Link>
);

const EmptyState = ({ icon, title, sub }) => (
  <div style={{
    backgroundColor: 'white', borderRadius: '20px', padding: '3rem 1.5rem',
    textAlign: 'center', color: '#706F65', border: '1px solid rgba(0,0,0,0.04)',
  }}>
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem', color: '#D1D5DB' }}>{icon}</div>
    <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>{title}</p>
    <p style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{sub}</p>
  </div>
);

export default AdminDashboard;

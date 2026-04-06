import { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { ShoppingBag, Search, Trash2, ChevronRight, X, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_OPTIONS = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const getStatusConfig = (status) => {
  switch (status) {
    case 'Delivered':  return { bg: '#DCFCE7', color: '#15803D', border: '#22C55E' };
    case 'Processing': return { bg: '#FEF9C3', color: '#A16207', border: '#EAB308' };
    case 'Shipped':    return { bg: '#DBEAFE', color: '#1D4ED8', border: '#3B82F6' };
    case 'Cancelled':  return { bg: '#FEE2E2', color: '#B91C1C', border: '#EF4444' };
    default:           return { bg: '#F3F4F6', color: '#374151', border: '#9CA3AF' };
  }
};

const OrderManagement = () => {
  const { orders, updateOrderStatus } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = orders.filter(o => o.status === 'Processing').length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F3ED', paddingBottom: '6rem' }}>

      {/* Navy Header */}
      <div style={{
        background: 'linear-gradient(160deg, #1E2A3A 0%, #162030 100%)',
        padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1.2rem, 3vw, 2rem)',
        paddingTop: 'clamp(1.5rem, 4vw, 2.5rem)',
        color: 'white', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '220px', height: '220px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart2 size={16} color="#93C5FD" />
            </div>
            <Link to="/admin" style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', textDecoration: 'none' }}>
              ← Dashboard
            </Link>
          </div>
          <h1 style={{ fontSize: 'clamp(1.9rem, 5vw, 2.6rem)', fontWeight: 800, margin: '0 0 0.3rem', letterSpacing: '-0.03em', color: 'white' }}>Orders</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', margin: 0 }}>
            {orders.length} total · <span style={{ color: '#FDE68A' }}>{pendingCount} pending</span>
          </p>

          {/* Status Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.8rem', overflowX: 'auto', paddingBottom: '0.2rem', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {STATUS_OPTIONS.map(status => {
              const isActive = filterStatus === status;
              const sc = status !== 'All' ? getStatusConfig(status) : null;
              return (
                <button key={status} onClick={() => setFilterStatus(status)} style={{
                  flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.5rem 1rem', borderRadius: '100px',
                  border: isActive ? `1.5px solid ${sc ? sc.border : 'white'}` : '1.5px solid rgba(255,255,255,0.1)',
                  backgroundColor: isActive ? (sc ? sc.bg : 'white') : 'rgba(255,255,255,0.07)',
                  color: isActive ? (sc ? sc.color : '#1E2A3A') : 'rgba(255,255,255,0.6)',
                  fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'inherit',
                }}>
                  {sc && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: sc.border, flexShrink: 0 }} />}
                  {status}
                  {status !== 'All' && <span style={{ fontSize: '0.65rem', opacity: 0.75 }}>({orders.filter(o => o.status === status).length})</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ backgroundColor: '#F7F3ED', borderRadius: '28px 28px 0 0', padding: 'clamp(1.2rem,3vw,2rem)', marginTop: '-1.5rem', position: 'relative', zIndex: 2 }}>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '1.2rem', animation: 'cardEntrance 0.5s cubic-bezier(0.2,0.8,0.2,1) 0.05s backwards' }}>
          <Search size={16} style={{ position: 'absolute', top: '50%', left: '1.1rem', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
          <input
            type="text" placeholder="Search orders…" value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.85rem 2.75rem', backgroundColor: 'white', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.06)', fontSize: '0.88rem', color: '#1E2A3A', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => { e.target.style.borderColor = '#436132'; e.target.style.boxShadow = '0 0 0 3px rgba(67,97,50,0.1)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.boxShadow = 'none'; }}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} style={{ position: 'absolute', top: '50%', right: '0.9rem', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex' }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Order Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {filteredOrders.length === 0 ? (
            <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '4rem 1.5rem', textAlign: 'center', border: '1px dashed rgba(0,0,0,0.1)' }}>
              <ShoppingBag size={38} strokeWidth={1} style={{ opacity: 0.2, marginBottom: '0.8rem' }} />
              <p style={{ fontWeight: 600, color: '#374151' }}>No orders found</p>
              <p style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: '0.3rem' }}>Adjust your search or filter.</p>
            </div>
          ) : (
            filteredOrders.map((order, index) => {
              const sc = getStatusConfig(order.status);
              const isExpanded = expandedOrder === order.id;
              const initials = order.customer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
              return (
                <div key={order.id} style={{ backgroundColor: 'white', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)', borderLeft: `3.5px solid ${sc.border}`, overflow: 'hidden', animation: `cardEntrance 0.5s cubic-bezier(0.2,0.8,0.2,1) ${0.1 + index * 0.05}s backwards` }}>
                  <div onClick={() => setExpandedOrder(isExpanded ? null : order.id)} style={{ padding: '1rem 1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0, backgroundColor: `${sc.border}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 800, color: sc.color }}>
                      {initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E2A3A' }}>#{order.id.substring(0, 8)}</span>
                        <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '100px', backgroundColor: sc.bg, color: sc.color, letterSpacing: '0.05em', textTransform: 'uppercase', flexShrink: 0 }}>{order.status}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                        <span style={{ fontSize: '0.8rem', color: '#706F65', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.customer.name}</span>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: '#436132', letterSpacing: '-0.02em', flexShrink: 0, marginLeft: '0.5rem' }}>LKR {order.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <ChevronRight size={15} color="#9CA3AF" style={{ flexShrink: 0, transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.25s ease' }} />
                  </div>

                  {isExpanded && (
                    <div style={{ padding: '0 1.2rem 1.2rem', borderTop: '1px solid rgba(0,0,0,0.05)', animation: 'fadeIn 0.25s ease' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem', marginBottom: '1rem' }}>
                        {order.customer.email && <InfoItem label="Email" value={order.customer.email} />}
                        <InfoItem label="Date" value={new Date(order.date).toLocaleDateString()} />
                        <InfoItem label="Items" value={`${order.items?.length || 0} item(s)`} />
                        <InfoItem label="Payment" value="Paid" valueColor="#15803D" />
                      </div>
                      <div>
                        <p style={{ fontSize: '0.62rem', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Update Status</p>
                        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                          {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => {
                            const ssc = getStatusConfig(s);
                            return (
                              <button key={s} onClick={() => updateOrderStatus(order.id, s)} style={{ padding: '0.4rem 0.9rem', borderRadius: '100px', border: order.status === s ? `1.5px solid ${ssc.border}` : '1.5px solid rgba(0,0,0,0.08)', backgroundColor: order.status === s ? ssc.bg : 'transparent', color: order.status === s ? ssc.color : '#706F65', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                                {s}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div style={{ marginTop: '0.85rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '10px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        {filteredOrders.length > 0 && (
          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#9CA3AF', marginTop: '1.5rem' }}>
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
        )}
      </div>
    </div>
  );
};

const InfoItem = ({ label, value, valueColor }) => (
  <div>
    <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.15rem' }}>{label}</div>
    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: valueColor || '#1E2A3A' }}>{value}</div>
  </div>
);

export default OrderManagement;

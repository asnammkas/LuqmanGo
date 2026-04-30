import { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { ShoppingBag, Search, Trash2, ChevronRight, X, AlertTriangle } from 'lucide-react';

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

/* ─── Custom Confirmation Modal ─── */
const ConfirmModal = ({ isOpen, title, message, confirmLabel, onConfirm, onCancel, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.2s ease'
    }} onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'white', borderRadius: '16px', padding: '2rem',
        maxWidth: '400px', width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        animation: 'fadeIn 0.25s ease',
      }}>
        {/* Icon */}
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.2rem'
        }}>
          <AlertTriangle size={24} color="#DC2626" />
        </div>

        {/* Title */}
        <h3 style={{
          textAlign: 'center', fontSize: '1.1rem', fontWeight: 700,
          color: 'var(--color-text-main)', margin: '0 0 0.6rem'
        }}>{title}</h3>

        {/* Message */}
        <p style={{
          textAlign: 'center', fontSize: '0.88rem', color: 'var(--color-text-muted)',
          lineHeight: 1.5, margin: '0 0 1.8rem'
        }}>{message}</p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button
            onClick={onCancel}
            disabled={isLoading}
            style={{
              flex: 1, padding: '0.75rem', borderRadius: '10px',
              border: '1px solid var(--color-border)', background: 'white',
              fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
              color: 'var(--color-text-main)', fontFamily: 'inherit',
              transition: 'all 0.2s ease',
            }}
          >Cancel</button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              flex: 1, padding: '0.75rem', borderRadius: '10px',
              border: 'none', background: '#DC2626',
              fontSize: '0.9rem', fontWeight: 600, cursor: isLoading ? 'wait' : 'pointer',
              color: 'white', fontFamily: 'inherit',
              opacity: isLoading ? 0.7 : 1,
              transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
            }}
          >
            {isLoading && (
              <div style={{
                width: '14px', height: '14px',
                border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white',
                borderRadius: '50%', animation: 'spin 0.8s linear infinite'
              }} />
            )}
            {isLoading ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderManagement = () => {
  const { orders, updateOrderStatus, deleteOrder, deleteAllOrders } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);

  // Modal state
  const [confirmModal, setConfirmModal] = useState({ open: false, type: null, orderId: null });

  const handleDeleteSingle = async () => {
    const orderId = confirmModal.orderId;
    setIsDeleting(orderId);
    try {
      await deleteOrder(orderId);
      setExpandedOrder(null);
    } catch (e) {
      // silently handled
    } finally {
      setIsDeleting(null);
      setConfirmModal({ open: false, type: null, orderId: null });
    }
  };

  const handleDeleteAll = async () => {
    setIsDeleting('all');
    try {
      await deleteAllOrders();
    } catch (e) {
      // silently handled
    } finally {
      setIsDeleting(null);
      setConfirmModal({ open: false, type: null, orderId: null });
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = orders.filter(o => o.status === 'Processing').length;

  return (
    <>
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.open}
        title={confirmModal.type === 'all' ? 'Delete All Orders?' : `Delete Order #${confirmModal.orderId?.substring(0, 8) || ''}?`}
        message={confirmModal.type === 'all'
          ? 'This will permanently erase every single order from the database. This action cannot be undone.'
          : 'This order will be permanently deleted. This action cannot be undone.'}
        confirmLabel={confirmModal.type === 'all' ? 'Delete All' : 'Delete'}
        onConfirm={confirmModal.type === 'all' ? handleDeleteAll : handleDeleteSingle}
        onCancel={() => setConfirmModal({ open: false, type: null, orderId: null })}
        isLoading={!!isDeleting}
      />

      <div className="admin-page-header">
        <div>
          <h1>Orders</h1>
          <p>{orders.length} total · <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{pendingCount} pending</span></p>
        </div>
        {orders.length > 0 && (
          <button
            onClick={() => setConfirmModal({ open: true, type: 'all', orderId: null })}
            disabled={isDeleting === 'all'}
            className="admin-action-btn danger"
            style={{ 
              width: 'auto', padding: '0.6rem 1.2rem', gap: '0.5rem', 
              color: '#DC2626', borderColor: '#FCA5A5',
              opacity: isDeleting === 'all' ? 0.6 : 1,
              cursor: isDeleting === 'all' ? 'wait' : 'pointer'
            }}
          >
            <AlertTriangle size={16} />
            Delete All Orders
          </button>
        )}
      </div>

      <div className="admin-controls">
        <div className="admin-search-wrapper">
          <Search size={16} />
          <input
            type="text" placeholder="Search orders…" value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="admin-search-input"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} style={{ position: 'absolute', top: '50%', right: '0.9rem', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}>
              <X size={16} />
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          {STATUS_OPTIONS.map(status => {
            const isActive = filterStatus === status;
            return (
              <button key={status} onClick={() => setFilterStatus(status)} style={{
                flexShrink: 0, padding: '0.5rem 1rem', borderRadius: '10px',
                border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                backgroundColor: isActive ? 'var(--color-bg-main)' : 'white',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-main)',
                fontSize: '0.85rem', fontWeight: isActive ? 700 : 500, cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'inherit',
              }}>
                {status}
                {status !== 'All' && <span style={{ fontSize: '0.7rem', opacity: 0.8, marginLeft: '0.3rem' }}>({orders.filter(o => o.status === status).length})</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="admin-table-card">
        {filteredOrders.length === 0 ? (
          <div className="admin-empty-state">
            <ShoppingBag size={48} color="var(--color-border)" style={{ marginBottom: '1rem' }} />
            <h2>No orders found</h2>
            <p>Adjust your search or filter.</p>
          </div>
        ) : (
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {filteredOrders.map((order, index) => {
                const sc = getStatusConfig(order.status);
                const isExpanded = expandedOrder === order.id;
                const initials = order.customer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                
                return (
                  <div key={order.id} className="admin-product-row" style={{ animationDelay: `${index * 0.05}s`, display: 'block', padding: 0 }}>
                    <div onClick={() => setExpandedOrder(isExpanded ? null : order.id)} style={{ padding: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0, backgroundColor: 'var(--color-bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                        {initials}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-main)' }}>#{order.id.substring(0, 8)}</span>
                          <span className={`admin-status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.customer.name}</span>
                          <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.02em', flexShrink: 0, marginLeft: '0.5rem' }}>LKR {order.total.toFixed(2)}</span>
                        </div>
                      </div>
                      <ChevronRight size={18} color="var(--color-text-muted)" style={{ flexShrink: 0, transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.25s ease' }} />
                    </div>

                    {isExpanded && (
                      <div style={{ padding: '0 1.2rem 1.2rem', borderTop: '1px solid var(--color-border)', animation: 'fadeIn 0.25s ease' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.2rem', marginBottom: '1.5rem' }}>
                          {order.customer.email && <InfoItem label="Email" value={order.customer.email} />}
                          <InfoItem label="Date" value={order.date?.toDate ? order.date.toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'} />
                          <InfoItem label="Items" value={`${order.items?.length || 0} item(s)`} />
                          <InfoItem label="Payment" value="Paid" valueColor="var(--color-leaf-green)" />
                        </div>
                        <div>
                          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Update Status</p>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => {
                              const ssc = getStatusConfig(s);
                              const isCurrent = order.status === s;
                              return (
                                <button key={s} onClick={() => updateOrderStatus(order.id, s)} className="admin-status-select" style={{
                                  backgroundColor: isCurrent ? ssc.bg : 'transparent',
                                  color: isCurrent ? ssc.color : 'var(--color-text-muted)',
                                  borderColor: isCurrent ? ssc.border : 'var(--color-border)'
                                }}>
                                  {s}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div style={{ marginTop: '1.2rem', display: 'flex', justifyContent: 'flex-end' }}>
                          <button 
                            className="admin-action-btn danger" 
                            style={{ width: 'auto', padding: '0 1rem', gap: '0.4rem', color: '#DC2626' }}
                            disabled={!!isDeleting}
                            onClick={() => setConfirmModal({ open: true, type: 'single', orderId: order.id })}
                          >
                            <Trash2 size={16} /> Delete Order
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {filteredOrders.length > 0 && (
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '1.5rem' }}>
          Showing {filteredOrders.length} of {orders.length} orders
        </p>
      )}
    </>
  );
};

const InfoItem = ({ label, value, valueColor }) => (
  <div>
    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{label}</div>
    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: valueColor || 'var(--color-text-main)' }}>{value}</div>
  </div>
);

export default OrderManagement;

import { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { ShoppingBag, Search, Eye, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderManagement = () => {
  const { orders, updateOrderStatus } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <Link to="/admin" style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>
              <ArrowLeft size={24} />
            </Link>
            <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Order Management</h1>
          </div>
          <p style={{ color: 'var(--color-text-muted)' }}>View and update customer orders.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
          <ShoppingBag size={20} />
          {orders.length} Total Orders
        </div>
      </div>

      {/* Controls */}
      <div className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flexGrow: 1, position: 'relative', minWidth: '250px' }}>
          <Search size={20} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--color-text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by Order ID or Customer Name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input"
            style={{ width: '100%', paddingLeft: '3rem' }}
          />
        </div>
        <select 
          className="input" 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ width: '200px', cursor: 'pointer' }}
        >
          <option value="All">All Statuses</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-main)' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Order ID</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Customer</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Date</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Total</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Status</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-text-muted)', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  <ShoppingBag size={48} opacity={0.2} style={{ margin: '0 auto 1rem auto', display: 'block' }} />
                  No orders found matching your search.
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background-color 0.2s', ':hover': { backgroundColor: 'var(--color-bg-main)' } }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-secondary)' }}>#{order.id.substring(0, 8)}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontWeight: 500, color: 'var(--color-text-main)' }}>{order.customer.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{order.customer.email}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                    ${order.total.toFixed(2)}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <select 
                      value={order.status} 
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: 'var(--radius-sm)', 
                        border: '1px solid var(--color-border)',
                        backgroundColor: order.status === 'Delivered' ? '#D1FAE5' : order.status === 'Processing' ? '#FEF3C7' : 'var(--color-bg-main)',
                        color: order.status === 'Delivered' ? '#065F46' : order.status === 'Processing' ? '#92400E' : 'inherit',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button className="btn-icon" style={{ backgroundColor: 'var(--color-bg-main)', border: '1px solid var(--color-border)' }} title="View Details">
                        <Eye size={18} color="var(--color-secondary)" />
                      </button>
                      <button className="btn-icon" style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA', color: '#EF4444' }} title="Delete Order">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;

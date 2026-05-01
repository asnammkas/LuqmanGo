import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';
import { useCategories } from '../../context/CategoryContext';
import {
  Package, ShoppingBag, TrendingUp, Clock, Plus, Eye,
  Store, ChevronRight, Calendar, User, LayoutGrid, Zap
} from 'lucide-react';

const AdminDashboard = () => {
  const { products, fetchAdminCatalog, clearAdminCatalog } = useProducts();
  const { orders } = useOrders();
  const { categories } = useCategories();

  React.useEffect(() => {
    fetchAdminCatalog();
    // No clearAdminCatalog on unmount here as other admin pages might need it 
    // or we might want to keep it while in admin section.
    // Actually, following the pattern in ProductManagement:
    return () => clearAdminCatalog();
  }, [fetchAdminCatalog, clearAdminCatalog]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Processing').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 5).length;

  const fulfillmentRate = orders.length > 0
    ? Math.round((deliveredOrders / orders.length) * 100)
    : 0;

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back — here's your store at a glance.</p>
        </div>
        <div className="admin-page-actions">
          <Link to="/admin/products" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
            <Plus size={16} /> New Product
          </Link>
          <Link to="/" className="btn btn-outline" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', background: 'white' }}>
            <Store size={16} /> Storefront
          </Link>
        </div>
      </div>

      <div className="admin-metrics">
        <div className="admin-metric-card">
          <div className="admin-metric-icon green">
            <TrendingUp size={24} color="var(--color-primary)" />
          </div>
          <div className="admin-metric-info">
            <h3>Revenue</h3>
            <p>LKR {totalRevenue.toFixed(0)}</p>
          </div>
        </div>
        
        <div className="admin-metric-card">
          <div className="admin-metric-icon sage">
            <Package size={24} color="var(--color-text-sage)" />
          </div>
          <div className="admin-metric-info">
            <h3>Products</h3>
            <p>{products.length}</p>
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-icon emerald">
            <LayoutGrid size={24} color="#10B981" />
          </div>
          <div className="admin-metric-info">
            <h3>Categories</h3>
            <p>{categories.length}</p>
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-icon amber">
            <Clock size={24} color="#F59E0B" />
          </div>
          <div className="admin-metric-info">
            <h3>Pending Orders</h3>
            <p>{pendingOrders}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        
        {/* Store Health */}
        <div className="admin-table-card" style={{ padding: '1.5rem' }}>
          <h2 className="admin-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={18} color="var(--color-primary)" /> Store Health
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
            <HealthBar label="Fulfillment Rate" value={fulfillmentRate} color="var(--color-primary)" />
            <HealthBar
              label="Stock Health"
              value={products.length > 0 ? Math.round(((products.length - lowStockProducts) / products.length) * 100) : 100}
              color="var(--color-leaf-green)"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-table-card" style={{ padding: '1.5rem' }}>
          <h2 className="admin-section-title">Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <QuickAction icon={<Plus size={18} />} label="Add New Product" sub="Publish to catalog" to="/admin/products" />
            <QuickAction icon={<Eye size={18} />} label="Manage Orders" sub={`${pendingOrders} pending`} to="/admin/orders" />
            <QuickAction icon={<Store size={18} />} label="Visit Storefront" sub="Open customer view" to="/" />
          </div>
        </div>

      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 className="admin-section-title" style={{ margin: 0 }}>Recent Orders</h2>
        <Link to="/admin/orders" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          View All <ChevronRight size={14} />
        </Link>
      </div>

      <div className="admin-table-card">
        {orders.length === 0 ? (
          <div className="admin-empty-state">
            <ShoppingBag size={48} color="var(--color-border)" style={{ marginBottom: '1rem' }} />
            <h2>No orders yet</h2>
            <p>Orders will appear here once customers start purchasing.</p>
          </div>
        ) : (
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(order => (
                  <tr key={order.id}>
                    <td className="cell-bold">#{order.id.substring(0, 8)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-accent-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-sage)' }}>
                          <User size={14} />
                        </div>
                        <span className="cell-primary">{order.customer.name}</span>
                      </div>
                    </td>
                    <td className="cell-muted">{new Date(order.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`admin-status-badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="cell-primary">LKR {order.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </>
  );
};

/* ─── Sub Components ─── */

const HealthBar = ({ label, value, color }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)' }}>{label}</span>
      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)' }}>{value}%</span>
    </div>
    <div style={{ height: '6px', borderRadius: '99px', backgroundColor: 'var(--color-border)', overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: '99px',
        backgroundColor: color,
        width: `${value}%`,
        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
      }} />
    </div>
  </div>
);

const QuickAction = ({ icon, label, sub, to }) => (
  <Link to={to} style={{
    display: 'flex', alignItems: 'center', gap: '1rem',
    padding: '1rem',
    backgroundColor: 'var(--color-bg-main)',
    borderRadius: '14px',
    border: '1px solid var(--color-border)',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--color-accent-sage)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
  >
    <div style={{
      width: '40px', height: '40px', borderRadius: '10px',
      backgroundColor: 'white', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--color-primary)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-main)' }}>{label}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>{sub}</div>
    </div>
    <ChevronRight size={16} color="var(--color-text-muted)" />
  </Link>
);

export default AdminDashboard;

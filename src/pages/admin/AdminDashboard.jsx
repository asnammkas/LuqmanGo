import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { Package, ShoppingBag, TrendingUp, Users } from 'lucide-react';

const AdminDashboard = () => {
  const { products, orders } = useShop();

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Processing').length;

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Welcome back, store owner.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
           <Link to="/admin/products" className="btn btn-outline">Manage Products</Link>
           <Link to="/admin/orders" className="btn btn-outline">Manage Orders</Link>
           <Link to="/" className="btn btn-primary">View Storefront</Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        <MetricCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} icon={<TrendingUp size={24} color="var(--color-primary)" />} />
        <MetricCard title="Active Products" value={products.length} icon={<Package size={24} color="var(--color-secondary)" />} />
        <MetricCard title="Total Orders" value={orders.length} icon={<ShoppingBag size={24} color="#10b981" />} />
        <MetricCard title="Pending Orders" value={pendingOrders} icon={<Users size={24} color="#f59e0b" />} />
      </div>

      {/* Recent Orders Table */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Recent Orders</h2>
      <div className="card admin-table-container" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-main)' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Order ID</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Customer</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Date</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Total</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No orders yet.</td>
              </tr>
            ) : (
              orders.slice(0, 5).map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background-color 0.2s', ':hover': { backgroundColor: 'var(--color-bg-main)' } }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{order.id}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{order.customer.name}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>{new Date(order.date).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>${order.total.toFixed(2)}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span className={`badge ${order.status === 'Processing' ? 'badge-primary' : 'badge-secondary'}`}>
                      {order.status}
                    </span>
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

const MetricCard = ({ title, value, icon }) => (
  <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
    <div style={{ backgroundColor: 'var(--color-bg-main)', padding: '1rem', borderRadius: '50%' }}>
      {icon}
    </div>
    <div>
      <h3 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', fontWeight: 500 }}>{title}</h3>
      <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{value}</p>
    </div>
  </div>
);

export default AdminDashboard;

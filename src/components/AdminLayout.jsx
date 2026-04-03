import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, ExternalLink } from 'lucide-react';

const navLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
];

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <h2>LuqmanGo</h2>
          <span>Admin</span>
        </div>

        <nav className="admin-sidebar-nav">
          {navLinks.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `admin-sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="link-icon">
                <Icon size={18} />
              </span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <NavLink to="/" className="admin-sidebar-link">
            <span className="link-icon">
              <ExternalLink size={18} />
            </span>
            Storefront
          </NavLink>
        </div>
      </aside>

      {/* Content Area */}
      <main className="admin-content animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;

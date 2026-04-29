import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Package, LayoutGrid, ShoppingBag, Store, LogOut, Image } from 'lucide-react';
import '../../admin.css';

const AdminLayout = () => {
  const navLinks = [
    { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard', end: true },
    { to: '/admin/products', icon: <Package size={18} />, label: 'Products' },
    { to: '/admin/categories', icon: <LayoutGrid size={18} />, label: 'Categories' },
    { to: '/admin/banners', icon: <Image size={18} />, label: 'Banners' },
    { to: '/admin/orders', icon: <ShoppingBag size={18} />, label: 'Orders' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <Link to="/admin" style={{ textDecoration: 'none' }}>
            <h2>LUQMAN</h2>
            <span>Admin</span>
          </Link>
        </div>

        <nav className="admin-sidebar-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `admin-sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <div className="link-icon">{link.icon}</div>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-sidebar-link">
            <div className="link-icon"><Store size={18} /></div>
            Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

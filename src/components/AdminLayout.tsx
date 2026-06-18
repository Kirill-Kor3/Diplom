import { Outlet, Link, NavLink, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, FolderOpen, ShoppingBag, Users, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/admin', label: 'Дашборд', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Товары', icon: Package },
  { to: '/admin/categories', label: 'Категории', icon: FolderOpen },
  { to: '/admin/orders', label: 'Заказы', icon: ShoppingBag },
  { to: '/admin/users', label: 'Пользователи', icon: Users },
];

export default function AdminLayout() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <div className="loading">Загрузка...</div>;
  if (!user || !isAdmin) return <Navigate to="/login" replace />;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Админ-панель</h2>
          <Link to="/" className="back-link"><ArrowLeft size={16} /> На сайт</Link>
        </div>
        <nav>
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

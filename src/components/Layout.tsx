import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Cpu, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Layout.css';

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  const navLinks = [
    { to: '/', label: 'Главная' },
    { to: '/catalog', label: 'Каталог' },
    { to: '/about', label: 'О магазине' },
    { to: '/contacts', label: 'Контакты' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `/catalog?search=${encodeURIComponent(search.trim())}`;
    }
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            <Cpu size={28} />
            <span>TechStore</span>
          </Link>

          <form className="search-form" onSubmit={handleSearch}>
            <Search size={18} />
            <input
              type="search"
              placeholder="Поиск товаров..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <nav className={`nav ${menuOpen ? 'open' : ''}`}>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={location.pathname === link.to ? 'active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            {isAdmin && (
              <Link to="/admin" className="icon-btn" title="Админ-панель">
                <LayoutDashboard size={20} />
              </Link>
            )}
            <Link to="/cart" className="icon-btn cart-btn">
              <ShoppingCart size={20} />
              {totalItems > 0 && <span className="badge">{totalItems}</span>}
            </Link>
            {user ? (
              <div className="user-menu">
                <Link to="/profile" className="icon-btn">
                  <User size={20} />
                </Link>
                <span className="user-name">{user.name.split(' ')[0]}</span>
                <button className="icon-btn" onClick={logout} title="Выйти">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-sm btn-outline">Войти</Link>
            )}
            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <div className="logo footer-logo">
              <Cpu size={24} />
              <span>TechStore</span>
            </div>
            <p>Интернет-магазин компьютерной техники и комплектующих. Качество, гарантия, быстрая доставка.</p>
          </div>
          <div>
            <h4>Каталог</h4>
            <Link to="/catalog?category=gpu">Видеокарты</Link>
            <Link to="/catalog?category=cpu">Процессоры</Link>
            <Link to="/catalog?category=ram">Память</Link>
            <Link to="/catalog?category=storage">Накопители</Link>
          </div>
          <div>
            <h4>Информация</h4>
            <Link to="/about">О магазине</Link>
            <Link to="/contacts">Контакты</Link>
            <Link to="/catalog">Все товары</Link>
          </div>
          <div>
            <h4>Контакты</h4>
            <p>+7 (800) 555-35-35</p>
            <p>info@techstore.ru</p>
            <p>Москва, ул. Технологическая, 1</p>
          </div>
        </div>
        <div className="footer-bottom container">
          <p>© 2026 TechStore. Дипломный проект — магазин компьютерной техники.</p>
        </div>
      </footer>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { api, formatPrice } from '../../api/client';
import type { AdminStats } from '../../types';

const STATUS_LABELS: Record<string, string> = {
  NEW: 'Новые',
  PROCESSING: 'В обработке',
  SHIPPED: 'Отправлены',
  DELIVERED: 'Доставлены',
  CANCELLED: 'Отменены',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    api.admin.stats().then(setStats);
  }, []);

  if (!stats) return <div className="loading">Загрузка...</div>;

  return (
    <div className="admin-page">
      <h1>Дашборд</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <Package size={28} />
          <div>
            <span className="stat-value">{stats.productsCount}</span>
            <span className="stat-label">Товаров</span>
          </div>
        </div>
        <div className="stat-card">
          <ShoppingBag size={28} />
          <div>
            <span className="stat-value">{stats.ordersCount}</span>
            <span className="stat-label">Заказов</span>
          </div>
        </div>
        <div className="stat-card">
          <Users size={28} />
          <div>
            <span className="stat-value">{stats.usersCount}</span>
            <span className="stat-label">Пользователей</span>
          </div>
        </div>
        <div className="stat-card highlight">
          <TrendingUp size={28} />
          <div>
            <span className="stat-value">{formatPrice(stats.revenue)}</span>
            <span className="stat-label">Выручка</span>
          </div>
        </div>
      </div>

      <div className="admin-grid-2">
        <div className="card">
          <h3>Заказы по статусам</h3>
          <ul className="status-list">
            {stats.ordersByStatus.map((s) => (
              <li key={s.status}>
                <span>{STATUS_LABELS[s.status] || s.status}</span>
                <strong>{s._count}</strong>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>Последние заказы</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Клиент</th>
                <th>Сумма</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.user?.name || (o as { guestName?: string }).guestName || 'Гость'}</td>
                  <td>{formatPrice(o.total)}</td>
                  <td><span className={`status status-${o.status.toLowerCase()}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

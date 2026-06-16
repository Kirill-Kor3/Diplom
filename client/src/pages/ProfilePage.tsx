import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Package, CheckCircle } from 'lucide-react';
import { api, formatPrice } from '../api/client';
import { useAuth } from '../context/AuthContext';
import SafeImage from '../components/SafeImage';
import type { Order } from '../types';

const STATUS_LABELS: Record<string, string> = {
  NEW: 'Новый',
  PROCESSING: 'В обработке',
  SHIPPED: 'Отправлен',
  DELIVERED: 'Доставлен',
  CANCELLED: 'Отменён',
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchParams] = useSearchParams();
  const ordered = searchParams.get('ordered');

  useEffect(() => {
    if (user) api.orders.my().then(setOrders);
  }, [user]);

  if (!user) {
    return (
      <div className="container auth-required">
        <p>Войдите, чтобы просмотреть заказы</p>
        <Link to="/login" className="btn btn-primary">Войти</Link>
      </div>
    );
  }

  return (
    <div className="profile-page container">
      <h1>Личный кабинет</h1>
      {ordered && (
        <div className="success-banner">
          <CheckCircle size={24} />
          <span>Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.</span>
        </div>
      )}
      <div className="profile-info card">
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        {user.phone && <p>{user.phone}</p>}
      </div>

      <h2><Package size={22} /> Мои заказы</h2>
      {orders.length === 0 ? (
        <p className="empty-state">У вас пока нет заказов</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card card">
              <div className="order-header">
                <span>Заказ #{order.id}</span>
                <span className={`status status-${order.status.toLowerCase()}`}>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
                <span className="order-date">
                  {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </div>
              <div className="order-items-preview">
                {order.items.map((item) => (
                  <div key={item.id} className="order-item-mini">
                    <SafeImage src={item.product.image} alt={item.product.name} />
                    <span>{item.product.name} × {item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <span>{order.city}, {order.address}</span>
                <strong>{formatPrice(order.total)}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

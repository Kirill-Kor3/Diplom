import { useEffect, useState } from 'react';
import { api, formatPrice } from '../../api/client';
import type { Order } from '../../types';

const STATUSES = ['NEW', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const STATUS_LABELS: Record<string, string> = {
  NEW: 'Новый', PROCESSING: 'В обработке', SHIPPED: 'Отправлен',
  DELIVERED: 'Доставлен', CANCELLED: 'Отменён',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('');

  const load = () => {
    const params = filter ? { status: filter } : undefined;
    api.orders.list(params).then((r) => setOrders(r.orders));
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id: number, status: string) => {
    await api.orders.updateStatus(id, status);
    load();
  };

  return (
    <div className="admin-page">
      <h1>Заказы</h1>
      <div className="filter-tabs">
        <button className={!filter ? 'active' : ''} onClick={() => setFilter('')}>Все</button>
        {STATUSES.map((s) => (
          <button key={s} className={filter === s ? 'active' : ''} onClick={() => setFilter(s)}>
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <table className="admin-table full">
        <thead>
          <tr>
            <th>#</th>
            <th>Дата</th>
            <th>Клиент</th>
            <th>Адрес</th>
            <th>Сумма</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{new Date(o.createdAt).toLocaleString('ru-RU')}</td>
              <td>{o.user?.name || o.guestName || '—'}<br /><small>{o.user?.email || o.guestEmail}</small></td>
              <td>{o.city}, {o.address}</td>
              <td>{formatPrice(o.total)}</td>
              <td>
                <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="select-sm">
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

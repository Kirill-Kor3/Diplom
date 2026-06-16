import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, formatPrice } from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SafeImage from '../components/SafeImage';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    guestName: user?.name || '',
    guestEmail: user?.email || '',
    guestPhone: user?.phone || '',
    city: '',
    address: '',
    comment: '',
  });

  if (items.length === 0) {
    return (
      <div className="container empty-cart">
        <h2>Корзина пуста</h2>
        <Link to="/catalog" className="btn btn-primary">В каталог</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.orders.create({
        ...form,
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      });
      clearCart();
      navigate('/profile?ordered=1');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка оформления');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page container">
      <h1>Оформление заказа</h1>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          {!user && (
            <>
              <h3>Контактные данные</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Имя *</label>
                  <input required value={form.guestName} onChange={(e) => setForm({ ...form, guestName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" required value={form.guestEmail} onChange={(e) => setForm({ ...form, guestEmail: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Телефон *</label>
                <input required value={form.guestPhone} onChange={(e) => setForm({ ...form, guestPhone: e.target.value })} />
              </div>
            </>
          )}
          <h3>Доставка</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Город *</label>
              <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Адрес *</label>
              <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Комментарий</label>
            <textarea rows={3} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Оформление...' : `Оплатить ${formatPrice(totalPrice)}`}
          </button>
        </form>

        <aside className="checkout-summary">
          <h3>Ваш заказ</h3>
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="checkout-item">
              <SafeImage src={product.image} alt={product.name} />
              <div>
                <p>{product.name}</p>
                <span>{quantity} × {formatPrice(product.price)}</span>
              </div>
            </div>
          ))}
          <div className="summary-row total">
            <span>Итого:</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

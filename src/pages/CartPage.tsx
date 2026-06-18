import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { formatPrice } from '../api/client';
import { useCart } from '../context/CartContext';
import SafeImage from '../components/SafeImage';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="container empty-cart">
        <ShoppingBag size={64} />
        <h2>Корзина пуста</h2>
        <p>Добавьте товары из каталога</p>
        <Link to="/catalog" className="btn btn-primary">Перейти в каталог</Link>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1>Корзина</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="cart-item">
              <Link to={`/product/${product.slug}`}>
                <SafeImage src={product.image} alt={product.name} />
              </Link>
              <div className="cart-item-info">
                <Link to={`/product/${product.slug}`}>
                  <h3>{product.name}</h3>
                </Link>
                <span className="price">{formatPrice(product.price)}</span>
              </div>
              <div className="qty-control">
                <button onClick={() => updateQuantity(product.id, quantity - 1)}>
                  <Minus size={14} />
                </button>
                <span>{quantity}</span>
                <button onClick={() => updateQuantity(product.id, quantity + 1)}>
                  <Plus size={14} />
                </button>
              </div>
              <span className="cart-item-total">{formatPrice(product.price * quantity)}</span>
              <button className="icon-btn danger" onClick={() => removeItem(product.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
        <aside className="cart-summary">
          <h3>Итого</h3>
          <div className="summary-row">
            <span>Товаров:</span>
            <span>{items.reduce((s, i) => s + i.quantity, 0)}</span>
          </div>
          <div className="summary-row total">
            <span>Сумма:</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <Link to="/checkout" className="btn btn-primary btn-block btn-lg">
            Оформить заказ
          </Link>
          <Link to="/catalog" className="btn btn-outline btn-block">
            Продолжить покупки
          </Link>
        </aside>
      </div>
    </div>
  );
}

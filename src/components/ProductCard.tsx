import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { formatPrice } from '../api/client';
import { useCart } from '../context/CartContext';
import SafeImage from './SafeImage';
import type { Product } from '../types';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  return (
    <article className="product-card">
      <Link to={`/product/${product.slug}`} className="product-card-image">
        <SafeImage src={product.image} alt={product.name} />
        {discount > 0 && <span className="discount-badge">-{discount}%</span>}
        {product.stock === 0 && <span className="out-of-stock">Нет в наличии</span>}
      </Link>
      <div className="product-card-body">
        {product.category && (
          <span className="product-category">{product.category.name}</span>
        )}
        <Link to={`/product/${product.slug}`}>
          <h3>{product.name}</h3>
        </Link>
        <div className="product-card-price">
          <span className="price">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="old-price">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
        <button
          className="btn btn-primary btn-block"
          disabled={product.stock === 0}
          onClick={() => addItem(product)}
        >
          <ShoppingCart size={16} />
          В корзину
        </button>
      </div>
    </article>
  );
}

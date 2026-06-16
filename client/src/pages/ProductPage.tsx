import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, Check } from 'lucide-react';
import { api, formatPrice, parseSpecs } from '../api/client';
import { useCart } from '../context/CartContext';
import SafeImage from '../components/SafeImage';
import type { Product } from '../types';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.products.get(slug)
      .then(setProduct)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="container loading">Загрузка...</div>;
  if (notFound || !product) return <div className="container empty-state">Товар не найден</div>;

  const specs = parseSpecs(product.specs);
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-page container">
      <nav className="breadcrumbs">
        <Link to="/">Главная</Link> /{' '}
        <Link to="/catalog">Каталог</Link> /{' '}
        {product.category && (
          <>
            <Link to={`/catalog?category=${product.category.slug}`}>{product.category.name}</Link> /{' '}
          </>
        )}
        <span>{product.name}</span>
      </nav>

      <div className="product-detail">
        <div className="product-gallery">
          <SafeImage src={product.image} alt={product.name} loading="eager" />
          {discount > 0 && <span className="discount-badge">-{discount}%</span>}
        </div>

        <div className="product-info">
          {product.category && (
            <Link to={`/catalog?category=${product.category.slug}`} className="product-category">
              {product.category.name}
            </Link>
          )}
          <h1>{product.name}</h1>
          <p className="product-description">{product.description}</p>

          <div className="product-price-block">
            <span className="price-lg">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="old-price">{formatPrice(product.oldPrice)}</span>
            )}
          </div>

          <p className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out'}`}>
            {product.stock > 0 ? `В наличии: ${product.stock} шт.` : 'Нет в наличии'}
          </p>

          {product.stock > 0 && (
            <div className="add-to-cart-row">
              <div className="qty-control">
                <button onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1}>
                  <Minus size={16} />
                </button>
                <span>{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} disabled={qty >= product.stock}>
                  <Plus size={16} />
                </button>
              </div>
              <button className="btn btn-primary btn-lg" onClick={handleAdd}>
                {added ? <><Check size={18} /> Добавлено</> : <><ShoppingCart size={18} /> В корзину</>}
              </button>
            </div>
          )}
        </div>
      </div>

      {Object.keys(specs).length > 0 && (
        <section className="specs-section">
          <h2>Характеристики</h2>
          <table className="specs-table">
            <tbody>
              {Object.entries(specs).map(([key, val]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Headphones, Zap } from 'lucide-react';
import { api } from '../api/client';
import ProductCard from '../components/ProductCard';
import SafeImage from '../components/SafeImage';
import type { Product, Category } from '../types';

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.products.list({ featured: 'true', limit: '8' }).then((r) => setFeatured(r.products));
    api.categories.list().then(setCategories);
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-badge">Новинки 2026</span>
            <h1>Компьютерная техника<br />для вашего ПК</h1>
            <p>
              Видеокарты, процессоры, память и комплектующие от ведущих брендов.
              Гарантия, быстрая доставка по всей России.
            </p>
            <div className="hero-actions">
              <Link to="/catalog" className="btn btn-primary btn-lg">
                Перейти в каталог <ArrowRight size={18} />
              </Link>
              <Link to="/catalog?featured=true" className="btn btn-outline btn-lg">
                Хиты продаж
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <SafeImage
              src="https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800"
              alt="Компьютерные комплектующие"
              loading="eager"
            />
          </div>
        </div>
      </section>

      <section className="features container">
        <div className="feature">
          <Truck size={32} />
          <h3>Быстрая доставка</h3>
          <p>От 1 дня по Москве, 2–5 дней по России</p>
        </div>
        <div className="feature">
          <Shield size={32} />
          <h3>Официальная гарантия</h3>
          <p>На все товары от производителя</p>
        </div>
        <div className="feature">
          <Headphones size={32} />
          <h3>Поддержка 24/7</h3>
          <p>Консультации по подбору комплектующих</p>
        </div>
        <div className="feature">
          <Zap size={32} />
          <h3>Актуальные цены</h3>
          <p>Регулярные акции и скидки</p>
        </div>
      </section>

      <section className="section container">
        <div className="section-header">
          <h2>Категории</h2>
          <Link to="/catalog" className="link-more">Все категории →</Link>
        </div>
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link key={cat.id} to={`/catalog?category=${cat.slug}`} className="category-card">
              <SafeImage src={cat.image} alt={cat.name} kind="category" />
              <div className="category-card-overlay">
                <h3>{cat.name}</h3>
                <span>{cat._count?.products ?? 0} товаров</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section-header">
          <h2>Хиты продаж</h2>
          <Link to="/catalog?featured=true" className="link-more">Смотреть все →</Link>
        </div>
        <div className="products-grid">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <div className="container cta-content">
          <h2>Соберите идеальный ПК</h2>
          <p>Не знаете, что выбрать? Наши специалисты помогут подобрать комплектующие под ваш бюджет.</p>
          <Link to="/contacts" className="btn btn-primary btn-lg">Связаться с нами</Link>
        </div>
      </section>
    </div>
  );
}

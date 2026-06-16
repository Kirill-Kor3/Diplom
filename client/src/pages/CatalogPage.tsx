import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import ProductCard from '../components/ProductCard';
import type { Product, Category } from '../types';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const featured = searchParams.get('featured') || '';
  const sort = searchParams.get('sort') || '';
  const page = searchParams.get('page') || '1';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    api.categories.list().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = { page, limit: '12' };
    if (category) params.category = category;
    if (search) params.search = search;
    if (featured) params.featured = featured;
    if (sort) params.sort = sort;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    api.products.list(params).then((r) => {
      setProducts(r.products);
      setTotal(r.total);
      setPages(r.pages);
      setLoading(false);
    });
  }, [category, search, featured, sort, page, minPrice, maxPrice]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  };

  const currentCategory = categories.find((c) => c.slug === category);

  return (
    <div className="catalog-page container">
      <div className="page-header">
        <h1>{currentCategory?.name || (search ? `Поиск: «${search}»` : 'Каталог товаров')}</h1>
        <p>{total} товаров</p>
      </div>

      <div className="catalog-layout">
        <aside className="catalog-filters">
          <h3>Категории</h3>
          <button
            className={`filter-item ${!category ? 'active' : ''}`}
            onClick={() => updateParam('category', '')}
          >
            Все товары
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-item ${category === cat.slug ? 'active' : ''}`}
              onClick={() => updateParam('category', cat.slug)}
            >
              {cat.name}
              <span>{cat._count?.products}</span>
            </button>
          ))}

          <h3>Сортировка</h3>
          <select value={sort} onChange={(e) => updateParam('sort', e.target.value)} className="select">
            <option value="">По умолчанию</option>
            <option value="price_asc">Цена: по возрастанию</option>
            <option value="price_desc">Цена: по убыванию</option>
            <option value="name">По названию</option>
          </select>

          <h3>Цена, ₽</h3>
          <div className="price-range">
            <input
              type="number"
              placeholder="От"
              value={minPrice}
              onChange={(e) => updateParam('minPrice', e.target.value)}
            />
            <input
              type="number"
              placeholder="До"
              value={maxPrice}
              onChange={(e) => updateParam('maxPrice', e.target.value)}
            />
          </div>
        </aside>

        <div className="catalog-main">
          {loading ? (
            <div className="loading">Загрузка...</div>
          ) : products.length === 0 ? (
            <div className="empty-state">Товары не найдены</div>
          ) : (
            <>
              <div className="products-grid">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {pages > 1 && (
                <div className="pagination">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      className={page === String(p) ? 'active' : ''}
                      onClick={() => updateParam('page', String(p))}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { api, formatPrice } from '../../api/client';
import SafeImage from '../../components/SafeImage';
import type { Product, Category } from '../../types';

const emptyProduct = {
  name: '', slug: '', description: '', price: 0, oldPrice: null as number | null,
  stock: 0, image: '', specs: '{}', featured: false, categoryId: 0,
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyProduct);
  const [editId, setEditId] = useState<number | null>(null);

  const load = () => {
    api.products.list({ limit: '100' }).then((r) => setProducts(r.products));
    api.categories.list().then(setCategories);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditId(null);
    setForm({ ...emptyProduct, categoryId: categories[0]?.id || 0 });
    setModal(true);
  };

  const openEdit = (p: Product) => {
    setEditId(p.id);
    setForm({
      name: p.name, slug: p.slug, description: p.description, price: p.price,
      oldPrice: p.oldPrice ?? null, stock: p.stock, image: p.image, specs: p.specs,
      featured: p.featured, categoryId: p.categoryId,
    });
    setModal(true);
  };

  const handleSave = async () => {
    if (editId) await api.products.update(editId, form);
    else await api.products.create(form);
    setModal(false);
    load();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Удалить товар?')) {
      await api.products.delete(id);
      load();
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <h1>Товары</h1>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Добавить</button>
      </div>

      <table className="admin-table full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Фото</th>
            <th>Название</th>
            <th>Цена</th>
            <th>Склад</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td><SafeImage src={p.image} alt={p.name} className="table-thumb" /></td>
              <td>{p.name}</td>
              <td>{formatPrice(p.price)}</td>
              <td>{p.stock}</td>
              <td className="actions">
                <button className="icon-btn" onClick={() => openEdit(p)}><Pencil size={16} /></button>
                <button className="icon-btn danger" onClick={() => handleDelete(p.id)}><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editId ? 'Редактировать' : 'Новый товар'}</h2>
            <div className="form-group"><label>Название</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="form-group"><label>Slug</label><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
            <div className="form-group"><label>Описание</label><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="form-row">
              <div className="form-group"><label>Цена</label><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} /></div>
              <div className="form-group"><label>Старая цена</label><input type="number" value={form.oldPrice ?? ''} onChange={(e) => setForm({ ...form, oldPrice: e.target.value ? +e.target.value : null })} /></div>
              <div className="form-group"><label>Склад</label><input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: +e.target.value })} /></div>
            </div>
            <div className="form-group"><label>URL изображения</label><input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
            <div className="form-group"><label>Характеристики (JSON)</label><textarea rows={3} value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })} /></div>
            <div className="form-group">
              <label>Категория</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: +e.target.value })}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <label className="checkbox-label">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Хит продаж
            </label>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setModal(false)}>Отмена</button>
              <button className="btn btn-primary" onClick={handleSave}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { api } from '../../api/client';
import SafeImage from '../../components/SafeImage';
import type { Category } from '../../types';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '', image: '' });
  const [editId, setEditId] = useState<number | null>(null);

  const load = () => api.categories.list().then(setCategories);
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditId(null);
    setForm({ name: '', slug: '', description: '', image: '' });
    setModal(true);
  };

  const openEdit = (c: Category) => {
    setEditId(c.id);
    setForm({ name: c.name, slug: c.slug, description: c.description || '', image: c.image || '' });
    setModal(true);
  };

  const handleSave = async () => {
    if (editId) await api.categories.update(editId, form);
    else await api.categories.create(form);
    setModal(false);
    load();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Удалить категорию?')) {
      await api.categories.delete(id);
      load();
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <h1>Категории</h1>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Добавить</button>
      </div>

      <table className="admin-table full">
        <thead>
          <tr><th>ID</th><th>Фото</th><th>Название</th><th>Slug</th><th>Товаров</th><th>Действия</th></tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td><SafeImage src={c.image} alt={c.name} kind="category" className="table-thumb" /></td>
              <td>{c.name}</td>
              <td>{c.slug}</td>
              <td>{c._count?.products}</td>
              <td className="actions">
                <button className="icon-btn" onClick={() => openEdit(c)}><Pencil size={16} /></button>
                <button className="icon-btn danger" onClick={() => handleDelete(c.id)}><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editId ? 'Редактировать' : 'Новая категория'}</h2>
            <div className="form-group"><label>Название</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="form-group"><label>Slug</label><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
            <div className="form-group"><label>Описание</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="form-group"><label>URL изображения</label><input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
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

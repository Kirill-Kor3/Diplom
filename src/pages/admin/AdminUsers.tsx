import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import type { User } from '../../types';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api.admin.users().then(setUsers);
  }, []);

  return (
    <div className="admin-page">
      <h1>Пользователи</h1>
      <table className="admin-table full">
        <thead>
          <tr><th>ID</th><th>Имя</th><th>Email</th><th>Телефон</th><th>Роль</th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.phone || '—'}</td>
              <td><span className={`role role-${u.role.toLowerCase()}`}>{u.role}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

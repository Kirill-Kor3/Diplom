const API = '/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${url}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка запроса');
  return data;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ user: import('../types').User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (data: { email: string; password: string; name: string; phone?: string }) =>
      request<{ user: import('../types').User; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    me: () => request<import('../types').User>('/auth/me'),
  },
  products: {
    list: (params?: Record<string, string>) => {
      const q = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<{ products: import('../types').Product[]; total: number; page: number; pages: number }>(
        `/products${q}`
      );
    },
    get: (slug: string) => request<import('../types').Product>(`/products/${slug}`),
    create: (data: Partial<import('../types').Product>) =>
      request<import('../types').Product>('/products', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<import('../types').Product>) =>
      request<import('../types').Product>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => request<{ ok: boolean }>(`/products/${id}`, { method: 'DELETE' }),
  },
  categories: {
    list: () => request<import('../types').Category[]>('/categories'),
    create: (data: Partial<import('../types').Category>) =>
      request<import('../types').Category>('/categories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<import('../types').Category>) =>
      request<import('../types').Category>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => request<{ ok: boolean }>(`/categories/${id}`, { method: 'DELETE' }),
  },
  orders: {
    create: (data: object) => request<import('../types').Order>('/orders', { method: 'POST', body: JSON.stringify(data) }),
    my: () => request<import('../types').Order[]>('/orders/my'),
    list: (params?: Record<string, string>) => {
      const q = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<{ orders: import('../types').Order[]; total: number; page: number; pages: number }>(
        `/orders${q}`
      );
    },
    updateStatus: (id: number, status: string) =>
      request<import('../types').Order>(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },
  admin: {
    stats: () => request<import('../types').AdminStats>('/admin/stats'),
    users: () => request<import('../types').User[]>('/admin/users'),
  },
};

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price);
}

export function parseSpecs(specs: string): Record<string, string> {
  try {
    return JSON.parse(specs);
  } catch {
    return {};
  }
}

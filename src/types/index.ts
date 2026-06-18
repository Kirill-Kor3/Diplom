export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  phone?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  _count?: { products: number };
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number | null;
  stock: number;
  image: string;
  specs: string;
  featured: boolean;
  categoryId: number;
  category?: { id: number; name: string; slug: string };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  status: string;
  total: number;
  address: string;
  city: string;
  comment?: string;
  createdAt: string;
  items: OrderItem[];
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  user?: { name: string; email: string };
}

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: { id: number; name: string; image: string; slug?: string };
}

export interface AdminStats {
  productsCount: number;
  ordersCount: number;
  usersCount: number;
  revenue: number;
  recentOrders: Order[];
  ordersByStatus: { status: string; _count: number }[];
}

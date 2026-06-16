import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authRequired, adminRequired } from '../middleware/auth.js';

const router = Router();

router.use(authRequired, adminRequired);

router.get('/stats', async (_req, res) => {
  const [productsCount, ordersCount, usersCount, revenue, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.order.aggregate({
      where: { status: { not: 'CANCELLED' } },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        items: { include: { product: { select: { name: true } } } },
      },
    }),
  ]);

  const ordersByStatus = await prisma.order.groupBy({
    by: ['status'],
    _count: true,
  });

  res.json({
    productsCount,
    ordersCount,
    usersCount,
    revenue: revenue._sum.total ?? 0,
    recentOrders,
    ordersByStatus,
  });
});

router.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(users);
});

export default router;

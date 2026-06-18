import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authRequired, adminRequired } from '../middleware/auth.js';

const router = Router();

const orderSchema = z.object({
  address: z.string().min(5),
  city: z.string().min(2),
  comment: z.string().optional(),
  guestName: z.string().optional(),
  guestEmail: z.string().email().optional(),
  guestPhone: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.number().int(),
      quantity: z.number().int().min(1),
    })
  ).min(1),
});

router.post('/', async (req, res) => {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Некорректные данные заказа' });

  const { address, city, comment, guestName, guestEmail, guestPhone, items } = parsed.data;

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  if (products.length !== items.length) {
    return res.status(400).json({ error: 'Некоторые товары не найдены' });
  }

  const productMap = new Map(products.map((p) => [p.id, p]));
  let total = 0;
  const orderItems = items.map((item) => {
    const product = productMap.get(item.productId)!;
    if (product.stock < item.quantity) {
      throw new Error(`Недостаточно товара: ${product.name}`);
    }
    total += product.price * item.quantity;
    return { productId: item.productId, quantity: item.quantity, price: product.price };
  });

  const authHeader = req.headers.authorization;
  let userId: number | undefined;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const jwt = await import('jsonwebtoken');
      const payload = jwt.default.verify(authHeader.slice(7), process.env.JWT_SECRET!) as {
        userId: number;
      };
      userId = payload.userId;
    } catch {
      /* guest order */
    }
  }

  try {
  const order = await prisma.$transaction(async (tx) => {
    for (const item of items) {
      const product = productMap.get(item.productId)!;
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }
    return tx.order.create({
      data: {
        userId,
        guestName,
        guestEmail,
        guestPhone,
        address,
        city,
        comment,
        total,
        items: { create: orderItems },
      },
      include: {
        items: { include: { product: { select: { id: true, name: true, image: true } } } },
      },
    });
  });

  res.status(201).json(order);
  } catch (err) {
    return res.status(400).json({ error: err instanceof Error ? err.message : 'Ошибка создания заказа' });
  }
});

router.get('/my', authRequired, async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.userId },
    include: {
      items: { include: { product: { select: { id: true, name: true, image: true, slug: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(orders);
});

router.get('/', authRequired, adminRequired, async (req, res) => {
  const { status, page = '1' } = req.query;
  const pageNum = Math.max(1, parseInt(page as string) || 1);
  const limit = 20;
  const where = status ? { status: status as string } : {};
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (pageNum - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);
  res.json({ orders, total, page: pageNum, pages: Math.ceil(total / limit) });
});

router.get('/:id', authRequired, adminRequired, async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: parseInt(req.params.id as string) },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      items: { include: { product: true } },
    },
  });
  if (!order) return res.status(404).json({ error: 'Заказ не найден' });
  res.json(order);
});

router.patch('/:id/status', authRequired, adminRequired, async (req, res) => {
  const { status } = req.body;
  const valid = ['NEW', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  if (!valid.includes(status)) {
    return res.status(400).json({ error: 'Некорректный статус' });
  }
  const order = await prisma.order.update({
    where: { id: parseInt(req.params.id as string) },
    data: { status },
  });
  res.json(order);
});

export default router;

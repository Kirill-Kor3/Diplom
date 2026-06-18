import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authRequired, adminRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  const { category, search, featured, minPrice, maxPrice, sort, page = '1', limit = '12' } =
    req.query;
  const pageNum = Math.max(1, parseInt(page as string) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit as string) || 12));
  const skip = (pageNum - 1) * limitNum;

  const where: Record<string, unknown> = {};
  if (category) where.category = { slug: category };
  if (featured === 'true') where.featured = true;
  if (search) {
    where.OR = [
      { name: { contains: search as string } },
      { description: { contains: search as string } },
    ];
  }
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) (where.price as { gte?: number }).gte = parseFloat(minPrice as string);
    if (maxPrice) (where.price as { lte?: number }).lte = parseFloat(maxPrice as string);
  }

  let orderBy: { price?: 'asc' | 'desc'; createdAt?: 'desc'; name?: 'asc' } = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };
  if (sort === 'name') orderBy = { name: 'asc' };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limitNum,
      include: { category: { select: { id: true, name: true, slug: true } } },
    }),
    prisma.product.count({ where }),
  ]);

  res.json({ products, total, page: pageNum, pages: Math.ceil(total / limitNum) });
});

router.get('/:slug', async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { slug: req.params.slug },
    include: { category: true },
  });
  if (!product) return res.status(404).json({ error: 'Товар не найден' });
  res.json(product);
});

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string(),
  price: z.number().positive(),
  oldPrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0),
  image: z.string(),
  specs: z.string(),
  featured: z.boolean().optional(),
  categoryId: z.number().int(),
});

router.post('/', authRequired, adminRequired, async (req, res) => {
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const product = await prisma.product.create({ data: parsed.data });
  res.status(201).json(product);
});

router.put('/:id', authRequired, adminRequired, async (req, res) => {
  const id = parseInt(req.params.id as string);
  const parsed = productSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const product = await prisma.product.update({ where: { id }, data: parsed.data });
  res.json(product);
});

router.delete('/:id', authRequired, adminRequired, async (req, res) => {
  const id = parseInt(req.params.id as string);
  await prisma.product.delete({ where: { id } });
  res.json({ ok: true });
});

export default router;

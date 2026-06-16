import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authRequired, adminRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res) => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });
  res.json(categories);
});

router.get('/:slug', async (req, res) => {
  const category = await prisma.category.findUnique({
    where: { slug: req.params.slug },
    include: { _count: { select: { products: true } } },
  });
  if (!category) return res.status(404).json({ error: 'Категория не найдена' });
  res.json(category);
});

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  image: z.string().optional(),
});

router.post('/', authRequired, adminRequired, async (req, res) => {
  const parsed = categorySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const category = await prisma.category.create({ data: parsed.data });
  res.status(201).json(category);
});

router.put('/:id', authRequired, adminRequired, async (req, res) => {
  const id = parseInt(req.params.id);
  const parsed = categorySchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const category = await prisma.category.update({ where: { id }, data: parsed.data });
  res.json(category);
});

router.delete('/:id', authRequired, adminRequired, async (req, res) => {
  const id = parseInt(req.params.id);
  await prisma.category.delete({ where: { id } });
  res.json({ ok: true });
});

export default router;

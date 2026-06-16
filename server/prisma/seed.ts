import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categories = [
  { name: 'Видеокарты', slug: 'gpu', description: 'Дискретные и интегрированные GPU', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400' },
  { name: 'Процессоры', slug: 'cpu', description: 'CPU Intel и AMD', image: 'https://images.unsplash.com/photo-1555617981-dac3880b0d4a?w=400' },
  { name: 'Материнские платы', slug: 'motherboard', description: 'Платы для сборки ПК', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400' },
  { name: 'Оперативная память', slug: 'ram', description: 'DDR4 и DDR5 модули', image: 'https://images.unsplash.com/photo-1562976540-1502c214cad5?w=400' },
  { name: 'Накопители', slug: 'storage', description: 'SSD и HDD', image: 'https://images.unsplash.com/photo-1597872200969-2b65d08b49ae?w=400' },
  { name: 'Блоки питания', slug: 'psu', description: 'БП с сертификацией 80+', image: 'https://images.unsplash.com/photo-1587825140708-7e2b9b1c0b0a?w=400' },
  { name: 'Корпуса', slug: 'case', description: 'Корпуса ATX, mATX, ITX', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9ea?w=400' },
  { name: 'Мониторы', slug: 'monitors', description: 'Игровые и офисные мониторы', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d663f?w=400' },
];

const products = [
  { name: 'NVIDIA GeForce RTX 4070 Ti SUPER', slug: 'rtx-4070-ti-super', category: 'gpu', price: 89990, oldPrice: 94990, stock: 15, featured: true, image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600', description: 'Видеокарта NVIDIA GeForce RTX 4070 Ti SUPER на архитектуре Ada Lovelace. 16 ГБ GDDR6X, DLSS 3, ray tracing.', specs: JSON.stringify({ chip: 'AD103', memory: '16 GB GDDR6X', bus: '256-bit', tdp: '285W' }) },
  { name: 'AMD Radeon RX 7800 XT', slug: 'rx-7800-xt', category: 'gpu', price: 54990, stock: 22, featured: true, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9ea?w=600', description: 'AMD Radeon RX 7800 XT — отличное соотношение цены и производительности для 1440p.', specs: JSON.stringify({ chip: 'Navi 32', memory: '16 GB GDDR6', bus: '256-bit', tdp: '263W' }) },
  { name: 'Intel Core i7-14700K', slug: 'i7-14700k', category: 'cpu', price: 42990, stock: 18, featured: true, image: 'https://images.unsplash.com/photo-1555617981-dac3880b0d4a?w=600', description: '20-ядерный процессор Intel 14-го поколения с гибридной архитектурой Raptor Lake Refresh.', specs: JSON.stringify({ cores: '8P+12E', threads: 28, base: '3.4 GHz', boost: '5.6 GHz', socket: 'LGA1700' }) },
  { name: 'AMD Ryzen 7 7800X3D', slug: 'ryzen-7-7800x3d', category: 'cpu', price: 38990, oldPrice: 41990, stock: 12, featured: true, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600', description: 'Лучший игровой процессор с технологией 3D V-Cache.', specs: JSON.stringify({ cores: 8, threads: 16, base: '4.2 GHz', boost: '5.0 GHz', socket: 'AM5', cache: '96 MB' }) },
  { name: 'ASUS ROG STRIX B650E-F', slug: 'asus-b650e-f', category: 'motherboard', price: 24990, stock: 10, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600', description: 'Материнская плата ATX для AMD AM5 с PCIe 5.0 и Wi-Fi 6E.', specs: JSON.stringify({ socket: 'AM5', chipset: 'B650E', form: 'ATX', ram: 'DDR5, 4 slots' }) },
  { name: 'MSI MAG Z790 TOMAHAWK', slug: 'msi-z790-tomahawk', category: 'motherboard', price: 27990, stock: 8, image: 'https://images.unsplash.com/photo-1555617981-dac3880b0d4a?w=600', description: 'Плата Intel Z790 с поддержкой DDR5 и PCIe 5.0.', specs: JSON.stringify({ socket: 'LGA1700', chipset: 'Z790', form: 'ATX', ram: 'DDR5, 4 slots' }) },
  { name: 'G.Skill Trident Z5 32GB DDR5-6000', slug: 'gskill-trident-z5-32gb', category: 'ram', price: 12990, stock: 30, featured: true, image: 'https://images.unsplash.com/photo-1562976540-1502c214cad5?w=600', description: 'Комплект 2×16 ГБ DDR5-6000 CL30 с RGB-подсветкой.', specs: JSON.stringify({ capacity: '32 GB (2x16)', type: 'DDR5', speed: '6000 MHz', latency: 'CL30' }) },
  { name: 'Kingston Fury Beast 16GB DDR4-3200', slug: 'kingston-fury-16gb', category: 'ram', price: 4490, stock: 45, image: 'https://images.unsplash.com/photo-1562976540-1502c214cad5?w=600', description: 'Доступный комплект 2×8 ГБ DDR4 для апгрейда.', specs: JSON.stringify({ capacity: '16 GB (2x8)', type: 'DDR4', speed: '3200 MHz', latency: 'CL16' }) },
  { name: 'Samsung 990 PRO 2TB', slug: 'samsung-990-pro-2tb', category: 'storage', price: 16990, oldPrice: 18990, stock: 25, featured: true, image: 'https://images.unsplash.com/photo-1597872200969-2b65d08b49ae?w=600', description: 'NVMe SSD PCIe 4.0 — до 7450 МБ/с чтения.', specs: JSON.stringify({ interface: 'M.2 NVMe PCIe 4.0', capacity: '2 TB', read: '7450 MB/s', write: '6900 MB/s' }) },
  { name: 'WD Black SN850X 1TB', slug: 'wd-sn850x-1tb', category: 'storage', price: 8990, stock: 35, image: 'https://images.unsplash.com/photo-1597872200969-2b65d08b49ae?w=600', description: 'Игровой NVMe-накопитель с высокой скоростью.', specs: JSON.stringify({ interface: 'M.2 NVMe PCIe 4.0', capacity: '1 TB', read: '7300 MB/s', write: '6300 MB/s' }) },
  { name: 'be quiet! Straight Power 12 850W', slug: 'bequiet-sp12-850w', category: 'psu', price: 14990, stock: 14, image: 'https://images.unsplash.com/photo-1587825140708-7e2b9b1c0b0a?w=600', description: 'Модульный БП 850W 80+ Platinum, тихая работа.', specs: JSON.stringify({ power: '850W', cert: '80+ Platinum', modular: 'Full', fan: '135mm' }) },
  { name: 'Corsair RM850x', slug: 'corsair-rm850x', category: 'psu', price: 12990, stock: 20, image: 'https://images.unsplash.com/photo-1587825140708-7e2b9b1c0b0a?w=600', description: 'Надёжный блок питания 850W с 10-летней гарантией.', specs: JSON.stringify({ power: '850W', cert: '80+ Gold', modular: 'Full' }) },
  { name: 'NZXT H7 Flow', slug: 'nzxt-h7-flow', category: 'case', price: 11990, stock: 16, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9ea?w=600', description: 'Mid-tower корпус с отличной вентиляцией и стеклянной панелью.', specs: JSON.stringify({ form: 'Mid Tower', mb: 'ATX/mATX/ITX', fans: '2x140mm included', gpu: 'up to 400mm' }) },
  { name: 'Fractal Design North', slug: 'fractal-north', category: 'case', price: 13990, stock: 11, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9ea?w=600', description: 'Стильный корпус в скандинавском дизайне с деревянной отделкой.', specs: JSON.stringify({ form: 'Mid Tower', mb: 'ATX/mATX/ITX', material: 'Steel/Wood' }) },
  { name: 'LG UltraGear 27GP850-B', slug: 'lg-27gp850', category: 'monitors', price: 34990, stock: 9, featured: true, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d663f?w=600', description: '27" QHD 165Hz Nano IPS — идеален для киберспорта.', specs: JSON.stringify({ size: '27"', resolution: '2560x1440', refresh: '165Hz', panel: 'Nano IPS' }) },
  { name: 'Samsung Odyssey G7 32"', slug: 'samsung-g7-32', category: 'monitors', price: 49990, oldPrice: 54990, stock: 7, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d663f?w=600', description: 'Изогнутый 32" QHD 240Hz VA с HDR600.', specs: JSON.stringify({ size: '32"', resolution: '2560x1440', refresh: '240Hz', panel: 'VA Curved' }) },
  { name: 'NVIDIA GeForce RTX 4060', slug: 'rtx-4060', category: 'gpu', price: 32990, stock: 28, image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600', description: 'Компактная видеокарта для 1080p-гейминга с DLSS 3.', specs: JSON.stringify({ chip: 'AD107', memory: '8 GB GDDR6', tdp: '115W' }) },
  { name: 'Intel Core i5-14600K', slug: 'i5-14600k', category: 'cpu', price: 28990, stock: 24, image: 'https://images.unsplash.com/photo-1555617981-dac3880b0d4a?w=600', description: 'Универсальный процессор для игр и работы.', specs: JSON.stringify({ cores: '6P+8E', threads: 20, socket: 'LGA1700' }) },
  { name: 'Crucial P3 Plus 500GB', slug: 'crucial-p3-500gb', category: 'storage', price: 3990, stock: 50, image: 'https://images.unsplash.com/photo-1597872200969-2b65d08b49ae?w=600', description: 'Бюджетный NVMe SSD для системного диска.', specs: JSON.stringify({ interface: 'M.2 NVMe PCIe 4.0', capacity: '500 GB', read: '5000 MB/s' }) },
  { name: 'DeepCool AK620', slug: 'deepcool-ak620', category: 'cpu', price: 5490, stock: 32, image: 'https://images.unsplash.com/photo-1555617981-dac3880b0d4a?w=600', description: 'Двухбашенный кулер для процессоров до 260W TDP.', specs: JSON.stringify({ type: 'Air Cooler', fans: '2x120mm', tdp: '260W', height: '160mm' }) },
];

async function main() {
  console.log('Seeding database...');

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const adminHash = await bcrypt.hash('admin123', 10);
  const userHash = await bcrypt.hash('user123', 10);

  await prisma.user.create({
    data: { email: 'admin@techstore.ru', password: adminHash, name: 'Администратор', role: 'ADMIN', phone: '+7 (999) 000-00-01' },
  });
  await prisma.user.create({
    data: { email: 'user@techstore.ru', password: userHash, name: 'Иван Петров', role: 'USER', phone: '+7 (999) 123-45-67' },
  });

  const catMap: Record<string, number> = {};
  for (const cat of categories) {
    const created = await prisma.category.create({ data: cat });
    catMap[cat.slug] = created.id;
  }

  for (const p of products) {
    const { category, ...data } = p;
    await prisma.product.create({
      data: { ...data, categoryId: catMap[category] },
    });
  }

  console.log('Seed completed!');
  console.log('Admin: admin@techstore.ru / admin123');
  console.log('User:  user@techstore.ru / user123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

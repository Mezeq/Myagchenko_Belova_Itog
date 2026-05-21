require('dotenv').config();
const bcrypt = require('bcryptjs');
const { run, query } = require('./config/db');

async function seed() {
  console.log('Seeding database...');

  const adminExists = await query('SELECT id FROM users WHERE email = ?', ['admin@greenbasket.ru']);
  if (adminExists.length === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Администратор', 'admin@greenbasket.ru', hashedPassword, 'admin']
    );
    console.log('Admin user created (admin@greenbasket.ru / admin123)');
  }

  const basketsCount = await query('SELECT COUNT(*) as count FROM baskets');
  if (basketsCount[0].count === 0) {
    const baskets = [
      { name: 'Овощная корзина', description: 'Свежие сезонные овощи для здорового питания', price: 1490, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
      { name: 'Фруктовая корзина', description: 'Сочные фрукты и ягоды, богатые витаминами', price: 1790, image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
      { name: 'Полная корзина', description: 'Овощи, фрукты, зелень и фермерские продукты', price: 2490, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
      { name: 'Вегетарианская', description: 'Растительные продукты для вегетарианцев', price: 1990, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    ];

    for (const b of baskets) {
      await run(
        'INSERT INTO baskets (name, description, price, image) VALUES (?, ?, ?, ?)',
        [b.name, b.description, b.price, b.image]
      );
    }
    console.log('Baskets seeded');
  }

  const reviewsCount = await query('SELECT COUNT(*) as count FROM reviews');
  if (reviewsCount[0].count === 0) {
    const reviews = [
      { name: 'Анна Петрова', text: 'Заказываю овощную корзину уже 3 месяца. Качество продуктов всегда на высоте! Особенно радует, что все местное и свежее.', rating: 5, image: 'https://randomuser.me/api/portraits/women/32.jpg' },
      { name: 'Иван Сидоров', text: 'Отличный сервис! Настроил корзину под свои предпочтения, исключил картофель и лук. Привозят именно то, что нужно.', rating: 4, image: 'https://randomuser.me/api/portraits/men/54.jpg' },
      { name: 'Мария Иванова', text: 'Как мама двоих детей, очень ценю качественные продукты. Дети стали лучше кушать овощи, когда они свежие и вкусные.', rating: 5, image: 'https://randomuser.me/api/portraits/women/67.jpg' },
    ];

    for (const r of reviews) {
      await run(
        'INSERT INTO reviews (name, text, rating, image) VALUES (?, ?, ?, ?)',
        [r.name, r.text, r.rating, r.image]
      );
    }
    console.log('Reviews seeded');
  }

  console.log('Seed completed!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});

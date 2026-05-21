const express = require('express');
const { body, validationResult } = require('express-validator');
const { query, run, get } = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'admin') {
      orders = await query('SELECT * FROM orders ORDER BY created_at DESC');
    } else {
      orders = await query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    }
    orders = orders.map(o => ({
      ...o,
      exclude_items: JSON.parse(o.exclude_items || '[]')
    }));
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.post('/', [
  body('name').trim().notEmpty().withMessage('Имя обязательно'),
  body('phone').trim().notEmpty().withMessage('Телефон обязателен'),
  body('deliveryDate').notEmpty().withMessage('Дата доставки обязательна'),
  body('basketType').notEmpty().withMessage('Тип корзины обязателен'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { basketType, deliveryDate, frequency, excludeItems, preferences, name, phone } = req.body;

    await run(
      `INSERT INTO orders (user_id, basket_type, delivery_date, frequency, exclude_items, preferences, name, phone)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user ? req.user.id : null,
        basketType,
        deliveryDate,
        frequency || 'weekly',
        JSON.stringify(excludeItems || []),
        preferences || '',
        name,
        phone
      ]
    );

    const order = await get('SELECT * FROM orders WHERE id = (SELECT MAX(id) FROM orders)');
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    await run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    const order = await get('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!order) return res.status(404).json({ error: 'Заказ не найден' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const order = await get('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!order) return res.status(404).json({ error: 'Заказ не найден' });

    await run('DELETE FROM orders WHERE id = ?', [req.params.id]);
    res.json({ message: 'Заказ удален' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;

const express = require('express');
const { body, validationResult } = require('express-validator');
const { query, run, get } = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const baskets = await query('SELECT * FROM baskets ORDER BY id');
    res.json(baskets);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const basket = await get('SELECT * FROM baskets WHERE id = ?', [req.params.id]);
    if (!basket) return res.status(404).json({ error: 'Корзина не найдена' });
    res.json(basket);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.post('/', authMiddleware, adminMiddleware, [
  body('name').trim().notEmpty().withMessage('Название обязательно'),
  body('price').isFloat({ min: 0 }).withMessage('Цена должна быть положительным числом'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, image } = req.body;
    const result = await run(
      'INSERT INTO baskets (name, description, price, image) VALUES (?, ?, ?, ?)',
      [name, description || '', price, image || '']
    );

    const basket = await get('SELECT * FROM baskets WHERE id = (SELECT MAX(id) FROM baskets)');
    res.status(201).json(basket);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.put('/:id', authMiddleware, adminMiddleware, [
  body('name').trim().notEmpty().withMessage('Название обязательно'),
  body('price').isFloat({ min: 0 }).withMessage('Цена должна быть положительным числом'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, image } = req.body;
    await run(
      'UPDATE baskets SET name = ?, description = ?, price = ?, image = ? WHERE id = ?',
      [name, description || '', price, image || '', req.params.id]
    );

    const basket = await get('SELECT * FROM baskets WHERE id = ?', [req.params.id]);
    if (!basket) return res.status(404).json({ error: 'Корзина не найдена' });
    res.json(basket);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const basket = await get('SELECT * FROM baskets WHERE id = ?', [req.params.id]);
    if (!basket) return res.status(404).json({ error: 'Корзина не найдена' });

    await run('DELETE FROM baskets WHERE id = ?', [req.params.id]);
    res.json({ message: 'Корзина удалена' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;

const express = require('express');
const { body, validationResult } = require('express-validator');
const { query, run, get } = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const reviews = await query('SELECT * FROM reviews ORDER BY id');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.post('/', [
  body('name').trim().notEmpty().withMessage('Имя обязательно'),
  body('text').trim().notEmpty().withMessage('Текст отзыва обязателен'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Рейтинг от 1 до 5'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, text, rating, image } = req.body;
    await run(
      'INSERT INTO reviews (name, text, rating, image) VALUES (?, ?, ?, ?)',
      [name, text, rating, image || '']
    );

    const review = await get('SELECT * FROM reviews WHERE id = (SELECT MAX(id) FROM reviews)');
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const review = await get('SELECT * FROM reviews WHERE id = ?', [req.params.id]);
    if (!review) return res.status(404).json({ error: 'Отзыв не найден' });

    await run('DELETE FROM reviews WHERE id = ?', [req.params.id]);
    res.json({ message: 'Отзыв удален' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;

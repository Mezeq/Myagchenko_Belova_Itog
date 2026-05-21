const express = require('express');
const { body, validationResult } = require('express-validator');
const { run, query } = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const subscribers = await query('SELECT * FROM subscribers ORDER BY created_at DESC');
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.post('/', [
  body('email').isEmail().withMessage('Некорректный email'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    const existing = await query('SELECT id FROM subscribers WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Вы уже подписаны на рассылку' });
    }

    await run('INSERT INTO subscribers (email) VALUES (?)', [email]);
    res.status(201).json({ message: 'Спасибо за подписку!' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;

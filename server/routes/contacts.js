const express = require('express');
const { body, validationResult } = require('express-validator');
const { run, query } = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const messages = await query('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.post('/', [
  body('name').trim().notEmpty().withMessage('Имя обязательно'),
  body('email').isEmail().withMessage('Некорректный email'),
  body('message').trim().notEmpty().withMessage('Сообщение обязательно'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, message } = req.body;

    await run(
      'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );

    let emailSent = false;
    try {
      const nodemailer = require('nodemailer');
      let transporter;
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
        await transporter.sendMail({
          from: `"Green Basket" <${process.env.EMAIL_USER}>`,
          to: 'info@greenbasket.ru',
          subject: `Новое сообщение от ${name}`,
          html: `<h2>Новое сообщение с сайта Green Basket</h2>
                 <p><strong>Имя:</strong> ${name}</p>
                 <p><strong>Email:</strong> ${email}</p>
                 <p><strong>Сообщение:</strong></p>
                 <p>${message}</p>`,
        });
        emailSent = true;
      }
    } catch (emailErr) {
      console.log('Email sending not configured, saved to database');
    }

    res.status(201).json({
      message: 'Сообщение отправлено',
      email_sent: emailSent,
    });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;

module.exports = (pool) => {
  const express = require('express');
  const router = express.Router();

  router.post('/', async (req, res) => {
    const { name, email, attendance } = req.body;

    if (!name || !email || !attendance) {
      return res.status(400).json({ error: 'Пожалуйста, заполните все поля' });
    }

    try {
      const [result] = await pool.query(
        'INSERT INTO graduates (name, email, attendance) VALUES (?, ?, ?)',
        [name, email, attendance]
      );

      res.json({ id: result.insertId, message: 'Выпускник добавлен.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  });

  return router;
};

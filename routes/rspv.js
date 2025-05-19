const express = require('express');

module.exports = function(pool) {
  const router = express.Router();

  // POST /api/rsvp
  router.post('/', async (req, res) => {
    const { name, email, attendance } = req.body;

    // Валидация входных данных
    if (!name || !email || !attendance) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const conn = await pool.getConnection();
      await conn.query(
        'INSERT INTO rsvp (name, email, attendance) VALUES (?, ?, ?)',
        [name, email, attendance]
      );
      conn.release();

      // Успешный ответ для фронтенда
      return res.status(200).json({ message: 'RSVP saved' });
    } catch (err) {
      console.error('DB error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
};

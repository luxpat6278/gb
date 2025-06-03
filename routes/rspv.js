module.exports = (pool) => {
  const express = require('express');
  const router = express.Router();

  router.post('/', async (req, res) => {
    const { name, email, attendance } = req.body;
    if (!name || !email || !attendance) {
      console.warn('Validation failed:', req.body);
      return res.status(400).json({ error: 'Missing required fields: name, email, attendance' });
    }
    try {
      const [result] = await pool.execute(
        'INSERT INTO rsvps (name, email, attendance) VALUES (?, ?, ?)',
        [name, email, attendance]
      );
      return res.status(201).json({ id: result.insertId });
    } catch (err) {
      console.error('Database insertion error:', err.message);
      return res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
  });

  return router;
};
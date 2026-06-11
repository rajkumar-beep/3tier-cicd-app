const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  const { phone, twelfth_percent } = req.body;
  const userId = req.user.userId;
  if (!phone || twelfth_percent === undefined)
    return res.status(400).json({ message: 'Phone and 12th percentage required' });
  if (twelfth_percent < 0 || twelfth_percent > 100)
    return res.status(400).json({ message: 'Percentage must be 0-100' });
  try {
    const [existing] = await pool.query('SELECT id FROM user_details WHERE user_id = ?', [userId]);
    if (existing.length > 0) {
      await pool.query(
        'UPDATE user_details SET phone = ?, twelfth_percent = ? WHERE user_id = ?',
        [phone, twelfth_percent, userId]
      );
    } else {
      await pool.query(
        'INSERT INTO user_details (user_id, phone, twelfth_percent) VALUES (?, ?, ?)',
        [userId, phone, twelfth_percent]
      );
    }
    res.json({ message: 'Details saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  try {
    const [rows] = await pool.query(
      `SELECT u.name, u.email, d.phone, d.twelfth_percent
       FROM users u LEFT JOIN user_details d ON u.id = d.user_id
       WHERE u.id = ?`,
      [userId]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

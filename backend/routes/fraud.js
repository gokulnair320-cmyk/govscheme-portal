const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/fraud - get all fraud records
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM FRAUD ORDER BY flagId DESC');
    res.json(rows);
  } catch (err) {
    console.error('Get fraud error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

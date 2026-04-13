const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/schemes - get all schemes
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM SCHEME');
    res.json(rows);
  } catch (err) {
    console.error('Get schemes error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

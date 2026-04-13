const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/citizens/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM CITIZEN WHERE citizenId = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Citizen not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Get citizen error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/citizens - get all citizens (admin)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM CITIZEN');
    res.json(rows);
  } catch (err) {
    console.error('Get all citizens error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

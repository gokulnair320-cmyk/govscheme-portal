const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/documents/:citizenId
router.get('/:citizenId', async (req, res) => {
  const { citizenId } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT * FROM DOCUMENT WHERE citizen_id = ?',
      [citizenId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Get documents error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

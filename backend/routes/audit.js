const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/audit - get all audit logs
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM AUDIT_LOG ORDER BY action_date DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Get audit log error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/eligibility/:citizenId
router.get('/:citizenId', async (req, res) => {
  const { citizenId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT e.*, s.name AS schemeName
       FROM ELIGIBILITY_LOG e
       LEFT JOIN APPLICATION a ON e.application_id = a.appId
       LEFT JOIN SCHEME s ON a.schemeId = s.schemeId
       WHERE e.citizen_id = ?`,
      [citizenId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Get eligibility error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

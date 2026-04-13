const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/notifications/:citizenId
router.get('/:citizenId', async (req, res) => {
  const { citizenId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT * FROM NOTIFICATION WHERE citizen_id = ?
       ORDER BY CASE WHEN status = 'Unread' THEN 0 ELSE 1 END, notification_date DESC`,
      [citizenId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/notifications/:id - mark as read
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(
      "UPDATE NOTIFICATION SET status = 'Read' WHERE notification_id = ?",
      [id]
    );
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    console.error('Update notification error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

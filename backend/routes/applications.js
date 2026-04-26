const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/applications - apply for a scheme
router.post('/', async (req, res) => {
  const { citizenId, schemeId } = req.body;
  if (!citizenId || !schemeId) {
    return res.status(400).json({ message: 'citizenId and schemeId are required' });
  }

  try {
    // Check if already applied
    const [existing] = await db.query(
      'SELECT * FROM APPLICATION WHERE citizen_id = ? AND schemeId = ?',
      [citizenId, schemeId]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Already applied for this scheme' });
    }

    // Insert application
    const citizenIdStr = 'C' + String(citizenId).padStart(3, '0');
    const [appResult] = await db.query(
      'INSERT INTO APPLICATION (citizen_id, status, schemeId) VALUES (?, ?, ?)',
      [citizenIdStr, 'Pending', schemeId]
    );
    const appId = appResult.insertId;

    // Fetch citizen and scheme data for eligibility check
    const [[citizen]] = await db.query('SELECT * FROM CITIZEN WHERE citizenId = ?', [citizenId]);
    const [[scheme]] = await db.query('SELECT * FROM SCHEME WHERE schemeId = ?', [schemeId]);

    // Check eligibility
    let eligible = true;
    let remarks = 'All criteria met';

    if (!citizen) {
      eligible = false;
      remarks = 'Citizen not found';
    } else {
      if (citizen.age < scheme.age_lower || citizen.age > scheme.age_upper) {
        eligible = false;
        remarks = 'Age criteria not met';
      } else if (citizen.income > scheme.income) {
        eligible = false;
        remarks = 'Income exceeded limit';
      } else if (
        scheme.gender !== 'ALL' &&
        citizen.gender.toLowerCase() !== scheme.gender.toLowerCase()
      ) {
        eligible = false;
        remarks = 'Gender criteria not met';
      } else if (
        scheme.caste !== 'ALL' &&
        citizen.caste.toLowerCase() !== scheme.caste.toLowerCase()
      ) {
        eligible = false;
        remarks = 'Caste criteria not met';
      }
    }

    const eligibilityResult = eligible ? 'Eligible' : 'Non-Eligible';
    const logId = 'L' + String(Date.now()).slice(-6);

    // Write to ELIGIBILITY_LOG
    await db.query(
      'INSERT INTO ELIGIBILITY_LOG (log_id, application_id, eligibility_result, remarks, citizen_id) VALUES (?, ?, ?, ?, ?)',
      [logId, appId, eligibilityResult, remarks, citizenId]
    );

    // Update application status based on eligibility
    const newStatus = eligible ? 'Pending' : 'Rejected';
    await db.query('UPDATE APPLICATION SET status = ? WHERE appId = ?', [newStatus, appId]);

    res.json({
      success: true,
      appId,
      eligibilityResult,
      remarks,
      status: newStatus,
    });
  } catch (err) {
    console.error('Apply scheme error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/applications/:citizenId - get applications for a citizen
router.get('/:citizenId', async (req, res) => {
  const { citizenId } = req.params;
  try {
    const citizenIdStr = 'C' + String(citizenId).padStart(3, '0');
    const [rows] = await db.query(
      `SELECT a.appId, a.citizen_id, a.status, a.schemeId,
              s.name AS schemeName,
              e.eligibility_result, e.remarks
       FROM APPLICATION a
       LEFT JOIN SCHEME s ON a.schemeId = s.schemeId
       LEFT JOIN ELIGIBILITY_LOG e ON e.application_id = a.appId
       WHERE a.citizen_id = ?`,
      [citizenIdStr]
    );
    res.json(rows);
  } catch (err) {
    console.error('Get applications error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/applications - get all applications (admin)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT a.appId, a.citizen_id, a.status, a.schemeId,
              c.name AS citizenName,
              s.name AS schemeName,
              e.eligibility_result, e.remarks
       FROM APPLICATION a
       LEFT JOIN SCHEME s ON a.schemeId = s.schemeId
       LEFT JOIN ELIGIBILITY_LOG e ON e.application_id = a.appId
       LEFT JOIN CITIZEN c ON e.citizen_id = c.citizenId
       ORDER BY a.appId DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Get all applications error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/applications/:id/status - approve or reject
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }
  try {
    await db.query('UPDATE APPLICATION SET status = ? WHERE appId = ?', [status, id]);
    res.json({ success: true, message: `Application ${status}` });
  } catch (err) {
    console.error('Update application status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/applications/stats - get aggregate metrics (Aggregate/Arithmetic Demo)
router.get('/stats', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT COUNT(*) AS total_applications, SUM(s.benefit_amount) AS total_budget_needed 
       FROM APPLICATION a 
       JOIN SCHEME s ON a.schemeId = s.schemeId 
       WHERE a.status = 'Approved'`
    );
    res.json(rows[0]);
  } catch (err) {
    console.error('Get aggregate stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

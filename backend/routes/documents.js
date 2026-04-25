const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer for local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// GET /api/documents/all - Admin only
router.get('/all', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT d.*, c.name as citizen_name 
       FROM DOCUMENT d 
       JOIN CITIZEN c ON d.citizen_id = c.citizenId
       ORDER BY CASE WHEN d.verification_status = 'Pending' THEN 0 ELSE 1 END, d.document_id DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Get all documents error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/documents/:citizenId
router.get('/:citizenId', async (req, res) => {
  const { citizenId } = req.params;
  if (citizenId === 'all') return; // Skip if matching /all
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

// POST /api/documents/upload - Upload a new document
router.post('/upload', upload.single('document'), async (req, res) => {
  const { citizenId, documentType } = req.body;
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  const document_number = req.file.filename; // using filename as document number for now
  const document_id = 'D' + Math.floor(Math.random() * 10000); 

  try {
    await db.query(
      'INSERT INTO DOCUMENT (document_id, citizen_id, document_type, document_number, verification_status) VALUES (?, ?, ?, ?, ?)',
      [document_id, citizenId, documentType, document_number, 'Pending']
    );

    await db.query(
      'INSERT INTO AUDIT_LOG (citizen_id, action, action_date) VALUES (?, ?, NOW())',
      [citizenId, 'Document Upload - ' + documentType]
    );

    res.json({ success: true, message: 'Document uploaded successfully', document: { document_id, citizen_id: citizenId, document_type: documentType, document_number, verification_status: 'Pending' } });
  } catch (err) {
    console.error('Upload document error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/documents/:id/verify - Admin Verify Document
router.put('/:id/verify', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'Verified' or 'Rejected'
  try {
    await db.query(
      'UPDATE DOCUMENT SET verification_status = ? WHERE document_id = ?',
      [status, id]
    );
    res.json({ success: true, message: `Document ${status} successfully` });
  } catch (err) {
    console.error('Update document status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

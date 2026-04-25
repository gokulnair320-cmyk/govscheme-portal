const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, age, gender, address, income, caste, education, username, password } = req.body;
  try {
    // Check if username already exists
    const [existing] = await db.query('SELECT * FROM LOGIN_CREDENTIALS WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Insert Citizen
    const [citRes] = await db.query(
      'INSERT INTO CITIZEN (name, age, gender, address, income, caste, education) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, parseInt(age), gender, address, parseFloat(income), caste, education]
    );
    const citizenId = citRes.insertId;

    // Insert Login Credentials
    const [logRes] = await db.query(
      'INSERT INTO LOGIN_CREDENTIALS (citizen_id, username, password, last_login) VALUES (?, ?, ?, NOW())',
      [citizenId, username, password]
    );
    const loginId = logRes.insertId;

    // Log the registration
    await db.query(
      'INSERT INTO AUDIT_LOG (citizen_id, action, action_date) VALUES (?, ?, NOW())',
      [citizenId, 'Register Application']
    );

    // Auto login
    req.session.citizenId = citizenId;
    req.session.role = 'citizen';
    req.session.username = username;
    req.session.loginId = loginId;

    res.json({ success: true, role: 'citizen', citizenId });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check for admin officer
    if (username === 'admin' && password === 'admin123') {
      req.session.citizenId = null;
      req.session.role = 'admin';
      req.session.username = 'admin';
      return res.json({ success: true, role: 'admin', citizenId: null });
    }

    const [rows] = await db.query(
      'SELECT * FROM LOGIN_CREDENTIALS WHERE username = ? AND password = ?',
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const user = rows[0];
    req.session.citizenId = user.citizen_id;
    req.session.role = 'citizen';
    req.session.username = user.username;
    req.session.loginId = user.login_id;

    // Update last_login
    await db.query(
      'UPDATE LOGIN_CREDENTIALS SET last_login = NOW() WHERE login_id = ?',
      [user.login_id]
    );

    // Write to AUDIT_LOG
    await db.query(
      'INSERT INTO AUDIT_LOG (citizen_id, action, action_date) VALUES (?, ?, NOW())',
      [user.citizen_id, 'Login']
    );

    res.json({ success: true, role: 'citizen', citizenId: user.citizen_id });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  const citizenId = req.session.citizenId;
  try {
    if (citizenId) {
      await db.query(
        'INSERT INTO AUDIT_LOG (citizen_id, action, action_date) VALUES (?, ?, NOW())',
        [citizenId, 'Logout']
      );
    }
    req.session.destroy(() => {
      res.json({ success: true, message: 'Logged out' });
    });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/auth/me - check current session
router.get('/me', (req, res) => {
  if (req.session && req.session.username) {
    res.json({
      loggedIn: true,
      role: req.session.role,
      citizenId: req.session.citizenId,
      username: req.session.username,
    });
  } else {
    res.json({ loggedIn: false });
  }
});

module.exports = router;

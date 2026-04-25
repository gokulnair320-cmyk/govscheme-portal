require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const citizenRoutes = require('./routes/citizens');
const schemeRoutes = require('./routes/schemes');
const applicationRoutes = require('./routes/applications');
const documentRoutes = require('./routes/documents');
const notificationRoutes = require('./routes/notifications');
const fraudRoutes = require('./routes/fraud');
const auditRoutes = require('./routes/audit');
const eligibilityRoutes = require('./routes/eligibility');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'govscheme_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
  },
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/citizens', citizenRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/fraud', fraudRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/eligibility', eligibilityRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'GovScheme Portal API running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

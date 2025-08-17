// app.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require ('./routes/adminRoutes')

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

// health
app.get('/api/v1/health', (req, res) => res.json({ status: 'ok' }));

// mount routes
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/blog', blogRoutes);
app.use('/api/v1/portfolio', portfolioRoutes);
app.use('/api/v1/resume', resumeRoutes);
app.use('/api/v1/users', userRoutes);

// central error handler (existing middleware)
app.use((err, req, res, next) => errorHandler(err, req, res, next));

module.exports = app;

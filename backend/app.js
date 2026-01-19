// app.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require ('./routes/adminRoutes')
const homeRoutes = require('./routes/HomeRoutes')
const aboutRoutes = require ('./routes/aboutRoutes')
const resumeRoutes = require('./routes/resumeRoutes');
const projectRoutes = require("./routes/projectRoutes");
const contactRoutes = require ('./routes/ContactRoutes')


const path = require('path');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Update to Vite default
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Increase limit just in case
app.use(cookieParser());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// health
app.get('/api/v1/health', (req, res) => res.json({ status: 'ok' }));

// mount routes
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/blog', blogRoutes);
app.use('/api/v1/portfolio', portfolioRoutes);
app.use('/api/v1/resume', resumeRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/home', homeRoutes);
app.use('/api/v1/about', aboutRoutes);
app.use('/api/v1/contact', contactRoutes);

//project routes
app.use('/api/v1/projects', projectRoutes);

// central error handler (existing middleware)
app.use((err, req, res, next) => errorHandler(err, req, res, next));

module.exports = app;

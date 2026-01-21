const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true }));

// Routes
const contactRoutes = require('./src/routes/contacts');
app.use('/api/contacts', contactRoutes);

// Database
mongoose.connect(process.env.mongodb_url || 'mongodb://localhost:27017/crud_app')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
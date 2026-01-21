const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expressDB')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Import routes
const contactRoutes = require('./src/routes/contact');

// Routes
app.use('/api/contacts', contactRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Contact Information API',
        endpoints: {
            getContacts: 'GET /api/contacts',
            getContact: 'GET /api/contacts/:id',
            createContact: 'POST /api/contacts',
            updateContact: 'PUT /api/contacts/:id',
            deleteContact: 'DELETE /api/contacts/:id',
            searchContacts: 'GET /api/contacts/search/:keyword'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}`);
});
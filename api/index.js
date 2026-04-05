const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Create Express app
const app = express();

app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGINS?.split(',') || '*',
    credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Root
app.get('/', (req, res) => {
    res.json({
        status: 200,
        message: 'Finance Dashboard Backend API is running',
        timestamp: new Date().toISOString()
    });
});

// Test auth endpoint
app.post('/auth/register', (req, res) => {
    res.status(501).json({
        status: 501,
        message: 'Registration endpoint - database not connected yet',
        received: req.body
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 404,
        error_code: 'NOT_FOUND',
        message: `Route ${req.method} ${req.path} not found`,
        timestamp: new Date().toISOString()
    });
});

// Export for Vercel
module.exports = (req, res) => {
    // Strip /api prefix
    req.url = req.url.replace(/^\/api/, '') || '/';
    return app(req, res);
};

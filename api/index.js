// Vercel serverless function for Finance Dashboard API
// This is a simplified version that works without the full TypeScript backend

const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
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
        docs: {
            health: '/api/health',
            auth: '/api/auth/login',
            note: 'Full backend integration in progress'
        },
        timestamp: new Date().toISOString()
    });
});

// Auth endpoints - placeholder responses
app.post('/auth/register', (req, res) => {
    res.status(503).json({
        status: 503,
        error_code: 'SERVICE_UNAVAILABLE',
        message: 'Backend is being configured. Please try again shortly.',
        timestamp: new Date().toISOString()
    });
});

app.post('/auth/login', (req, res) => {
    res.status(503).json({
        status: 503,
        error_code: 'SERVICE_UNAVAILABLE',
        message: 'Backend is being configured. Please try again shortly.',
        timestamp: new Date().toISOString()
    });
});

// Catch all other routes
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

// Simple Vercel serverless function without external dependencies
module.exports = (req, res) => {
    // Strip /api prefix
    const path = req.url.replace(/^\/api/, '') || '/';
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle OPTIONS preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Set content type
    res.setHeader('Content-Type', 'application/json');
    
    // Route handling
    if (path === '/health' && req.method === 'GET') {
        res.status(200).json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        });
        return;
    }
    
    if (path === '/' && req.method === 'GET') {
        res.status(200).json({
            status: 200,
            message: 'Finance Dashboard Backend API is running',
            timestamp: new Date().toISOString()
        });
        return;
    }
    
    if (path === '/auth/register' && req.method === 'POST') {
        res.status(501).json({
            status: 501,
            message: 'Registration endpoint - database not connected yet',
            path: path,
            method: req.method
        });
        return;
    }
    
    // 404 for everything else
    res.status(404).json({
        status: 404,
        error_code: 'NOT_FOUND',
        message: `Route ${req.method} ${path} not found`,
        timestamp: new Date().toISOString()
    });
};

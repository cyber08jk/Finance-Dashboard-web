// Next.js API route handler
export default function handler(req, res) {
    const { path } = req.query;
    const fullPath = '/' + (Array.isArray(path) ? path.join('/') : path || '');
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle OPTIONS preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Route handling
    if (fullPath === '/health' && req.method === 'GET') {
        res.status(200).json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        });
        return;
    }
    
    if (fullPath === '/' && req.method === 'GET') {
        res.status(200).json({
            status: 200,
            message: 'Finance Dashboard Backend API is running',
            docs: {
                health: '/api/health',
                note: 'Backend running via Next.js API routes'
            },
            timestamp: new Date().toISOString()
        });
        return;
    }
    
    if (fullPath === '/auth/register' && req.method === 'POST') {
        res.status(503).json({
            status: 503,
            error_code: 'SERVICE_UNAVAILABLE',
            message: 'Full backend needs to be deployed separately to Railway/Render',
            timestamp: new Date().toISOString()
        });
        return;
    }
    
    if (fullPath === '/auth/login' && req.method === 'POST') {
        res.status(503).json({
            status: 503,
            error_code: 'SERVICE_UNAVAILABLE',
            message: 'Full backend needs to be deployed separately to Railway/Render',
            timestamp: new Date().toISOString()
        });
        return;
    }
    
    // 404 for everything else
    res.status(404).json({
        status: 404,
        error_code: 'NOT_FOUND',
        message: `Route ${req.method} ${fullPath} not found`,
        timestamp: new Date().toISOString()
    });
}

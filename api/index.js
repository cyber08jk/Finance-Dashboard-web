// Import using dynamic require to handle ES modules
let app;
let AppDataSource;
let dbConnected = false;

async function initializeApp() {
    if (!app) {
        // Dynamically import the ES module
        const serverModule = await import('../src/server.js');
        app = serverModule.default;
        
        const dbModule = await import('../src/config/database.js');
        AppDataSource = dbModule.AppDataSource;
    }
    
    // Initialize database connection once
    if (!dbConnected && AppDataSource) {
        try {
            if (!AppDataSource.isInitialized) {
                await AppDataSource.initialize();
            }
            dbConnected = true;
            console.log('✓ Vercel serverless DB connection established');
        } catch (e) {
            console.error('⚠ Vercel serverless DB connection failed:', e);
            // Continue anyway - some routes might work without DB
        }
    }
}

module.exports = async (req, res) => {
    try {
        // Initialize app and database
        await initializeApp();
        
        // Strip /api prefix
        req.url = req.url.replace(/^\/api/, '') || '/';
        
        // Pass to Express app
        return app(req, res);
    } catch (error) {
        console.error('Serverless function error:', error);
        res.status(500).json({
            status: 500,
            error_code: 'INTERNAL_ERROR',
            message: 'Internal server error',
            timestamp: new Date().toISOString()
        });
    }
};

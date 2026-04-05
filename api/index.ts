import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/server.js';
import { AppDataSource } from '../src/config/database.js';

let dbConnected = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Initialize database connection once
    if (!dbConnected) {
        try {
            if (!AppDataSource.isInitialized) {
                await AppDataSource.initialize();
            }
            dbConnected = true;
            console.log('✓ Vercel serverless DB connection established');
        } catch (e) {
            console.error('⚠ Vercel serverless DB connection failed:', e);
        }
    }

    // Strip /api prefix from the path for Express routing
    const originalUrl = req.url || '/';
    req.url = originalUrl.replace(/^\/api/, '') || '/';

    // Pass the request to Express app
    return app(req as any, res as any);
}

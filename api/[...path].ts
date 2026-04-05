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

    // Extract the path from the URL
    // Vercel passes /api/health as the URL, we need to strip /api
    let path = req.url || '/';
    
    // Remove /api prefix if present
    if (path.startsWith('/api')) {
        path = path.substring(4);
    }
    
    // Ensure path starts with /
    if (!path.startsWith('/')) {
        path = '/' + path;
    }

    // Create modified request
    const modifiedReq = {
        ...req,
        url: path,
        originalUrl: path
    };

    // Pass to Express
    return app(modifiedReq as any, res as any);
}

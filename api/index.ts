import { Request, Response } from 'express';
import app from '../src/server.js';
import { AppDataSource } from '../src/config/database.js';

let dbConnected = false;

export default async function handler(req: Request, res: Response) {
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

    return app(req, res);
}

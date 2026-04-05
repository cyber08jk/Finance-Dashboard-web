import { Request, Response } from 'express';
import { dashboardService } from '../services/DashboardService.js';
import { RecordType } from '../models/FinancialRecord.js';
import { UserRole } from '../models/User.js';

export class DashboardController {
  async getSummary(req: Request, res: Response) {
    const userId = req.user!.userId;
    const userRole = req.user!.role as UserRole;
    const date_from = req.query.date_from ? new Date(req.query.date_from as string) : undefined;
    const date_to = req.query.date_to ? new Date(req.query.date_to as string) : undefined;

    const summary = await dashboardService.getSummary(userId, userRole, date_from, date_to);
    res.status(200).json({
      status: 200,
      message: 'Summary retrieved successfully',
      data: summary,
    });
  }

  async getCategoryBreakdown(req: Request, res: Response) {
    const userId = req.user!.userId;
    const userRole = req.user!.role as UserRole;
    const typeStr = req.query.type as string | undefined;
    const type = typeStr === 'both' ? undefined : (typeStr as RecordType | undefined);
    const date_from = req.query.date_from ? new Date(req.query.date_from as string) : undefined;
    const date_to = req.query.date_to ? new Date(req.query.date_to as string) : undefined;

    const breakdown = await dashboardService.getCategoryBreakdown(userId, userRole, type, date_from, date_to);
    res.status(200).json({
      status: 200,
      message: 'Category breakdown retrieved successfully',
      data: breakdown,
    });
  }

  async getRecentActivity(req: Request, res: Response) {
    const userId = req.user!.userId;
    const userRole = req.user!.role as UserRole;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

    const activity = await dashboardService.getRecentActivity(userId, userRole, limit);
    res.status(200).json({
      status: 200,
      message: 'Recent activity retrieved successfully',
      data: activity,
    });
  }

  async getMonthlyTrends(req: Request, res: Response) {
    const userId = req.user!.userId;
    const userRole = req.user!.role as UserRole;
    const date_from = req.query.date_from ? new Date(req.query.date_from as string) : undefined;
    const date_to = req.query.date_to ? new Date(req.query.date_to as string) : undefined;

    const trends = await dashboardService.getMonthlyTrends(userId, userRole, date_from, date_to);
    res.status(200).json({
      status: 200,
      message: 'Monthly trends retrieved successfully',
      data: trends,
    });
  }

  async getWeeklyTrends(req: Request, res: Response) {
    const userId = req.user!.userId;
    const userRole = req.user!.role as UserRole;
    const date_from = req.query.date_from ? new Date(req.query.date_from as string) : undefined;
    const date_to = req.query.date_to ? new Date(req.query.date_to as string) : undefined;

    const trends = await dashboardService.getWeeklyTrends(userId, userRole, date_from, date_to);
    res.status(200).json({
      status: 200,
      message: 'Weekly trends retrieved successfully',
      data: trends,
    });
  }
}

export const dashboardController = new DashboardController();

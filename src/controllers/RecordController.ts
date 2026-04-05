import { Request, Response } from 'express';
import { recordService } from '../services/RecordService.js';
import { RecordType } from '../models/FinancialRecord.js';
import { UserRole } from '../models/User.js';

export class RecordController {
  async createRecord(req: Request, res: Response) {
    const userId = req.user!.userId;
    const { amount, type, category, date, description } = req.body;

    const record = await recordService.createRecord(
      userId,
      amount,
      type,
      category,
      new Date(date),
      description
    );

    res.status(201).json({
      status: 201,
      message: 'Record created successfully',
      data: record,
    });
  }

  async getRecord(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role as UserRole;

    const record = await recordService.getRecordById(id, userId, userRole);
    res.status(200).json({
      status: 200,
      message: 'Record retrieved successfully',
      data: record,
    });
  }

  async listRecords(req: Request, res: Response) {
    const userId = req.user!.userId;
    const userRole = req.user!.role as UserRole;

    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100); // Cap at 100
    const offset = Math.max(parseInt(req.query.offset as string) || 0, 0); // Prevent negative
    const category = req.query.category as string | undefined;
    const type = req.query.type as RecordType | undefined;
    const date_from = req.query.date_from ? new Date(req.query.date_from as string) : undefined;
    const date_to = req.query.date_to ? new Date(req.query.date_to as string) : undefined;
    const search = req.query.search as string | undefined;

    const result = await recordService.listRecords(userId, userRole, {
      limit,
      offset,
      category,
      type,
      date_from,
      date_to,
      search,
    });

    res.status(200).json({
      status: 200,
      message: 'Records retrieved successfully',
      data: result,
    });
  }

  async updateRecord(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role as UserRole;
    const updates = req.body;

    const record = await recordService.updateRecord(id, userId, userRole, updates);
    res.status(200).json({
      status: 200,
      message: 'Record updated successfully',
      data: record,
    });
  }

  async deleteRecord(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role as UserRole;

    await recordService.deleteRecord(id, userId, userRole);
    res.status(200).json({
      status: 200,
      message: 'Record deleted successfully',
    });
  }
}

export const recordController = new RecordController();

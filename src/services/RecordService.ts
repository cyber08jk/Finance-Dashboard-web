import { recordRepository, QueryFilters } from '../repositories/FinancialRecordRepository.js';
import { NotFoundError, AuthorizationError } from '../utils/errors.js';
import { FinancialRecord, RecordType } from '../models/FinancialRecord.js';
import { UserRole } from '../models/User.js';

export class RecordService {
  async createRecord(
    userId: string,
    amount: number,
    type: RecordType,
    category: string,
    date: Date,
    description?: string
  ) {
    const record = await recordRepository.create(
      userId,
      amount,
      type,
      category,
      date,
      description,
      userId
    );

    return this.formatRecord(record);
  }

  async getRecordById(id: string, userId: string, userRole: UserRole) {
    const record = await recordRepository.findByIdWithUser(id);
    if (!record) {
      throw new NotFoundError('Record');
    }

    // Viewers can only see their own records
    if (userRole === UserRole.VIEWER && record.user_id !== userId) {
      throw new AuthorizationError('You can only view your own records');
    }

    return this.formatRecord(record);
  }

  async listRecords(
    userId: string,
    userRole: UserRole,
    filters: {
      limit?: number;
      offset?: number;
      category?: string;
      type?: RecordType;
      date_from?: Date;
      date_to?: Date;
      search?: string;
    }
  ) {
    const queryFilters: QueryFilters = {
      limit: filters.limit || 20,
      offset: filters.offset || 0,
      category: filters.category,
      type: filters.type,
      date_from: filters.date_from,
      date_to: filters.date_to,
      search: filters.search,
    };

    // Viewers can only see their own records
    if (userRole === UserRole.VIEWER) {
      queryFilters.user_id = userId;
    }

    const { records, total } = await recordRepository.findAll(queryFilters);

    return {
      records: records.map((r) => this.formatRecord(r)),
      pagination: {
        limit: queryFilters.limit,
        offset: queryFilters.offset,
        total,
        has_more: (queryFilters.offset || 0) + (queryFilters.limit || 20) < total,
      },
    };
  }

  async updateRecord(
    id: string,
    userId: string,
    userRole: UserRole,
    updates: Partial<FinancialRecord>
  ) {
    const record = await recordRepository.findByIdWithUser(id);
    if (!record) {
      throw new NotFoundError('Record');
    }

    // Viewers cannot update records
    if (userRole === UserRole.VIEWER) {
      throw new AuthorizationError('Viewers cannot update records');
    }
    // Analysts can only update their own records
    if (record.user_id !== userId && userRole !== UserRole.ADMIN) {
      throw new AuthorizationError('You can only update your own records');
    }

    const updated = await recordRepository.update(id, updates);
    if (!updated) {
      throw new NotFoundError('Record');
    }

    return this.formatRecord(updated);
  }

  async deleteRecord(id: string, userId: string, userRole: UserRole) {
    const record = await recordRepository.findByIdWithUser(id);
    if (!record) {
      throw new NotFoundError('Record');
    }

    // Only admin can delete records
    if (userRole !== UserRole.ADMIN) {
      throw new AuthorizationError('Only admins can delete records');
    }

    await recordRepository.softDelete(id);
  }

  private formatRecord(record: FinancialRecord) {
    return {
      id: record.id,
      user_id: record.user_id,
      amount: parseFloat(record.amount.toString()),
      type: record.type,
      category: record.category,
      date: record.date,
      description: record.description || null,
      created_by: record.created_by,
      created_at: record.created_at,
      updated_at: record.updated_at,
      deleted_at: record.deleted_at || null,
    };
  }
}

export const recordService = new RecordService();

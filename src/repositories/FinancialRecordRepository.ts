import { Repository, IsNull, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { AppDataSource } from '../config/database.js';
import { FinancialRecord, RecordType } from '../models/FinancialRecord.js';

export interface QueryFilters {
  limit?: number;
  offset?: number;
  category?: string;
  type?: RecordType;
  date_from?: Date;
  date_to?: Date;
  user_id?: string;
  search?: string;
}

export class FinancialRecordRepository {
  private repository: Repository<FinancialRecord>;

  constructor() {
    this.repository = AppDataSource.getRepository(FinancialRecord);
  }

  async create(
    userId: string,
    amount: number,
    type: RecordType,
    category: string,
    date: Date,
    description?: string,
    createdBy?: string
  ): Promise<FinancialRecord> {
    const record = this.repository.create({
      user_id: userId,
      amount,
      type,
      category,
      date,
      description,
      created_by: createdBy || userId,
    });
    return await this.repository.save(record);
  }

  async findById(id: string): Promise<FinancialRecord | null> {
    return await this.repository.findOne({
      where: { id, deleted_at: IsNull() },
    });
  }

  async findByIdWithUser(id: string): Promise<FinancialRecord | null> {
    return await this.repository.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['user'],
    });
  }

  async findAll(filters: QueryFilters): Promise<{ records: FinancialRecord[]; total: number }> {
    const {
      limit = 20,
      offset = 0,
      category,
      type,
      date_from,
      date_to,
      user_id,
      search,
    } = filters;

    let qb = this.repository
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.user', 'user')
      .where('record.deleted_at IS NULL');

    if (user_id) {
      qb = qb.andWhere('record.user_id = :user_id', { user_id });
    }
    if (category) {
      qb = qb.andWhere('record.category = :category', { category });
    }
    if (type) {
      qb = qb.andWhere('record.type = :type', { type });
    }
    if (date_from && date_to) {
      qb = qb.andWhere('record.date BETWEEN :date_from AND :date_to', { date_from, date_to });
    } else if (date_from) {
      qb = qb.andWhere('record.date >= :date_from', { date_from });
    } else if (date_to) {
      qb = qb.andWhere('record.date <= :date_to', { date_to });
    }
    if (search) {
      qb = qb.andWhere(
        '(record.category ILIKE :search OR record.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    const [records, total] = await qb
      .orderBy('record.date', 'DESC')
      .addOrderBy('record.created_at', 'DESC')
      .take(limit)
      .skip(offset)
      .getManyAndCount();

    return { records, total };
  }

  async update(id: string, updates: Partial<FinancialRecord>): Promise<FinancialRecord | null> {
    await this.repository.update(id, {
      ...updates,
      updated_at: new Date(),
    });
    return await this.findById(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.update(id, {
      deleted_at: new Date(),
      updated_at: new Date(),
    });
  }

  // ----- Aggregation queries -----

  // userId is optional: pass undefined so admins/analysts see all records
  async getTotalByType(
    userId: string | undefined,
    type: RecordType,
    dateFrom?: Date,
    dateTo?: Date
  ): Promise<number> {
    let query = this.repository
      .createQueryBuilder('record')
      .select('SUM(record.amount)', 'total')
      .where('record.type = :type', { type })
      .andWhere('record.deleted_at IS NULL');

    if (userId) {
      query = query.andWhere('record.user_id = :userId', { userId });
    }
    if (dateFrom) {
      query = query.andWhere('record.date >= :dateFrom', { dateFrom });
    }
    if (dateTo) {
      query = query.andWhere('record.date <= :dateTo', { dateTo });
    }

    const result = await query.getRawOne();
    return parseFloat(result.total) || 0;
  }

  async getCategoryBreakdown(
    userId: string | undefined,
    type?: RecordType,
    dateFrom?: Date,
    dateTo?: Date
  ): Promise<any[]> {
    let query = this.repository
      .createQueryBuilder('record')
      .select('record.category', 'category')
      .addSelect('SUM(record.amount)', 'total')
      .where('record.deleted_at IS NULL')
      .groupBy('record.category')
      .orderBy('total', 'DESC');

    if (userId) {
      query = query.andWhere('record.user_id = :userId', { userId });
    }
    if (type) {
      query = query.andWhere('record.type = :type', { type });
    }
    if (dateFrom) {
      query = query.andWhere('record.date >= :dateFrom', { dateFrom });
    }
    if (dateTo) {
      query = query.andWhere('record.date <= :dateTo', { dateTo });
    }

    const results = await query.getRawMany();
    return results.map((r) => ({
      category: r.category,
      total: parseFloat(r.total),
    }));
  }

  async getMonthlyTrends(
    userId: string | undefined,
    dateFrom?: Date,
    dateTo?: Date
  ): Promise<any[]> {
    let query = this.repository
      .createQueryBuilder('record')
      .select("DATE_TRUNC('month', record.date)", 'month')
      .addSelect('record.type', 'type')
      .addSelect('SUM(record.amount)', 'total')
      .where('record.deleted_at IS NULL')
      .groupBy("DATE_TRUNC('month', record.date)")
      .addGroupBy('record.type')
      .orderBy("DATE_TRUNC('month', record.date)", 'DESC');

    if (userId) {
      query = query.andWhere('record.user_id = :userId', { userId });
    }
    if (dateFrom) {
      query = query.andWhere('record.date >= :dateFrom', { dateFrom });
    }
    if (dateTo) {
      query = query.andWhere('record.date <= :dateTo', { dateTo });
    }

    return await query.getRawMany();
  }

  async getWeeklyTrends(
    userId: string | undefined,
    dateFrom?: Date,
    dateTo?: Date
  ): Promise<any[]> {
    let query = this.repository
      .createQueryBuilder('record')
      .select("DATE_TRUNC('week', record.date)", 'week')
      .addSelect('record.type', 'type')
      .addSelect('SUM(record.amount)', 'total')
      .where('record.deleted_at IS NULL')
      .groupBy("DATE_TRUNC('week', record.date)")
      .addGroupBy('record.type')
      .orderBy("DATE_TRUNC('week', record.date)", 'DESC');

    if (userId) {
      query = query.andWhere('record.user_id = :userId', { userId });
    }
    if (dateFrom) {
      query = query.andWhere('record.date >= :dateFrom', { dateFrom });
    }
    if (dateTo) {
      query = query.andWhere('record.date <= :dateTo', { dateTo });
    }

    return await query.getRawMany();
  }

  async getRecentRecords(userId: string | undefined, limit: number = 20): Promise<FinancialRecord[]> {
    const where: any = { deleted_at: IsNull() };
    if (userId) {
      where.user_id = userId;
    }
    return await this.repository.find({
      where,
      order: { date: 'DESC', created_at: 'DESC' },
      take: limit,
    });
  }
}

export const recordRepository = new FinancialRecordRepository();

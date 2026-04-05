import { recordRepository } from '../repositories/FinancialRecordRepository.js';
import { RecordType } from '../models/FinancialRecord.js';
import { UserRole } from '../models/User.js';

export class DashboardService {
  /**
   * Resolves the effective userId filter.
   * Viewers see only their own data; Analysts and Admins see all records.
   */
  private effectiveUserId(userId: string, userRole: UserRole): string | undefined {
    return userRole === UserRole.VIEWER ? userId : undefined;
  }

  async getSummary(userId: string, userRole: UserRole, dateFrom?: Date, dateTo?: Date) {
    const scopedUserId = this.effectiveUserId(userId, userRole);

    const totalIncome = await recordRepository.getTotalByType(scopedUserId, RecordType.INCOME, dateFrom, dateTo);
    const totalExpenses = await recordRepository.getTotalByType(scopedUserId, RecordType.EXPENSE, dateFrom, dateTo);

    return {
      total_income: parseFloat(totalIncome.toFixed(2)),
      total_expenses: parseFloat(totalExpenses.toFixed(2)),
      net_balance: parseFloat((totalIncome - totalExpenses).toFixed(2)),
      scope: userRole === UserRole.VIEWER ? 'own' : 'all',
      period: {
        from: dateFrom || null,
        to: dateTo || null,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async getCategoryBreakdown(
    userId: string,
    userRole: UserRole,
    type?: RecordType,
    dateFrom?: Date,
    dateTo?: Date
  ) {
    const scopedUserId = this.effectiveUserId(userId, userRole);
    const breakdown = await recordRepository.getCategoryBreakdown(scopedUserId, type, dateFrom, dateTo);

    const totalAmount = breakdown.reduce((sum, item) => sum + item.total, 0);

    const formatted = breakdown.map((item) => ({
      category: item.category,
      total: parseFloat(item.total.toFixed(2)),
      percent_of_total: totalAmount > 0 ? parseFloat(((item.total / totalAmount) * 100).toFixed(2)) : 0,
    }));

    return {
      breakdown: formatted,
      total: parseFloat(totalAmount.toFixed(2)),
      scope: userRole === UserRole.VIEWER ? 'own' : 'all',
      period: {
        from: dateFrom || null,
        to: dateTo || null,
      },
    };
  }

  async getRecentActivity(userId: string, userRole: UserRole, limit: number = 20) {
    const scopedUserId = this.effectiveUserId(userId, userRole);
    const records = await recordRepository.getRecentRecords(scopedUserId, limit);

    return {
      recent_records: records.map((r) => ({
        id: r.id,
        user_id: r.user_id,
        type: r.type,
        category: r.category,
        amount: parseFloat(r.amount.toString()),
        date: r.date,
        description: r.description || null,
        created_at: r.created_at,
      })),
      count: records.length,
      scope: userRole === UserRole.VIEWER ? 'own' : 'all',
    };
  }

  async getMonthlyTrends(userId: string, userRole: UserRole, dateFrom?: Date, dateTo?: Date) {
    const scopedUserId = this.effectiveUserId(userId, userRole);
    const trends = await recordRepository.getMonthlyTrends(scopedUserId, dateFrom, dateTo);

    return this.buildTrendResponse(trends, 'month', userRole, dateFrom, dateTo);
  }

  async getWeeklyTrends(userId: string, userRole: UserRole, dateFrom?: Date, dateTo?: Date) {
    const scopedUserId = this.effectiveUserId(userId, userRole);
    const trends = await recordRepository.getWeeklyTrends(scopedUserId, dateFrom, dateTo);

    return this.buildTrendResponse(trends, 'week', userRole, dateFrom, dateTo);
  }

  private buildTrendResponse(
    trends: any[],
    unit: 'month' | 'week',
    userRole: UserRole,
    dateFrom?: Date,
    dateTo?: Date
  ) {
    const bucketMap = new Map<string, { income: number; expenses: number; net: number }>();

    trends.forEach((item) => {
      const rawDate = item[unit];
      if (!rawDate) return;

      let bucketKey: string;
      try {
        bucketKey = new Date(rawDate).toISOString().split('T')[0];
      } catch {
        console.warn('Invalid date in trends:', rawDate);
        return;
      }

      if (!bucketMap.has(bucketKey)) {
        bucketMap.set(bucketKey, { income: 0, expenses: 0, net: 0 });
      }

      const data = bucketMap.get(bucketKey)!;
      const amount = parseFloat(item.total) || 0;

      if (item.type === RecordType.INCOME) {
        data.income += amount;
      } else if (item.type === RecordType.EXPENSE) {
        data.expenses += amount;
      }
      data.net = data.income - data.expenses;
    });

    if (bucketMap.size === 0) {
      return {
        trends: [],
        total_income: 0,
        total_expenses: 0,
        net_balance: 0,
        scope: userRole === UserRole.VIEWER ? 'own' : 'all',
        period: {
          from: dateFrom || null,
          to: dateTo || null,
        },
      };
    }

    const formatted: Record<string, any>[] = Array.from(bucketMap.entries())
      .map(([period, data]) => ({
        [unit]: unit === 'month' ? period.substring(0, 7) : period,
        income: parseFloat(data.income.toFixed(2)),
        expenses: parseFloat(data.expenses.toFixed(2)),
        net: parseFloat(data.net.toFixed(2)),
      }))
      .sort((a: Record<string, any>, b: Record<string, any>) => {
        const aDate = new Date(a[unit] as string).getTime();
        const bDate = new Date(b[unit] as string).getTime();
        return bDate - aDate;
      });

    const totals = formatted.reduce(
      (acc, item) => ({
        income: acc.income + item.income,
        expenses: acc.expenses + item.expenses,
      }),
      { income: 0, expenses: 0 }
    );

    return {
      trends: formatted,
      total_income: parseFloat(totals.income.toFixed(2)),
      total_expenses: parseFloat(totals.expenses.toFixed(2)),
      net_balance: parseFloat((totals.income - totals.expenses).toFixed(2)),
      scope: userRole === UserRole.VIEWER ? 'own' : 'all',
      period: {
        from: dateFrom || null,
        to: dateTo || null,
      },
    };
  }
}

export const dashboardService = new DashboardService();

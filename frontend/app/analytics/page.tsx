'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { dashboardApi, handleApiError } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorAlert from '@/components/ErrorAlert';
import IncomeVsExpenseChart from '@/components/dashboard/IncomeVsExpenseChart';
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown';
import toast from 'react-hot-toast';

type TrendPoint = {
  month: string;
  income: number;
  expenses: number;
  net: number;
};

type MonthlyTrendsPayload = {
  data: {
    trends: TrendPoint[];
  };
};

type CategoryPoint = {
  category: string;
  total: number;
  percent_of_total: string;
};

type BreakdownPayload = {
  data: {
    breakdown: CategoryPoint[];
    total: number;
  };
};

export default function AnalyticsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrendsPayload | null>(null);
  const [breakdown, setBreakdown] = useState<BreakdownPayload | null>(null);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const [trendsRes, breakdownRes] = await Promise.all([
          dashboardApi.getTrends(),
          dashboardApi.getBreakdown(),
        ]);

        setMonthlyTrends(trendsRes.data as MonthlyTrendsPayload);
        setBreakdown(breakdownRes.data as BreakdownPayload);
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError.message);
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [authLoading, isAuthenticated]);

  if (authLoading || loading) return <LoadingSpinner />;
  if (!isAuthenticated) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Detailed Analytics</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Deep dive into your financial health and transaction trends.
        </p>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="col-span-1 xl:col-span-2">
          {monthlyTrends && <IncomeVsExpenseChart trends={monthlyTrends.data.trends} />}
        </div>

        <div className="col-span-1 xl:col-span-2">
          {breakdown && <CategoryBreakdown breakdown={breakdown.data} />}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { dashboardApi, handleApiError } from '@/lib/api';
import {
  DashboardSummary,
  DashboardBreakdown,
  DashboardTrends,
  DashboardRecents,
} from '@/types';
import SummaryCards from '@/components/dashboard/SummaryCards';
import IncomeVsExpenseChart from '@/components/dashboard/IncomeVsExpenseChart';
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorAlert from '@/components/ErrorAlert';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [breakdown, setBreakdown] = useState<DashboardBreakdown | null>(null);
  const [trends, setTrends] = useState<DashboardTrends | null>(null);
  const [recents, setRecents] = useState<DashboardRecents | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    fetchDashboardData();
  }, [authLoading, isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [summaryRes, breakdownRes, trendsRes, recentsRes] = await Promise.all([
        dashboardApi.getSummary(),
        dashboardApi.getBreakdown(),
        dashboardApi.getTrends(),
        dashboardApi.getRecentActivity(5),
      ]);

      setSummary(summaryRes.data);
      setBreakdown(breakdownRes.data);
      setTrends(trendsRes.data);
      setRecents(recentsRes.data);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) return <LoadingSpinner />;
  if (!isAuthenticated) return null;

  return (
    <div className="space-y-6 md:space-y-7">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          Welcome back, {user?.username}! 👋
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Here&apos;s your financial overview for the current period
        </p>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      {/* Summary Cards */}
      {summary && <SummaryCards summary={summary.data} />}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
        {/* Income vs Expense */}
        {trends && <IncomeVsExpenseChart trends={trends.data.trends} />}

        {/* Category Breakdown */}
        {breakdown && <CategoryBreakdown breakdown={breakdown.data} />}
      </div>

      {/* Recent Transactions */}
      {recents && <RecentTransactions transactions={recents.data.recent_records} />}

      {/* Refresh Button */}
      <button
        onClick={fetchDashboardData}
        className="btn btn-secondary"
      >
        Refresh Data
      </button>
    </div>
  );
}

'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MonthlyTrend } from '@/types';
import { useTheme } from 'next-themes';

interface Props {
  trends: MonthlyTrend[];
}

export default function IncomeVsExpenseChart({ trends }: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';

  if (!trends || trends.length === 0) {
    return (
      <div className="card flex items-center justify-center h-64 md:h-72">
        <p className="text-slate-500 dark:text-slate-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Income vs Expenses
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={trends}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="month" stroke={axisColor} />
          <YAxis stroke={axisColor} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`,
              borderRadius: '8px',
            }}
            labelStyle={{ color: isDark ? '#e2e8f0' : '#1e293b' }}
          />
          <Legend wrapperStyle={{ paddingTop: '12px' }} />
          <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} />
          <Bar dataKey="expenses" fill="#ef4444" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

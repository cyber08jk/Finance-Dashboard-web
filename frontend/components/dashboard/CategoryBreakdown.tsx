'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '@/utils/format';

type BreakdownItem = {
  category: string;
  total: number;
  percent_of_total: string;
};

interface Props {
  breakdown: {
    breakdown: BreakdownItem[];
    total: number;
  };
}

export default function CategoryBreakdown({ breakdown }: Props) {
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const chartData = breakdown.breakdown.map((item) => ({
    name: item.category,
    value: Math.round(item.total),
  }));

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
        Category Breakdown
      </h2>

      <div className="w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-slate-500">
            No category data
          </div>
        )}
      </div>
    </div>
  );
}

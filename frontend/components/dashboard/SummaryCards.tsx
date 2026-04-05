import { DashboardSummary } from '@/types';
import { formatCurrency } from '@/utils/format';
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Props {
  summary: DashboardSummary['data'] | null;
}

export default function SummaryCards({ summary }: Props) {
  const cards = [
    {
      title: 'Total Balance',
      value: summary?.net_balance || 0,
      icon: DollarSign,
      trend: '+12.5%',
      isPositive: (summary?.net_balance || 0) >= 0,
      color: 'primary',
    },
    {
      title: 'Total Income',
      value: summary?.total_income || 0,
      icon: TrendingUp,
      trend: '+8.2%',
      isPositive: true,
      color: 'emerald',
    },
    {
      title: 'Total Expenses',
      value: summary?.total_expenses || 0,
      icon: TrendingDown,
      trend: '-2.4%',
      isPositive: false,
      color: 'rose',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="relative group overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-4 md:p-5 transition-all duration-300 hover:shadow-xl hover:shadow-zinc-200/40 dark:hover:shadow-black hover:-translate-y-0.5"
          >
            <div
              className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-[0.15] dark:opacity-10 pointer-events-none ${
                card.color === 'primary'
                  ? 'bg-primary-500'
                  : card.color === 'emerald'
                    ? 'bg-emerald-500'
                    : 'bg-rose-500'
              }`}
            />

            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs md:text-sm font-semibold text-zinc-500 dark:text-zinc-400 tracking-tight">
                  {card.title}
                </p>
                <div
                  className={`p-2 rounded-lg border ${
                    card.color === 'primary'
                      ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-100 dark:border-primary-500/20'
                      : card.color === 'emerald'
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20'
                        : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl md:text-[1.75rem] font-bold text-zinc-900 dark:text-white tracking-tighter">
                  {formatCurrency(card.value)}
                </h3>
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-xs md:text-sm">
                <span
                  className={`flex items-center font-semibold ${
                    card.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {card.isPositive ? <ArrowUpRight className="w-4 h-4 mr-0.5" /> : <ArrowDownRight className="w-4 h-4 mr-0.5" />}
                  {card.trend}
                </span>
                <span className="text-zinc-500 dark:text-zinc-400 font-medium tracking-tight">vs last month</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

'use client';

import { RecentActivity } from '@/types';
import { formatCurrency, formatDate } from '@/utils/format';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  transactions: RecentActivity[];
}

export default function RecentTransactions({ transactions }: Props) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="card flex items-center justify-center h-64">
        <p className="text-slate-500 dark:text-slate-400">No recent transactions</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
        Recent Transactions
      </h2>
      
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2 rounded-lg ${
                  transaction.type === 'income'
                    ? 'bg-green-100 dark:bg-green-900'
                    : 'bg-red-100 dark:bg-red-900'
                }`}
              >
                {transaction.type === 'income' ? (
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
              </div>
              
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {transaction.category}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {transaction.description || 'No description'}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {formatDate(transaction.date)}
                </p>
              </div>
            </div>
            
            <div className={`text-right font-semibold ${
              transaction.type === 'income'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}
              {formatCurrency(transaction.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

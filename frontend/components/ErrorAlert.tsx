'use client';

import { AlertCircle, X } from 'lucide-react';

interface Props {
  message: string;
  onDismiss?: () => void;
  title?: string;
}

export default function ErrorAlert({ message, onDismiss, title = 'Error' }: Props) {
  return (
    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-200">{title}</h3>
            <p className="text-sm text-red-800 dark:text-red-300 mt-1">{message}</p>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

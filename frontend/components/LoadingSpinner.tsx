'use client';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-slate-300 dark:border-slate-700 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">
          Loading...
        </p>
      </div>
    </div>
  );
}

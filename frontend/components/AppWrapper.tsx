'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth, AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import LoadingSpinner from './LoadingSpinner';

function AppLayout({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const isAuthPage = pathname?.includes('/auth');
  const isRootPath = pathname === '/';

  if (loading && !isRootPath) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <LoadingSpinner />
      </div>
    );
  }

  if (isAuthPage || isRootPath) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden font-sans selection:bg-primary-500/30">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-primary-500/5 to-transparent dark:from-primary-500/[0.02] pointer-events-none" />
        <Navbar />
        <main className="flex-1 overflow-y-auto w-full">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[1600px] mx-auto relative z-10">
            <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppLayout>{children}</AppLayout>
      </AuthProvider>
    </ThemeProvider>
  );
}

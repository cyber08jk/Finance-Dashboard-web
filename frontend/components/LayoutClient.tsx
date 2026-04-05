'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/hooks/useAuth';

export default function LayoutClient({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();
  const isAuthPage = pathname?.includes('/auth');
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || loading) return;

    if (isAuthPage && isAuthenticated) {
      router.replace('/dashboard');
      return;
    }

    if (!isAuthPage && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [mounted, loading, isAuthPage, isAuthenticated, router]);

  if (!mounted) {
    return (
      <>
        <Toaster position="top-right" />
        {!isAuthPage && (
          <div className="flex h-screen overflow-hidden">
            <div className="w-64 bg-slate-900" /> {/* Sidebar placeholder */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800" /> {/* Navbar placeholder */}
              <main className="flex-1 overflow-y-auto">
                <div className="p-4 md:p-6 lg:p-7">
                  {children}
                </div>
              </main>
            </div>
          </div>
        )}
        
        {isAuthPage && (
          <div className="min-h-screen">
            {children}
          </div>
        )}
      </>
    );
  }

  if (loading) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Toaster position="top-right" />
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950" />
      </ThemeProvider>
    );
  }

  if (isAuthPage && isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Toaster position="top-right" />
      </ThemeProvider>
    );
  }

  if (!isAuthPage && !isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Toaster position="top-right" />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Toaster position="top-right" />
      
      {!isAuthPage && (
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-y-auto">
              <div className="p-4 md:p-6 lg:p-7">
                {children}
              </div>
            </main>
          </div>
        </div>
      )}
      
      {isAuthPage && (
        <div className="min-h-screen">
          {children}
        </div>
      )}
    </ThemeProvider>
  );
}

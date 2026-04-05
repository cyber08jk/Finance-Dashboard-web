'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    router.replace(token ? '/dashboard' : '/auth/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-primary-600 animate-spin" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">Redirecting...</p>
      </div>
    </div>
  );
}

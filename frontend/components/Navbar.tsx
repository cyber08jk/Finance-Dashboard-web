'use client';

import { useAuth } from '@/hooks/useAuth';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Sun, Moon, Menu, LogOut, User, Settings, Search, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLogout = () => {
    logout();
    window.location.href = '/auth/login';
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-b border-zinc-200 dark:border-white/5 transition-colors">
      <div className="flex items-center justify-between h-14 md:h-16 px-4 md:px-6">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 -ml-2 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors">
            <Menu className="w-5 h-5" />
          </button>

          {/* Subtle Search Bar */}
          <div className="hidden sm:block relative w-56 md:w-64 lg:w-80 group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2 border-none rounded-full bg-zinc-100/80 dark:bg-zinc-900/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all dark:text-zinc-200 placeholder-zinc-500"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="p-2 rounded-full text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors relative hover:text-primary-600 dark:hover:text-primary-400">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-950"></span>
          </button>

          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors hidden sm:block text-zinc-500 dark:text-zinc-400"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}

          <div className="h-6 w-px bg-zinc-200 dark:bg-white/10 mx-1 sm:mx-2 hidden sm:block"></div>

          {/* User Menu */}
          <div className="relative group ml-1 sm:ml-2">
            <div className="flex items-center gap-3 cursor-pointer p-1 pr-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 text-white flex items-center justify-center font-bold shadow-sm shadow-primary-500/30">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden lg:flex flex-col items-start pr-2">
                <span className="text-sm font-semibold text-zinc-900 dark:text-white leading-none">
                  {user?.username}
                </span>
                <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest mt-1">
                  {user?.role}
                </span>
              </div>
            </div>

            {/* Elegant Dropdown */}
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200/80 dark:border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 translate-y-2 group-hover:translate-y-0">
              <div className="px-4 py-3 border-b border-zinc-100 dark:border-white/5 mb-1 lg:hidden">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">{user?.username}</p>
                <p className="text-xs text-primary-500 uppercase tracking-wider font-bold mt-0.5">{user?.role}</p>
              </div>

              <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <User className="w-4 h-4" /> Profile
              </Link>
              <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <Settings className="w-4 h-4" /> Settings
              </Link>

              <div className="h-px bg-zinc-100 dark:bg-white/5 my-1" />

              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

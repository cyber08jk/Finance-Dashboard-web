'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  PieChart,
  LayoutGrid,
  WalletCards,
  Users,
  Settings,
  Shield,
  LifeBuoy
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navigation = [
  { href: '/dashboard', label: 'Overview', icon: LayoutGrid },
  { href: '/records', label: 'Transactions', icon: WalletCards },
  { href: '/analytics', label: 'Analytics', icon: PieChart },
  { href: '/users', label: 'Users & Roles', icon: Users, adminOnly: true },
];

const secondaryNavigation = [
  { href: '/settings', label: 'Appearance', icon: Settings },
  { href: '#', label: 'Support', icon: LifeBuoy },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const visibleNav = navigation.filter(
    (item) => !item.adminOnly || user?.role === 'admin'
  );

  return (
    <aside className="hidden md:flex flex-col w-[240px] lg:w-[250px] bg-white/50 dark:bg-zinc-950/50 backdrop-blur-3xl border-r border-zinc-200 dark:border-white/5">
      {/* Brand */}
      <div className="h-16 md:h-18 flex items-center px-5 md:px-6 border-b border-transparent">
        <Link href="/dashboard" className="flex items-center gap-3 group focus:outline-none">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 flex items-center justify-center shadow-md shadow-zinc-500/20 dark:shadow-white/10 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-white dark:text-zinc-900" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 tracking-tight">
            Valut
          </span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 md:px-4 py-6 md:py-7 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4 px-2">Main Menu</div>

        {visibleNav.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-medium transition-all duration-300 group relative overflow-hidden ${isActive
                  ? 'text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-500/10 shadow-sm shadow-primary-500/5'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100/80 dark:hover:bg-white/5 dark:hover:text-white'
                }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-r-md"></div>
              )}
              <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary-600 dark:text-primary-400' : 'group-hover:text-zinc-900 dark:group-hover:text-white'}`} />
              {label}
            </Link>
          );
        })}

        <div className="mt-10 mb-4 px-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Preferences</div>

        {secondaryNavigation.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-medium transition-all duration-300 group ${isActive
                  ? 'text-zinc-900 dark:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-white/10 dark:hover:bg-white/15'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100/80 dark:hover:bg-white/5 dark:hover:text-white'
                }`}
            >
              <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-zinc-900 dark:text-white' : 'group-hover:text-zinc-900 dark:group-hover:text-white'}`} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Decorative Bottom */}
      <div className="p-6">
        <div className="w-full h-32 rounded-2xl bg-gradient-to-b from-primary-500/10 to-transparent dark:from-primary-500/5 border border-primary-500/20 dark:border-primary-500/10 flex flex-col items-center justify-center p-4 text-center">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center mb-2">
            <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <p className="text-xs font-semibold text-primary-900 dark:text-primary-100">Pro Security</p>
          <p className="text-[10px] text-primary-600/70 dark:text-primary-400/60 mt-0.5">End-to-End Encrypted</p>
        </div>
      </div>
    </aside>
  );
}

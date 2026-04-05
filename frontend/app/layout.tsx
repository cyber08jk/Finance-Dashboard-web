import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import AppWrapper from '@/components/AppWrapper';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Finance Dashboard - Professional Financial Management',
  description: 'Comprehensive finance dashboard for income and expense management',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body className={`${inter.variable} font-sans bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors`}>
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}

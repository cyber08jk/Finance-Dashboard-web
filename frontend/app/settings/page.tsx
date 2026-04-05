'use client';

import { useTheme } from 'next-themes';
import { Settings, Moon, Sun, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Settings className="w-6 h-6 text-primary-500" />
                    Appearance Settings
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Customize how the dashboard looks and feels.</p>
            </div>

            <div className="card">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Theme Preference</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                        onClick={() => setTheme('light')}
                        className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all ${theme === 'light'
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10 text-primary-600'
                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                            }`}
                    >
                        <Sun className="w-8 h-8" />
                        <span className="font-medium">Light Mode</span>
                    </button>

                    <button
                        onClick={() => setTheme('dark')}
                        className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all ${theme === 'dark'
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10 text-primary-600'
                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                            }`}
                    >
                        <Moon className="w-8 h-8" />
                        <span className="font-medium">Dark Mode</span>
                    </button>

                    <button
                        onClick={() => setTheme('system')}
                        className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all ${theme === 'system'
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10 text-primary-600'
                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                            }`}
                    >
                        <Monitor className="w-8 h-8" />
                        <span className="font-medium">System Default</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/LoadingSpinner';
import { User, Mail, ShieldAlert, Calendar } from 'lucide-react';
import { formatDate } from '@/utils/format';

export default function ProfilePage() {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) return <LoadingSpinner />;
    if (!isAuthenticated || !user) return null;

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile Details</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">View your personal account information.</p>
            </div>

            <div className="card overflow-hidden">
                <div className="p-8 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center text-5xl font-bold uppercase">
                        {user.username.substring(0, 2)}
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-2">
                                <User className="w-3 h-3" /> Username
                            </label>
                            <p className="font-medium text-slate-900 dark:text-white text-lg">{user.username}</p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-2">
                                <Mail className="w-3 h-3" /> Email
                            </label>
                            <p className="font-medium text-slate-900 dark:text-white text-lg">{user.email}</p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-2">
                                <ShieldAlert className="w-3 h-3" /> Account Role
                            </label>
                            <p className="font-medium text-slate-900 dark:text-white text-lg capitalize">{user.role}</p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-2">
                                <Calendar className="w-3 h-3" /> Joined
                            </label>
                            <p className="font-medium text-slate-900 dark:text-white text-lg">
                                {formatDate(user.created_at)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

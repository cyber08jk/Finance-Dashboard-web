'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usersApi, handleApiError } from '@/lib/api';
import { User } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorAlert from '@/components/ErrorAlert';
import { Shield, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const { user: currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const limit = 20;

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    const fetchUsers = async () => {
      if (currentUser?.role !== 'admin') {
        setError('You do not have permission to view the users directory.');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await usersApi.getAll({ limit, offset: 0 });
        const payload = res.data as {
          data?: {
            users?: User[];
            data?: User[];
          } | User[];
        };

        const resolvedUsers = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.data?.users)
            ? payload.data.users
            : Array.isArray(payload?.data?.data)
              ? payload.data.data
              : [];

        setUsers(resolvedUsers);
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError.message);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [authLoading, isAuthenticated, currentUser]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await usersApi.getAll({ limit, offset: 0 });
      const payload = res.data as {
        data?: {
          users?: User[];
          data?: User[];
        } | User[];
      };

      const resolvedUsers = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.data?.users)
          ? payload.data.users
          : Array.isArray(payload?.data?.data)
            ? payload.data.data
            : [];

      setUsers(resolvedUsers);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (userId: string, newRole: string) => {
    try {
      await usersApi.changeUserRole(userId, newRole);
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (err) {
      const apiError = handleApiError(err);
      toast.error(apiError.message || 'Failed to update role');
    }
  };

  const removeUser = async (userId: string, username: string) => {
    if (userId === currentUser?.id) {
      toast.error('You cannot remove your own account.');
      return;
    }

    const confirmed = window.confirm(`Remove user "${username}"? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }

    try {
      setDeletingUserId(userId);
      await usersApi.delete(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      toast.success('User removed successfully');
      fetchUsers();
    } catch (err) {
      const apiError = handleApiError(err);
      toast.error(apiError.message || 'Failed to remove user');
    } finally {
      setDeletingUserId(null);
    }
  };

  if (authLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary-500" />
          User Management
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Manage system access roles and accounts.</p>
      </div>

      {error ? (
        <ErrorAlert message={error} onDismiss={() => setError(null)} />
      ) : (
        <div className="card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {loading && users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      <LoadingSpinner />
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        {u.role === 'admin' ? <ShieldAlert className="w-4 h-4 text-red-500" /> : null}
                        {u.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={u.role}
                          onChange={(e) => changeRole(u.id, e.target.value)}
                          disabled={u.id === currentUser?.id}
                          className="text-sm rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option value="viewer">Viewer</option>
                          <option value="analyst">Analyst</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {u.status === 'active' ? (
                          <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                            <CheckCircle className="w-4 h-4" /> Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-sm text-slate-500">
                            <XCircle className="w-4 h-4" /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => removeUser(u.id, u.username)}
                          disabled={u.id === currentUser?.id || deletingUserId === u.id}
                          className="text-sm px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingUserId === u.id ? 'Removing...' : 'Remove'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

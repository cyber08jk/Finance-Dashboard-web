'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { recordsApi, handleApiError } from '@/lib/api';
import { FinancialRecord } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorAlert from '@/components/ErrorAlert';
import { formatCurrency, formatDate } from '@/utils/format';
import { TrendingUp, TrendingDown, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecordsPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);

    const [records, setRecords] = useState<FinancialRecord[]>([]);
    const [search, setSearch] = useState('');

    const [createForm, setCreateForm] = useState({
        amount: '',
        type: 'expense' as 'income' | 'expense',
        category: '',
        date: new Date().toISOString().slice(0, 10),
        description: '',
    });

    const [page, setPage] = useState(1);
    const limit = 15;
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) return;

        fetchRecords();
    }, [authLoading, isAuthenticated, page, search]);

    const fetchRecords = async () => {
        try {
            setLoading(true);
            setError(null);

            const offset = (page - 1) * limit;
            const params: Record<string, string | number> = { limit, offset };
            if (search) params.search = search;

            const res = await recordsApi.getAll(params);
            const payload = res.data as { data: { records: FinancialRecord[], pagination: { total: number } } };

            setRecords(payload.data.records || []);
            setTotal(payload.data.pagination.total || 0);
        } catch (err) {
            const apiError = handleApiError(err);
            setError(apiError.message);
            toast.error('Failed to load records');
        } finally {
            setLoading(false);
        }
    };

    const resetCreateForm = () => {
        setCreateForm({
            amount: '',
            type: 'expense',
            category: '',
            date: new Date().toISOString().slice(0, 10),
            description: '',
        });
    };

    const openCreateModal = () => {
        if (user?.role === 'viewer') {
            toast.error('Viewer role cannot create records');
            return;
        }
        setShowCreateModal(true);
    };

    const handleCreateRecord = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!createForm.amount || Number(createForm.amount) <= 0) {
            toast.error('Enter a valid amount');
            return;
        }

        if (!createForm.category.trim()) {
            toast.error('Category is required');
            return;
        }

        try {
            setCreating(true);

            await recordsApi.create({
                amount: Number(createForm.amount),
                type: createForm.type,
                category: createForm.category.trim(),
                date: createForm.date,
                description: createForm.description.trim() || undefined,
            });

            toast.success('Record added successfully');
            setShowCreateModal(false);
            resetCreateForm();
            setPage(1);
            await fetchRecords();
        } catch (err) {
            const apiError = handleApiError(err);
            toast.error(apiError.message || 'Failed to add record');
        } finally {
            setCreating(false);
        }
    };

    if (authLoading) return <LoadingSpinner />;
    if (!isAuthenticated) return null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Financial Records</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Manage all your income and expenses.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    disabled={user?.role === 'viewer'}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    title={user?.role === 'viewer' ? 'Viewer cannot create records' : 'Add a new record'}
                >
                    <Plus className="w-4 h-4" />
                    Add Record
                </button>
            </div>

            {/* Error Alert */}
            {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

            {/* Filters & Search */}
            <div className="card py-4 !px-4">
                <div className="relative max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm transition-colors"
                        placeholder="Search by category or description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="card !p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {loading && records.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <LoadingSpinner />
                                    </td>
                                </tr>
                            ) : records.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No records found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                records.map((record) => (
                                    <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                                            {formatDate(record.date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${record.type === 'income'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                {record.type === 'income' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                <span className="capitalize">{record.type}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {record.category}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 max-w-xs truncate">
                                            {record.description || '-'}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${record.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                            }`}>
                                            {record.type === 'income' ? '+' : '-'}{formatCurrency(record.amount)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Info */}
                {!loading && records.length > 0 && (
                    <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(page * limit, total)}</span> of <span className="font-medium">{total}</span> results
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1 text-sm rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage((p) => p + 1)}
                                disabled={page * limit >= total}
                                className="px-3 py-1 text-sm rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setShowCreateModal(false)}
                    />
                    <div className="relative w-full max-w-md card !p-5 md:!p-6">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Add Record</h2>

                        <form onSubmit={handleCreateRecord} className="space-y-4">
                            <div>
                                <label className="label">Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={createForm.amount}
                                    onChange={(e) => setCreateForm((prev) => ({ ...prev, amount: e.target.value }))}
                                    className="input"
                                    placeholder="0.00"
                                    disabled={creating}
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Type</label>
                                <select
                                    value={createForm.type}
                                    onChange={(e) => setCreateForm((prev) => ({ ...prev, type: e.target.value as 'income' | 'expense' }))}
                                    className="input"
                                    disabled={creating}
                                >
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>
                            </div>

                            <div>
                                <label className="label">Category</label>
                                <input
                                    type="text"
                                    value={createForm.category}
                                    onChange={(e) => setCreateForm((prev) => ({ ...prev, category: e.target.value }))}
                                    className="input"
                                    placeholder="e.g. Salary, Rent, Groceries"
                                    maxLength={100}
                                    disabled={creating}
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Date</label>
                                <input
                                    type="date"
                                    value={createForm.date}
                                    onChange={(e) => setCreateForm((prev) => ({ ...prev, date: e.target.value }))}
                                    className="input"
                                    disabled={creating}
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Description (Optional)</label>
                                <textarea
                                    value={createForm.description}
                                    onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
                                    className="input min-h-[84px]"
                                    maxLength={500}
                                    placeholder="Add notes"
                                    disabled={creating}
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="btn btn-secondary"
                                    disabled={creating}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={creating}
                                >
                                    {creating ? 'Adding...' : 'Add Record'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
